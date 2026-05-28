/* ============================================================
   API stub — 預留串接後端資料庫的介面
   未來只需修改本檔，將 fetch URL 接到實際後端即可
   作者：葉欲禾 (Gary Yu-Ho YEH)
   ============================================================ */
(function (global) {
  "use strict";

  // 統一管理後端基礎位址；未來部署再修改
  const API_BASE = ""; // 例如 "https://your-domain.com/api"

  // 是否啟用後端（false 時所有呼叫只在前端 localStorage 紀錄）
  const USE_BACKEND = false;

  // 取得目前學生（暫時匿名，未來可串 SSO/登入系統）
  function getStudent() {
    let id = localStorage.getItem("eeg_student_id");
    if (!id) {
      id = "anon-" + Math.random().toString(36).slice(2, 10);
      localStorage.setItem("eeg_student_id", id);
    }
    return { id };
  }

  /**
   * 提交一份測驗結果。
   * @param {object} payload { chapterId, score, total, answers, durationMs }
   */
  async function submitQuizResult(payload) {
    const student = getStudent();
    const data = { ...payload, studentId: student.id, ts: Date.now() };

    // 一律寫入 localStorage（離線備援、提供未來同步）
    try {
      const key = "eeg_results";
      const arr = JSON.parse(localStorage.getItem(key) || "[]");
      arr.push(data);
      localStorage.setItem(key, JSON.stringify(arr));
    } catch (e) { /* ignore */ }

    if (!USE_BACKEND) return { ok: true, offline: true };

    try {
      const res = await fetch(`${API_BASE}/quiz/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (err) {
      console.warn("[API] submitQuizResult failed, fallback to local:", err);
      return { ok: false, offline: true, error: String(err) };
    }
  }

  /** 取得章節題庫；未啟用後端時由前端題庫接管。 */
  async function fetchQuestionBank(chapterId) {
    if (!USE_BACKEND) return null;
    try {
      const res = await fetch(`${API_BASE}/quiz/${chapterId}/bank`);
      return await res.json();
    } catch (err) {
      console.warn("[API] fetchQuestionBank failed:", err);
      return null;
    }
  }

  /** 記錄學習行為事件（章節停留、互動點擊等），方便未來分析。 */
  function logEvent(name, details = {}) {
    const ev = { name, details, ts: Date.now(), studentId: getStudent().id };
    try {
      const key = "eeg_events";
      const arr = JSON.parse(localStorage.getItem(key) || "[]");
      arr.push(ev);
      // 上限 200 筆，避免無限成長
      if (arr.length > 200) arr.splice(0, arr.length - 200);
      localStorage.setItem(key, JSON.stringify(arr));
    } catch (e) { /* ignore */ }

    if (USE_BACKEND) {
      fetch(`${API_BASE}/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ev),
      }).catch(() => {});
    }
  }

  global.EEG_API = { getStudent, submitQuizResult, fetchQuestionBank, logEvent };
})(window);
