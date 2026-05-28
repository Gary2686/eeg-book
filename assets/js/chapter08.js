/* ============================================================
   Chapter 8 — 互動模組
   作者：葉欲禾 (Gary Yu-Ho YEH) ・ 鄭鈞 (Jacob Cheng)
   涵蓋：
     1. 腦網絡互動（節點點擊顯示度與相連對象）
     2. 三種拓撲切換（regular / small-world / random）
   ============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    try { initBrainNetwork(); } catch (e) { console.error(e); }
    try { initTopology();     } catch (e) { console.error(e); }

    if (window.EEG_API) window.EEG_API.logEvent("chapter_open", { chapterId: "ch08" });

    if (window.EEGQuiz && window.QUESTIONS_CH08) {
      window.EEGQuiz.init({
        mount: "#quiz-host",
        chapterId: "ch08",
        bank: window.QUESTIONS_CH08,
        count: 10,
        title: "第 8 章 隨機 10 題測驗",
      });
    }
  });

  // ===== 1. 腦網絡互動 =====
  function initBrainNetwork() {
    const svg = document.getElementById("brain-network");
    const info = document.getElementById("node-info");
    if (!svg || !info) return;

    // 11 個節點（依大致腦區位置擺）
    const nodes = [
      { id: "Fp1", x: 220, y: 70,  region: "前額" },
      { id: "Fp2", x: 380, y: 70,  region: "前額" },
      { id: "F3",  x: 180, y: 130, region: "額葉" },
      { id: "F4",  x: 420, y: 130, region: "額葉" },
      { id: "Cz",  x: 300, y: 180, region: "中央（樞紐）" },
      { id: "C3",  x: 170, y: 200, region: "感覺運動皮層" },
      { id: "C4",  x: 430, y: 200, region: "感覺運動皮層" },
      { id: "P3",  x: 200, y: 260, region: "頂葉" },
      { id: "P4",  x: 400, y: 260, region: "頂葉" },
      { id: "O1",  x: 250, y: 320, region: "枕葉" },
      { id: "O2",  x: 350, y: 320, region: "枕葉" },
    ];
    // 邊（無向）
    const edges = [
      ["Fp1","F3"], ["Fp2","F4"], ["Fp1","Fp2"],
      ["F3","Cz"], ["F4","Cz"], ["F3","C3"], ["F4","C4"],
      ["Cz","C3"], ["Cz","C4"], ["Cz","P3"], ["Cz","P4"], ["Cz","Fp1"], ["Cz","Fp2"],
      ["C3","P3"], ["C4","P4"], ["P3","P4"],
      ["P3","O1"], ["P4","O2"], ["O1","O2"], ["P3","O2"], ["P4","O1"],
    ];

    // 計算每個節點的度
    const degree = {};
    nodes.forEach(n => degree[n.id] = 0);
    edges.forEach(([a,b]) => { degree[a]++; degree[b]++; });
    const maxDeg = Math.max(...Object.values(degree));

    // 構建邊
    let svgHTML = "";
    edges.forEach(([a,b]) => {
      const A = nodes.find(n => n.id === a), B = nodes.find(n => n.id === b);
      svgHTML += `<line class="edge" data-a="${a}" data-b="${b}" x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}" stroke="#94a3b8" stroke-width="1.5" opacity="0.55"/>`;
    });
    // 節點
    nodes.forEach(n => {
      const ratio = degree[n.id] / maxDeg;
      const r = 12 + ratio * 8;
      const blue = Math.round(220 - ratio * 120);
      svgHTML += `<g class="bn-node" data-id="${n.id}" style="cursor:pointer">
        <circle cx="${n.x}" cy="${n.y}" r="${r}" fill="rgb(${blue},${blue+10},255)" stroke="#1e3a8a" stroke-width="1.5"/>
        <text x="${n.x}" y="${n.y + 4}" text-anchor="middle" font-size="11" font-weight="700" fill="#1e3a8a">${n.id}</text>
      </g>`;
    });
    svg.innerHTML = svgHTML;

    function highlight(id) {
      // 邊
      svg.querySelectorAll(".edge").forEach(el => {
        const a = el.dataset.a, b = el.dataset.b;
        if (a === id || b === id) {
          el.setAttribute("stroke", "#dc2626");
          el.setAttribute("stroke-width", "3");
          el.setAttribute("opacity", "0.95");
        } else {
          el.setAttribute("stroke", "#cbd5e1");
          el.setAttribute("stroke-width", "1");
          el.setAttribute("opacity", "0.35");
        }
      });
      // 節點
      svg.querySelectorAll(".bn-node").forEach(el => {
        const isFocus = el.dataset.id === id;
        const circ = el.querySelector("circle");
        if (isFocus) circ.setAttribute("stroke", "#dc2626"), circ.setAttribute("stroke-width", "3");
        else circ.setAttribute("stroke", "#1e3a8a"), circ.setAttribute("stroke-width", "1.5");
      });
      const node = nodes.find(n => n.id === id);
      const neighbors = [];
      edges.forEach(([a,b]) => {
        if (a === id) neighbors.push(b);
        else if (b === id) neighbors.push(a);
      });
      info.innerHTML = `
        <strong>${node.id}（${node.region}）</strong><br>
        <strong>度 (degree)：</strong>${degree[id]} ${id === "Cz" ? "← 此網絡中的樞紐 (hub)" : ""}<br>
        <strong>相鄰節點：</strong>${neighbors.join("、")}
      `;
    }

    svg.querySelectorAll(".bn-node").forEach(el => {
      el.addEventListener("click",      () => highlight(el.dataset.id));
      el.addEventListener("mouseenter", () => highlight(el.dataset.id));
    });
    // 預設顯示 Cz
    highlight("Cz");
  }

  // ===== 2. 三種拓撲切換 =====
  function initTopology() {
    const svg  = document.getElementById("topo-svg");
    const desc = document.getElementById("topo-desc");
    if (!svg) return;

    const N = 14;
    const cx = 180, cy = 180, R = 130;
    const pts = [];
    for (let i = 0; i < N; i++) {
      const a = (i / N) * 2 * Math.PI - Math.PI / 2;
      pts.push({ x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) });
    }

    function generate(type) {
      const edges = [];
      const k = 2; // 每邊各 k 個鄰居（規則網絡）
      if (type === "regular") {
        for (let i = 0; i < N; i++)
          for (let j = 1; j <= k; j++)
            edges.push([i, (i + j) % N]);
      } else if (type === "small") {
        for (let i = 0; i < N; i++)
          for (let j = 1; j <= k; j++) {
            const a = i, b = (i + j) % N;
            // 機率 0.15 重新連到隨機節點
            if (Math.random() < 0.18) {
              let nb;
              do { nb = Math.floor(Math.random() * N); } while (nb === a);
              edges.push([a, nb]);
            } else {
              edges.push([a, b]);
            }
          }
      } else { // random
        const total = N * k; // 同樣 edge 數
        for (let m = 0; m < total; m++) {
          let a = Math.floor(Math.random() * N);
          let b;
          do { b = Math.floor(Math.random() * N); } while (b === a);
          edges.push([a, b]);
        }
      }
      return edges;
    }

    function render(type) {
      const edges = generate(type);
      let html = "";
      edges.forEach(([a, b]) => {
        html += `<line x1="${pts[a].x}" y1="${pts[a].y}" x2="${pts[b].x}" y2="${pts[b].y}" stroke="#3b82f6" stroke-width="1.4" opacity="0.6"/>`;
      });
      pts.forEach((p, i) => {
        html += `<circle cx="${p.x}" cy="${p.y}" r="7" fill="#1d4ed8" stroke="white" stroke-width="2"/>`;
      });
      svg.innerHTML = html;

      // 計算粗略的集群係數與平均路徑
      const adj = Array.from({ length: N }, () => new Set());
      edges.forEach(([a, b]) => { adj[a].add(b); adj[b].add(a); });
      // 集群
      let c = 0, cnt = 0;
      for (let i = 0; i < N; i++) {
        const neigh = [...adj[i]];
        if (neigh.length < 2) continue;
        let possible = neigh.length * (neigh.length - 1) / 2, actual = 0;
        for (let a = 0; a < neigh.length; a++)
          for (let b = a + 1; b < neigh.length; b++)
            if (adj[neigh[a]].has(neigh[b])) actual++;
        c += actual / possible;
        cnt++;
      }
      const clustering = (c / Math.max(1, cnt)).toFixed(2);

      // BFS 平均路徑
      let totalDist = 0, totalPairs = 0;
      for (let i = 0; i < N; i++) {
        const dist = Array(N).fill(-1);
        dist[i] = 0;
        const q = [i];
        while (q.length) {
          const u = q.shift();
          adj[u].forEach(v => {
            if (dist[v] === -1) { dist[v] = dist[u] + 1; q.push(v); }
          });
        }
        for (let j = 0; j < N; j++)
          if (j !== i && dist[j] > 0) { totalDist += dist[j]; totalPairs++; }
      }
      const avgPath = totalPairs ? (totalDist / totalPairs).toFixed(2) : "∞";

      const explain = {
        regular: "<strong>規則網絡：</strong>每個節點只連最近鄰，<u>集群係數高</u>但<u>平均路徑長</u>。資訊傳到對面要繞很久。",
        small:   "<strong>小世界網絡：</strong>大部份是近鄰連結 + 少數『捷徑』，<u>同時擁有高集群與短路徑</u>。<strong>大腦正是這種結構。</strong>",
        random:  "<strong>隨機網絡：</strong>連線隨機分佈，<u>集群係數低</u>，但<u>平均路徑短</u>。少了區域結構。",
      }[type];

      desc.innerHTML = `${explain}<br><br>
        <strong>集群係數 C ≈</strong> ${clustering}　|
        <strong>平均路徑長 L ≈</strong> ${avgPath}`;
    }

    document.querySelectorAll('input[name="net-type"]').forEach(r => {
      r.addEventListener("change", e => render(e.target.value));
    });
    render("regular");
  }
})();
