/* ============================================================
   Chapter 7 — Machine Learning for EEG 互動模組
   作者：葉欲禾 (Gary Yu-Ho YEH) ・ 鄭鈞 (Jacob Cheng)
   涵蓋：
     1. 決策邊界互動 (LDA vs. SVM RBF vs. KNN)
     2. CNN 架構互動圖
   ============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    initDecisionDemo();
    initCNNDiagram();

    if (window.EEG_API) window.EEG_API.logEvent("chapter_open", { chapterId: "ch07" });

    if (window.EEGQuiz && window.QUESTIONS_CH07) {
      window.EEGQuiz.init({
        mount: "#quiz-host",
        chapterId: "ch07",
        bank: window.QUESTIONS_CH07,
        count: 10,
        title: "第 7 章 隨機 10 題測驗",
      });
    }
  });

  // ===== 1. 決策邊界 demo =====
  function initDecisionDemo() {
    const svg = document.getElementById("dec-plot");
    if (!svg) return;
    const caption = document.getElementById("dec-caption");
    const W = 480, H = 360;
    const GRID = 60; // 解析度
    const CELL_W = W / GRID, CELL_H = H / GRID;

    // 產生兩類 toy 資料：兩個高斯團 + 一些 outlier
    function rng(seed) { let s = seed; return () => (s = (s * 9301 + 49297) % 233280) / 233280; }
    const rand = rng(42);
    function gauss(mx, my, sigma, n, label) {
      const arr = [];
      for (let i = 0; i < n; i++) {
        // Box-Muller
        const u1 = rand() || 1e-9, u2 = rand();
        const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
        arr.push({ x: mx + z0 * sigma, y: my + z1 * sigma, c: label });
      }
      return arr;
    }
    const dataA = gauss(W * 0.35, H * 0.40, 38, 36, 0);
    const dataB = gauss(W * 0.65, H * 0.65, 38, 36, 1);
    const data = dataA.concat(dataB);

    // 各分類器 predictor
    function predLDA(x, y) {
      // 兩高斯均值
      const muA = { x: W * 0.35, y: H * 0.40 };
      const muB = { x: W * 0.65, y: H * 0.65 };
      // 中垂線方向：簡化
      const dx = muB.x - muA.x, dy = muB.y - muA.y;
      const cx = (muA.x + muB.x) / 2, cy = (muA.y + muB.y) / 2;
      // sign: 若 (x-c)·(B-A) > 0 → class B
      return ((x - cx) * dx + (y - cy) * dy) > 0 ? 1 : 0;
    }
    function predSVMRBF(x, y) {
      // 簡化版：用每個樣本的 RBF kernel 和標籤線性組合
      const sigma2 = 40 * 40 * 2;
      let score = 0;
      for (const p of data) {
        const d2 = (x - p.x) ** 2 + (y - p.y) ** 2;
        const w = Math.exp(-d2 / sigma2);
        score += (p.c === 1 ? 1 : -1) * w;
      }
      return score > 0 ? 1 : 0;
    }
    function predKNN(x, y) {
      const k = 5;
      const arr = data.map(p => ({ c: p.c, d: (x - p.x) ** 2 + (y - p.y) ** 2 }));
      arr.sort((a, b) => a.d - b.d);
      let votesA = 0, votesB = 0;
      for (let i = 0; i < k; i++) (arr[i].c === 1 ? votesB++ : votesA++);
      return votesB > votesA ? 1 : 0;
    }

    function render(modelFn, name) {
      // 背景網格
      let html = `<rect width="${W}" height="${H}" fill="#fafbff"/>`;
      for (let i = 0; i < GRID; i++) {
        for (let j = 0; j < GRID; j++) {
          const cx = (i + 0.5) * CELL_W;
          const cy = (j + 0.5) * CELL_H;
          const lab = modelFn(cx, cy);
          const fill = lab === 1 ? "#dbeafe" : "#fee2e2";
          html += `<rect x="${(i * CELL_W).toFixed(1)}" y="${(j * CELL_H).toFixed(1)}" width="${(CELL_W + 0.5).toFixed(1)}" height="${(CELL_H + 0.5).toFixed(1)}" fill="${fill}"/>`;
        }
      }
      // 資料點
      for (const p of data) {
        const col = p.c === 1 ? "#1d4ed8" : "#b91c1c";
        html += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4" fill="${col}" stroke="white" stroke-width="1"/>`;
      }
      html += `<text x="10" y="20" font-size="13" font-weight="700" fill="#1e3a8a">${name}</text>`;
      svg.innerHTML = html;
    }

    function setCaption(t) { if (caption) caption.textContent = t; }

    document.getElementById("dec-lda").addEventListener("click", () => {
      render(predLDA, "LDA — 線性決策邊界");
      setCaption("LDA：兩類分佈為高斯時最佳，邊界為直線。對重疊區域沒辦法做出彎曲邊界，但訓練快、樣本需求低。");
    });
    document.getElementById("dec-svm").addEventListener("click", () => {
      render(predSVMRBF, "SVM (RBF) — 非線性決策邊界");
      setCaption("SVM 以 RBF kernel 把資料映射到高維，邊界可彎曲、自動聚焦在 support vectors 附近，是 EEG 分類最常用工具之一。");
    });
    document.getElementById("dec-knn").addEventListener("click", () => {
      render(predKNN, "KNN (k = 5) — 局部投票");
      setCaption("KNN 由 5 個最近樣本投票決定。邊界呈現 jagged 鋸齒狀，雜訊敏感、但實作簡單且不需訓練。");
    });

    // 預設顯示 LDA
    render(predLDA, "LDA — 線性決策邊界");
  }

  // ===== 2. CNN 架構互動圖 =====
  function initCNNDiagram() {
    const svg = document.getElementById("cnn-plot");
    const info = document.getElementById("cnn-info");
    if (!svg || !info) return;

    const W = 760, H = 220;
    // 各層定義 [x, y, w, h, fill, stroke, label, sublabel, key]
    const layers = [
      { x: 20,  y: 60,  w: 70, h: 90,  fill: "#fde68a", stroke: "#b45309", label: "Input",        sub: "28×28×1",    key: "input"  },
      { x: 110, y: 50,  w: 80, h: 110, fill: "#bfdbfe", stroke: "#1d4ed8", label: "Conv 3×3",     sub: "32 filters", key: "conv1"  },
      { x: 210, y: 60,  w: 70, h: 90,  fill: "#bbf7d0", stroke: "#047857", label: "ReLU",         sub: "max(0,z)",   key: "relu1"  },
      { x: 300, y: 65,  w: 70, h: 80,  fill: "#c7d2fe", stroke: "#4338ca", label: "MaxPool 2×2",  sub: "stride 2",   key: "pool1"  },
      { x: 390, y: 50,  w: 80, h: 110, fill: "#bfdbfe", stroke: "#1d4ed8", label: "Conv 3×3",     sub: "64 filters", key: "conv2"  },
      { x: 490, y: 60,  w: 70, h: 90,  fill: "#bbf7d0", stroke: "#047857", label: "ReLU",         sub: "",           key: "relu2"  },
      { x: 580, y: 70,  w: 60, h: 70,  fill: "#c7d2fe", stroke: "#4338ca", label: "MaxPool",      sub: "2×2",        key: "pool2"  },
      { x: 660, y: 75,  w: 50, h: 60,  fill: "#fbcfe8", stroke: "#9d174d", label: "Flatten",      sub: "",           key: "flat"   },
      { x: 730, y: 85,  w: 26, h: 40,  fill: "#fcd34d", stroke: "#92400e", label: "FC",           sub: "Softmax",    key: "fc"     },
    ];

    const desc = {
      input: { title: "Input 影像 / EEG segment",   text: "原始輸入。對影像通常是 28×28 灰階；對 EEG 是『時間 × 通道』或『時間 × 頻率 × 通道』張量。資料越大，後面的網路越深。" },
      conv1: { title: "Convolution 卷積層",         text: "用一組 3×3 filter 在輸入上滑動做局部點積。每個 filter 學一種『局部 motif』：對影像是邊緣／紋理，對 EEG 是特定波形（如 spike、紡錘波）。" },
      relu1: { title: "ReLU 非線性",                text: "f(z) = max(0, z)。把負數歸零，引入非線性。優點：計算便宜、不飽和、緩解梯度消失，因此成為現代 DNN 的標配。" },
      pool1: { title: "Max-Pooling 池化",           text: "每 2×2 patch 取最大值，使表示更精簡、增加對小幅位移的不變性。也減少參數量、降低 overfit。" },
      conv2: { title: "更深的 Conv 層",             text: "對前一層 feature map 再做卷積，學『更高階特徵』：邊緣組合成紋理、紋理組合成形狀。對 EEG 則由短期 patterns 組成段落級特徵。" },
      relu2: { title: "第二個 ReLU",                text: "同樣對特徵圖做非線性激活。深層 CNN 每經一次 conv 都會接 ReLU。" },
      pool2: { title: "再次池化",                   text: "進一步縮小空間維度，把 14×14 變 7×7。" },
      flat:  { title: "Flatten 攤平",               text: "把 (通道 × 高 × 寬) 的特徵圖攤成一維向量，準備餵給全連結層。" },
      fc:    { title: "Fully Connected + Softmax",  text: "最後用全連結層做分類；softmax 輸出每個類別的機率。對 EEG 例如分『左 / 右手』或『正/中/負 情緒』。" },
    };

    let activeKey = "conv1";

    function setActive(key) {
      activeKey = key;
      render();
      const d = desc[key];
      info.innerHTML = `<strong>${d.title}</strong><br><span>${d.text}</span>`;
    }

    function render() {
      let html = `<rect width="${W}" height="${H}" fill="#fafbff"/>`;
      // 連接箭頭
      html += `<defs><marker id="cnn-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 Z" fill="#94a3b8"/></marker></defs>`;
      for (let i = 0; i < layers.length - 1; i++) {
        const a = layers[i], b = layers[i + 1];
        const ax = a.x + a.w, ay = a.y + a.h / 2;
        const bx = b.x, by = b.y + b.h / 2;
        html += `<line x1="${ax + 2}" y1="${ay}" x2="${bx - 4}" y2="${by}" stroke="#94a3b8" stroke-width="1.6" marker-end="url(#cnn-arrow)"/>`;
      }
      // 各層方塊
      for (const lay of layers) {
        const sw = (lay.key === activeKey) ? 3.5 : 2;
        const sCol = (lay.key === activeKey) ? "#dc2626" : lay.stroke;
        html += `<g data-key="${lay.key}" style="cursor:pointer;">`;
        html += `<rect x="${lay.x}" y="${lay.y}" width="${lay.w}" height="${lay.h}" rx="8" fill="${lay.fill}" stroke="${sCol}" stroke-width="${sw}"/>`;
        html += `<text x="${lay.x + lay.w / 2}" y="${lay.y + lay.h / 2 - 2}" text-anchor="middle" font-size="12" font-weight="700" fill="#1e293b">${lay.label}</text>`;
        if (lay.sub) html += `<text x="${lay.x + lay.w / 2}" y="${lay.y + lay.h / 2 + 14}" text-anchor="middle" font-size="10" fill="#475569">${lay.sub}</text>`;
        html += `</g>`;
      }
      // 標題
      html += `<text x="20" y="22" font-size="13" font-weight="700" fill="#1e3a8a">CNN 架構：點任一層查看用途</text>`;
      svg.innerHTML = html;

      // 重新綁定點擊
      svg.querySelectorAll("g[data-key]").forEach(g => {
        g.addEventListener("click", () => setActive(g.getAttribute("data-key")));
        g.addEventListener("mouseenter", () => setActive(g.getAttribute("data-key")));
      });
    }

    setActive("conv1");
  }
})();
