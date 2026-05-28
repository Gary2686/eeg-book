/* ============================================================
   Chapter 2 — 互動模組
   作者：葉欲禾 (Gary Yu-Ho YEH)
   涵蓋：
     1. 五大腦節律 (δ/θ/α/β/γ) 互動波形切換
     2. 10-20 電極系統互動地圖
   ============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    initRhythms();
    initElectrodeMap();

    if (window.EEG_API) window.EEG_API.logEvent("chapter_open", { chapterId: "ch02" });

    if (window.EEGQuiz && window.QUESTIONS_CH02) {
      window.EEGQuiz.init({
        mount: "#quiz-host",
        chapterId: "ch02",
        bank: window.QUESTIONS_CH02,
        count: 10,
        title: "第二章 隨機 10 題測驗",
      });
    }
  });

  // ===== 1. 五大腦節律切換 =====
  function initRhythms() {
    const svg = document.getElementById("rhythm-wave");
    const info = document.getElementById("rhythm-info");
    const caption = document.getElementById("rhythm-caption");
    if (!svg) return;

    const RHYTHMS = {
      delta: { freq: 2,  amp: 70, color: "#7c3aed", label: "δ Delta",
               range: "0.5 – 4 Hz", site: "全頭、深層",
               desc: "深睡與嬰兒最常見的慢波。清醒成人若出現大量 δ 波，多與病理（腫瘤、腦水腫、灰質疾病）有關。容易被頸/下顎肌肉電位混淆。" },
      theta: { freq: 6,  amp: 45, color: "#0891b2", label: "θ Theta",
               range: "4 – 7.5 Hz", site: "顳葉、丘腦來源",
               desc: "意識開始朦朧（drowsiness）、創意冥想、潛意識探索時的代表波。兒童正常，但成人清醒時大量出現屬異常，需查病因。" },
      alpha: { freq:10,  amp: 40, color: "#16a34a", label: "α Alpha",
               range: "8 – 13 Hz", site: "枕葉（後腦勺）",
               desc: "閉眼放鬆時最明顯。睜眼、焦慮、心算會立即「α 阻斷」。Berger 1929 年首度描述。振幅通常 < 50 μV。" },
      beta:  { freq:20,  amp: 22, color: "#dc2626", label: "β Beta",
               range: "14 – 26 Hz", site: "額葉、中央區",
               desc: "清醒思考、專注、解決問題的代表頻段。恐慌狀態會出現高強度 β。振幅通常 < 30 μV。中央 β 與 Rolandic μ 節律相關，可被動作或觸覺刺激壓掉。" },
      gamma: { freq:38,  amp: 14, color: "#b45309", label: "γ Gamma",
               range: "> 30 Hz（多達 45 Hz）", site: "額中央區",
               desc: "振幅小且罕見。是事件相關同步 (ERS) 的指標，可用於確認手指、舌頭等運動相關活動，亦與某些腦疾病的辨識有關。" },
    };

    function drawWave(key) {
      const r = RHYTHMS[key];
      const W = 720, H = 200, mid = H / 2;
      // 取樣 sin wave，加一點隨機讓它看起來像 EEG
      const points = [];
      const cycles = r.freq * 2; // 視覺上 2 秒
      for (let i = 0; i <= 720; i++) {
        const t = i / 720;
        // 基底 sin + 微擾
        const phase = 2 * Math.PI * cycles * t;
        const noise = (key === "gamma" ? 0.25 : 0.1) * Math.sin(phase * 3.7 + 1.2);
        const y = mid - r.amp * (Math.sin(phase) + noise);
        points.push(i.toFixed(1) + "," + y.toFixed(1));
      }

      let html = `
        <rect x="0" y="0" width="${W}" height="${H}" fill="#fafbff"/>
        <line x1="0" y1="${mid}" x2="${W}" y2="${mid}" stroke="#cbd5e1" stroke-dasharray="4 4"/>
        <text x="12" y="22" font-size="14" font-weight="700" fill="${r.color}">${r.label}</text>
        <text x="12" y="40" font-size="12" fill="#475569">${r.range}　典型位置：${r.site}</text>
        <polyline points="${points.join(' ')}" fill="none" stroke="${r.color}" stroke-width="2"/>
        <text x="${W - 10}" y="${H - 8}" text-anchor="end" font-size="11" fill="#64748b">2 秒模擬波形</text>
      `;
      svg.innerHTML = html;

      if (caption) caption.textContent = `${r.label}：${r.range}`;
      if (info) info.innerHTML = `<strong>${r.label}（${r.range}）</strong><br>${r.desc}`;

      // 更新按鈕樣式
      document.querySelectorAll(".rhythm-tab").forEach(btn => {
        const active = btn.dataset.rhythm === key;
        btn.className = "btn rhythm-tab" + (active ? "" : " secondary");
      });
    }

    document.querySelectorAll(".rhythm-tab").forEach(btn => {
      btn.addEventListener("click", () => drawWave(btn.dataset.rhythm));
    });

    drawWave("alpha");
  }

  // ===== 2. 10-20 電極系統互動地圖 =====
  function initElectrodeMap() {
    const svg = document.getElementById("electrode-map");
    const info = document.getElementById("electrode-info");
    if (!svg) return;

    // 中心 (230,230)，圓半徑 200
    // 電極座標（依國際 10-20 標準近似投影，俯視，上=Nasion）
    const ELECTRODES = [
      // Frontal Pole
      { id: "Fp1", x: 200, y: 80,  desc: "左額前 (Frontal Pole)：眨眼、眼動偽訊主要來源；P300 ERP 採集區。" },
      { id: "Fp2", x: 260, y: 80,  desc: "右額前 (Frontal Pole)：與 Fp1 對稱。常用於記錄 EOG 與 P300。" },
      // Frontal
      { id: "F7",  x: 110, y: 130, desc: "左前顳前 (Frontal)：語言區附近，偵測左前顳葉異常。" },
      { id: "F3",  x: 180, y: 130, desc: "左額葉 (Frontal)：常用於情緒效價研究（左 vs 右額不對稱）。" },
      { id: "Fz",  x: 230, y: 130, desc: "額中線 (Fz)：P300 與認知 ERP 中央指標。" },
      { id: "F4",  x: 280, y: 130, desc: "右額葉：與 F3 對稱；負向情緒時更活躍。" },
      { id: "F8",  x: 350, y: 130, desc: "右前顳前：與 F7 對稱。" },
      // Temporal
      { id: "T3",  x: 70,  y: 230, desc: "左顳 (Temporal)：T3 對應現代 T7；接近聽覺與語言皮質。" },
      { id: "T4",  x: 390, y: 230, desc: "右顳：T4 對應現代 T8。" },
      { id: "T5",  x: 110, y: 330, desc: "左顳後：T5 對應現代 P7。" },
      { id: "T6",  x: 350, y: 330, desc: "右顳後：T6 對應現代 P8。" },
      // Central
      { id: "C3",  x: 150, y: 230, desc: "左中央 (Central)：左手指運動與 BCI 重點通道（μ 節律會被動作壓掉）。" },
      { id: "Cz",  x: 230, y: 230, desc: "頭頂 (Vertex)：常用作參考點；Vertex sleep waves 由此最明顯。" },
      { id: "C4",  x: 310, y: 230, desc: "右中央：右手指運動相關通道。" },
      // Parietal
      { id: "P3",  x: 180, y: 330, desc: "左頂葉：P300 ERP 常選通道之一。" },
      { id: "Pz",  x: 230, y: 330, desc: "頂中線 (Pz)：P300 振幅最大的位置。" },
      { id: "P4",  x: 280, y: 330, desc: "右頂葉：與 P3 對稱。" },
      // Occipital
      { id: "O1",  x: 200, y: 390, desc: "左枕葉 (Occipital)：α 節律最強的位置；視覺誘發電位 VEP 採集區。" },
      { id: "Oz",  x: 230, y: 395, desc: "枕中線：視覺刺激最直接的反應點。" },
      { id: "O2",  x: 260, y: 390, desc: "右枕葉：與 O1 對稱。" },
      // 耳垂
      { id: "A1",  x: 30,  y: 230, desc: "左耳垂：常用參考電極之一。" },
      { id: "A2",  x: 430, y: 230, desc: "右耳垂：與 A1 一起常用作 linked-ears 參考。" },
    ];

    // 繪製頭部輪廓 + nasion 標示
    let html = `
      <circle cx="230" cy="230" r="200" fill="#fafbff" stroke="#94a3b8" stroke-width="2"/>
      <!-- nasion 三角 -->
      <polygon points="220,30 240,30 230,55" fill="#94a3b8"/>
      <text x="230" y="22" text-anchor="middle" font-size="12" font-weight="600" fill="#475569">Nasion</text>
      <!-- inion -->
      <text x="230" y="445" text-anchor="middle" font-size="12" font-weight="600" fill="#475569">Inion</text>
      <!-- 左右耳記號 -->
      <text x="14" y="234" font-size="11" fill="#64748b">L</text>
      <text x="442" y="234" font-size="11" fill="#64748b">R</text>
      <!-- 同心參考圈 -->
      <circle cx="230" cy="230" r="140" fill="none" stroke="#e2e8f0" stroke-dasharray="3 3"/>
      <circle cx="230" cy="230" r="80"  fill="none" stroke="#e2e8f0" stroke-dasharray="3 3"/>
      <line x1="30" y1="230" x2="430" y2="230" stroke="#e2e8f0" stroke-dasharray="3 3"/>
      <line x1="230" y1="30" x2="230" y2="430" stroke="#e2e8f0" stroke-dasharray="3 3"/>
    `;

    // 繪製電極
    ELECTRODES.forEach(e => {
      const isMid = e.id.endsWith("z");
      const fill = isMid ? "#fbbf24" : (e.id === "A1" || e.id === "A2" ? "#a78bfa" : "#60a5fa");
      html += `
        <g class="electrode" data-id="${e.id}" style="cursor:pointer">
          <circle cx="${e.x}" cy="${e.y}" r="16" fill="${fill}" stroke="#1e3a8a" stroke-width="1.5"/>
          <text x="${e.x}" y="${e.y + 4}" text-anchor="middle" font-size="11" font-weight="700" fill="#0f172a">${e.id}</text>
        </g>
      `;
    });

    svg.innerHTML = html;

    function showElectrode(id) {
      const e = ELECTRODES.find(x => x.id === id);
      if (!e || !info) return;
      info.innerHTML = `<strong>${e.id}</strong>　<small style="color:#64748b;">座標 (${e.x}, ${e.y})</small><br>${e.desc}`;
      // 高亮被點到的電極
      svg.querySelectorAll(".electrode circle").forEach(c => {
        c.setAttribute("stroke-width", "1.5");
        c.setAttribute("stroke", "#1e3a8a");
      });
      const target = svg.querySelector(`.electrode[data-id="${id}"] circle`);
      if (target) {
        target.setAttribute("stroke-width", "3.5");
        target.setAttribute("stroke", "#dc2626");
      }
    }

    svg.querySelectorAll(".electrode").forEach(g => {
      g.addEventListener("mouseenter", () => showElectrode(g.dataset.id));
      g.addEventListener("click",      () => showElectrode(g.dataset.id));
    });
    showElectrode("Cz");
  }
})();
