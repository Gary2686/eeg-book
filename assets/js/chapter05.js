/* ============================================================
   Chapter 5 — EEG Signal Decomposition 互動模組
   作者：葉欲禾 (Gary Yu-Ho YEH) ・ 鄭鈞 (Jacob Cheng)
   涵蓋：
     1. BSS 玩具示範：源 vs. 觀測 vs. ICA 還原
     2. ICA 旋轉收斂示意
   ============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    initBSSDemo();
    initICADemo();

    if (window.EEG_API) window.EEG_API.logEvent("chapter_open", { chapterId: "ch05" });

    if (window.EEGQuiz && window.QUESTIONS_CH05) {
      window.EEGQuiz.init({
        mount: "#quiz-host",
        chapterId: "ch05",
        bank: window.QUESTIONS_CH05,
        count: 10,
        title: "第 5 章 隨機 10 題測驗",
      });
    }
  });

  // ===== 1. BSS 玩具示範：源 / 觀測 / 還原 =====
  function initBSSDemo() {
    const svg = document.getElementById("bss-plot");
    if (!svg) return;
    const caption = document.getElementById("bss-caption");
    const W = 720, H = 280, PAD_L = 70, PAD_R = 12, PAD_T = 10, PAD_B = 28;
    const ROW_H = (H - PAD_T - PAD_B) / 3;
    const N = 240; // samples
    const labels = ["源 1 / 觀測 1", "源 2 / 觀測 2", "源 3 / 觀測 3"];

    // 三條源訊號
    function source(i, n) {
      const t = n / N;
      if (i === 0) return Math.sin(2 * Math.PI * 5 * t);                              // 正弦
      if (i === 1) return Math.sign(Math.sin(2 * Math.PI * 3 * t)) * 0.9;             // 方波
      if (i === 2) return (n % 40 === 5 || n % 40 === 22) ? 0.95 : ((n % 80 === 60) ? -0.7 : 0); // 衝擊
      return 0;
    }

    // 混合矩陣 (3x3, 隨機定值)
    const HMIX = [
      [ 0.8,  0.6, -0.4],
      [-0.3,  0.7,  0.5],
      [ 0.5, -0.4,  0.8],
    ];

    function buildSignals() {
      const sArr = [[], [], []];
      const xArr = [[], [], []];
      for (let n = 0; n < N; n++) {
        const s = [source(0, n), source(1, n), source(2, n)];
        sArr[0].push(s[0]); sArr[1].push(s[1]); sArr[2].push(s[2]);
        for (let r = 0; r < 3; r++) {
          xArr[r].push(HMIX[r][0] * s[0] + HMIX[r][1] * s[1] + HMIX[r][2] * s[2]);
        }
      }
      return { sArr, xArr };
    }

    const { sArr, xArr } = buildSignals();

    function rowYCenter(r) { return PAD_T + ROW_H * r + ROW_H / 2; }

    function pathFor(arr, rIdx, color) {
      const max = Math.max(...arr.map(v => Math.abs(v))) || 1;
      const cy = rowYCenter(rIdx);
      const drawW = W - PAD_L - PAD_R;
      const amp = ROW_H * 0.42;
      const pts = arr.map((v, i) => {
        const x = PAD_L + (i / (arr.length - 1)) * drawW;
        const y = cy - (v / max) * amp;
        return (i === 0 ? "M" : "L") + x.toFixed(1) + "," + y.toFixed(1);
      }).join(" ");
      return `<path d="${pts}" fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>`;
    }

    function render(mode) {
      // mode: 'sources' | 'mix' | 'ica'
      let html = `<rect width="${W}" height="${H}" fill="#fafbff"/>`;
      // 三條基線
      for (let r = 0; r < 3; r++) {
        const cy = rowYCenter(r);
        html += `<line x1="${PAD_L}" y1="${cy}" x2="${W - PAD_R}" y2="${cy}" stroke="#e2e8f0" stroke-dasharray="3 4"/>`;
        html += `<text x="10" y="${cy + 4}" font-size="11" fill="#475569">${labels[r]}</text>`;
      }
      // 標題
      if (mode === "sources") {
        html += `<text x="${PAD_L}" y="14" font-size="12" font-weight="700" fill="#1e3a8a">① 原始源 s(t) — 三個彼此獨立的訊號</text>`;
        for (let r = 0; r < 3; r++) html += pathFor(sArr[r], r, "#16a34a");
      } else if (mode === "mix") {
        html += `<text x="${PAD_L}" y="14" font-size="12" font-weight="700" fill="#7f1d1d">② 觀測 x(t) = H·s(t) — 已經被攪在一起，肉眼幾乎看不出原樣</text>`;
        for (let r = 0; r < 3; r++) html += pathFor(xArr[r], r, "#dc2626");
      } else if (mode === "ica") {
        html += `<text x="${PAD_L}" y="14" font-size="12" font-weight="700" fill="#1d4ed8">③ ICA 還原 ŝ(t) — 與源僅差『置換 + 縮放』模糊，原貌已恢復</text>`;
        // 模擬 ICA 還原：把 sources 隨機置換 + 反向部分通道，模擬尺度/符號模糊
        const perm = [2, 0, 1];
        const signs = [-1, 1, -1];
        for (let r = 0; r < 3; r++) {
          const recovered = sArr[perm[r]].map(v => signs[r] * v);
          html += pathFor(recovered, r, "#2563eb");
        }
      }
      svg.innerHTML = html;
    }

    function setCaption(text) { if (caption) caption.textContent = text; }

    document.getElementById("bss-show-sources").addEventListener("click", () => {
      render("sources");
      setCaption("源訊號 s(t)：正弦、方波、衝擊。三者彼此獨立。");
    });
    document.getElementById("bss-show-mix").addEventListener("click", () => {
      render("mix");
      setCaption("觀測 x(t)：在 3 個電極上量到的是源訊號的線性組合，看起來雜亂。這正是 EEG 的真實處境。");
    });
    document.getElementById("bss-run-ica").addEventListener("click", () => {
      render("ica");
      setCaption("ICA 還原：源訊號近乎完美還原，僅順序與正負號可能與原始不同 (P·D 模糊)。");
    });

    render("sources");
  }

  // ===== 2. ICA 旋轉收斂示意 =====
  function initICADemo() {
    const svg = document.getElementById("ica-plot");
    if (!svg) return;
    const iterLabel = document.getElementById("ica-iter");
    const W = 360, H = 320;
    const CX = W / 2, CY = H / 2;
    const N = 240;

    // 兩個獨立、非高斯源 (Laplace + uniform)
    function rndLap() {
      // 雙指數
      const u = Math.random() - 0.5;
      return -Math.sign(u) * Math.log(1 - 2 * Math.abs(u)) / 1.3;
    }
    function rndUni() { return (Math.random() - 0.5) * 2.2; }

    // 生成資料：旋轉一個角度 θ_true
    const THETA_TRUE = 0.7; // 真實混合角度
    const cT = Math.cos(THETA_TRUE), sT = Math.sin(THETA_TRUE);
    const data = [];
    for (let i = 0; i < N; i++) {
      const s1 = rndLap();
      const s2 = rndUni();
      const x1 = cT * s1 - sT * s2;
      const x2 = sT * s1 + cT * s2;
      data.push([x1, x2]);
    }
    // 顯示用縮放
    const maxAbs = Math.max(...data.flatMap(p => p.map(Math.abs)));
    const SCALE = (Math.min(W, H) * 0.42) / maxAbs;

    let iter = 0;
    const MAX_ITER = 12;
    // 估計角度：用簡化的 fastICA 概念 — 對峰度做梯度
    // 為示範簡化，這裡讓 theta 從 0 線性收斂到 THETA_TRUE
    function currentTheta() {
      const ratio = Math.min(1, iter / MAX_ITER);
      // 用 ease-out 讓動畫更平順
      return THETA_TRUE * (1 - Math.pow(1 - ratio, 2));
    }

    function render() {
      const theta = currentTheta();
      let html = `<rect width="${W}" height="${H}" fill="#fafbff"/>`;
      // 軸
      html += `<line x1="0" y1="${CY}" x2="${W}" y2="${CY}" stroke="#e2e8f0"/>`;
      html += `<line x1="${CX}" y1="0" x2="${CX}" y2="${H}" stroke="#e2e8f0"/>`;
      // 資料點
      for (const p of data) {
        const px = CX + p[0] * SCALE;
        const py = CY - p[1] * SCALE;
        html += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="2" fill="#3b82f6" opacity="0.55"/>`;
      }
      // 估計到的兩個獨立方向 (旋轉 theta 的軸)
      const L = Math.min(W, H) * 0.42;
      const ax1x = CX + L * Math.cos(theta), ax1y = CY - L * Math.sin(theta);
      const ax1xN = CX - L * Math.cos(theta), ax1yN = CY + L * Math.sin(theta);
      const ax2x = CX + L * Math.cos(theta + Math.PI / 2), ax2y = CY - L * Math.sin(theta + Math.PI / 2);
      const ax2xN = CX - L * Math.cos(theta + Math.PI / 2), ax2yN = CY + L * Math.sin(theta + Math.PI / 2);
      html += `<line x1="${ax1xN.toFixed(1)}" y1="${ax1yN.toFixed(1)}" x2="${ax1x.toFixed(1)}" y2="${ax1y.toFixed(1)}" stroke="#dc2626" stroke-width="2.5"/>`;
      html += `<line x1="${ax2xN.toFixed(1)}" y1="${ax2yN.toFixed(1)}" x2="${ax2x.toFixed(1)}" y2="${ax2y.toFixed(1)}" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="5 4"/>`;
      // 標題
      const deg = (theta * 180 / Math.PI).toFixed(1);
      html += `<text x="10" y="18" font-size="12" font-weight="700" fill="#1e3a8a">估計角度 θ = ${deg}°（目標 ${(THETA_TRUE*180/Math.PI).toFixed(1)}°）</text>`;
      html += `<text x="10" y="${H - 8}" font-size="11" fill="#475569">紅實線=主獨立方向，紅虛線=另一獨立方向</text>`;
      svg.innerHTML = html;
      if (iterLabel) iterLabel.textContent = `迭代 ${iter} / ${MAX_ITER}`;
    }

    document.getElementById("ica-step").addEventListener("click", () => {
      if (iter < MAX_ITER) iter++;
      render();
    });
    document.getElementById("ica-reset").addEventListener("click", () => {
      iter = 0; render();
    });
    render();
  }
})();
