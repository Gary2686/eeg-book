/* ============================================================
   Chapter 6 — Chaos and Dynamical Analysis 互動模組
   作者：葉欲禾 (Gary Yu-Ho YEH) ・ 鄭鈞 (Jacob Cheng)
   涵蓋：
     1. Lyapunov 收斂 vs. 發散動畫 (logistic map)
     2. 相空間嵌入示意 (正弦 / 混沌 / 雜訊)
   ============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    initLyapunovDemo();
    initAttractorDemo();

    if (window.EEG_API) window.EEG_API.logEvent("chapter_open", { chapterId: "ch06" });

    if (window.EEGQuiz && window.QUESTIONS_CH06) {
      window.EEGQuiz.init({
        mount: "#quiz-host",
        chapterId: "ch06",
        bank: window.QUESTIONS_CH06,
        count: 10,
        title: "第 6 章 隨機 10 題測驗",
      });
    }
  });

  // ===== 1. Lyapunov demo：兩條軌跡的演化 =====
  function initLyapunovDemo() {
    const svg = document.getElementById("lyap-plot");
    if (!svg) return;
    const caption = document.getElementById("lyap-caption");
    const W = 720, H = 280, PAD_L = 50, PAD_R = 12, PAD_T = 16, PAD_B = 30;
    const STEPS = 60;
    const EPS = 1e-5;

    function logisticTraj(alpha, x0, n) {
      const arr = [x0];
      for (let i = 0; i < n; i++) {
        const prev = arr[arr.length - 1];
        arr.push(alpha * prev * (1 - prev));
      }
      return arr;
    }

    function render(alpha, label) {
      const t1 = logisticTraj(alpha, 0.4, STEPS);
      const t2 = logisticTraj(alpha, 0.4 + EPS, STEPS);
      const xScale = i => PAD_L + (i / STEPS) * (W - PAD_L - PAD_R);
      const yScale = v => PAD_T + (1 - v) * (H - PAD_T - PAD_B);
      function pathOf(arr, color) {
        const pts = arr.map((v, i) => (i === 0 ? "M" : "L") + xScale(i).toFixed(1) + "," + yScale(v).toFixed(1)).join(" ");
        return `<path d="${pts}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round"/>`;
      }
      // 軸
      let html = `<rect width="${W}" height="${H}" fill="#fafbff"/>`;
      html += `<line x1="${PAD_L}" y1="${H - PAD_B}" x2="${W - PAD_R}" y2="${H - PAD_B}" stroke="#94a3b8"/>`;
      html += `<line x1="${PAD_L}" y1="${PAD_T}" x2="${PAD_L}" y2="${H - PAD_B}" stroke="#94a3b8"/>`;
      // 標籤
      [0, 0.5, 1].forEach(v => {
        const y = yScale(v);
        html += `<line x1="${PAD_L - 4}" y1="${y}" x2="${PAD_L}" y2="${y}" stroke="#94a3b8"/>`;
        html += `<text x="${PAD_L - 8}" y="${y + 4}" text-anchor="end" font-size="10" fill="#475569">${v}</text>`;
      });
      for (let i = 0; i <= STEPS; i += 10) {
        const x = xScale(i);
        html += `<text x="${x}" y="${H - PAD_B + 14}" text-anchor="middle" font-size="10" fill="#475569">${i}</text>`;
      }
      html += `<text x="${PAD_L}" y="14" font-size="13" font-weight="700" fill="#1e3a8a">${label}（兩條軌跡初值差 ε=10⁻⁵）</text>`;
      html += pathOf(t1, "#dc2626");
      html += pathOf(t2, "#2563eb");
      svg.innerHTML = html;
    }

    function setCaption(text) { if (caption) caption.textContent = text; }

    document.getElementById("lyap-chaos").addEventListener("click", () => {
      render(3.95, "α = 3.95（混沌區）");
      setCaption("混沌：兩條紅藍軌跡很快指數性發散，10⁻⁵ 的初始誤差幾步後就無法區分位置 — 對應正的 Lyapunov 指數。");
    });
    document.getElementById("lyap-order").addEventListener("click", () => {
      render(2.5, "α = 2.5（有序區）");
      setCaption("有序：兩條軌跡迅速收斂到同一個不動點，初始差異被消除 — Lyapunov 指數為負。");
    });
    document.getElementById("lyap-reset").addEventListener("click", () => {
      render(3.95, "α = 3.95（混沌區）");
      setCaption("紅色與藍色軌跡初值差 ε=10⁻⁵；觀察是否快速分離。");
    });

    render(3.95, "α = 3.95（混沌區）");
  }

  // ===== 2. 相空間嵌入示意 =====
  function initAttractorDemo() {
    const svg = document.getElementById("attr-plot");
    if (!svg) return;
    const caption = document.getElementById("attr-caption");
    const W = 720, H = 300;
    const PAD = 20;
    const LEFT_W = (W / 2) - PAD * 1.5;
    const RIGHT_W = (W / 2) - PAD * 1.5;

    function genSine(N) {
      const arr = [];
      for (let i = 0; i < N; i++) arr.push(Math.sin(2 * Math.PI * 6 * i / N));
      return arr;
    }
    function genChaos(N) {
      const arr = [0.35];
      for (let i = 1; i < N; i++) {
        const prev = arr[i - 1];
        arr.push(3.95 * prev * (1 - prev));
      }
      // shift to [-1, 1]
      return arr.map(v => 2 * v - 1);
    }
    function genNoise(N) {
      const arr = [];
      for (let i = 0; i < N; i++) arr.push((Math.random() - 0.5) * 1.8);
      return arr;
    }

    function render(kind) {
      const N = 400;
      const TAU = kind === "sine" ? 8 : 2;
      const signal = kind === "sine" ? genSine(N) : kind === "chaos" ? genChaos(N) : genNoise(N);
      const max = 1.1;
      // Left: time series
      const leftXScale = i => PAD + (i / N) * LEFT_W;
      const leftYScale = v => H / 2 - (v / max) * (H / 2 - PAD);
      const tsPath = signal.map((v, i) => (i === 0 ? "M" : "L") + leftXScale(i).toFixed(1) + "," + leftYScale(v).toFixed(1)).join(" ");

      // Right: phase space (x(t), x(t+TAU))
      const rightOriginX = W / 2 + PAD * 0.5;
      const rightCenter = { x: rightOriginX + RIGHT_W / 2, y: H / 2 };
      const rScale = (RIGHT_W / 2) - 8;
      const pts = [];
      for (let i = 0; i + TAU < N; i++) {
        const px = rightCenter.x + (signal[i] / max) * rScale;
        const py = rightCenter.y - (signal[i + TAU] / max) * rScale;
        pts.push(`<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="1.4" fill="#3b82f6" opacity="0.7"/>`);
      }

      let html = `<rect width="${W}" height="${H}" fill="#fafbff"/>`;
      // Left frame
      html += `<rect x="${PAD - 4}" y="${PAD - 4}" width="${LEFT_W + 8}" height="${H - PAD * 2 + 8}" fill="none" stroke="#e2e8f0"/>`;
      html += `<line x1="${PAD}" y1="${H / 2}" x2="${PAD + LEFT_W}" y2="${H / 2}" stroke="#cbd5e1" stroke-dasharray="3 3"/>`;
      html += `<text x="${PAD + LEFT_W / 2}" y="${PAD + 4}" text-anchor="middle" font-size="12" font-weight="700" fill="#1e3a8a">時間序列 x(t)</text>`;
      html += `<path d="${tsPath}" fill="none" stroke="#dc2626" stroke-width="1.4"/>`;
      // Right frame
      html += `<rect x="${rightOriginX - 4}" y="${PAD - 4}" width="${RIGHT_W + 8}" height="${H - PAD * 2 + 8}" fill="none" stroke="#e2e8f0"/>`;
      html += `<line x1="${rightCenter.x}" y1="${PAD}" x2="${rightCenter.x}" y2="${H - PAD}" stroke="#e2e8f0"/>`;
      html += `<line x1="${rightOriginX}" y1="${rightCenter.y}" x2="${rightOriginX + RIGHT_W}" y2="${rightCenter.y}" stroke="#e2e8f0"/>`;
      html += `<text x="${rightCenter.x}" y="${PAD + 4}" text-anchor="middle" font-size="12" font-weight="700" fill="#1e3a8a">相空間 (x(t), x(t+τ))</text>`;
      html += pts.join("");
      svg.innerHTML = html;
    }

    function setCaption(text) { if (caption) caption.textContent = text; }

    document.getElementById("attr-sine").addEventListener("click", () => {
      render("sine");
      setCaption("正弦訊號 → 相空間為閉合橢圓（週期軌道），Lyapunov ≈ 0，碎形維度 ≈ 1。");
    });
    document.getElementById("attr-chaos").addEventListener("click", () => {
      render("chaos");
      setCaption("Logistic 混沌 → 相空間呈現『折疊但有結構』的吸引子，碎形維度為非整數、Lyapunov > 0。");
    });
    document.getElementById("attr-noise").addEventListener("click", () => {
      render("noise");
      setCaption("白雜訊 → 相空間充滿了沒有結構的點雲（無吸引子），維度近似 m (嵌入維)，無法用混沌規律描述。");
    });

    render("sine");
  }
})();
