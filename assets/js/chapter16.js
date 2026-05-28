/* ============================================================
   Chapter 16 — 互動模組
   作者：葉欲禾 (Gary Yu-Ho YEH)
   涵蓋：
     1. 八種精神/神經發育疾病 EEG 指紋雷達圖切換
   ============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    initDisorderRadar();

    if (window.EEG_API) window.EEG_API.logEvent("chapter_open", { chapterId: "ch16" });

    if (window.EEGQuiz && window.QUESTIONS_CH16) {
      window.EEGQuiz.init({
        mount: "#quiz-host",
        chapterId: "ch16",
        bank: window.QUESTIONS_CH16,
        count: 10,
        title: "第 16 章 隨機 10 題測驗",
      });
    }
  });

  function initDisorderRadar() {
    const svg = document.getElementById("disorder-radar");
    const desc = document.getElementById("disorder-desc");
    const btns = document.querySelectorAll("[data-dis]");
    if (!svg || !desc) return;

    // 每個疾病在 6 個 EEG 向度上的「典型偏離程度」
    // 向度：1)δ↑  2)θ↑  3)α↓  4)β/γ↑  5)複雜度↑/↓ 6)連結度異常
    // 值 0~1，僅作教學示意
    const data = {
      adhd: {
        name: "ADHD（注意力不足）",
        vals: [0.30, 0.85, 0.25, 0.20, 0.40, 0.50],
        text: "<strong>ADHD：</strong>典型是 Cz 的 θ 上升、β 下降（θ/β 比 ↑）。ERN、Pe、P300 下降，γ 在成人 ADHD 下降。多變量分析比單一指標更穩。",
      },
      asd: {
        name: "ASD（自閉症）",
        vals: [0.25, 0.30, 0.40, 0.40, 0.70, 0.85],
        text: "<strong>ASD：</strong>本地連結 ↑、長距連結 ↓；非線性複雜度（sample entropy 等）變化明顯；γ 同步在情緒臉孔任務中異常。",
      },
      depression: {
        name: "憂鬱症",
        vals: [0.25, 0.45, 0.65, 0.20, 0.80, 0.55],
        text: "<strong>憂鬱：</strong>後頂 α 與頂部 μ 下降，HFD、Sample Entropy 上升；ERP 中 P300、N450 下降。左右額葉 α 不對稱是經典指標。",
      },
      bipolar: {
        name: "Bipolar 躁鬱",
        vals: [0.35, 0.40, 0.30, 0.70, 0.45, 0.65],
        text: "<strong>躁鬱：</strong>高頻能量（β、γ）上升，半球內 α coherence 上升。與思覺失調可用 16 Hz SSVEP 配合統計量區分。",
      },
      scz: {
        name: "Schizophrenia 思覺失調",
        vals: [0.85, 0.55, 0.35, 0.75, 0.30, 0.80],
        text: "<strong>思覺失調：</strong>δ 顯著上升、γ 上升、MMN/P3a 下降。LZC 在靜息態反而升高（與健康者相反），跨半球低頻連結上升。",
      },
      anxiety: {
        name: "焦慮（含 GAD / PTSD）",
        vals: [0.20, 0.55, 0.30, 0.85, 0.45, 0.40],
        text: "<strong>焦慮：</strong>γ 顯著上升（worry 時最明顯）；額葉 / 中央 / 枕區 α 不對稱；β-α 差異上升。",
      },
      insomnia: {
        name: "失眠 Insomnia",
        vals: [0.40, 0.35, 0.30, 0.40, 0.50, 0.30],
        text: "<strong>失眠：</strong>依睡眠分期變化，分析常結合 PSG + actigraphy。階段依賴分類 + DNN 是當前主流。",
      },
      scztype: {
        name: "Schizotypal 分裂型",
        vals: [0.45, 0.30, 0.45, 0.30, 0.40, 0.50],
        text: "<strong>分裂型：</strong>研究尚少。LORETA 顯示前扣帶 δ/θ/β 下降，右顳 α1、左顳 α2 下降，呈現頻段相關的空間模式。",
      },
    };

    const dims = [
      "δ ↑\n(慢化)",
      "θ ↑\n(慢化)",
      "α ↓\n(警覺降)",
      "β/γ ↑\n(高頻活躍)",
      "複雜度\n變化",
      "連結度\n異常",
    ];

    function render(key) {
      btns.forEach(b => b.classList.toggle("secondary", b.getAttribute("data-dis") !== key));
      const d = data[key];
      const cx = 220, cy = 165, R = 110;
      const N = dims.length;
      let html = `<rect width="680" height="320" fill="#fafbff"/>`;
      // 標題
      html += `<text x="220" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="#1e3a8a">${d.name} EEG 指紋（六向度雷達）</text>`;
      // 同心圓
      for (let r = 1; r <= 4; r++) {
        html += `<circle cx="${cx}" cy="${cy}" r="${R * r / 4}" fill="none" stroke="#e2e8f0"/>`;
      }
      // 軸與標籤
      const pts = [];
      for (let i = 0; i < N; i++) {
        const ang = -Math.PI / 2 + i * (2 * Math.PI / N);
        const x1 = cx + Math.cos(ang) * R;
        const y1 = cy + Math.sin(ang) * R;
        html += `<line x1="${cx}" y1="${cy}" x2="${x1}" y2="${y1}" stroke="#cbd5e1"/>`;
        const lx = cx + Math.cos(ang) * (R + 30);
        const ly = cy + Math.sin(ang) * (R + 24);
        const lines = dims[i].split("\n");
        html += `<text x="${lx}" y="${ly}" text-anchor="middle" font-size="11" font-weight="600" fill="#475569">${lines[0]}</text>`;
        if (lines[1]) html += `<text x="${lx}" y="${ly + 13}" text-anchor="middle" font-size="10" fill="#64748b">${lines[1]}</text>`;
        // 該疾病的值
        const v = d.vals[i];
        const px = cx + Math.cos(ang) * R * v;
        const py = cy + Math.sin(ang) * R * v;
        pts.push(`${px.toFixed(1)},${py.toFixed(1)}`);
      }
      html += `<polygon points="${pts.join(' ')}" fill="#2563eb" fill-opacity="0.18" stroke="#2563eb" stroke-width="2"/>`;
      pts.forEach(p => {
        const [x, y] = p.split(",");
        html += `<circle cx="${x}" cy="${y}" r="3.5" fill="#1d4ed8"/>`;
      });

      // 右側：八個按鈕的縮圖標籤
      const list = ["adhd","asd","depression","bipolar","scz","anxiety","insomnia","scztype"];
      list.forEach((k, i) => {
        const x = 420, y = 60 + i * 28;
        const isCur = k === key;
        html += `<rect x="${x}" y="${y - 14}" width="220" height="22" rx="6" fill="${isCur ? '#1d4ed8' : '#e2e8f0'}"/>`;
        html += `<text x="${x + 10}" y="${y + 2}" font-size="12" font-weight="600" fill="${isCur ? 'white' : '#475569'}">${data[k].name}</text>`;
      });

      svg.innerHTML = html;
      desc.innerHTML = d.text;
    }

    btns.forEach(b => b.addEventListener("click", () => render(b.getAttribute("data-dis"))));
    render("adhd");
  }
})();
