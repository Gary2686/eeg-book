/* ============================================================
   通用 Quiz 引擎 — 適用於所有章節
   呼叫範例：
     EEGQuiz.init({
       mount: "#quiz-host",
       chapterId: "ch01",
       bank: QUESTIONS_CH01,
       count: 10,
     });
   作者：葉欲禾 (Gary Yu-Ho YEH)
   ============================================================ */
(function (global) {
  "use strict";

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  function gradeText(pct) {
    if (pct >= 90) return "🏆 神乎其技！你已掌握本章核心。";
    if (pct >= 80) return "🎉 表現優異！細節再加強就完美了。";
    if (pct >= 70) return "👍 不錯！再複習幾個概念可以更穩。";
    if (pct >= 60) return "📚 及格了。建議回頭看錯題對應段落。";
    return "💪 別氣餒，重新讀過本章再來挑戰一次！";
  }

  /**
   * 初始化測驗
   * @param {object} opts
   *   mount     : CSS selector，要掛載的容器
   *   chapterId : 字串，例如 "ch01"
   *   bank      : 題目陣列，每題格式：
   *               { q: "題目", options: ["A","B","C","D"], answer: 0, explain: "..." }
   *   count     : 抽幾題（預設 10）
   *   title     : 標題（預設「章節練習」）
   */
  function init(opts) {
    const host = document.querySelector(opts.mount);
    if (!host) { console.error("[Quiz] mount not found:", opts.mount); return; }

    const count = opts.count || 10;
    const chapterId = opts.chapterId || "unknown";
    const title = opts.title || "章節練習 10 題";
    let questions = [];
    const startedAt = Date.now();

    function render() {
      questions = shuffle(opts.bank).slice(0, count).map(q => ({
        ...q,
        // 將每題的選項順序也隨機，並重新計算答案 index
        _shuffled: (function () {
          const idx = q.options.map((_, i) => i);
          const sh = shuffle(idx);
          return {
            options: sh.map(i => q.options[i]),
            answer: sh.indexOf(q.answer),
          };
        })(),
      }));

      host.innerHTML = `
        <div class="quiz" id="quiz-root">
          <h2>📝 ${escapeHTML(title)}</h2>
          <p>本練習自題庫隨機抽出 ${count} 題，每次刷新題目順序與選項皆不同。完成後點「批改」可立即看到成績與解析。</p>
          <div class="quiz-meta">
            <span class="quiz-progress" id="quiz-progress">已作答 0 / ${count}</span>
            <div>
              <button class="btn secondary" id="quiz-reshuffle">🔀 重抽題目</button>
              <button class="btn success" id="quiz-grade">✅ 批改</button>
            </div>
          </div>
          <div id="quiz-questions"></div>
          <div class="quiz-result" id="quiz-result"></div>
        </div>
      `;

      const qhost = host.querySelector("#quiz-questions");
      qhost.innerHTML = questions.map((qq, i) => {
        const opts = qq._shuffled.options.map((o, oi) => `
          <label class="quiz-option" data-q="${i}" data-opt="${oi}">
            <input type="radio" name="q-${i}" value="${oi}">
            <span>${String.fromCharCode(65 + oi)}. ${escapeHTML(o)}</span>
          </label>`).join("");
        return `
          <div class="quiz-question" id="qq-${i}">
            <div class="q-num">第 ${i + 1} 題</div>
            <div class="q-text">${escapeHTML(qq.q)}</div>
            <div class="quiz-options">${opts}</div>
            <div class="quiz-explain"><strong>解析：</strong><span class="explain-text"></span></div>
          </div>`;
      }).join("");

      // 監聽選擇變化
      qhost.querySelectorAll(".quiz-option").forEach(label => {
        label.addEventListener("click", () => {
          const qi = +label.dataset.q;
          // 在同題中清除其他樣式
          qhost.querySelectorAll(`.quiz-option[data-q="${qi}"]`).forEach(el => el.classList.remove("selected"));
          label.classList.add("selected");
          updateProgress();
        });
      });

      host.querySelector("#quiz-reshuffle").addEventListener("click", () => {
        if (confirm("確定重新抽題？目前作答將清空。")) render();
      });
      host.querySelector("#quiz-grade").addEventListener("click", grade);
    }

    function updateProgress() {
      const done = host.querySelectorAll(".quiz-option.selected").length;
      const el = host.querySelector("#quiz-progress");
      if (el) el.textContent = `已作答 ${done} / ${count}`;
    }

    function grade() {
      let correct = 0;
      const answers = [];
      questions.forEach((qq, i) => {
        const qEl = host.querySelector(`#qq-${i}`);
        qEl.classList.add("graded");
        const picked = qEl.querySelector(".quiz-option.selected");
        const pickedIdx = picked ? +picked.dataset.opt : -1;
        const correctIdx = qq._shuffled.answer;
        answers.push({ q: qq.q, picked: pickedIdx, correct: correctIdx });

        qEl.querySelectorAll(".quiz-option").forEach(el => {
          const oi = +el.dataset.opt;
          if (oi === correctIdx) el.classList.add("correct");
          else if (oi === pickedIdx) el.classList.add("wrong");
        });
        qEl.querySelector(".explain-text").textContent = qq.explain || "（本題無額外解析）";
        if (pickedIdx === correctIdx) correct++;
      });

      const total = questions.length;
      const pct = Math.round((correct / total) * 100);
      const dur = Date.now() - startedAt;
      const r = host.querySelector("#quiz-result");
      r.classList.add("show");
      r.innerHTML = `
        <div style="font-size:14px;color:#6b7280;">本次成績</div>
        <div class="score">${correct} / ${total}</div>
        <div class="grade">${pct} 分　${gradeText(pct)}</div>
        <div style="margin-top:10px;font-size:13px;color:#9ca3af;">作答時長 ${Math.round(dur / 1000)} 秒</div>
      `;
      r.scrollIntoView({ behavior: "smooth", block: "center" });

      // 串接後端（若 USE_BACKEND=true 時自動送出；否則只存 localStorage）
      if (global.EEG_API) {
        global.EEG_API.submitQuizResult({
          chapterId, score: correct, total, answers, durationMs: dur,
        });
        global.EEG_API.logEvent("quiz_completed", { chapterId, score: correct, total });
      }
    }

    render();
  }

  global.EEGQuiz = { init };
})(window);
