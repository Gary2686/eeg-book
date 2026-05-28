/* ============================================================
   Chapter 1 — 互動模組
   作者：葉欲禾 (Gary Yu-Ho YEH)
   涵蓋：
     1. EEG/MEG/fMRI 比較互動
     2. 歷史時間軸展開/收合
     3. 神經元解剖互動
     4. 動作電位 (AP) 六階段動畫
     5. 頭部三層解剖剖面
     6. 大腦三部分互動圖
   ============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    initTimeline();
    initAPAnimation();
    initNeuronDiagram();
    initEPSPIPSP();
    initHeadLayers();
    initBrainRegions();

    // 紀錄章節進入事件
    if (window.EEG_API) window.EEG_API.logEvent("chapter_open", { chapterId: "ch01" });

    // 載入題庫並掛載 Quiz
    if (window.EEGQuiz && window.QUESTIONS_CH01) {
      window.EEGQuiz.init({
        mount: "#quiz-host",
        chapterId: "ch01",
        bank: window.QUESTIONS_CH01,
        count: 10,
        title: "第一章 隨機 10 題測驗",
      });
    }
  });

  // ===== 1. 歷史時間軸 =====
  function initTimeline() {
    document.querySelectorAll(".timeline-item").forEach(item => {
      item.addEventListener("click", () => item.classList.toggle("expanded"));
    });
  }

  // ===== 2. 動作電位動畫 =====
  function initAPAnimation() {
    const svg = document.getElementById("ap-plot");
    if (!svg) return;

    // 6 個階段（依書本 Figure 1.5）
    const stages = [
      { id: 1, t: 0,   v: -70, label: "靜止電位",     desc: "膜電位 ≈ -70 mV，Na+/K+ 幫浦維持。" },
      { id: 2, t: 1,   v: -55, label: "達到閾值",     desc: "刺激讓內部由 -70 升至 -55 mV，超過閾值。" },
      { id: 3, t: 2,   v:  30, label: "去極化",       desc: "電壓門控 Na+ 通道大量開啟，Na+ 湧入，膜電位飆升至 ~+30 mV。" },
      { id: 4, t: 3,   v:  10, label: "Na+ 關 / K+ 開","desc": "Na+ 通道關閉、K+ 通道開啟。K+ 較慢，去極化得以完成。" },
      { id: 5, t: 4.5, v: -70, label: "再極化",       desc: "K+ 流出，膜電位下降，回到靜止水平。" },
      { id: 6, t: 6,   v: -90, label: "過極化",       desc: "K+ 通道仍開，電位低於 -70 mV，進入『不反應期』，確保訊號單向傳遞。" },
      { id: 7, t: 8,   v: -70, label: "恢復靜止",     desc: "Na+/K+ 幫浦把膜電位拉回 -70 mV，準備迎接下一次訊號。" },
    ];

    // 平滑曲線（簡單貝茲）
    const W = 560, H = 280, PAD_L = 56, PAD_R = 16, PAD_T = 18, PAD_B = 40;
    const xMin = 0, xMax = 9;
    const yMin = -100, yMax = 40;
    const xScale = t => PAD_L + ((t - xMin) / (xMax - xMin)) * (W - PAD_L - PAD_R);
    const yScale = v => PAD_T + ((yMax - v) / (yMax - yMin)) * (H - PAD_T - PAD_B);

    // 採樣生成連續曲線（用 spline-like 簡化方式）
    const samples = [];
    for (let t = 0; t <= xMax; t += 0.05) {
      let v;
      if (t < 1)          v = -70;
      else if (t < 2)     v = -70 + (t - 1) * (30 - (-70));        // -70 → +30 線性
      else if (t < 2.6)   v = 30  + (t - 2) / 0.6 * (10 - 30);     // 30 → 10
      else if (t < 4.5)   v = 10  + (t - 2.6) / 1.9 * (-70 - 10);  // 10 → -70
      else if (t < 6)     v = -70 + (t - 4.5) / 1.5 * (-90 - (-70));// -70 → -90
      else if (t < 8)     v = -90 + (t - 6) / 2 * (-70 - (-90));   // -90 → -70
      else                v = -70;
      samples.push([t, v]);
    }
    const pathD = samples.map((p, i) => (i === 0 ? "M" : "L") + xScale(p[0]).toFixed(1) + "," + yScale(p[1]).toFixed(1)).join(" ");

    // 軸線、刻度
    let html = `
      <rect x="0" y="0" width="${W}" height="${H}" fill="#fafbff"/>
      <line x1="${PAD_L}" y1="${PAD_T}" x2="${PAD_L}" y2="${H - PAD_B}" stroke="#94a3b8" stroke-width="1"/>
      <line x1="${PAD_L}" y1="${H - PAD_B}" x2="${W - PAD_R}" y2="${H - PAD_B}" stroke="#94a3b8" stroke-width="1"/>
    `;
    // y 刻度
    [-100, -70, -55, 0, 30].forEach(v => {
      const y = yScale(v);
      html += `<line x1="${PAD_L - 4}" y1="${y}" x2="${PAD_L}" y2="${y}" stroke="#94a3b8"/>
               <text x="${PAD_L - 8}" y="${y + 4}" text-anchor="end" font-size="11" fill="#475569">${v}</text>`;
    });
    html += `<text x="14" y="${PAD_T + 80}" font-size="12" fill="#475569" transform="rotate(-90 14,${PAD_T + 80})">膜電位 (mV)</text>`;
    // 閾值參考線
    html += `<line x1="${PAD_L}" y1="${yScale(-55)}" x2="${W - PAD_R}" y2="${yScale(-55)}" stroke="#f59e0b" stroke-width="1" stroke-dasharray="4 4"/>
             <text x="${W - PAD_R}" y="${yScale(-55) - 4}" font-size="11" text-anchor="end" fill="#b45309">閾值 -55 mV</text>`;
    // x 刻度
    for (let t = 0; t <= 8; t += 2) {
      const x = xScale(t);
      html += `<line x1="${x}" y1="${H - PAD_B}" x2="${x}" y2="${H - PAD_B + 4}" stroke="#94a3b8"/>
               <text x="${x}" y="${H - PAD_B + 18}" text-anchor="middle" font-size="11" fill="#475569">${t}</text>`;
    }
    html += `<text x="${(W + PAD_L) / 2}" y="${H - 6}" text-anchor="middle" font-size="12" fill="#475569">時間 (ms)</text>`;

    // 曲線（先繪未走過的灰色 + 已走過的紅色）
    html += `<path id="ap-curve-bg" d="${pathD}" fill="none" stroke="#e2e8f0" stroke-width="3"/>`;
    html += `<path id="ap-curve-fg" d="${pathD}" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round"/>`;

    // 階段點
    stages.forEach((s, i) => {
      html += `<g class="ap-stage" data-i="${i}">
        <circle cx="${xScale(s.t)}" cy="${yScale(s.v)}" r="7" fill="#fff" stroke="#dc2626" stroke-width="2"/>
        <text x="${xScale(s.t)}" y="${yScale(s.v) - 12}" text-anchor="middle" font-size="11" font-weight="700" fill="#7f1d1d">${s.id}</text>
      </g>`;
    });

    // 走動的紅點
    html += `<circle id="ap-cursor" class="ap-dot" cx="${xScale(0)}" cy="${yScale(-70)}" r="9"/>`;

    svg.innerHTML = html;

    // 控制
    const btnPlay  = document.getElementById("ap-play");
    const btnPause = document.getElementById("ap-pause");
    const btnReset = document.getElementById("ap-reset");
    const stageDesc = document.getElementById("ap-stage-desc");
    const slider   = document.getElementById("ap-slider");
    const cursor   = svg.querySelector("#ap-cursor");
    const fg       = svg.querySelector("#ap-curve-fg");
    const totalLen = fg.getTotalLength();
    fg.style.strokeDasharray = totalLen;
    fg.style.strokeDashoffset = totalLen;

    function updateAt(t) {
      // 找 sample 中對應 t 的點
      const idx = Math.min(samples.length - 1, Math.max(0, Math.round(t / 0.05)));
      const [tt, vv] = samples[idx];
      cursor.setAttribute("cx", xScale(tt));
      cursor.setAttribute("cy", yScale(vv));
      // 線條 dash 動畫進度（按比例）
      const pct = idx / (samples.length - 1);
      fg.style.strokeDashoffset = totalLen * (1 - pct);

      // 找最近的 stage 顯示說明
      let nearest = stages[0], nd = Infinity;
      stages.forEach(s => {
        const d = Math.abs(s.t - tt);
        if (d < nd) { nd = d; nearest = s; }
      });
      // 高亮對應 step
      document.querySelectorAll(".step").forEach(el => el.classList.toggle("active", +el.dataset.step === nearest.id));
      if (stageDesc) stageDesc.innerHTML = `<strong>階段 ${nearest.id}：${nearest.label}</strong><br><small>${nearest.desc}</small>`;
      slider.value = tt;
    }

    let timer = null;
    let curT = 0;
    function play() {
      if (timer) return;
      timer = setInterval(() => {
        curT += 0.08;
        if (curT > xMax) { curT = xMax; pause(); }
        updateAt(curT);
      }, 50);
    }
    function pause() {
      if (timer) { clearInterval(timer); timer = null; }
    }
    function reset() {
      pause();
      curT = 0;
      updateAt(0);
    }

    btnPlay && btnPlay.addEventListener("click", play);
    btnPause && btnPause.addEventListener("click", pause);
    btnReset && btnReset.addEventListener("click", reset);
    slider && slider.addEventListener("input", (e) => {
      pause();
      curT = +e.target.value;
      updateAt(curT);
    });

    // 點階段按鈕跳到對應位置
    document.querySelectorAll(".step").forEach(el => {
      el.addEventListener("click", () => {
        const id = +el.dataset.step;
        const s = stages.find(x => x.id === id);
        if (!s) return;
        pause();
        curT = s.t;
        updateAt(curT);
      });
    });

    updateAt(0);
  }

  // ===== 3. 神經元解剖互動 =====
  function initNeuronDiagram() {
    const items = document.querySelectorAll(".neuron-part");
    const info = document.getElementById("neuron-info");
    if (!info) return;
    const parts = {
      dendrite: { title: "樹突 Dendrite", text: "像「天線」接收其他神經元傳來的訊號。一個神經元的樹突可連接約 1 萬個其他神經元，是訊號『輸入』的主要部位。" },
      soma:     { title: "細胞體 Soma / Cell Body", text: "包含細胞核，負責蛋白質合成與基本代謝。整合所有突觸輸入並決定是否觸發 AP。" },
      axon:     { title: "軸突 Axon", text: "長條圓柱狀結構，AP 由此沿單向傳遞。長度可從零點幾公釐到超過一公尺；軸突內有分子馬達把蛋白沿微管運送。" },
      myelin:   { title: "髓鞘 Myelin Sheath", text: "由 Schwann 細胞包覆，作為絕緣層，使 AP 在 Ranvier 節點之間『跳躍式傳遞 (saltatory conduction)』，大幅加快速度。" },
      terminal: { title: "軸突末梢 Axon Terminal", text: "AP 抵達時釋放神經傳導物質，跨越突觸間隙影響下一個神經元——形成『化學傳遞 (chemical transmission)』。" },
      synapse:  { title: "突觸 Synapse", text: "神經元之間的接點。可分興奮性（→EPSP）或抑制性（→IPSP）；多個 EPSP 累加超過閾值才會觸發新的 AP。" },
    };
    items.forEach(el => {
      el.addEventListener("mouseenter", () => highlight(el.dataset.part));
      el.addEventListener("click",     () => highlight(el.dataset.part));
    });
    function highlight(key) {
      items.forEach(el => el.classList.toggle("active", el.dataset.part === key));
      const p = parts[key];
      info.innerHTML = `<strong>${p.title}</strong><br><span>${p.text}</span>`;
    }
    highlight("dendrite");
  }

  // ===== 4. EPSP / IPSP 切換 =====
  function initEPSPIPSP() {
    const radio = document.querySelectorAll('input[name="psp-type"]');
    const wave = document.getElementById("psp-wave");
    const desc = document.getElementById("psp-desc");
    if (!wave) return;
    function update(type) {
      // EPSP: 短暫去極化 (上升)；IPSP: 短暫過極化 (下降)
      const W = 320, H = 140, PAD = 24;
      const points = [];
      for (let x = 0; x <= 100; x++) {
        // 簡單高斯型脈衝
        const t = (x - 30) / 8;
        const amp = (type === "epsp" ? +12 : -10) * Math.exp(-t * t / 2);
        const xx = PAD + x / 100 * (W - PAD * 2);
        const yy = H / 2 - amp * 2;
        points.push(xx.toFixed(1) + "," + yy.toFixed(1));
      }
      wave.innerHTML = `
        <rect width="${W}" height="${H}" fill="#fafbff"/>
        <line x1="${PAD}" y1="${H/2}" x2="${W-PAD}" y2="${H/2}" stroke="#cbd5e1" stroke-dasharray="4 4"/>
        <text x="${PAD}" y="${H/2 - 6}" font-size="11" fill="#64748b">靜止電位 ≈ -70 mV</text>
        <polyline points="${points.join(' ')}" fill="none" stroke="${type === 'epsp' ? '#dc2626' : '#2563eb'}" stroke-width="3"/>
        <text x="${W-PAD}" y="20" text-anchor="end" font-size="12" font-weight="700" fill="${type === 'epsp' ? '#dc2626' : '#2563eb'}">${type === 'epsp' ? 'EPSP（去極化）' : 'IPSP（過極化）'}</text>
      `;
      desc.innerHTML = type === "epsp"
        ? "<strong>興奮性突觸後電位 (EPSP)：</strong>使下游神經元更<u>容易</u>達到觸發 AP 的閾值（-55 mV）。多個 EPSP 在短時間內加總就有機會點燃新的 AP。"
        : "<strong>抑制性突觸後電位 (IPSP)：</strong>讓下游神經元電位更負（過極化），更<u>難</u>達到閾值，扮演『煞車』的角色。";
    }
    radio.forEach(r => r.addEventListener("change", e => update(e.target.value)));
    update("epsp");
  }

  // ===== 5. 頭部三層 =====
  function initHeadLayers() {
    const items = document.querySelectorAll("[data-layer]");
    const info = document.getElementById("layer-info");
    if (!info) return;
    const data = {
      scalp: { title: "頭皮 Scalp", text: "外層：皮膚、皮下結締組織、帽狀腱膜、疏鬆結締組織、骨膜。電極通常貼於此處量得 EEG。" },
      skull: { title: "顱骨 Skull", text: "硬骨層。對 EEG 訊號的衰減約是軟組織的 100 倍，這也是頭皮 EEG 振幅很小、需要大族群神經元同步才能被觀察到的主因。" },
      brain: { title: "腦 Brain（含皮質與覆膜）", text: "皮質之外有蜘蛛膜、軟腦膜、硬膜等覆膜；腦脊髓液（CSF）填充其間。EEG 真正想觀察的訊號源（皮質椎體神經元）就在此層。" },
    };
    function showLayer(el) {
      items.forEach(x => x.classList.toggle("active", x === el));
      const d = data[el.dataset.layer];
      info.innerHTML = `<strong>${d.title}</strong><br>${d.text}`;
    }
    items.forEach(el => {
      el.addEventListener("mouseenter", () => showLayer(el));
      el.addEventListener("click",      () => showLayer(el));
    });
    if (items[0]) showLayer(items[0]);
  }

  // ===== 6. 大腦三部分 =====
  function initBrainRegions() {
    const items = document.querySelectorAll("[data-region]");
    const info = document.getElementById("region-info");
    if (!info) return;
    const data = {
      cerebrum:    { title: "大腦 Cerebrum", text: "包含左右兩個高度皺褶的半球（皮質）。負責運動發起、感覺意識、複雜分析、情緒與行為表達。" },
      cerebellum:  { title: "小腦 Cerebellum", text: "協調隨意肌動作與平衡維持。動作越精細，小腦的角色越重要。" },
      brainstem:   { title: "腦幹 Brain Stem", text: "控制不自主功能：呼吸、心跳調節、生物節律、神經荷爾蒙與激素分泌。腦幹受損常造成生命危險。" },
    };
    function showRegion(el) {
      items.forEach(x => x.classList.toggle("active", x === el));
      const d = data[el.dataset.region];
      info.innerHTML = `<strong>${d.title}</strong><br>${d.text}`;
    }
    items.forEach(el => {
      el.addEventListener("mouseenter", () => showRegion(el));
      el.addEventListener("click",      () => showRegion(el));
    });
    if (items[0]) showRegion(items[0]);
  }
})();
