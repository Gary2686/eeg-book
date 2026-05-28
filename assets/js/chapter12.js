/* ============================================================
   Chapter 12 — 互動模組
   作者：葉欲禾 (Gary Yu-Ho YEH) ・ 鄭鈞 (Jacob Cheng)
   涵蓋：
     1. 五階段睡眠 EEG 切換
     2. 整晚 Hypnogram 互動
   ============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    initStageSwitch();
    initHypnogram();

    if (window.EEG_API) window.EEG_API.logEvent("chapter_open", { chapterId: "ch12" });

    if (window.EEGQuiz && window.QUESTIONS_CH12) {
      window.EEGQuiz.init({
        mount: "#quiz-host",
        chapterId: "ch12",
        bank: window.QUESTIONS_CH12,
        count: 10,
        title: "第 12 章 隨機 10 題測驗",
      });
    }
  });

  // ===== 1. 五階段切換 =====
  function initStageSwitch() {
    const svg = document.getElementById("sleep-wave");
    const desc = document.getElementById("sleep-desc");
    const buttons = document.querySelectorAll("[data-stage]");
    if (!svg || !desc) return;

    const W = 720, H = 200, midY = H / 2;

    const stages = {
      W: {
        title: "W 清醒 — 低振幅、混合頻率",
        text: "閉眼可見 α 波 (8–13 Hz) 集中在後腦（O1/O2）；張眼時 α 被『阻斷』。EEG 呈低振幅、快頻、不規則。",
        color: "#2563eb",
        gen: (N) => {
          const a = [];
          for (let i = 0; i < N; i++) {
            const t = i / N * 2 * Math.PI * 30;
            a.push(12 * Math.sin(t) + 4 * Math.sin(t * 2.3) + (Math.random() - 0.5) * 6);
          }
          return a;
        },
        markers: [],
      },
      N1: {
        title: "N1 入睡淺眠 — α 消退、theta 出現",
        text: "佔總睡眠 5–10%。成人特徵：α 漸退；4–6 Hz θ 漸增。可能出現 vertex wave。容易被叫醒。",
        color: "#0891b2",
        gen: (N) => {
          const a = [];
          for (let i = 0; i < N; i++) {
            const t = i / N * 2 * Math.PI * 14;
            a.push(15 * Math.sin(t) + 6 * Math.sin(t * 2 + 0.2) + (Math.random() - 0.5) * 5);
          }
          // vertex wave
          for (let k = 280; k < 300; k++) a[k] += -45 * Math.exp(-((k - 290) ** 2) / 30);
          return a;
        },
        markers: [{ x: 290, label: "Vertex wave" }],
      },
      N2: {
        title: "N2 — 紡錘波 + K-complex（佔 40–50%）",
        text: "EEG 出現典型 sleep spindle（11–15 Hz、0.5–2.5 秒、漸增漸減）與 K-complex（一個 sharp negative + slow component）。佔總睡眠最多。",
        color: "#7c3aed",
        gen: (N) => {
          const a = [];
          for (let i = 0; i < N; i++) {
            const t = i / N * 2 * Math.PI * 6;
            a.push(8 * Math.sin(t) + (Math.random() - 0.5) * 4);
          }
          // K-complex 在中央
          for (let k = 200; k < 260; k++) {
            const dk = k - 220;
            a[k] += -40 * Math.exp(-(dk * dk) / 80) + 30 * Math.exp(-((dk - 18) ** 2) / 200);
          }
          // spindle 兩段
          for (let k = 380; k < 460; k++) {
            const env = Math.sin(((k - 380) / 80) * Math.PI);
            a[k] += 22 * env * Math.sin((k - 380) * 0.9);
          }
          return a;
        },
        markers: [{ x: 230, label: "K-complex" }, { x: 420, label: "Spindle" }],
      },
      N3: {
        title: "N3 (SWS) — 慢波/深睡",
        text: "0.5–4 Hz delta 大振幅慢波佔主導（20–50% epoch 是 SWA → N3；>50% → N4，現代合稱 N3）。難喚醒；分泌生長激素。",
        color: "#b45309",
        gen: (N) => {
          const a = [];
          for (let i = 0; i < N; i++) {
            const t = i / N * 2 * Math.PI * 2.2;
            a.push(40 * Math.sin(t) + 12 * Math.sin(t * 1.5 + 0.3) + (Math.random() - 0.5) * 4);
          }
          return a;
        },
        markers: [],
      },
      REM: {
        title: "REM — 像清醒的腦、麻痺的身體",
        text: "EEG 與 wake 類似（低振幅、α 略慢）；眼球快速移動；心跳呼吸快而不規律；肌肉幾乎完全麻痺。多數夢境出現於此。",
        color: "#dc2626",
        gen: (N) => {
          const a = [];
          for (let i = 0; i < N; i++) {
            const t = i / N * 2 * Math.PI * 22;
            a.push(10 * Math.sin(t) + 5 * Math.sin(t * 1.7) + (Math.random() - 0.5) * 6);
          }
          // sawtooth wave (typical REM)
          for (let k = 320; k < 380; k++) {
            a[k] += 18 * ((k - 320) % 12 - 6);
          }
          return a;
        },
        markers: [{ x: 350, label: "Sawtooth (REM)" }],
      },
    };

    function draw(key) {
      const stage = stages[key];
      const N = 720;
      const data = stage.gen(N);
      const pts = data.map((v, i) => {
        const x = (i / (N - 1)) * (W - 10) + 5;
        const y = midY - Math.max(-60, Math.min(60, v)) * 1.2;
        return x.toFixed(1) + "," + y.toFixed(1);
      }).join(" ");

      let html = `<rect width="${W}" height="${H}" fill="#fafbff"/>
        <line x1="5" y1="${midY}" x2="${W - 5}" y2="${midY}" stroke="#cbd5e1" stroke-dasharray="3 3"/>
        <polyline points="${pts}" fill="none" stroke="${stage.color}" stroke-width="1.6"/>
        <text x="${W - 12}" y="22" text-anchor="end" font-size="13" font-weight="700" fill="${stage.color}">${stage.title}</text>`;

      stage.markers.forEach(m => {
        const x = (m.x / (N - 1)) * (W - 10) + 5;
        html += `<line x1="${x}" y1="20" x2="${x}" y2="${H - 10}" stroke="#a3a3a3" stroke-dasharray="3 3"/>
                 <text x="${x + 4}" y="36" font-size="11" fill="#525252">${m.label}</text>`;
      });

      svg.innerHTML = html;
      desc.innerHTML = `<strong>${stage.title}</strong><br>${stage.text}`;
      buttons.forEach(b => {
        const active = b.dataset.stage === key;
        b.style.background = active ? stage.color : "";
        b.style.color = active ? "white" : "";
      });
    }

    buttons.forEach(b => b.addEventListener("click", () => draw(b.dataset.stage)));
    draw("N2");
  }

  // ===== 2. Hypnogram =====
  function initHypnogram() {
    const svg  = document.getElementById("hypnogram");
    const desc = document.getElementById("hypno-desc");
    if (!svg) return;

    const W = 760, H = 240, PAD_L = 80, PAD_R = 16, PAD_T = 24, PAD_B = 40;
    // y 軸由上到下：Wake / REM / N1 / N2 / N3
    const levels = [
      { id: "W",   label: "Wake", y: PAD_T,           color: "#0891b2" },
      { id: "REM", label: "REM",  y: PAD_T + 35,      color: "#dc2626" },
      { id: "N1",  label: "N1",   y: PAD_T + 70,      color: "#0d9488" },
      { id: "N2",  label: "N2",   y: PAD_T + 105,     color: "#7c3aed" },
      { id: "N3",  label: "N3",   y: PAD_T + 140,     color: "#b45309" },
    ];
    // 簡化的 8 小時 hypnogram (約 16 段)
    const segments = [
      "W","N1","N2","N3","N3","N2","REM",
      "N2","N3","N2","REM","N2","REM",
      "N2","REM","W"
    ];
    const T = segments.length;
    const xStep = (W - PAD_L - PAD_R) / T;

    function levelY(id) { return levels.find(l => l.id === id).y; }
    function levelColor(id) { return levels.find(l => l.id === id).color; }

    let html = `<rect width="${W}" height="${H}" fill="#fafbff"/>`;
    // y label
    levels.forEach(l => {
      html += `<text x="${PAD_L - 10}" y="${l.y + 5}" text-anchor="end" font-size="12" font-weight="600" fill="#475569">${l.label}</text>
               <line x1="${PAD_L}" y1="${l.y}" x2="${W - PAD_R}" y2="${l.y}" stroke="#e2e8f0" stroke-dasharray="2 3"/>`;
    });
    // x label
    for (let h = 0; h <= 8; h++) {
      const x = PAD_L + (h / 8) * (W - PAD_L - PAD_R);
      html += `<line x1="${x}" y1="${H - PAD_B}" x2="${x}" y2="${H - PAD_B + 5}" stroke="#94a3b8"/>
               <text x="${x}" y="${H - PAD_B + 22}" text-anchor="middle" font-size="11" fill="#475569">${h}h</text>`;
    }
    html += `<text x="${(W + PAD_L) / 2}" y="${H - 6}" text-anchor="middle" font-size="12" fill="#475569">入睡後時數 (hour)</text>`;

    // 階梯線
    let prevY = null, prevX = PAD_L;
    segments.forEach((seg, i) => {
      const x1 = PAD_L + i * xStep;
      const x2 = PAD_L + (i + 1) * xStep;
      const y = levelY(seg);
      if (prevY !== null && prevY !== y) {
        html += `<line x1="${x1}" y1="${prevY}" x2="${x1}" y2="${y}" stroke="#1e293b" stroke-width="2"/>`;
      }
      html += `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#1e293b" stroke-width="2"/>`;
      html += `<rect class="seg" data-i="${i}" data-stage="${seg}" x="${x1}" y="${PAD_T - 4}" width="${xStep}" height="${H - PAD_B - PAD_T + 8}" fill="transparent" style="cursor:pointer"/>`;
      // 上色一些重要 epoch
      html += `<rect x="${x1}" y="${y - 3}" width="${xStep - 1}" height="6" fill="${levelColor(seg)}" opacity="0.6"/>`;
      prevY = y; prevX = x2;
    });

    svg.innerHTML = html;

    const stageNames = {
      W: "清醒",
      REM: "REM (快速眼動)",
      N1: "N1 (入睡 / 淺眠)",
      N2: "N2 (紡錘波 + K-complex)",
      N3: "N3 (慢波 / 深睡, SWS)",
    };

    function showSeg(i, stage) {
      if (!desc) return;
      const hr = ((i / T) * 8).toFixed(2);
      desc.innerHTML = `<strong>Epoch #${i + 1}（約第 ${hr} 小時）：${stageNames[stage] || stage}</strong><br>
        典型 hypnogram 早段 N3 多、後段 REM 多；觀察到 REM 周期約每 90 分鐘出現一次。`;
    }
    svg.querySelectorAll(".seg").forEach(r => {
      r.addEventListener("mouseenter", () => showSeg(+r.dataset.i, r.dataset.stage));
      r.addEventListener("click",      () => showSeg(+r.dataset.i, r.dataset.stage));
    });
    showSeg(0, segments[0]);
  }
})();
