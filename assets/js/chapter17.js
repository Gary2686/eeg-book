/* ============================================================
   Chapter 17 — 互動模組
   作者：葉欲禾 (Gary Yu-Ho YEH) ・ 鄭鈞 (Jacob Cheng)
   涵蓋：
     1. BCI 系統流程互動圖（5 個方塊）
     2. P300 / SSVEP / MI 三種 paradigm 互動
   ============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    initBciPipeline();
    initBciParadigm();

    if (window.EEG_API) window.EEG_API.logEvent("chapter_open", { chapterId: "ch17" });

    if (window.EEGQuiz && window.QUESTIONS_CH17) {
      window.EEGQuiz.init({
        mount: "#quiz-host",
        chapterId: "ch17",
        bank: window.QUESTIONS_CH17,
        count: 10,
        title: "第 17 章 隨機 10 題測驗",
      });
    }
  });

  // ===== BCI 系統流程互動 =====
  function initBciPipeline() {
    const svg = document.getElementById("bci-pipeline");
    const desc = document.getElementById("bci-stage-desc");
    if (!svg || !desc) return;

    const stages = [
      { id: "acq",   label: "感測 / 放大",    sub: "EEG 電極 + 差動放大",
        text: "把頭皮上 8–128 個電極的微伏訊號放大（增益 ~10000×）並 A/D 數位化。常用取樣率 250–1000 Hz。" },
      { id: "pre",   label: "預處理",        sub: "Bandpass + ICA + Artefact",
        text: "用 bandpass（如 8–30 Hz for MI）去掉 baseline drift 與肌電；ICA 去除眼動、心跳、肌電等偽影；必要時做 referencing。" },
      { id: "feat",  label: "特徵抽取",      sub: "CSP / PSD / Tensor",
        text: "把高維 EEG 投影到低維、能凸顯類別差異的空間。MI 多用 CSP，P300/SSVEP 用時間或頻譜特徵，深度學習可從原始訊號學特徵。" },
      { id: "clf",   label: "分類器",        sub: "LDA / SVM / CNN",
        text: "把特徵向量映射到類別。LDA 簡單、SVM 穩、DNN+transfer learning 是新主流。多類別可用 Riemannian 幾何分類器。" },
      { id: "fb",    label: "輸出 / 反饋",   sub: "螢幕、機械手、輪椅",
        text: "把預測結果轉成裝置動作（光標、字母、輪椅方向），並用視覺 / 觸覺 / 聽覺反饋給使用者，閉迴路改善後續訊號。" },
    ];

    function showStage(id) {
      const s = stages.find(x => x.id === id);
      desc.innerHTML = `<strong>${s.label}：${s.sub}</strong><br>${s.text}`;
      // 高亮
      stages.forEach(x => {
        const r = svg.querySelector(`[data-stage="${x.id}"] rect`);
        if (r) r.setAttribute("fill", x.id === id ? "#2563eb" : "#dbeafe");
        const t = svg.querySelector(`[data-stage="${x.id}"] text.label`);
        if (t) t.setAttribute("fill", x.id === id ? "white" : "#1e3a8a");
        const sb = svg.querySelector(`[data-stage="${x.id}"] text.sub`);
        if (sb) sb.setAttribute("fill", x.id === id ? "#bfdbfe" : "#64748b");
      });
    }

    // 繪製方塊
    const boxW = 130, boxH = 80, gap = 24;
    const startX = 20, y0 = 60;
    let html = `<rect width="760" height="220" fill="#fafbff"/>`;
    html += `<text x="380" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="#1e3a8a">BCI 系統流程</text>`;
    stages.forEach((s, i) => {
      const x = startX + i * (boxW + gap);
      html += `<g data-stage="${s.id}" style="cursor:pointer">
        <rect x="${x}" y="${y0}" width="${boxW}" height="${boxH}" rx="8" fill="#dbeafe" stroke="#1d4ed8" stroke-width="1.5"/>
        <text class="label" x="${x + boxW/2}" y="${y0 + 32}" text-anchor="middle" font-size="14" font-weight="700" fill="#1e3a8a">${s.label}</text>
        <text class="sub" x="${x + boxW/2}" y="${y0 + 56}" text-anchor="middle" font-size="11" fill="#64748b">${s.sub}</text>
      </g>`;
      if (i < stages.length - 1) {
        const ax = x + boxW + 4;
        html += `<path d="M${ax} ${y0 + boxH/2} L${ax + gap - 6} ${y0 + boxH/2}" stroke="#1d4ed8" stroke-width="2" marker-end="url(#arrow)"/>`;
      }
    });
    // 反饋回路
    html += `<path d="M${startX + 4*(boxW+gap) + boxW/2} ${y0+boxH+4} Q ${(startX + 2*(boxW+gap)+boxW/2)} ${y0+boxH+50} ${startX + boxW/2} ${y0+boxH+4}" fill="none" stroke="#fbbf24" stroke-width="2" stroke-dasharray="5 3" marker-end="url(#arrowf)"/>`;
    html += `<text x="380" y="${y0+boxH+44}" text-anchor="middle" font-size="11" fill="#b45309">反饋迴路（使用者依輸出調整意圖）</text>`;

    // markers
    html = `<defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="strokeWidth" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0 0 L10 5 L0 10 Z" fill="#1d4ed8"/>
      </marker>
      <marker id="arrowf" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="strokeWidth" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0 0 L10 5 L0 10 Z" fill="#b45309"/>
      </marker>
    </defs>` + html;
    svg.innerHTML = html;

    // 綁定事件（用 helper function，不要用 g.click()）
    stages.forEach(s => {
      const g = svg.querySelector(`[data-stage="${s.id}"]`);
      if (g) g.addEventListener("click", () => showStage(s.id));
    });
    showStage("acq");
  }

  // ===== 三種 BCI Paradigm 互動 =====
  function initBciParadigm() {
    const svg = document.getElementById("bci-paradigm");
    const desc = document.getElementById("bci-paradigm-desc");
    const btns = document.querySelectorAll("[data-bci]");
    if (!svg || !desc) return;

    function render(kind) {
      btns.forEach(b => b.classList.toggle("secondary", b.getAttribute("data-bci") !== kind));
      let html = `<rect width="720" height="260" fill="#fafbff"/>`;

      if (kind === "p300") {
        // P300 odd-ball：稀有刺激後 ~300 ms 出現正波
        html += `<text x="360" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="#1e3a8a">P300 — 稀有目標刺激後 ~300 ms 出現正波</text>`;
        // 時間軸
        html += `<line x1="80" y1="200" x2="660" y2="200" stroke="#94a3b8"/>`;
        html += `<text x="80" y="220" font-size="11" fill="#475569">0</text>`;
        html += `<text x="270" y="220" font-size="11" fill="#475569">300 ms</text>`;
        html += `<text x="460" y="220" font-size="11" fill="#475569">600 ms</text>`;
        html += `<text x="650" y="220" font-size="11" fill="#475569">ms</text>`;
        // 刺激
        html += `<rect x="80" y="60" width="14" height="80" fill="#dc2626"/>`;
        html += `<text x="87" y="55" text-anchor="middle" font-size="11" fill="#7f1d1d" font-weight="700">稀有刺激</text>`;
        // ERP 波形
        const pts = [];
        for (let t = 0; t <= 600; t += 5) {
          const x = 80 + t / 600 * 580;
          let y;
          if (t < 80)         y = 0;
          else if (t < 150)   y = -8 * Math.sin((t-80)/70 * Math.PI);  // N1
          else if (t < 250)   y = 5 * Math.sin((t-150)/100 * Math.PI); // P2
          else if (t < 450)   y = 22 * Math.exp(-Math.pow((t-330)/60, 2)); // P300
          else                y = 2 * Math.sin((t-450)/80 * Math.PI);
          pts.push(`${x.toFixed(1)},${(140 - y * 2).toFixed(1)}`);
        }
        html += `<polyline points="${pts.join(' ')}" stroke="#2563eb" stroke-width="2.5" fill="none"/>`;
        html += `<text x="270" y="65" font-size="12" fill="#1d4ed8" font-weight="700">P300 ↑</text>`;
        html += `<line x1="270" y1="70" x2="270" y2="92" stroke="#1d4ed8" stroke-width="1.5" stroke-dasharray="3 2"/>`;

        desc.innerHTML = `<strong>P300（odd-ball paradigm）</strong><br>
          當稀有 / 目標刺激出現時，腦會在 ~300 ms 後產生一個正向波 (P300)。speller 利用這個原理：
          字母網格逐列、逐欄高亮，使用者注視目標字母 → 該<strong>列</strong>與<strong>欄</strong>會誘發較大的 P300，交叉處就是目標。
          <strong>優點</strong>：不需訓練；<strong>缺點</strong>：須等刺激出現，速度受限。`;

      } else if (kind === "ssvep") {
        html += `<text x="360" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="#1e3a8a">SSVEP — 注視 N Hz 閃爍 → 枕葉 EEG 出現 N Hz 穩態反應</text>`;
        // 三個閃爍刺激源
        const targets = [
          { x: 130, y: 90, freq: "10 Hz", color: "#dc2626" },
          { x: 360, y: 90, freq: "12 Hz", color: "#2563eb" },
          { x: 590, y: 90, freq: "15 Hz", color: "#16a34a" },
        ];
        targets.forEach((t, i) => {
          html += `<circle cx="${t.x}" cy="${t.y}" r="22" fill="${t.color}" opacity="${0.4 + 0.3 * (i === 1 ? 1 : 0)}"/>`;
          html += `<text x="${t.x}" y="${t.y + 5}" text-anchor="middle" font-size="12" font-weight="700" fill="white">${t.freq}</text>`;
        });
        html += `<text x="360" y="40" text-anchor="middle" font-size="12" fill="#475569">注視 12 Hz 那個</text>`;
        // EEG 穩態反應
        const pts = [];
        for (let t = 0; t < 600; t += 2) {
          const x = 80 + t / 600 * 580;
          const y = 24 * Math.sin(2 * Math.PI * 12 * (t/1000));
          pts.push(`${x.toFixed(1)},${(200 - y).toFixed(1)}`);
        }
        html += `<polyline points="${pts.join(' ')}" stroke="#2563eb" stroke-width="2" fill="none"/>`;
        html += `<text x="100" y="175" font-size="11" fill="#1d4ed8">枕葉 EEG（Oz）→ 12 Hz 穩態反應</text>`;

        desc.innerHTML = `<strong>SSVEP（Steady-State Visual Evoked Potential）</strong><br>
          每個目標以不同頻率閃爍（如 10、12、15 Hz）。使用者注視哪個目標，枕葉 EEG 就會出現對應頻率的穩態反應。
          <strong>優點</strong>：訓練極少、ITR 高（最新可達 267–325 bpm）；<strong>缺點</strong>：對眼睛容易疲勞，需高頻穩定閃爍。`;

      } else {
        html += `<text x="360" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="#1e3a8a">Motor Imagery — 想像左/右手動作 → 對側運動皮質 μ/β ERD</text>`;
        // 大腦草圖
        html += `<ellipse cx="240" cy="120" rx="120" ry="70" fill="#dbeafe" stroke="#1e3a8a" stroke-width="2"/>`;
        html += `<line x1="240" y1="50" x2="240" y2="190" stroke="#1e3a8a" stroke-dasharray="4 3"/>`;
        html += `<text x="170" y="60" font-size="12" fill="#1e3a8a" font-weight="700">左半球</text>`;
        html += `<text x="270" y="60" font-size="12" fill="#1e3a8a" font-weight="700">右半球</text>`;
        // 「想像右手」 → 對側（左）ERD
        html += `<circle cx="190" cy="120" r="22" fill="#dc2626" opacity="0.85"/>`;
        html += `<text x="190" y="125" text-anchor="middle" font-size="11" font-weight="700" fill="white">μ ↓</text>`;
        html += `<text x="190" y="160" text-anchor="middle" font-size="11" fill="#7f1d1d" font-weight="700">C3 ERD</text>`;
        html += `<text x="290" y="125" text-anchor="middle" font-size="11" fill="#475569">休息</text>`;
        html += `<text x="290" y="160" text-anchor="middle" font-size="11" fill="#475569">C4</text>`;
        html += `<text x="240" y="220" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="600">使用者『想像右手動作』</text>`;

        // 右邊：頻譜變化
        html += `<rect x="430" y="60" width="240" height="120" fill="white" stroke="#cbd5e1"/>`;
        html += `<text x="550" y="55" text-anchor="middle" font-size="12" font-weight="700" fill="#1e3a8a">C3 頻譜（休息 → MI）</text>`;
        // 休息頻譜
        const sp1 = [];
        for (let x = 0; x <= 100; x++) {
          const f = x; // 0..100, scale 0..30
          const val = 20 * Math.exp(-Math.pow((f - 30) / 12, 2)) + 16 * Math.exp(-Math.pow((f - 60) / 8, 2));
          sp1.push(`${(430 + x / 100 * 240).toFixed(1)},${(170 - val).toFixed(1)}`);
        }
        html += `<polyline points="${sp1.join(' ')}" stroke="#2563eb" stroke-width="2" fill="none"/>`;
        // MI 頻譜（μ、β 凹陷）
        const sp2 = [];
        for (let x = 0; x <= 100; x++) {
          const f = x;
          const val = 8 * Math.exp(-Math.pow((f - 30) / 12, 2)) + 7 * Math.exp(-Math.pow((f - 60) / 8, 2));
          sp2.push(`${(430 + x / 100 * 240).toFixed(1)},${(170 - val).toFixed(1)}`);
        }
        html += `<polyline points="${sp2.join(' ')}" stroke="#dc2626" stroke-width="2" fill="none" stroke-dasharray="4 3"/>`;
        html += `<text x="450" y="200" font-size="11" fill="#1d4ed8">藍：休息（μ/β 高）</text>`;
        html += `<text x="570" y="200" font-size="11" fill="#7f1d1d">紅：MI（μ/β 下降）</text>`;

        desc.innerHTML = `<strong>Motor Imagery（運動想像）</strong><br>
          使用者想像某側肢體動作，<u>對側</u>運動皮質的 μ (8–13 Hz)、β (14–28 Hz) 節律會出現 ERD（變弱）。
          常用方法：bandpass 8–30 Hz → CSP → LDA / SVM。
          <strong>優點</strong>：可自主啟動（不需外部刺激）；<strong>缺點</strong>：需數天訓練、個人差異大、訊號弱。`;
      }

      svg.innerHTML = html;
    }

    btns.forEach(b => b.addEventListener("click", () => render(b.getAttribute("data-bci"))));
    render("p300");
  }
})();
