/* ============================================================
   Chapter 3 — 互動模組
   作者：葉欲禾 (Gary Yu-Ho YEH)
   涵蓋：
     1. Hodgkin-Huxley AP 視覺化（膜電位 + 閘門變數 m/h/n 同步動畫）
     2. GMM (Gaussian Mixture Model) 三分量權重互動
   ============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    initHH();
    initGMM();

    if (window.EEG_API) window.EEG_API.logEvent("chapter_open", { chapterId: "ch03" });

    if (window.EEGQuiz && window.QUESTIONS_CH03) {
      window.EEGQuiz.init({
        mount: "#quiz-host",
        chapterId: "ch03",
        bank: window.QUESTIONS_CH03,
        count: 10,
        title: "第三章 隨機 10 題測驗",
      });
    }
  });

  // ===== 1. Hodgkin–Huxley AP 視覺化 =====
  function initHH() {
    const svg = document.getElementById("hh-plot");
    const desc = document.getElementById("hh-desc");
    const slider = document.getElementById("hh-slider");
    const btnPlay = document.getElementById("hh-play");
    const btnReset = document.getElementById("hh-reset");
    if (!svg) return;

    // 預先以分段近似的方式產生：
    // 膜電位 E(t)：靜止 -65 → +35 spike → -75 hyper → 回 -65
    // m (Na 活化, 快開)：靜止 0.05 → 高峰 0.95 → 跌回 0.05
    // h (Na 不活化, 慢關)：靜止 0.6 → 跌到 0.05 → 慢慢回 0.6
    // n (K 活化, 慢開)：靜止 0.3 → 緩升至 0.75 → 慢慢回 0.3
    const samples = [];
    for (let t = 0; t <= 10; t += 0.05) {
      let E, m, h, n;
      if (t < 1) {
        E = -65;
        m = 0.05; h = 0.6; n = 0.3;
      } else if (t < 1.6) {
        const p = (t - 1) / 0.6;
        E = -65 + p * (35 - (-65));
        m = 0.05 + p * 0.9;
        h = 0.6 - p * 0.4;
        n = 0.3 + p * 0.15;
      } else if (t < 2.6) {
        const p = (t - 1.6) / 1.0;
        E = 35 - p * (35 - (-75));
        m = 0.95 - p * 0.85;
        h = 0.2 - p * 0.15;
        n = 0.45 + p * 0.3;
      } else if (t < 4.5) {
        const p = (t - 2.6) / 1.9;
        E = -75 + p * 10;       // -75 → -65
        m = 0.10 - p * 0.05;
        h = 0.05 + p * 0.5;     // 慢慢回
        n = 0.75 - p * 0.45;
      } else {
        E = -65; m = 0.05; h = 0.6; n = 0.3;
      }
      samples.push({ t, E, m, h, n });
    }

    const W = 720, H = 360, PAD_L = 56, PAD_R = 16, PAD_T = 18;
    const TOP_H = 180; // 膜電位區塊高
    const BOT_TOP = TOP_H + 24;
    const BOT_H = 130; // 閘門變數區塊高

    const xScale = t => PAD_L + (t / 10) * (W - PAD_L - PAD_R);
    const yE = v => PAD_T + ((40 - v) / 120) * (TOP_H - PAD_T);
    const yG = v => BOT_TOP + (1 - v) * (BOT_H - 8);

    // 建構曲線 path
    const pathE = samples.map((s, i) => (i === 0 ? "M" : "L") + xScale(s.t).toFixed(1) + "," + yE(s.E).toFixed(1)).join(" ");
    const pathM = samples.map((s, i) => (i === 0 ? "M" : "L") + xScale(s.t).toFixed(1) + "," + yG(s.m).toFixed(1)).join(" ");
    const pathH = samples.map((s, i) => (i === 0 ? "M" : "L") + xScale(s.t).toFixed(1) + "," + yG(s.h).toFixed(1)).join(" ");
    const pathN = samples.map((s, i) => (i === 0 ? "M" : "L") + xScale(s.t).toFixed(1) + "," + yG(s.n).toFixed(1)).join(" ");

    let html = `
      <rect x="0" y="0" width="${W}" height="${H}" fill="#fafbff"/>
      <text x="${PAD_L}" y="14" font-size="12" font-weight="700" fill="#0f172a">膜電位 E (mV)</text>
      <text x="${PAD_L}" y="${BOT_TOP - 4}" font-size="12" font-weight="700" fill="#0f172a">閘門變數 (0~1)：m=Na 活化, h=Na 不活化, n=K 活化</text>
      <line x1="${PAD_L}" y1="${PAD_T}" x2="${PAD_L}" y2="${TOP_H}" stroke="#94a3b8"/>
      <line x1="${PAD_L}" y1="${TOP_H}" x2="${W - PAD_R}" y2="${TOP_H}" stroke="#94a3b8"/>
      <line x1="${PAD_L}" y1="${BOT_TOP}" x2="${PAD_L}" y2="${BOT_TOP + BOT_H}" stroke="#94a3b8"/>
      <line x1="${PAD_L}" y1="${BOT_TOP + BOT_H}" x2="${W - PAD_R}" y2="${BOT_TOP + BOT_H}" stroke="#94a3b8"/>
    `;

    // y 刻度（上）
    [40, 0, -40, -80].forEach(v => {
      const y = yE(v);
      html += `<line x1="${PAD_L - 4}" y1="${y}" x2="${PAD_L}" y2="${y}" stroke="#94a3b8"/>
               <text x="${PAD_L - 8}" y="${y + 4}" text-anchor="end" font-size="10" fill="#475569">${v}</text>`;
    });
    // 閾值 -55
    html += `<line x1="${PAD_L}" y1="${yE(-55)}" x2="${W - PAD_R}" y2="${yE(-55)}" stroke="#f59e0b" stroke-dasharray="4 4"/>
             <text x="${W - PAD_R - 4}" y="${yE(-55) - 4}" text-anchor="end" font-size="10" fill="#b45309">閾值 -55 mV</text>`;

    // y 刻度（下）0、0.5、1
    [0, 0.5, 1].forEach(v => {
      const y = yG(v);
      html += `<line x1="${PAD_L - 4}" y1="${y}" x2="${PAD_L}" y2="${y}" stroke="#94a3b8"/>
               <text x="${PAD_L - 8}" y="${y + 4}" text-anchor="end" font-size="10" fill="#475569">${v}</text>`;
    });

    // x 刻度
    for (let t = 0; t <= 10; t += 2) {
      const x = xScale(t);
      html += `<line x1="${x}" y1="${BOT_TOP + BOT_H}" x2="${x}" y2="${BOT_TOP + BOT_H + 4}" stroke="#94a3b8"/>
               <text x="${x}" y="${BOT_TOP + BOT_H + 16}" text-anchor="middle" font-size="10" fill="#475569">${t}</text>`;
    }
    html += `<text x="${W / 2}" y="${H - 4}" text-anchor="middle" font-size="11" fill="#475569">時間 (ms)</text>`;

    // 曲線
    html += `<path d="${pathE}" stroke="#dc2626" stroke-width="2.5" fill="none"/>`;
    html += `<path d="${pathM}" stroke="#2563eb" stroke-width="2" fill="none"/>`;
    html += `<path d="${pathH}" stroke="#16a34a" stroke-width="2" fill="none"/>`;
    html += `<path d="${pathN}" stroke="#a855f7" stroke-width="2" fill="none"/>`;

    // 圖例
    html += `
      <g font-size="11">
        <rect x="${W - 130}" y="${BOT_TOP + 8}" width="120" height="78" fill="#ffffff" stroke="#cbd5e1"/>
        <line x1="${W - 124}" y1="${BOT_TOP + 22}" x2="${W - 102}" y2="${BOT_TOP + 22}" stroke="#2563eb" stroke-width="2"/>
        <text x="${W - 98}" y="${BOT_TOP + 26}" fill="#1e3a8a">m (Na 活化)</text>
        <line x1="${W - 124}" y1="${BOT_TOP + 40}" x2="${W - 102}" y2="${BOT_TOP + 40}" stroke="#16a34a" stroke-width="2"/>
        <text x="${W - 98}" y="${BOT_TOP + 44}" fill="#166534">h (Na 不活化)</text>
        <line x1="${W - 124}" y1="${BOT_TOP + 58}" x2="${W - 102}" y2="${BOT_TOP + 58}" stroke="#a855f7" stroke-width="2"/>
        <text x="${W - 98}" y="${BOT_TOP + 62}" fill="#6b21a8">n (K 活化)</text>
        <line x1="${W - 124}" y1="${BOT_TOP + 76}" x2="${W - 102}" y2="${BOT_TOP + 76}" stroke="#dc2626" stroke-width="2"/>
        <text x="${W - 98}" y="${BOT_TOP + 80}" fill="#991b1b">E (上方紅線)</text>
      </g>
    `;

    // cursor
    html += `<circle id="hh-cursor-E" cx="${xScale(0)}" cy="${yE(-65)}" r="6" fill="#dc2626"/>`;
    html += `<line id="hh-cursor-line" x1="${xScale(0)}" y1="${PAD_T}" x2="${xScale(0)}" y2="${BOT_TOP + BOT_H}" stroke="#dc2626" stroke-dasharray="3 3" opacity="0.5"/>`;

    svg.innerHTML = html;

    const cursor = svg.querySelector("#hh-cursor-E");
    const cursorLine = svg.querySelector("#hh-cursor-line");

    function describe(s) {
      const t = s.t;
      let stage;
      if (t < 1) stage = "靜止 (Resting) — Na/K 通道幾乎都關，膜電位約 -65 mV。";
      else if (t < 1.6) stage = "去極化 (Depolarization) — m 快速上升、Na⁺ 大量湧入，把膜電位拉至 +35 mV。";
      else if (t < 2.6) stage = "再極化 (Repolarization) — h 關掉 Na 通道、n 緩開讓 K⁺ 流出。";
      else if (t < 4.5) stage = "過極化 (Hyperpolarization) — K 通道仍開，電位低於靜止值，進入不反應期。";
      else stage = "恢復 (Recovery) — 所有閘門變數回到靜止值，準備下一次 AP。";
      if (desc) desc.innerHTML = `<strong>t = ${t.toFixed(2)} ms</strong>　E = ${s.E.toFixed(1)} mV｜m=${s.m.toFixed(2)}, h=${s.h.toFixed(2)}, n=${s.n.toFixed(2)}<br><span style="color:#475569;">${stage}</span>`;
    }

    function updateAt(t) {
      const idx = Math.min(samples.length - 1, Math.max(0, Math.round(t / 0.05)));
      const s = samples[idx];
      const x = xScale(s.t);
      cursor.setAttribute("cx", x);
      cursor.setAttribute("cy", yE(s.E));
      cursorLine.setAttribute("x1", x);
      cursorLine.setAttribute("x2", x);
      slider.value = s.t;
      describe(s);
    }

    let timer = null, curT = 0;
    function play() {
      if (timer) return;
      timer = setInterval(() => {
        curT += 0.08;
        if (curT > 10) { curT = 10; stop(); }
        updateAt(curT);
      }, 40);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function reset() { stop(); curT = 0; updateAt(0); }

    btnPlay && btnPlay.addEventListener("click", play);
    btnReset && btnReset.addEventListener("click", reset);
    slider && slider.addEventListener("input", e => { stop(); curT = +e.target.value; updateAt(curT); });

    updateAt(0);
  }

  // ===== 2. GMM 三分量互動 =====
  function initGMM() {
    const svg = document.getElementById("gmm-plot");
    if (!svg) return;
    const sliders = ["gmm-w1", "gmm-w2", "gmm-w3"].map(id => document.getElementById(id));
    const vals    = ["gmm-w1-v", "gmm-w2-v", "gmm-w3-v"].map(id => document.getElementById(id));

    // 三個高斯參數（mu, sigma, color）
    const gaussians = [
      { mu: -4, sigma: 1.4, color: "#dc2626" },
      { mu:  0, sigma: 1.0, color: "#2563eb" },
      { mu:  4, sigma: 1.8, color: "#16a34a" },
    ];

    const W = 720, H = 220, PAD_L = 50, PAD_R = 12, PAD_T = 14, PAD_B = 40;
    const xMin = -10, xMax = 10;
    const yMax = 0.45;

    function gauss(x, mu, sigma) {
      return Math.exp(-((x - mu) ** 2) / (2 * sigma * sigma)) / (sigma * Math.sqrt(2 * Math.PI));
    }

    function xScale(x) { return PAD_L + ((x - xMin) / (xMax - xMin)) * (W - PAD_L - PAD_R); }
    function yScale(y) { return H - PAD_B - (y / yMax) * (H - PAD_T - PAD_B); }

    function render() {
      const raw = sliders.map(s => +s.value);
      const sum = raw.reduce((a,b) => a + b, 0) || 1;
      const w = raw.map(v => v / sum);
      vals.forEach((el, i) => el.textContent = w[i].toFixed(2));

      // sample N 個 x
      const xs = [];
      const N = 360;
      for (let i = 0; i <= N; i++) xs.push(xMin + (i / N) * (xMax - xMin));

      const totalPts = [];
      const compPts  = [[], [], []];
      xs.forEach(x => {
        let tot = 0;
        gaussians.forEach((g, i) => {
          const p = gauss(x, g.mu, g.sigma);
          compPts[i].push(xScale(x).toFixed(1) + "," + yScale(p * w[i]).toFixed(1));
          tot += w[i] * p;
        });
        totalPts.push(xScale(x).toFixed(1) + "," + yScale(tot).toFixed(1));
      });

      let html = `
        <rect x="0" y="0" width="${W}" height="${H}" fill="#fafbff"/>
        <line x1="${PAD_L}" y1="${H - PAD_B}" x2="${W - PAD_R}" y2="${H - PAD_B}" stroke="#94a3b8"/>
        <line x1="${PAD_L}" y1="${PAD_T}" x2="${PAD_L}" y2="${H - PAD_B}" stroke="#94a3b8"/>
        <text x="${W / 2}" y="${H - 8}" text-anchor="middle" font-size="11" fill="#475569">樣本振幅 x</text>
        <text x="14" y="${(H + PAD_T) / 2}" font-size="11" fill="#475569" transform="rotate(-90 14,${(H + PAD_T) / 2})">機率密度</text>
      `;
      // x 刻度
      for (let x = xMin; x <= xMax; x += 2) {
        html += `<line x1="${xScale(x)}" y1="${H - PAD_B}" x2="${xScale(x)}" y2="${H - PAD_B + 4}" stroke="#94a3b8"/>
                 <text x="${xScale(x)}" y="${H - PAD_B + 16}" text-anchor="middle" font-size="10" fill="#475569">${x}</text>`;
      }
      // 各分量虛線
      compPts.forEach((pts, i) => {
        html += `<polyline points="${pts.join(' ')}" fill="none" stroke="${gaussians[i].color}" stroke-width="1.5" stroke-dasharray="5 3" opacity="0.85"/>`;
      });
      // 總和粗線
      html += `<polyline points="${totalPts.join(' ')}" fill="none" stroke="#0f172a" stroke-width="2.5"/>`;
      html += `<text x="${W - PAD_R - 8}" y="${PAD_T + 14}" text-anchor="end" font-size="11" fill="#0f172a">— 加權總和分布 p(x)</text>`;

      svg.innerHTML = html;
    }

    sliders.forEach(s => s.addEventListener("input", render));
    render();
  }
})();
