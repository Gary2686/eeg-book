/* ============================================================
   Chapter 14 — 互動模組
   作者：葉欲禾 (Gary Yu-Ho YEH)
   涵蓋：
     1. Valence-Arousal 二維平面 (情緒點選)
     2. Frontal Alpha Asymmetry (FAA) 互動條形圖
   ============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    initVAPlane();
    initAsymmetry();

    if (window.EEG_API) window.EEG_API.logEvent("chapter_open", { chapterId: "ch14" });

    if (window.EEGQuiz && window.QUESTIONS_CH14) {
      window.EEGQuiz.init({
        mount: "#quiz-host",
        chapterId: "ch14",
        bank: window.QUESTIONS_CH14,
        count: 10,
        title: "第 14 章 隨機 10 題測驗",
      });
    }
  });

  // ===== 1. Valence-Arousal 平面 =====
  function initVAPlane() {
    const svg = document.getElementById("va-plane");
    const desc = document.getElementById("va-desc");
    if (!svg) return;

    const W = 540, H = 420, cx = W / 2, cy = H / 2, R = 170;
    // 情緒點 (valence -1..+1, arousal -1..+1)
    const emotions = [
      { id: "excited",  name: "Excited 興奮",   v:  0.7, a:  0.7, color: "#dc2626",
        text: "高 arousal + 正 valence。EEG：左 PFC 活躍（α 減小）、β/γ 上升；FAA 偏正。常以快節奏音樂、刺激畫面誘發。" },
      { id: "happy",    name: "Happy 開心",     v:  0.9, a:  0.2, color: "#f59e0b",
        text: "正 valence、中低 arousal。EEG：左前額活化、側顳葉 β γ 上升。最常被用於『正情緒』分類任務。" },
      { id: "calm",     name: "Calm 平靜",      v:  0.7, a: -0.7, color: "#22c55e",
        text: "正 valence、低 arousal。EEG：α 上升（特別在頂枕區）、呼吸與心率變慢。常用於放鬆引導與 mindfulness 研究。" },
      { id: "sleepy",   name: "Sleepy 想睡",    v:  0.0, a: -0.9, color: "#0891b2",
        text: "中性 valence、極低 arousal。EEG 漸入 N1：α 減弱、θ 上升、可能出現 vertex wave。" },
      { id: "sad",      name: "Sad 悲傷",       v: -0.7, a: -0.4, color: "#1d4ed8",
        text: "負 valence、中低 arousal。EEG：右前額活化、頂枕 δ 升高（Zheng 等的觀察）。FAA 偏負。" },
      { id: "angry",    name: "Angry 憤怒",     v: -0.7, a:  0.7, color: "#b91c1c",
        text: "負 valence、高 arousal。但屬『接近型情緒』，依 Direction Model 反而活化『左』PFC；P3a 較小、P3b 較大。" },
      { id: "fear",     name: "Fear 恐懼",      v: -0.85, a:  0.5, color: "#7c3aed",
        text: "負 valence、高 arousal。P100、N170、VPP 振幅顯著高於 happy/neutral 臉；杏仁體強烈活化。" },
      { id: "neutral",  name: "Neutral 中性", v:  0.0, a:  0.0, color: "#64748b",
        text: "Reference 狀態：頂枕 α 穩定、ERP 振幅較低。常作為其他情緒的對照。" },
    ];

    function vx(v) { return cx + v * R; }
    function ay(a) { return cy - a * R; }

    let html = `<rect width="${W}" height="${H}" fill="#fafbff"/>`;
    // 圓形背景
    html += `<circle cx="${cx}" cy="${cy}" r="${R + 6}" fill="#e0f2fe" stroke="#0284c7" stroke-width="1"/>`;
    // 軸
    html += `<line x1="${cx - R}" y1="${cy}" x2="${cx + R}" y2="${cy}" stroke="#475569" stroke-width="1.5"/>
             <line x1="${cx}" y1="${cy - R}" x2="${cx}" y2="${cy + R}" stroke="#475569" stroke-width="1.5"/>`;
    // 軸標籤
    html += `<text x="${cx + R + 12}" y="${cy + 4}" font-size="13" font-weight="700" fill="#1e3a8a">Valence +</text>`;
    html += `<text x="${cx - R - 12}" y="${cy + 4}" text-anchor="end" font-size="13" font-weight="700" fill="#1e3a8a">− Valence</text>`;
    html += `<text x="${cx}" y="${cy - R - 12}" text-anchor="middle" font-size="13" font-weight="700" fill="#1e3a8a">Arousal +</text>`;
    html += `<text x="${cx}" y="${cy + R + 24}" text-anchor="middle" font-size="13" font-weight="700" fill="#1e3a8a">− Arousal</text>`;
    // 象限說明
    html += `<text x="${cx + R/2}" y="${cy - R/2 + 4}" text-anchor="middle" font-size="11" fill="#475569">高激動 + 正向</text>`;
    html += `<text x="${cx - R/2}" y="${cy - R/2 + 4}" text-anchor="middle" font-size="11" fill="#475569">高激動 + 負向</text>`;
    html += `<text x="${cx - R/2}" y="${cy + R/2 + 4}" text-anchor="middle" font-size="11" fill="#475569">低激動 + 負向</text>`;
    html += `<text x="${cx + R/2}" y="${cy + R/2 + 4}" text-anchor="middle" font-size="11" fill="#475569">低激動 + 正向</text>`;

    // 情緒點
    emotions.forEach(e => {
      const x = vx(e.v), y = ay(e.a);
      html += `<g class="emo" data-id="${e.id}" style="cursor:pointer">
                 <circle cx="${x}" cy="${y}" r="11" fill="${e.color}" stroke="white" stroke-width="2"/>
                 <text x="${x}" y="${y + 28}" text-anchor="middle" font-size="11" font-weight="600" fill="#0f172a">${e.name}</text>
               </g>`;
    });

    svg.innerHTML = html;

    function showEmo(id) {
      const e = emotions.find(x => x.id === id);
      if (!e || !desc) return;
      desc.innerHTML = `<strong style="color:${e.color}">${e.name}</strong> (V=${e.v.toFixed(1)}, A=${e.a.toFixed(1)})<br>${e.text}`;
      svg.querySelectorAll(".emo circle").forEach(c => c.setAttribute("r", "11"));
      const sel = svg.querySelector(`[data-id="${id}"] circle`);
      if (sel) sel.setAttribute("r", "16");
    }
    svg.querySelectorAll(".emo").forEach(g => {
      g.addEventListener("click", () => showEmo(g.dataset.id));
      g.addEventListener("mouseenter", () => showEmo(g.dataset.id));
    });
    showEmo("neutral");
  }

  // ===== 2. Frontal Alpha Asymmetry =====
  function initAsymmetry() {
    const svg = document.getElementById("asym-bar");
    const lInp = document.getElementById("asym-l");
    const rInp = document.getElementById("asym-r");
    const lVal = document.getElementById("asym-l-val");
    const rVal = document.getElementById("asym-r-val");
    const desc = document.getElementById("asym-desc");
    if (!svg) return;

    function update() {
      const al = +lInp.value, ar = +rInp.value;
      lVal.textContent = al.toFixed(1);
      rVal.textContent = ar.toFixed(1);
      const faa = Math.log(ar) - Math.log(al);
      const maxBar = 50;
      const W = 540, H = 200, midX = W / 2;
      // 兩個 bar
      const lH = (al / maxBar) * 140;
      const rH = (ar / maxBar) * 140;
      let html = `<rect width="${W}" height="${H}" fill="#fafbff"/>`;
      html += `<line x1="20" y1="180" x2="${W - 20}" y2="180" stroke="#475569" stroke-width="1.5"/>`;
      // bar 左
      html += `<rect x="120" y="${180 - lH}" width="60" height="${lH}" fill="#2563eb"/>
               <text x="150" y="195" text-anchor="middle" font-size="12" fill="#1e3a8a">F3 (左) α = ${al.toFixed(1)}</text>`;
      // bar 右
      html += `<rect x="360" y="${180 - rH}" width="60" height="${rH}" fill="#dc2626"/>
               <text x="390" y="195" text-anchor="middle" font-size="12" fill="#7f1d1d">F4 (右) α = ${ar.toFixed(1)}</text>`;

      // FAA 文字
      let interp, color;
      if (faa > 0.15)      { interp = "FAA > 0：左 PFC 較活躍 → 偏『正向 / 接近型情緒』"; color = "#15803d"; }
      else if (faa < -0.15){ interp = "FAA < 0：右 PFC 較活躍 → 偏『負向 / 迴避型情緒』"; color = "#b91c1c"; }
      else                 { interp = "FAA ≈ 0：兩半球對稱，情緒中性或不確定"; color = "#475569"; }

      html += `<text x="${midX}" y="30" text-anchor="middle" font-size="14" font-weight="700" fill="${color}">FAA = ln(F4) − ln(F3) = ${faa.toFixed(2)}</text>`;
      html += `<text x="${midX}" y="52" text-anchor="middle" font-size="12" fill="#475569">α 越大代表該半球越「不活躍」（α 阻斷反向解讀）</text>`;

      svg.innerHTML = html;
      if (desc) desc.innerHTML = `<strong style="color:${color}">${interp}</strong><br><small>注意：FAA 是統計趨勢，不是 100% 的情緒指標；個體差異大、需與其他特徵合用。</small>`;
    }
    lInp.addEventListener("input", update);
    rInp.addEventListener("input", update);
    update();
  }
})();
