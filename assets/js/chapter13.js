/* ============================================================
   Chapter 13 — 互動模組
   作者：葉欲禾 (Gary Yu-Ho YEH)
   涵蓋：
     1. (θ+α)/(α+β) ratio 隨時間變化（可拖動滑桿/自動播放）
   ============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    initRatioPlot();

    if (window.EEG_API) window.EEG_API.logEvent("chapter_open", { chapterId: "ch13" });

    if (window.EEGQuiz && window.QUESTIONS_CH13) {
      window.EEGQuiz.init({
        mount: "#quiz-host",
        chapterId: "ch13",
        bank: window.QUESTIONS_CH13,
        count: 10,
        title: "第 13 章 隨機 10 題測驗",
      });
    }
  });

  // ===== (θ+α)/(α+β) 動畫 =====
  function initRatioPlot() {
    const svg = document.getElementById("ratio-plot");
    const slider = document.getElementById("ratio-slider");
    const btnPlay = document.getElementById("ratio-play");
    const btnReset = document.getElementById("ratio-reset");
    const desc = document.getElementById("ratio-desc");
    if (!svg) return;

    const W = 720, H = 280, PAD_L = 60, PAD_R = 20, PAD_T = 20, PAD_B = 50;
    const Tmax = 60; // 分鐘

    // 建立資料：基準在 0.6，逐漸上升至 1.6，疊加雜訊
    const data = [];
    for (let t = 0; t <= Tmax; t++) {
      const base = 0.6 + 1.0 * (t / Tmax);
      const noise = (Math.sin(t * 0.7) * 0.05) + (Math.random() - 0.5) * 0.08;
      data.push({ t, v: +(base + noise).toFixed(3) });
    }
    const vMin = 0.4, vMax = 1.9;
    const xScale = t => PAD_L + (t / Tmax) * (W - PAD_L - PAD_R);
    const yScale = v => PAD_T + ((vMax - v) / (vMax - vMin)) * (H - PAD_T - PAD_B);
    const alertThr = 0.9;
    const fatigueThr = 1.3;

    let html = `<rect width="${W}" height="${H}" fill="#fafbff"/>`;
    // y 軸
    html += `<line x1="${PAD_L}" y1="${PAD_T}" x2="${PAD_L}" y2="${H - PAD_B}" stroke="#94a3b8"/>`;
    [0.5, 0.9, 1.3, 1.6, 1.9].forEach(v => {
      const y = yScale(v);
      html += `<line x1="${PAD_L - 4}" y1="${y}" x2="${PAD_L}" y2="${y}" stroke="#94a3b8"/>
               <text x="${PAD_L - 8}" y="${y + 4}" text-anchor="end" font-size="11" fill="#475569">${v.toFixed(1)}</text>`;
    });
    html += `<text x="14" y="${PAD_T + 100}" font-size="12" fill="#475569" transform="rotate(-90 14,${PAD_T + 100})">(θ+α)/(α+β)</text>`;
    // x 軸
    html += `<line x1="${PAD_L}" y1="${H - PAD_B}" x2="${W - PAD_R}" y2="${H - PAD_B}" stroke="#94a3b8"/>`;
    for (let t = 0; t <= 60; t += 10) {
      const x = xScale(t);
      html += `<line x1="${x}" y1="${H - PAD_B}" x2="${x}" y2="${H - PAD_B + 4}" stroke="#94a3b8"/>
               <text x="${x}" y="${H - PAD_B + 18}" text-anchor="middle" font-size="11" fill="#475569">${t}</text>`;
    }
    html += `<text x="${(W + PAD_L) / 2}" y="${H - 6}" text-anchor="middle" font-size="12" fill="#475569">駕駛時間 (分鐘)</text>`;
    // 區域底色
    html += `<rect x="${PAD_L}" y="${yScale(alertThr)}" width="${W - PAD_L - PAD_R}" height="${yScale(vMin) - yScale(alertThr)}" fill="#86efac" opacity="0.18"/>`;
    html += `<rect x="${PAD_L}" y="${yScale(fatigueThr)}" width="${W - PAD_L - PAD_R}" height="${yScale(alertThr) - yScale(fatigueThr)}" fill="#fef08a" opacity="0.3"/>`;
    html += `<rect x="${PAD_L}" y="${PAD_T}" width="${W - PAD_L - PAD_R}" height="${yScale(fatigueThr) - PAD_T}" fill="#fca5a5" opacity="0.25"/>`;
    // 區域標籤
    html += `<text x="${W - PAD_R - 8}" y="${yScale(0.7)}" text-anchor="end" font-size="11" fill="#15803d">Alert 區</text>`;
    html += `<text x="${W - PAD_R - 8}" y="${yScale(1.1)}" text-anchor="end" font-size="11" fill="#a16207">過渡區</text>`;
    html += `<text x="${W - PAD_R - 8}" y="${yScale(1.55)}" text-anchor="end" font-size="11" fill="#b91c1c">Fatigue 區</text>`;
    // 閾值線
    html += `<line x1="${PAD_L}" y1="${yScale(alertThr)}" x2="${W - PAD_R}" y2="${yScale(alertThr)}" stroke="#f59e0b" stroke-dasharray="4 4"/>`;
    html += `<line x1="${PAD_L}" y1="${yScale(fatigueThr)}" x2="${W - PAD_R}" y2="${yScale(fatigueThr)}" stroke="#dc2626" stroke-dasharray="4 4"/>`;
    // 訊號曲線
    const pts = data.map(d => xScale(d.t).toFixed(1) + "," + yScale(d.v).toFixed(1)).join(" ");
    html += `<polyline points="${pts}" fill="none" stroke="#2563eb" stroke-width="2"/>`;
    // 紅點
    html += `<circle id="ratio-cursor" cx="${xScale(0)}" cy="${yScale(data[0].v)}" r="7" fill="#dc2626" stroke="#fff" stroke-width="2"/>`;

    svg.innerHTML = html;

    function update(t) {
      const i = Math.max(0, Math.min(Tmax, Math.round(t)));
      const v = data[i].v;
      const cursor = svg.querySelector("#ratio-cursor");
      cursor.setAttribute("cx", xScale(i));
      cursor.setAttribute("cy", yScale(v));
      let state, color;
      if (v < alertThr)        { state = "Alert (清醒警覺)"; color = "#15803d"; }
      else if (v < fatigueThr) { state = "Transition (注意力下降)"; color = "#a16207"; }
      else                     { state = "Fatigue (明顯疲勞)"; color = "#b91c1c"; }
      desc.innerHTML = `<strong>第 ${i} 分鐘</strong> — (θ+α)/(α+β) = <span style="color:${color};font-weight:700">${v.toFixed(2)}</span> → <span style="color:${color};font-weight:700">${state}</span><br>
        <small>當這個比值持續超過 fatigue 閾值，閉迴路系統可發出警告（震動方向盤、喇叭、自動駕駛接管）。</small>`;
      slider.value = i;
    }

    let timer = null;
    function play() {
      if (timer) return;
      let t = +slider.value;
      timer = setInterval(() => {
        t += 1;
        if (t > Tmax) { t = Tmax; stop(); }
        update(t);
      }, 120);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function reset() { stop(); update(0); }

    slider.addEventListener("input", () => { stop(); update(+slider.value); });
    btnPlay.addEventListener("click", () => { if (timer) stop(); else play(); });
    btnReset.addEventListener("click", reset);
    update(0);
  }
})();
