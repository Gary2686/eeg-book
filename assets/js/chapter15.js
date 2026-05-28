/* ============================================================
   Chapter 15 — 互動模組
   作者：葉欲禾 (Gary Yu-Ho YEH)
   涵蓋：
     1. 健康 vs AD 三種特徵（頻譜 / 複雜度 / 連結度）切換
   ============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    initADModeSwitch();

    if (window.EEG_API) window.EEG_API.logEvent("chapter_open", { chapterId: "ch15" });

    if (window.EEGQuiz && window.QUESTIONS_CH15) {
      window.EEGQuiz.init({
        mount: "#quiz-host",
        chapterId: "ch15",
        bank: window.QUESTIONS_CH15,
        count: 10,
        title: "第 15 章 隨機 10 題測驗",
      });
    }
  });

  // ===== 健康 vs AD 三種特徵切換 =====
  function initADModeSwitch() {
    const svg = document.getElementById("ad-spectrum");
    const desc = document.getElementById("ad-desc");
    const btns = document.querySelectorAll("[data-ad-mode]");
    if (!svg || !desc) return;

    function render(mode) {
      // 切按鈕樣式
      btns.forEach(b => {
        const sel = b.getAttribute("data-ad-mode") === mode;
        b.classList.toggle("secondary", !sel);
      });

      const W = 640, H = 280, PAD_L = 60, PAD_R = 20, PAD_T = 30, PAD_B = 46;
      const innerW = W - PAD_L - PAD_R;
      const innerH = H - PAD_T - PAD_B;
      let html = `<rect width="${W}" height="${H}" fill="#fafbff"/>`;
      html += `<line x1="${PAD_L}" y1="${PAD_T}" x2="${PAD_L}" y2="${H - PAD_B}" stroke="#94a3b8"/>`;
      html += `<line x1="${PAD_L}" y1="${H - PAD_B}" x2="${W - PAD_R}" y2="${H - PAD_B}" stroke="#94a3b8"/>`;

      if (mode === "spectrum") {
        // 五個頻段 (δ θ α β γ) 的能量條
        const bands = ["δ\n(<4Hz)", "θ\n(4-8)", "α\n(8-13)", "β\n(13-30)", "γ\n(30-45)"];
        const healthy = [0.20, 0.18, 0.55, 0.40, 0.25];
        const ad      = [0.32, 0.30, 0.30, 0.22, 0.18];
        const barW = innerW / bands.length / 2.8;
        const groupW = innerW / bands.length;
        bands.forEach((b, i) => {
          const cx = PAD_L + i * groupW + groupW / 2;
          const hh1 = healthy[i] * innerH;
          const hh2 = ad[i] * innerH;
          html += `<rect x="${cx - barW - 4}" y="${H - PAD_B - hh1}" width="${barW}" height="${hh1}" fill="#2563eb"/>`;
          html += `<rect x="${cx + 4}" y="${H - PAD_B - hh2}" width="${barW}" height="${hh2}" fill="#dc2626"/>`;
          const lines = b.split("\n");
          html += `<text x="${cx}" y="${H - PAD_B + 16}" text-anchor="middle" font-size="12" fill="#475569" font-weight="600">${lines[0]}</text>`;
          html += `<text x="${cx}" y="${H - PAD_B + 30}" text-anchor="middle" font-size="10" fill="#64748b">${lines[1] || ""}</text>`;
        });
        html += `<text x="${W/2}" y="20" text-anchor="middle" font-size="14" font-weight="700" fill="#1e3a8a">EEG 頻段相對能量 — 健康 vs AD</text>`;
        // 圖例
        html += `<rect x="${W - 180}" y="${PAD_T + 4}" width="14" height="10" fill="#2563eb"/><text x="${W - 162}" y="${PAD_T + 13}" font-size="12" fill="#1e3a8a">健康</text>`;
        html += `<rect x="${W - 110}" y="${PAD_T + 4}" width="14" height="10" fill="#dc2626"/><text x="${W - 92}" y="${PAD_T + 13}" font-size="12" fill="#7f1d1d">AD</text>`;

        desc.innerHTML = `<strong>AD 的 EEG 頻譜：『慢化 (slowing)』</strong><br>
          AD 患者的能量從 <u>高頻 (α、β)</u> 轉移到 <u>低頻 (δ、θ)</u>，整體節律變慢。
          這跟皮質神經元的同步性下降、突觸功能退化有關。`;
      } else if (mode === "complexity") {
        // 訊號複雜度示意：健康 EEG 與 AD EEG 兩條波形
        const N = 240;
        const ptsH = [], ptsA = [];
        for (let i = 0; i < N; i++) {
          const t = i / N;
          // 健康：多頻成分疊加
          const yh = 0.6 * Math.sin(2 * Math.PI * 10 * t)
                    + 0.4 * Math.sin(2 * Math.PI * 17 * t + 0.5)
                    + 0.3 * Math.sin(2 * Math.PI * 30 * t)
                    + 0.2 * Math.sin(2 * Math.PI * 6.3 * t + 1.2);
          // AD：較規律、低頻為主
          const ya = 1.0 * Math.sin(2 * Math.PI * 6 * t)
                    + 0.25 * Math.sin(2 * Math.PI * 11 * t + 0.3);
          const x = PAD_L + t * innerW;
          ptsH.push(`${x.toFixed(1)},${(PAD_T + 60 - yh * 24).toFixed(1)}`);
          ptsA.push(`${x.toFixed(1)},${(PAD_T + 180 - ya * 24).toFixed(1)}`);
        }
        html += `<polyline points="${ptsH.join(' ')}" stroke="#2563eb" stroke-width="1.6" fill="none"/>`;
        html += `<polyline points="${ptsA.join(' ')}" stroke="#dc2626" stroke-width="1.6" fill="none"/>`;
        html += `<text x="${PAD_L + 6}" y="${PAD_T + 14}" font-size="12" fill="#1e3a8a" font-weight="700">健康：多頻成分、複雜度高</text>`;
        html += `<text x="${PAD_L + 6}" y="${PAD_T + 134}" font-size="12" fill="#7f1d1d" font-weight="700">AD：頻率單純、複雜度低</text>`;
        html += `<text x="${W/2}" y="20" text-anchor="middle" font-size="14" font-weight="700" fill="#1e3a8a">訊號複雜度（Sample Entropy / 排列熵）</text>`;

        desc.innerHTML = `<strong>AD 的 EEG 複雜度：『變簡單 (complexity ↓)』</strong><br>
          健康腦電在多種頻率上有豐富的互動，AD 患者的訊號變得『可預測』，
          這可用 sample entropy、Lempel-Ziv complexity 等指標量化。
          訊號變簡單 = 腦在做的計算變少。`;
      } else {
        // connectivity 圖：兩個小腦網
        // 健康
        const drawNet = (cx, cy, color, lines, dashed) => {
          const pos = [
            [cx - 60, cy - 50], [cx + 60, cy - 50],
            [cx - 80, cy + 10], [cx + 80, cy + 10],
            [cx - 30, cy + 60], [cx + 30, cy + 60],
          ];
          let s = "";
          lines.forEach(([a, b]) => {
            s += `<line x1="${pos[a][0]}" y1="${pos[a][1]}" x2="${pos[b][0]}" y2="${pos[b][1]}" stroke="${color}" stroke-width="2" opacity="0.7" ${dashed ? 'stroke-dasharray="4 3"' : ''}/>`;
          });
          pos.forEach(p => {
            s += `<circle cx="${p[0]}" cy="${p[1]}" r="8" fill="${color}"/>`;
          });
          return s;
        };
        const healthyLinks = [[0,1],[0,2],[0,4],[1,3],[1,5],[2,3],[2,4],[3,5],[4,5],[0,3],[1,2]];
        const adLinks = [[0,1],[2,5],[3,4]];
        html += `<text x="${W*0.27}" y="20" text-anchor="middle" font-size="14" font-weight="700" fill="#1e3a8a">健康腦網絡（連結密集）</text>`;
        html += `<text x="${W*0.73}" y="20" text-anchor="middle" font-size="14" font-weight="700" fill="#7f1d1d">AD 腦網絡（連結稀疏 / 更隨機）</text>`;
        html += drawNet(W*0.27, H/2 + 10, "#2563eb", healthyLinks, false);
        html += drawNet(W*0.73, H/2 + 10, "#dc2626", adLinks, true);
        html += `<text x="${W/2}" y="${H - 14}" text-anchor="middle" font-size="12" fill="#475569">節點 = 腦區/電極，邊 = 同步度（PLI / wPLI）</text>`;

        desc.innerHTML = `<strong>AD 的 EEG 連結度：『變稀疏 (connectivity ↓)』</strong><br>
          AD 患者的 α、β 頻段 PLI 顯著下降，圖論顯示<u>群聚係數下降</u>，
          網路變得更隨機。這符合『定點攻擊 (Targeted Attack)』模型 —
          某些關鍵的<strong>樞紐 (hub)</strong> 先被破壞。`;
      }

      svg.innerHTML = html;
    }

    btns.forEach(b => b.addEventListener("click", () => render(b.getAttribute("data-ad-mode"))));
    render("spectrum");
  }
})();
