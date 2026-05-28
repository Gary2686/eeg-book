/* ============================================================
   Chapter 4 — 互動模組
   作者：葉欲禾 (Gary Yu-Ho YEH)
   涵蓋：
     1. STFT / Wavelet / Wigner-Ville 時頻平面視窗形狀比較
     2. 濾波器頻率響應（Low/High/Band/Notch）切換
   ============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    initTFCompare();
    initFilter();

    if (window.EEG_API) window.EEG_API.logEvent("chapter_open", { chapterId: "ch04" });

    if (window.EEGQuiz && window.QUESTIONS_CH04) {
      window.EEGQuiz.init({
        mount: "#quiz-host",
        chapterId: "ch04",
        bank: window.QUESTIONS_CH04,
        count: 10,
        title: "第四章 隨機 10 題測驗",
      });
    }
  });

  // ===== 1. STFT vs Wavelet vs WVD 視窗比較 =====
  function initTFCompare() {
    const svg = document.getElementById("tf-compare");
    const info = document.getElementById("tf-info");
    if (!svg) return;

    const W = 720, H = 280, PAD_L = 56, PAD_R = 16, PAD_T = 16, PAD_B = 40;
    const fMax = 50; // 頻率軸 Hz
    const tMax = 5;  // 時間軸 s
    const xScale = t => PAD_L + (t / tMax) * (W - PAD_L - PAD_R);
    const yScale = f => H - PAD_B - (f / fMax) * (H - PAD_T - PAD_B);

    const INFO = {
      fft: {
        title: "STFT — 固定大小視窗",
        text: "STFT 用固定大小的時間視窗對每段做 FFT。視窗短 → 時間細但頻率糊；視窗長 → 頻率細但時間糊。高頻、低頻無法兼顧（Heisenberg 不確定性）。",
        color: "#2563eb",
      },
      wavelet: {
        title: "Wavelet — 多尺度視窗",
        text: "高頻用窄視窗（時間細）、低頻用寬視窗（頻率細），更貼合 EEG 多頻段同時存在的特性。常見於癲癇偵測、ERP 分析。",
        color: "#16a34a",
      },
      wvd: {
        title: "Wigner-Ville — 解析度最佳，但有交叉項",
        text: "WVD 是 ambiguity function 的 2D Fourier，時頻解析度極佳，但多分量訊號會產生不存在的『交叉項』。Pseudo-WVD 或 Cohen's class 用低通核壓抑這些交叉項。",
        color: "#dc2626",
      },
    };

    function draw(mode) {
      let html = `
        <rect x="0" y="0" width="${W}" height="${H}" fill="#fafbff"/>
        <line x1="${PAD_L}" y1="${PAD_T}" x2="${PAD_L}" y2="${H - PAD_B}" stroke="#94a3b8"/>
        <line x1="${PAD_L}" y1="${H - PAD_B}" x2="${W - PAD_R}" y2="${H - PAD_B}" stroke="#94a3b8"/>
        <text x="${W / 2}" y="${H - 8}" text-anchor="middle" font-size="11" fill="#475569">時間 (s)</text>
        <text x="14" y="${(H + PAD_T) / 2}" font-size="11" fill="#475569" transform="rotate(-90 14,${(H + PAD_T) / 2})">頻率 (Hz)</text>
      `;
      for (let t = 0; t <= tMax; t++) {
        html += `<line x1="${xScale(t)}" y1="${H - PAD_B}" x2="${xScale(t)}" y2="${H - PAD_B + 4}" stroke="#94a3b8"/>
                 <text x="${xScale(t)}" y="${H - PAD_B + 16}" text-anchor="middle" font-size="10" fill="#475569">${t}</text>`;
      }
      for (let f = 0; f <= fMax; f += 10) {
        html += `<line x1="${PAD_L - 4}" y1="${yScale(f)}" x2="${PAD_L}" y2="${yScale(f)}" stroke="#94a3b8"/>
                 <text x="${PAD_L - 8}" y="${yScale(f) + 4}" text-anchor="end" font-size="10" fill="#475569">${f}</text>`;
      }

      const c = INFO[mode].color;

      if (mode === "fft") {
        // 固定大小視窗 (Δt=0.5s × Δf=10Hz)
        const dt = 0.5, df = 10;
        for (let t = 0; t < tMax; t += dt) {
          for (let f = 0; f < fMax; f += df) {
            html += `<rect x="${xScale(t)}" y="${yScale(f + df)}" width="${xScale(t + dt) - xScale(t)}" height="${yScale(f) - yScale(f + df)}" fill="none" stroke="${c}" stroke-width="1" opacity="0.85"/>`;
          }
        }
      } else if (mode === "wavelet") {
        // 多尺度：高頻窄、低頻寬
        // 在每個八度上把視窗大小加倍
        const octaves = [
          { fLo: 32, fHi: 50, dt: 0.25 },
          { fLo: 16, fHi: 32, dt: 0.5 },
          { fLo: 8,  fHi: 16, dt: 1.0 },
          { fLo: 4,  fHi: 8,  dt: 2.0 },
          { fLo: 0,  fHi: 4,  dt: 5.0 },
        ];
        octaves.forEach(o => {
          for (let t = 0; t < tMax; t += o.dt) {
            html += `<rect x="${xScale(t)}" y="${yScale(o.fHi)}" width="${xScale(Math.min(t + o.dt, tMax)) - xScale(t)}" height="${yScale(o.fLo) - yScale(o.fHi)}" fill="none" stroke="${c}" stroke-width="1" opacity="0.85"/>`;
          }
        });
      } else {
        // WVD：理想細網（外加 cross-term 示意）
        const dt = 0.15, df = 3;
        for (let t = 0; t < tMax; t += dt) {
          for (let f = 0; f < fMax; f += df) {
            html += `<rect x="${xScale(t)}" y="${yScale(f + df)}" width="${xScale(t + dt) - xScale(t)}" height="${yScale(f) - yScale(f + df)}" fill="none" stroke="${c}" stroke-width="0.5" opacity="0.7"/>`;
          }
        }
        // 模擬兩個訊號 + 中間的交叉項
        html += `<circle cx="${xScale(1.2)}" cy="${yScale(10)}" r="14" fill="${c}" opacity="0.8"/>`;
        html += `<circle cx="${xScale(3.8)}" cy="${yScale(35)}" r="14" fill="${c}" opacity="0.8"/>`;
        html += `<circle cx="${xScale(2.5)}" cy="${yScale(22)}" r="12" fill="#f59e0b" opacity="0.6" stroke="#92400e" stroke-dasharray="3 2"/>`;
        html += `<text x="${xScale(2.5) + 18}" y="${yScale(22) + 4}" font-size="11" fill="#b45309">交叉項 (cross-term)</text>`;
      }

      // 標題
      html += `<text x="${PAD_L + 6}" y="${PAD_T + 4}" font-size="13" font-weight="700" fill="${c}">${INFO[mode].title}</text>`;

      svg.innerHTML = html;
      if (info) info.innerHTML = `<strong>${INFO[mode].title}</strong><br>${INFO[mode].text}`;

      document.querySelectorAll(".tf-btn").forEach(b => {
        b.className = "btn tf-btn" + (b.dataset.mode === mode ? "" : " secondary");
      });
    }

    document.querySelectorAll(".tf-btn").forEach(b => b.addEventListener("click", () => draw(b.dataset.mode)));
    draw("fft");
  }

  // ===== 2. 濾波器頻率響應 =====
  function initFilter() {
    const svg = document.getElementById("filter-plot");
    const cap = document.getElementById("filter-cap");
    const info = document.getElementById("filter-info");
    if (!svg) return;

    const W = 720, H = 240, PAD_L = 50, PAD_R = 16, PAD_T = 18, PAD_B = 36;
    const fMax = 100;
    const xScale = f => PAD_L + (f / fMax) * (W - PAD_L - PAD_R);
    const yScale = a => H - PAD_B - a * (H - PAD_T - PAD_B);

    const FILTERS = {
      lowpass:  { title: "Low-pass（截止 30 Hz）", color: "#2563eb",
                  H: f => 1 / Math.sqrt(1 + Math.pow(f / 30, 8)),
                  desc: "通過 0–30 Hz；超過截止頻率衰減快速。EEG 主要資訊在 100 Hz 以下，多數應用甚至設 30 Hz 即可。" },
      highpass: { title: "High-pass（截止 0.5 Hz）", color: "#16a34a",
                  H: f => 1 / Math.sqrt(1 + Math.pow(0.5 / Math.max(f, 0.05), 8)),
                  desc: "通過 > 0.5 Hz；去除呼吸、體位等慢漂移與 DC 偏移。EEG 標準前處理一定有 HPF。" },
      bandpass: { title: "Band-pass（α 8–13 Hz）", color: "#9333ea",
                  H: f => {
                    const lo = 1 / Math.sqrt(1 + Math.pow(8 / Math.max(f, 0.1), 8));
                    const hi = 1 / Math.sqrt(1 + Math.pow(f / 13, 8));
                    return lo * hi;
                  },
                  desc: "只通過 α 頻段 (8–13 Hz)，常用於閉眼放鬆研究或 BCI 中的 SSVEP/SMR 應用。" },
      notch:    { title: "Notch（60 Hz ± 1 Hz）", color: "#dc2626",
                  H: f => {
                    const d = f - 60;
                    return 1 - Math.exp(-(d * d) / 2);
                  },
                  desc: "陷波濾波器：剔除電源頻率干擾 (台灣 60 Hz、歐洲 50 Hz)。其他頻段幾乎不受影響。" },
    };

    function draw(type) {
      const F = FILTERS[type];
      let html = `
        <rect x="0" y="0" width="${W}" height="${H}" fill="#fafbff"/>
        <line x1="${PAD_L}" y1="${PAD_T}" x2="${PAD_L}" y2="${H - PAD_B}" stroke="#94a3b8"/>
        <line x1="${PAD_L}" y1="${H - PAD_B}" x2="${W - PAD_R}" y2="${H - PAD_B}" stroke="#94a3b8"/>
        <text x="${W / 2}" y="${H - 6}" text-anchor="middle" font-size="11" fill="#475569">頻率 (Hz)</text>
        <text x="12" y="${(H + PAD_T) / 2}" font-size="11" fill="#475569" transform="rotate(-90 12,${(H + PAD_T) / 2})">|H(f)|</text>
      `;
      for (let f = 0; f <= fMax; f += 10) {
        html += `<line x1="${xScale(f)}" y1="${H - PAD_B}" x2="${xScale(f)}" y2="${H - PAD_B + 4}" stroke="#94a3b8"/>
                 <text x="${xScale(f)}" y="${H - PAD_B + 16}" text-anchor="middle" font-size="10" fill="#475569">${f}</text>`;
      }
      [0, 0.5, 1].forEach(a => {
        const y = yScale(a);
        html += `<line x1="${PAD_L - 4}" y1="${y}" x2="${PAD_L}" y2="${y}" stroke="#94a3b8"/>
                 <text x="${PAD_L - 8}" y="${y + 4}" text-anchor="end" font-size="10" fill="#475569">${a.toFixed(1)}</text>`;
      });

      // 繪製曲線
      const points = [];
      for (let f = 0; f <= fMax; f += 0.5) {
        const a = Math.max(0, Math.min(1.05, F.H(f)));
        points.push(xScale(f).toFixed(1) + "," + yScale(a).toFixed(1));
      }
      html += `<polyline points="${points.join(' ')}" fill="none" stroke="${F.color}" stroke-width="2.5"/>`;
      html += `<text x="${PAD_L + 8}" y="${PAD_T + 6}" font-size="13" font-weight="700" fill="${F.color}">${F.title}</text>`;

      svg.innerHTML = html;
      if (cap) cap.textContent = F.title;
      if (info) info.innerHTML = `<strong>${F.title}</strong><br>${F.desc}`;

      document.querySelectorAll(".filter-btn").forEach(b => {
        b.className = "btn filter-btn" + (b.dataset.type === type ? "" : " secondary");
      });
    }

    document.querySelectorAll(".filter-btn").forEach(b => b.addEventListener("click", () => draw(b.dataset.type)));
    draw("lowpass");
  }
})();
