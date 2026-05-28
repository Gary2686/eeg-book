/* ============================================================
   Chapter 10 — 互動模組
   作者：葉欲禾 (Gary Yu-Ho YEH)
   涵蓋：
     1. 正向 / 反向問題切換示意
     2. Dipole 位置互動（拖動滑桿改變源位置與方向，看頭皮電位）
   ============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    try { initForwardInverse(); } catch (e) { console.error(e); }
    try { initDipole();         } catch (e) { console.error(e); }

    if (window.EEG_API) window.EEG_API.logEvent("chapter_open", { chapterId: "ch10" });

    if (window.EEGQuiz && window.QUESTIONS_CH10) {
      window.EEGQuiz.init({
        mount: "#quiz-host",
        chapterId: "ch10",
        bank: window.QUESTIONS_CH10,
        count: 10,
        title: "第 10 章 隨機 10 題測驗",
      });
    }
  });

  // ===== 1. 正向 / 反向問題示意 =====
  function initForwardInverse() {
    const svg  = document.getElementById("fi-svg");
    const desc = document.getElementById("fi-desc");
    if (!svg) return;

    function render(mode) {
      const W = 560, H = 320;
      // 頭與腦輪廓
      let html = `<rect width="${W}" height="${H}" fill="#fafbff"/>`;
      // 頭皮
      html += `<ellipse cx="280" cy="170" rx="200" ry="120" fill="none" stroke="#fbbf24" stroke-width="10" opacity="0.7"/>`;
      // 顱骨
      html += `<ellipse cx="280" cy="170" rx="186" ry="108" fill="none" stroke="#a8a29e" stroke-width="10" opacity="0.7"/>`;
      // 腦
      html += `<ellipse cx="280" cy="170" rx="168" ry="90" fill="#fda4af" opacity="0.6" stroke="#be123c" stroke-width="1.5"/>`;

      // 電極（頭皮）
      const electrodes = [
        { x: 280, y: 50  }, { x: 200, y: 65 }, { x: 360, y: 65 },
        { x: 130, y: 110 }, { x: 430, y: 110 },
        { x: 100, y: 170 }, { x: 460, y: 170 },
        { x: 130, y: 230 }, { x: 430, y: 230 },
        { x: 200, y: 275 }, { x: 360, y: 275 }, { x: 280, y: 290 },
      ];
      // 源 (位於腦內)
      const src = { x: 250, y: 180 };

      if (mode === "forward") {
        // 從源放射出傳播線
        electrodes.forEach(e => {
          html += `<line x1="${src.x}" y1="${src.y}" x2="${e.x}" y2="${e.y}" stroke="#0891b2" stroke-width="1.5" opacity="0.5" marker-end="url(#arrowF)"/>`;
        });
        // 源
        html += `<circle cx="${src.x}" cy="${src.y}" r="11" fill="#dc2626" stroke="white" stroke-width="2"/>`;
        html += `<text x="${src.x}" y="${src.y - 16}" text-anchor="middle" font-size="12" font-weight="700" fill="#7f1d1d">已知源</text>`;
        // 電極
        electrodes.forEach(e => {
          html += `<circle cx="${e.x}" cy="${e.y}" r="6" fill="#0891b2" stroke="white" stroke-width="1.5"/>`;
        });
        html += `<text x="${W/2}" y="${H - 14}" text-anchor="middle" font-size="13" font-weight="700" fill="#0891b2">正向：源 (已知) → 計算電極電位</text>`;
        desc.innerHTML = "<strong>正向問題：</strong>給定大腦內源的位置、方向、強度，<u>計算每個電極上會看到多少電位</u>。這是物理上明確、有<u>唯一解</u>的問題，但需要完整的頭模型 (球形 / BEM / FEM) 與導電率。";
      } else {
        // 反向：從電極指向源（顯示多個可能源位置）
        const candidates = [
          { x: 250, y: 180, ok: true  },
          { x: 200, y: 150, ok: false },
          { x: 320, y: 200, ok: false },
          { x: 220, y: 210, ok: false },
        ];
        // 從電極指向真實源
        electrodes.forEach(e => {
          html += `<line x1="${e.x}" y1="${e.y}" x2="${src.x}" y2="${src.y}" stroke="#7c3aed" stroke-width="1.2" opacity="0.45" marker-end="url(#arrowI)"/>`;
        });
        candidates.forEach(c => {
          const col = c.ok ? "#dc2626" : "#a78bfa";
          const r   = c.ok ? 11 : 8;
          html += `<circle cx="${c.x}" cy="${c.y}" r="${r}" fill="${col}" stroke="white" stroke-width="2" opacity="${c.ok ? 1 : 0.55}"/>`;
        });
        html += `<text x="${src.x}" y="${src.y - 16}" text-anchor="middle" font-size="12" font-weight="700" fill="#7f1d1d">真實源（其中之一）</text>`;
        electrodes.forEach(e => {
          html += `<circle cx="${e.x}" cy="${e.y}" r="6" fill="#7c3aed" stroke="white" stroke-width="1.5"/>`;
        });
        html += `<text x="${W/2}" y="${H - 14}" text-anchor="middle" font-size="13" font-weight="700" fill="#7c3aed">反向：電極 (已知) → 推測源（多解）</text>`;
        desc.innerHTML = "<strong>反向問題：</strong>給定頭皮電極電位，<u>反推大腦內部源</u>。因為源數遠多於電極數，多個源組合都能解釋同樣的電位 → <strong>無唯一解（ill-posed）</strong>，需用先驗 (LORETA 平滑、FOCUSS 稀疏、fMRI 約束等) 才能挑出合理解。";
      }
      // arrow markers
      html = `<defs>
        <marker id="arrowF" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="#0891b2"/></marker>
        <marker id="arrowI" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="#7c3aed"/></marker>
      </defs>` + html;
      svg.innerHTML = html;
    }

    document.querySelectorAll('input[name="dir-type"]').forEach(r => {
      r.addEventListener("change", e => render(e.target.value));
    });
    render("forward");
  }

  // ===== 2. Dipole 互動 =====
  function initDipole() {
    const svg  = document.getElementById("dipole-svg");
    const desc = document.getElementById("dipole-desc");
    if (!svg) return;

    // 電極定義（頭皮圓周）
    const cx = 280, cy = 170;
    const Rscalp = 130;
    const electrodes = [];
    for (let i = 0; i < 14; i++) {
      const a = -Math.PI/2 + (i / 14) * 2 * Math.PI;
      electrodes.push({ x: cx + Rscalp * Math.cos(a), y: cy + Rscalp * Math.sin(a), name: "E" + (i + 1) });
    }

    function render() {
      const dx = +document.getElementById("dpx").value;
      const dy = +document.getElementById("dpy").value;
      const da = +document.getElementById("dpa").value;
      const sx = cx + dx, sy = cy + dy;
      const angRad = da * Math.PI / 180;
      const moment = { x: Math.cos(angRad), y: Math.sin(angRad) };

      // 計算每個電極的『電位』(簡化：dot(moment, dir_to_electrode) / |dist|²)
      const vs = electrodes.map(e => {
        const ex = e.x - sx, ey = e.y - sy;
        const d2 = ex * ex + ey * ey;
        const cos = (moment.x * ex + moment.y * ey) / Math.sqrt(d2);
        return cos / d2 * 8000; // 縮放使數字可看
      });
      const vMax = Math.max(...vs.map(Math.abs)) || 1;

      let html = `<rect width="560" height="320" fill="#fafbff"/>`;
      // 三層頭
      html += `<ellipse cx="${cx}" cy="${cy}" rx="${Rscalp + 14}" ry="${Rscalp + 14}" fill="none" stroke="#fbbf24" stroke-width="6" opacity="0.7"/>`;
      html += `<ellipse cx="${cx}" cy="${cy}" rx="${Rscalp + 4}" ry="${Rscalp + 4}" fill="none" stroke="#a8a29e" stroke-width="6" opacity="0.7"/>`;
      html += `<ellipse cx="${cx}" cy="${cy}" rx="${Rscalp - 6}" ry="${Rscalp - 6}" fill="#fda4af" opacity="0.45" stroke="#be123c" stroke-width="1.5"/>`;

      // 電極（顏色由電位決定：紅 = 正、藍 = 負）
      electrodes.forEach((e, i) => {
        const v = vs[i];
        const ratio = v / vMax; // -1 ~ 1
        let r, g, b;
        if (ratio >= 0) { r = 255; g = Math.round(255 - ratio * 220); b = Math.round(255 - ratio * 220); }
        else            { r = Math.round(255 + ratio * 220); g = Math.round(255 + ratio * 220); b = 255; }
        const size = 7 + Math.abs(ratio) * 6;
        html += `<circle cx="${e.x}" cy="${e.y}" r="${size}" fill="rgb(${r},${g},${b})" stroke="#1e3a8a" stroke-width="1.2"/>`;
      });

      // dipole arrow
      const arrowLen = 28;
      const ax = sx + arrowLen * moment.x, ay = sy + arrowLen * moment.y;
      html += `<defs><marker id="arrD" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><polygon points="0 0, 8 4, 0 8" fill="#dc2626"/></marker></defs>`;
      html += `<line x1="${sx}" y1="${sy}" x2="${ax}" y2="${ay}" stroke="#dc2626" stroke-width="3" marker-end="url(#arrD)"/>`;
      html += `<circle cx="${sx}" cy="${sy}" r="6" fill="#dc2626" stroke="white" stroke-width="2"/>`;

      // 圖例
      html += `<text x="20" y="22" font-size="12" font-weight="700" fill="#1e3a8a">頭皮電位</text>`;
      html += `<rect x="20" y="30" width="14" height="14" fill="rgb(255,40,40)"/><text x="40" y="42" font-size="11" fill="#475569">正（高）</text>`;
      html += `<rect x="20" y="50" width="14" height="14" fill="rgb(255,255,255)" stroke="#94a3b8"/><text x="40" y="62" font-size="11" fill="#475569">≈ 0</text>`;
      html += `<rect x="20" y="70" width="14" height="14" fill="rgb(40,40,255)"/><text x="40" y="82" font-size="11" fill="#475569">負（低）</text>`;

      // 數據
      const depth = Math.sqrt(dx * dx + dy * dy);
      html += `<text x="${cx}" y="305" text-anchor="middle" font-size="12" fill="#475569">
        Dipole 位置 (${dx}, ${dy})，離中心 ${depth.toFixed(0)} px｜方向 ${da}°
      </text>`;

      svg.innerHTML = html;

      // 描述
      let hint;
      if (depth < 30) hint = "源很<strong>淺</strong>且接近中心：頭皮各電極變化適中。";
      else if (depth < 80) hint = "源位於<strong>中等深度</strong>：靠近源的電極反應強烈、對側電極極性相反。";
      else hint = "源很<strong>深</strong>或<strong>偏</strong>：靠近的電極極大，其他電極幾乎沒變化，但頭皮分布瀰漫，難以反推精確位置。";
      desc.innerHTML = `${hint}<br>
        <small>提示：拖動上方滑桿改變 X / Y / 方向；觀察電極顏色（紅 = 正電位，藍 = 負電位）。Dipole 越深越難從頭皮反推位置。</small>`;
    }

    ["dpx", "dpy", "dpa"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("input", render);
    });
    render();
  }
})();
