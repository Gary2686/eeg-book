/* ============================================================
   Chapter 1 題庫 — Introduction to Electroencephalography
   作者：葉欲禾 (Gary Yu-Ho YEH) ・ 鄭鈞 (Jacob Cheng)
   題庫格式：
     { q: 題目, options: [...], answer: 正解索引(從0起), explain: 解析 }
   未來可改由後端 /quiz/ch01/bank 取回 JSON，僅需在 chapter01.html
   呼叫處改寫 bank 來源即可。
   ============================================================ */
const QUESTIONS_CH01 = [
  {
    q: "下列關於 EEG（腦電圖）的敘述，何者正確？",
    options: [
      "EEG 是直接測量神經元細胞內的電位",
      "EEG 是測量神經元放電在頭皮上產生的次級電場",
      "EEG 與 fMRI 一樣是測量血氧濃度",
      "EEG 訊號頻率通常高於 1 kHz",
    ],
    answer: 1,
    explain: "EEG 是『間接』量測皮質椎體神經元樹突上突觸電流形成的二次電場；訊號大多 < 100 Hz。fMRI 才是測血氧（BOLD），EEG 不是。",
  },
  {
    q: "與 MEG、fMRI 相比，EEG 最主要的優勢是什麼？",
    options: [
      "空間解析度最高",
      "可看到大腦深層活動細節",
      "成本低、可攜、時間解析度高",
      "不會受到頭皮與顱骨衰減影響",
    ],
    answer: 2,
    explain: "EEG 設備便宜、易攜帶，且具有毫秒級時間解析度。但其空間解析度差、訊號會被顱骨大幅衰減，深層活動更難偵測。",
  },
  {
    q: "誰被公認是第一位記錄到人類 EEG 訊號的人？",
    options: [
      "Richard Caton",
      "Hermann von Helmholtz",
      "Hans Berger",
      "Carlo Matteucci",
    ],
    answer: 2,
    explain: "Hans Berger 於 1924 年開始記錄，1929 年首次發表人類 EEG 紀錄（含 α 波）。Caton（1875）則是第一個記錄動物腦電活動的人。",
  },
  {
    q: "Richard Caton 在 1875 年的重要貢獻是什麼？",
    options: [
      "發明了第一台差動放大器",
      "首次紀錄到兔子與猴子大腦皮層的電活動",
      "首先提出 α 波",
      "提出突觸的概念",
    ],
    answer: 1,
    explain: "Caton 於 1875 年量測兔子與猴子皮層的電活動，確立大腦的電氣本質，並在人類頭皮上首次放置兩個電極記錄訊號，為後續 Berger 鋪路。",
  },
  {
    q: "下列何者『不是』神經元 (neuron) 的組成？",
    options: [
      "細胞體 (cell body / soma)",
      "軸突 (axon)",
      "樹突 (dendrite)",
      "粒線體膜 (mitochondrial membrane) 作為訊號傳遞主結構",
    ],
    answer: 3,
    explain: "神經元主要由細胞體、軸突、樹突組成。粒線體只是細胞器，不負責神經訊號的長距離傳遞。",
  },
  {
    q: "若一個 AP 抵達『興奮性突觸 (excitatory synapse)』時，下列何者最可能發生？",
    options: [
      "下游神經元產生 IPSP",
      "下游神經元產生 EPSP",
      "下游神經元立即進入過極化狀態",
      "下游神經元 K+ 通道大量打開",
    ],
    answer: 1,
    explain: "興奮性突觸→EPSP（去極化趨勢）；抑制性突觸→IPSP（過極化趨勢）。多個 EPSP 在閾值之上加總才會觸發新的 AP。",
  },
  {
    q: "EEG 訊號的頻率通常落在下列哪個範圍？",
    options: [
      "高於 1 kHz",
      "通常小於 100 Hz",
      "介於 500 Hz–1 kHz",
      "永遠介於 200–400 Hz",
    ],
    answer: 1,
    explain: "課文中提到 field potentials（EEG）一般 < 100 Hz；γ 波雖然較高但仍遠低於 1 kHz。",
  },
  {
    q: "下列關於『動作電位 (Action Potential)』敘述何者錯誤？",
    options: [
      "持續時間約 5–10 ms",
      "在去極化期 Na+ 通道大量開啟",
      "高於閾值才會觸發傳遞性 AP",
      "傳導速度通常低於 0.01 m/s",
    ],
    answer: 3,
    explain: "AP 傳導速度約 1–100 m/s（書本內容）。0.01 m/s 過慢，與實際情況不符。",
  },
  {
    q: "下列何者『不』屬於動作電位產生的順序步驟？",
    options: [
      "去極化 (Depolarization)",
      "再極化 (Repolarization)",
      "過極化 (Hyperpolarization)",
      "靜止電位提升至 +90 mV 並維持",
    ],
    answer: 3,
    explain: "AP 是『暫時性』膜電位變化；最終仍會由 Na+/K+ 幫浦把電位拉回約 -70 mV 的靜止值，不會停在 +90 mV。",
  },
  {
    q: "AP 發生後緊接著的『不反應期 (refractory period)』有何作用？",
    options: [
      "讓 AP 朝兩個方向同時傳遞",
      "確保訊號單向傳遞並避免立即再次觸發",
      "強迫 Na+ 通道一直打開",
      "讓細胞外鈣濃度暴增",
    ],
    answer: 1,
    explain: "過極化＋不反應期讓神經元無法立刻再被觸發，並阻止 AP 反向傳遞，確保訊號沿軸突單向行進。",
  },
  {
    q: "造成 EEG 訊號最主要的電活動來源是？",
    options: [
      "皮質椎體神經元 (pyramidal neurons) 樹突上的突觸電流",
      "肌肉收縮產生的電位",
      "心臟去極化",
      "顱骨內血流變化",
    ],
    answer: 0,
    explain: "EEG = 皮質椎體神經元 dendrites 上突觸電流加總、形成電偶極後在頭皮上量得的二次電場。",
  },
  {
    q: "頭部由外到內主要分為哪三大層？",
    options: [
      "頭皮、顱骨、腦",
      "髮、皮、肌",
      "皮質、髓質、丘腦",
      "硬腦膜、蜘蛛網膜、軟腦膜",
    ],
    answer: 0,
    explain: "課本提到頭部三大層為頭皮、顱骨、腦；其中顱骨對訊號衰減約為軟組織的 100 倍。",
  },
  {
    q: "為何頭皮量到的 EEG 振幅通常很小？",
    options: [
      "因為神經元只少量活化",
      "因為顱骨大約衰減訊號 100 倍，僅大量同步神經元才能被偵測",
      "因為訊號被血液完全屏蔽",
      "因為電極幾乎沒接觸到皮膚",
    ],
    answer: 1,
    explain: "顱骨衰減約 100 倍，只有大量同步活化的神經元產生的場電位才能被頭皮電極記錄下來，這也是 EEG 訊號需要放大的原因。",
  },
  {
    q: "從解剖學看，大腦 (brain) 由哪三部分組成？",
    options: [
      "大腦、小腦、腦幹",
      "額葉、頂葉、枕葉",
      "丘腦、下視丘、視丘",
      "皮質、髓質、海馬",
    ],
    answer: 0,
    explain: "解剖學上腦分為大腦 (cerebrum)、小腦 (cerebellum)、腦幹 (brain stem)；其中小腦負責協調動作、腦幹負責呼吸心跳等不自主功能。",
  },
  {
    q: "下列哪個離子流向開啟，是 AP 上升期 (depolarization) 的主因？",
    options: [
      "Cl- 從外流入",
      "K+ 從內流出",
      "Na+ 從外流入",
      "Ca2+ 從細胞核釋出",
    ],
    answer: 2,
    explain: "電壓門控 Na+ 通道開啟，Na+ 由細胞外大量湧入，使膜電位由 -70 mV 快速升至約 +30 mV，形成 spike。",
  },
  {
    q: "膜電位在 AP 結束後降到比靜止電位更低（約 -90 mV）的階段稱為？",
    options: [
      "去極化 Depolarization",
      "再極化 Repolarization",
      "過極化 Hyperpolarization",
      "重置 Reset",
    ],
    answer: 2,
    explain: "K+ 通道緩慢關閉造成電位短暫低於 -70 mV，稱為 hyperpolarization（過極化），對單向傳遞與不反應期極為重要。",
  },
  {
    q: "下列哪一個典型 AP 觸發閾值最接近書中描述？",
    options: [
      "約 -90 mV",
      "約 -55 mV",
      "約 +30 mV",
      "約 0 mV",
    ],
    answer: 1,
    explain: "課本提到：當膜內電位由 -70 mV 上升至約 -55 mV（閾值）時，更多電壓門控 Na+ 通道開啟，AP 才會發生。",
  },
  {
    q: "下列何種臨床應用『不』屬於 EEG 常見用途？",
    options: [
      "癲癇病灶定位",
      "睡眠分期",
      "麻醉深度監測",
      "測量血液葡萄糖濃度",
    ],
    answer: 3,
    explain: "葡萄糖濃度測量屬血液生化分析範疇，EEG 量測的是神經電活動，無法用於量血糖。",
  },
  {
    q: "依照課本內容，下列何者描述『腦作為網絡 (Brain as a Network)』的概念最貼切？",
    options: [
      "腦只是單一同步震盪的整體",
      "腦功能源自神經元間溝通與信號傳遞，可用圖論等方法分析其功能性連結",
      "腦的連結固定不變，與疾病無關",
      "EEG 振幅是評估腦網絡的唯一指標",
    ],
    answer: 1,
    explain: "課文強調 networking science 在神經科學的價值，並提到圖論在如 Alzheimer's disease 等疾病功能連結研究中的應用。",
  },
  {
    q: "成人大腦約有多少個突觸 (synapses)？（依課本估計）",
    options: [
      "10^4",
      "10^7",
      "10^11",
      "5 × 10^14",
    ],
    answer: 3,
    explain: "課本提到出生時約 10^11 神經元、平均每立方公釐 10^4 個；成人約有 5 × 10^14 個突觸。",
  },
  {
    q: "下列何者是『DC potentials』與 EEG 的主要差異？",
    options: [
      "DC potentials 是高頻訊號",
      "DC potentials 指訊號平均值的緩慢漂移；EEG 通常不含此緩漂",
      "DC potentials 是源自肌肉的雜訊",
      "DC potentials 永遠等於 EEG",
    ],
    answer: 1,
    explain: "課文：場電位若平均值幾乎不變稱 EEG；若出現緩慢漂移則為 DC potential，可能在如癲癇、缺氧等特殊狀況下與 EEG 同時出現。",
  },
  {
    q: "下列何者『不是』軸突 (axon) 的特徵？",
    options: [
      "通常為長條圓柱狀結構",
      "在人類體內最長可超過一公尺",
      "其長度可從零點幾公釐到數公尺",
      "其主要功能是合成蛋白質",
    ],
    answer: 3,
    explain: "蛋白質合成主要在細胞體 (soma)；軸突負責電脈衝的長距離傳遞，並有『分子馬達』沿微管運輸蛋白到末端。",
  },
  {
    q: "靜止膜電位 (resting membrane potential) 大約是？",
    options: [
      "+30 mV",
      "0 mV",
      "-60 ~ -70 mV",
      "-200 mV",
    ],
    answer: 2,
    explain: "課本明確提到細胞體膜下電位為負，介於 60–70 mV，極性為負（即 -60~-70 mV）。",
  },
  {
    q: "下列何者對 EEG 訊號最具直接貢獻？",
    options: [
      "神經元產生的 AP（單次脈衝）",
      "皮質椎體神經元的同步突觸後電位 (post-synaptic potentials) 累加",
      "頭皮上的汗腺活動",
      "腦脊髓液的流動",
    ],
    answer: 1,
    explain: "EEG 主要反映同步、垂直排列的椎體神經元突觸後電位的細胞外電流加總，而非單次的 AP（AP 太快、太局部，難在頭皮觀察到）。",
  },
  {
    q: "EEG 的『α 波 (alpha)』最早由誰所提出？",
    options: [
      "Hans Berger",
      "Richard Caton",
      "Hermann von Helmholtz",
      "W. Gray Walter",
    ],
    answer: 0,
    explain: "Berger 於 1929 年首次發表人類 EEG 紀錄並描述 α 波及『α 阻斷反應』。W. Gray Walter 之後則貢獻於 δ 波等研究。",
  },
];

// 暴露給全域，供 quiz-engine 使用
window.QUESTIONS_CH01 = QUESTIONS_CH01;
