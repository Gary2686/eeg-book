/* ============================================================
   Chapter 9 — 互動模組
   作者：葉欲禾 (Gary Yu-Ho YEH)
   涵蓋：
     1. ERP 成分波形切換 (P300 / N100 / N400 / MMN / P3a+P3b)
     2. 單試次 vs 平均比較
   ============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    try { initERPWave(); }   catch (e) { console.error(e); }
    try { initTrialMode(); } catch (e) { console.error(e); }

    if (window.EEG_API) window.EEG_API.logEvent("chapter_open", { chapterId: "ch09" });

    if (window.EEGQuiz && window.QUESTIONS_CH09) {
      window.EEGQuiz.init({
        mount: "#quiz-host",
        chapterId: "ch09",
        bank: window.QUESTIONS_CH09,
        count: 10,
        title: "第 9 章 隨機 10 題測驗",
      });
    }
  });

  // -------- 共用：繪圖座標 --------
  function makeAxes(svg, W, H, padL, padR, padT, padB, tMax, vMin, vMax) {
    const xScale = t => padL + (t / tMax) * (W - padL - padR);
    const yScale = v => padT + ((vMax - v) / (vMax - vMin)) * (H - padT - padB);
    let html = `<rect x="0" y="0" width="${W}" height="${H}" fill="#fafbff"/>`;
    // 0 軸（基線）
    html += `<line x1="${padL}" y1="${yScale(0)}" x2="${W - padR}" y2="${yScale(0)}" stroke="#94a3b8" stroke-dasharray="3 3"/>`;
    // 軸
    html += `<line x1="${padL}" y1="${padT}" x2="${padL}" y2="${H - padB}" stroke="#94a3b8"/>`;
    html += `<line x1="${padL}" y1="${H - padB}" x2="${W - padR}" y2="${H - padB}" stroke="#94a3b8"/>`;
    // x 軸刻度
    for (let t = 0; t <= tMax; t += 100) {
      const x = xScale(t);
      html += `<line x1="${x}" y1="${H - padB}" x2="${x}" y2="${H - padB + 4}" stroke="#94a3b8"/>
               <text x="${x}" y="${H - padB + 16}" text-anchor="middle" font-size="10" fill="#475569">${t}</text>`;
    }
    html += `<text x="${(W + padL) / 2}" y="${H - 6}" text-anchor="middle" font-size="11" fill="#475569">時間 (ms)</text>`;
    // y 軸刻度
    [vMin, 0, vMax].forEach(v => {
      const y = yScale(v);
      html += `<line x1="${padL - 4}" y1="${y}" x2="${padL}" y2="${y}" stroke="#94a3b8"/>
               <text x="${padL - 8}" y="${y + 4}" text-anchor="end" font-size="10" fill="#475569">${v}</text>`;
    });
    html += `<text x="14" y="${padT + 50}" font-size="11" fill="#475569" transform="rotate(-90 14,${padT + 50})">振幅 (μV)</text>`;
    return { html, xScale, yScale };
  }

  function gauss(t, mu, sigma, amp) {
    return amp * Math.exp(-Math.pow(t - mu, 2) / (2 * sigma * sigma));
  }

  // ===== 1. ERP 成分切換 =====
  function initERPWave() {
    const svg  = document.getElementById("erp-wave");
    const desc = document.getElementById("erp-desc");
    if (!svg) return;
    const W = 560, H = 240;
    const padL = 50, padR = 16, padT = 12, padB = 32;
    const tMax = 800, vMin = -10, vMax = 14;

    const presets = {
      P300: {
        peaks: [{ mu: 100, sigma: 20, amp: -3, label: "N100" },
                { mu: 200, sigma: 25, amp: 3,  label: "P200" },
                { mu: 320, sigma: 60, amp: 11, label: "P300" }],
        color: "#dc2626",
        desc: "<strong>P300：</strong>潛時約 250–500 ms、振幅約 5–20 μV、頂葉 (Pz) 最強。出現於 oddball 範式中對<u>任務相關目標</u>的反應。"
      },
      N100: {
        peaks: [{ mu: 100, sigma: 20, amp: -7, label: "N100" },
                { mu: 200, sigma: 25, amp: 3,  label: "P200" }],
        color: "#2563eb",
        desc: "<strong>N100：</strong>刺激後約 100 ms 的負電位、中央 (Cz) 分佈。反映早期感覺處理與<u>注意力捕捉</u>。"
      },
      N400: {
        peaks: [{ mu: 100, sigma: 25, amp: -2,  label: "N100" },
                { mu: 200, sigma: 25, amp: 2,   label: "P200" },
                { mu: 400, sigma: 70, amp: -7,  label: "N400" }],
        color: "#7c3aed",
        desc: "<strong>N400：</strong>潛時 ~400 ms 的負電位，與<u>語意處理</u>相關。當語句邏輯不通（『我喝湯吃叉子』）N400 振幅會放大。"
      },
      MMN: {
        peaks: [{ mu: 50,  sigma: 18, amp: 2,  label: "P50" },
                { mu: 100, sigma: 22, amp: -4, label: "N100" },
                { mu: 180, sigma: 40, amp: -5, label: "MMN" }],
        color: "#0891b2",
        desc: "<strong>MMN：</strong>潛時 100–250 ms 的負電位，由<u>deviant − standard</u> 差波得到。<u>不需注意</u>即可誘發，反映自動偵測機制。"
      },
      P3aP3b: {
        peaks: [{ mu: 100, sigma: 20, amp: -3, label: "N100" },
                { mu: 280, sigma: 40, amp: 9,  label: "P3a" },
                { mu: 380, sigma: 60, amp: 8,  label: "P3b" }],
        color: "#ea580c",
        desc: "<strong>P3a + P3b：</strong>P3a 較早 (~280 ms)、額中央 (Fz)、自動定向；P3b 較晚 (~380 ms)、頂葉 (Pz)、任務相關。"
      },
    };

    function render(type) {
      const cfg = presets[type];
      const a = makeAxes(svg, W, H, padL, padR, padT, padB, tMax, vMin, vMax);
      let html = a.html;
      // 計算波形（多個高斯相加）
      const points = [];
      for (let t = 0; t <= tMax; t += 4) {
        let v = 0;
        cfg.peaks.forEach(p => v += gauss(t, p.mu, p.sigma, p.amp));
        points.push(a.xScale(t).toFixed(1) + "," + a.yScale(v).toFixed(1));
      }
      html += `<polyline points="${points.join(' ')}" fill="none" stroke="${cfg.color}" stroke-width="2.8" stroke-linejoin="round"/>`;
      // 標註峰
      cfg.peaks.forEach(p => {
        let v = 0;
        cfg.peaks.forEach(q => v += gauss(p.mu, q.mu, q.sigma, q.amp));
        const x = a.xScale(p.mu), y = a.yScale(v);
        html += `<circle cx="${x}" cy="${y}" r="4" fill="${cfg.color}" stroke="white" stroke-width="1.5"/>
                 <text x="${x}" y="${y - 8}" text-anchor="middle" font-size="11" font-weight="700" fill="${cfg.color}">${p.label}</text>`;
      });
      svg.innerHTML = html;
      desc.innerHTML = cfg.desc;
    }

    document.querySelectorAll('input[name="erp-type"]').forEach(r => {
      r.addEventListener("change", e => render(e.target.value));
    });
    render("P300");
  }

  // ===== 2. 單試次 vs 平均 =====
  function initTrialMode() {
    const svg  = document.getElementById("trial-svg");
    const desc = document.getElementById("trial-desc");
    if (!svg) return;
    const W = 560, H = 240;
    const padL = 50, padR = 16, padT = 12, padB = 32;
    const tMax = 800, vMin = -16, vMax = 18;

    // 模擬：每個試次都有 P300 但帶大量雜訊
    function trialSignal(seed) {
      // 偽隨機（依 seed 產生固定序列以方便重現）
      let s = seed * 9301;
      const r = () => {
        s = (s * 9301 + 49297) % 233280;
        return (s / 233280) * 2 - 1;
      };
      const samples = [];
      // 加一些有色雜訊：用兩個正弦 + 高斯
      for (let t = 0; t <= tMax; t += 4) {
        const erp = gauss(t, 320, 60, 9) + gauss(t, 100, 22, -3) + gauss(t, 200, 25, 2.5);
        const noise = 4.5 * r() + 2.5 * Math.sin(2 * Math.PI * t / 90 + seed) + 1.8 * Math.sin(2 * Math.PI * t / 35 + seed * 0.5);
        samples.push({ t, v: erp + noise });
      }
      return samples;
    }

    function avgSignals(N) {
      const ref = trialSignal(1).map(s => ({ t: s.t, v: 0 }));
      for (let k = 1; k <= N; k++) {
        const tr = trialSignal(k + 7);
        for (let i = 0; i < ref.length; i++) ref[i].v += tr[i].v;
      }
      for (let i = 0; i < ref.length; i++) ref[i].v /= N;
      return ref;
    }

    function render(mode) {
      const a = makeAxes(svg, W, H, padL, padR, padT, padB, tMax, vMin, vMax);
      let html = a.html;
      let samples, color, label;
      if (mode === "single") {
        samples = trialSignal(3);
        color = "#9ca3af";
        label = "單一試次（含背景 EEG 與雜訊，P300 幾乎看不清）";
      } else if (mode === "avg10") {
        samples = avgSignals(10);
        color = "#2563eb";
        label = "10 次試次平均（P300 開始浮現）";
      } else {
        samples = avgSignals(50);
        color = "#dc2626";
        label = "50 次試次平均（P300 清晰可見，雜訊大幅降低）";
      }
      const pts = samples.map(s => a.xScale(s.t).toFixed(1) + "," + a.yScale(s.v).toFixed(1));
      html += `<polyline points="${pts.join(' ')}" fill="none" stroke="${color}" stroke-width="2.2" stroke-linejoin="round"/>`;
      // 標 P300 位置
      html += `<line x1="${a.xScale(320)}" y1="${padT}" x2="${a.xScale(320)}" y2="${H - padB}" stroke="#f59e0b" stroke-dasharray="3 3" opacity="0.7"/>
               <text x="${a.xScale(320) + 5}" y="${padT + 16}" font-size="11" fill="#b45309">P300 預期位置</text>`;
      svg.innerHTML = html;
      desc.innerHTML = `<strong>${label}</strong><br>
        平均次數越多，雜訊以 1/√N 速度下降，ERP 越清楚 — 但代價是無法看到試次間的真實變化。`;
    }

    document.querySelectorAll('input[name="trial-mode"]').forEach(r => {
      r.addEventListener("change", e => render(e.target.value));
    });
    render("single");
  }
})();
