/* ============================================================
   Chapter 11 — 互動模組
   作者：葉欲禾 (Gary Yu-Ho YEH)
   涵蓋：
     1. Pre-ictal / Ictal / Post-ictal / Inter-ictal 腦波切換
     2. Seizure Detection 流程方塊
   ============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    initPhaseSwitch();
    initDetFlow();

    if (window.EEG_API) window.EEG_API.logEvent("chapter_open", { chapterId: "ch11" });

    if (window.EEGQuiz && window.QUESTIONS_CH11) {
      window.EEGQuiz.init({
        mount: "#quiz-host",
        chapterId: "ch11",
        bank: window.QUESTIONS_CH11,
        count: 10,
        title: "第 11 章 隨機 10 題測驗",
      });
    }
  });

  // ===== 1. 四階段腦波切換 =====
  function initPhaseSwitch() {
    const svg  = document.getElementById("phase-wave");
    const desc = document.getElementById("phase-desc");
    const buttons = document.querySelectorAll("[data-phase]");
    if (!svg || !desc) return;

    const W = 720, H = 200, midY = H / 2;
    const phases = {
      inter: {
        title: "① 間發期 Inter-ictal — 平常狀態",
        text:  "病人沒有發作；多數時間 EEG 像正常人，但可能偶爾出現孤立的 IED（棘波 / sharp wave）。臨床上「能否在 inter-ictal 上找到棘波」是診斷癲癇的線索之一。",
        color: "#2563eb",
        gen:   genBackground,
      },
      pre: {
        title: "② 發作前期 Pre-ictal — 將要發作的幾分鐘到幾十分鐘",
        text:  "STLmax 漸進收斂、能量緩慢上升、dynamical similarity 下降。看似還沒爆發，但動力系統指標已開始改變 — 這是「預測 (prediction)」演算法的關鍵。",
        color: "#a855f7",
        gen:   genPreictal,
      },
      ictal: {
        title: "③ 發作期 Ictal — 真正的發作",
        text:  "大群神經元超同步放電 → 振幅顯著變大、頻率出現明顯規律。focal 發作可能只在幾個通道明顯；generalized 發作則全頭一致。",
        color: "#dc2626",
        gen:   genIctal,
      },
      post: {
        title: "④ 發作後期 Post-ictal — 結束的數分鐘",
        text:  "腦波呈現大量慢波與抑制 (suppression)，病人常感疲累、意識混亂。Post-ictal slowing 也是判讀發作真假的線索之一。",
        color: "#0d9488",
        gen:   genPost,
      },
    };

    function genBackground(N) {
      const arr = [];
      for (let i = 0; i < N; i++) {
        const t = i / N * 2 * Math.PI * 8;
        arr.push(8 * Math.sin(t) + 4 * Math.sin(t * 2.7 + 1) + (Math.random() - 0.5) * 8);
      }
      // 偶發小棘波
      [120, 360, 540].forEach(k => {
        if (arr[k] !== undefined) {
          arr[k]     += -30;
          arr[k + 1] += 36;
          arr[k + 2] += -18;
        }
      });
      return arr;
    }
    function genPreictal(N) {
      const arr = [];
      for (let i = 0; i < N; i++) {
        const t = i / N * 2 * Math.PI * 10;
        const env = 1 + (i / N) * 0.8;  // 緩慢增大
        arr.push(env * (10 * Math.sin(t) + 5 * Math.sin(t * 3 + 0.4)) + (Math.random() - 0.5) * 6);
      }
      return arr;
    }
    function genIctal(N) {
      const arr = [];
      for (let i = 0; i < N; i++) {
        const t = i / N * 2 * Math.PI * 14;
        arr.push(30 * Math.sin(t) + 18 * Math.sin(t * 2 + 0.2) + (Math.random() - 0.5) * 6);
      }
      return arr;
    }
    function genPost(N) {
      const arr = [];
      for (let i = 0; i < N; i++) {
        const t = i / N * 2 * Math.PI * 2.5;
        const env = Math.max(0.3, 1.5 - (i / N) * 1.0);
        arr.push(env * (22 * Math.sin(t) + 6 * Math.sin(t * 1.3)) + (Math.random() - 0.5) * 4);
      }
      return arr;
    }

    function draw(phaseKey) {
      const phase = phases[phaseKey];
      const N = 720;
      const data = phase.gen(N);
      const max = 50;
      const pts = data.map((v, i) => {
        const x = (i / (N - 1)) * (W - 10) + 5;
        const y = midY - Math.max(-max, Math.min(max, v)) * 1.4;
        return x.toFixed(1) + "," + y.toFixed(1);
      }).join(" ");

      let html = `
        <rect width="${W}" height="${H}" fill="#fafbff"/>
        <line x1="5" y1="${midY}" x2="${W - 5}" y2="${midY}" stroke="#cbd5e1" stroke-dasharray="3 3"/>
        <polyline points="${pts}" fill="none" stroke="${phase.color}" stroke-width="1.6"/>
        <text x="${W - 12}" y="22" text-anchor="end" font-size="13" font-weight="700" fill="${phase.color}">${phase.title}</text>
      `;
      if (phaseKey === "ictal" || phaseKey === "pre") {
        // 標 ictal onset 紅虛線
        const x = phaseKey === "ictal" ? 100 : W - 80;
        html += `<line x1="${x}" y1="20" x2="${x}" y2="${H - 10}" stroke="#dc2626" stroke-dasharray="5 4" stroke-width="1.5"/>
                 <text x="${x + 6}" y="34" font-size="11" fill="#dc2626">Ictal onset</text>`;
      }
      svg.innerHTML = html;
      desc.innerHTML = `<strong>${phase.title}</strong><br>${phase.text}`;

      buttons.forEach(b => {
        const active = b.dataset.phase === phaseKey;
        b.style.background = active ? phase.color : "";
        b.style.color = active ? "white" : "";
      });
    }

    buttons.forEach(b => b.addEventListener("click", () => draw(b.dataset.phase)));
    draw("inter");
  }

  // ===== 2. Detection 流程圖 =====
  function initDetFlow() {
    const svg  = document.getElementById("det-flow");
    const desc = document.getElementById("det-flow-desc");
    if (!svg || !desc) return;

    const steps = [
      { id: "raw",    x: 20,  label: "原始 EEG",      detail: "多通道頭皮 EEG 訊號，常 200–500 Hz 取樣。" },
      { id: "pre",    x: 140, label: "預處理",        detail: "Notch 50/60 Hz、bandpass 0.5–70 Hz、去除眨眼/肌肉 artefact（ICA、BSS）。" },
      { id: "feat",   x: 260, label: "特徵擷取",      detail: "計算能量、DWT 各層能量、STLmax、entropy、頻段比、相干性等。" },
      { id: "sel",    x: 380, label: "特徵選擇",      detail: "PCA / KPCA / 互資訊；挑出辨識力最強的少數特徵，降維。" },
      { id: "clf",    x: 500, label: "分類器",        detail: "SVM、ANN、Random Forest、CNN、Bi-LSTM 等；對 CHB-MIT 等資料庫可達 90%+ 準確率。" },
      { id: "out",    x: 620, label: "Seizure! 警告", detail: "輸出 binary 標記 + 信賴度；可串連 RNS / DBS 做閉迴路刺激。" },
    ];

    let html = `<rect width="760" height="180" fill="#fafbff"/>`;
    steps.forEach((s, i) => {
      const fill = "#dbeafe", stroke = "#1d4ed8";
      html += `<g class="det-box" data-id="${s.id}" style="cursor:pointer">
                 <rect x="${s.x}" y="55" width="110" height="70" rx="10" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
                 <text x="${s.x + 55}" y="92" text-anchor="middle" font-size="13" font-weight="700" fill="#1e3a8a">${s.label}</text>
                 <text x="${s.x + 55}" y="110" text-anchor="middle" font-size="11" fill="#1e40af">step ${i + 1}</text>
               </g>`;
      if (i < steps.length - 1) {
        const x1 = s.x + 110, x2 = steps[i + 1].x;
        html += `<line x1="${x1}" y1="90" x2="${x2}" y2="90" stroke="#475569" stroke-width="2"/>
                 <polygon points="${x2},90 ${x2 - 7},85 ${x2 - 7},95" fill="#475569"/>`;
      }
    });
    svg.innerHTML = html;

    function showStep(id) {
      const s = steps.find(x => x.id === id);
      if (!s) return;
      desc.innerHTML = `<strong>${s.label}</strong><br>${s.detail}`;
      svg.querySelectorAll(".det-box rect").forEach(r => r.setAttribute("stroke-width", "2"));
      const cur = svg.querySelector(`[data-id="${id}"] rect`);
      if (cur) cur.setAttribute("stroke-width", "4");
    }
    svg.querySelectorAll(".det-box").forEach(g => {
      g.addEventListener("click", () => showStep(g.dataset.id));
      g.addEventListener("mouseenter", () => showStep(g.dataset.id));
    });
    showStep("raw");
  }
})();
