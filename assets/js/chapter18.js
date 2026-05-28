/* ============================================================
   Chapter 18 — 互動模組
   作者：葉欲禾 (Gary Yu-Ho YEH)
   涵蓋：
     1. EEG / MEG / fMRI / fNIRS 解析度比較互動圖
   ============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    initModalCompare();

    if (window.EEG_API) window.EEG_API.logEvent("chapter_open", { chapterId: "ch18" });

    if (window.EEGQuiz && window.QUESTIONS_CH18) {
      window.EEGQuiz.init({
        mount: "#quiz-host",
        chapterId: "ch18",
        bank: window.QUESTIONS_CH18,
        count: 10,
        title: "第 18 章 隨機 10 題測驗",
      });
    }
  });

  function initModalCompare() {
    const svg = document.getElementById("modal-compare");
    const desc = document.getElementById("modal-desc");
    const btns = document.querySelectorAll("[data-mod]");
    if (!svg || !desc) return;

    // 各模態位置（log scale）
    // X 軸：時間解析度 1ms ~ 10s（log）
    // Y 軸：空間解析度 0.1mm ~ 100mm（log）
    // 也就是越靠左 = 時間越快；越靠下 = 空間越精細
    const modalities = {
      eeg:   { name: "EEG",   color: "#dc2626", t: 0.001, s: 30,   text: "EEG：時間極佳（~1 ms），空間差（~30 mm）。便宜、可攜、無侵入。" },
      meg:   { name: "MEG",   color: "#f59e0b", t: 0.001, s: 5,    text: "MEG：時間與 EEG 同等好，空間優於 EEG（~5 mm）。對顱骨不敏感，但需磁屏蔽、超低溫、極昂貴。" },
      fmri:  { name: "fMRI",  color: "#2563eb", t: 2,     s: 2,    text: "fMRI：空間極佳（~2 mm），但時間慢（1–2 秒/slice）。可看深層腦區，是『畫地圖』的首選。" },
      fnirs: { name: "fNIRS", color: "#16a34a", t: 0.5,   s: 15,   text: "fNIRS：時間中等（~500 ms），空間中等（~10–20 mm）；便宜、可攜、可在自然情境使用，但只能看皮質表層。" },
    };

    function render(focus) {
      btns.forEach(b => b.classList.toggle("secondary", b.getAttribute("data-mod") !== focus));

      const W = 720, H = 380, PAD_L = 70, PAD_R = 30, PAD_T = 30, PAD_B = 60;
      const innerW = W - PAD_L - PAD_R;
      const innerH = H - PAD_T - PAD_B;

      // log10 mapping
      // X: log10(t)  range [-3, 1]  → 1 ms (10^-3 s) 到 10 s
      // Y: log10(s)  range [-1, 2]  → 0.1 mm 到 100 mm（向下越大）
      const xMin = -3, xMax = 1.5;
      const yMin = -1, yMax = 2.5;
      const xScale = lt => PAD_L + (lt - xMin) / (xMax - xMin) * innerW;
      const yScale = ls => PAD_T + (ls - yMin) / (yMax - yMin) * innerH;

      let html = `<rect width="${W}" height="${H}" fill="#fafbff"/>`;
      // 標題
      html += `<text x="${W/2}" y="20" text-anchor="middle" font-size="14" font-weight="700" fill="#1e3a8a">時間 vs 空間解析度（log-log）</text>`;
      // 軸
      html += `<line x1="${PAD_L}" y1="${H - PAD_B}" x2="${W - PAD_R}" y2="${H - PAD_B}" stroke="#94a3b8"/>`;
      html += `<line x1="${PAD_L}" y1="${PAD_T}" x2="${PAD_L}" y2="${H - PAD_B}" stroke="#94a3b8"/>`;
      // X 刻度
      [-3, -2, -1, 0, 1].forEach(p => {
        const x = xScale(p);
        html += `<line x1="${x}" y1="${H - PAD_B}" x2="${x}" y2="${H - PAD_B + 5}" stroke="#94a3b8"/>`;
        const label = p === -3 ? "1 ms" : p === -2 ? "10 ms" : p === -1 ? "100 ms" : p === 0 ? "1 s" : "10 s";
        html += `<text x="${x}" y="${H - PAD_B + 22}" text-anchor="middle" font-size="11" fill="#475569">${label}</text>`;
      });
      // Y 刻度
      [-1, 0, 1, 2].forEach(p => {
        const y = yScale(p);
        html += `<line x1="${PAD_L - 5}" y1="${y}" x2="${PAD_L}" y2="${y}" stroke="#94a3b8"/>`;
        const label = p === -1 ? "0.1 mm" : p === 0 ? "1 mm" : p === 1 ? "10 mm" : "100 mm";
        html += `<text x="${PAD_L - 8}" y="${y + 4}" text-anchor="end" font-size="11" fill="#475569">${label}</text>`;
      });
      html += `<text x="${W/2}" y="${H - 18}" text-anchor="middle" font-size="13" font-weight="600" fill="#1e3a8a">時間解析度（越左越快）</text>`;
      html += `<text x="20" y="${PAD_T + innerH/2}" text-anchor="middle" font-size="13" font-weight="600" fill="#1e3a8a" transform="rotate(-90 20 ${PAD_T + innerH/2})">空間解析度（越下越精細）</text>`;

      // 各模態氣泡
      Object.entries(modalities).forEach(([k, m]) => {
        const lt = Math.log10(m.t);
        const ls = Math.log10(m.s);
        const x = xScale(lt);
        const y = yScale(ls);
        const focused = (focus === "all" || focus === k);
        const r = focused ? 38 : 24;
        const opacity = focused ? 0.85 : 0.25;
        html += `<circle cx="${x}" cy="${y}" r="${r}" fill="${m.color}" opacity="${opacity}"/>`;
        html += `<text x="${x}" y="${y + 5}" text-anchor="middle" font-size="${focused ? 14 : 12}" font-weight="700" fill="white">${m.name}</text>`;
      });

      // 角落註記
      html += `<text x="${PAD_L + 8}" y="${PAD_T + 16}" font-size="11" fill="#475569">↖ 理想：時間快、空間粗</text>`;
      html += `<text x="${W - PAD_R - 8}" y="${H - PAD_B - 8}" text-anchor="end" font-size="11" fill="#475569">↘ 慢、但空間細</text>`;

      svg.innerHTML = html;

      if (focus === "all") {
        desc.innerHTML = `<strong>四大模態地圖</strong><br>
          EEG / MEG 在「時間」最強；fMRI 在「空間」最強；fNIRS 是中庸又便宜。
          多模態整合的目的，就是把<u>左下角</u>（同時又快又細）那塊空白給補起來。`;
      } else {
        desc.innerHTML = modalities[focus].text;
      }
    }

    btns.forEach(b => b.addEventListener("click", () => render(b.getAttribute("data-mod"))));
    render("all");
  }
})();
