/* ============================================================
   Chapter 17 題庫 — Brain–Computer Interfacing Using EEG
   作者：葉欲禾 (Gary Yu-Ho YEH) ・ 鄭鈞 (Jacob Cheng)
   ============================================================ */
const QUESTIONS_CH17 = [
  {
    q: "BCI（Brain-Computer Interface）的核心定義是？",
    options: [
      "用 ECG 直接控制電腦",
      "用大腦電活動繞過正常肌肉輸出，直接驅動外部裝置",
      "用視覺刺激誘發肌肉動作",
      "用語音辨識搭配 EEG 確認指令",
    ],
    answer: 1,
    explain: "BCI 是讓使用者『不靠正常肌肉輸出路徑』，僅用大腦電活動就能與外部設備溝通的介面。",
  },
  {
    q: "第一篇正式提出 BCI 概念的研究是？",
    options: [
      "Berger（1929）",
      "Vidal（1973–77）",
      "Caton（1875）",
      "Helmholtz（1849）",
    ],
    answer: 1,
    explain: "Vidal 在 1973–77 年發表了 BCI 的開創性研究；Berger 是首次紀錄人類 EEG（1929），Caton 是動物腦電（1875）。",
  },
  {
    q: "下列關於 BCI 三大分類的敘述何者正確？",
    options: [
      "Active = 系統給刺激；Reactive = 想像動作；Passive = 量態監測",
      "Active = 想像動作；Reactive = 系統給刺激量反應；Passive = 不需使用者意圖",
      "三類完全相同",
      "Active 與 Passive 都是 P300 系統",
    ],
    answer: 1,
    explain: "Active BCI 由使用者主動產生意念（如 motor imagery）；Reactive 用刺激誘發反應（P300、SSVEP）；Passive 在背景監測使用者狀態，不要求使用者輸入。",
  },
  {
    q: "ERD（Event-Related Desynchronization）指的是？",
    options: [
      "動作前後對側 μ 與 β 節律振幅暫時下降",
      "動作後 α 節律完全消失",
      "動作前出現大量高頻 γ 振盪",
      "ECG 與 EEG 出現同步漂移",
    ],
    answer: 0,
    explain: "ERD 是動作（或想像動作）前後對側 Rolandic 區 μ (8–13 Hz)、β (14–28 Hz) 節律短暫變弱的現象。",
  },
  {
    q: "ERS（Event-Related Synchronization）的典型出現時機是？",
    options: [
      "動作前 5 秒",
      "動作結束後（PMBS 約 16–26 Hz 持續 600 ms）",
      "睡眠中",
      "刺激出現前 1 秒",
    ],
    answer: 1,
    explain: "動作結束後出現 β 反彈強化（post-movement beta synchronization, PMBS），是 ERS 的典型例子。",
  },
  {
    q: "Readiness Potential（RP, Bereitschaftspotential）的特徵是？",
    options: [
      "比 α 波大 100 倍，單次記錄可見",
      "比 α 波小 10–100 倍，需對齊動作時間平均才看得到",
      "與動作完全無關",
      "只在睡眠中出現",
    ],
    answer: 1,
    explain: "RP 振幅很小（比 α 小 10–100 倍），需要對齊動作 onset 做平均才能浮現。由 Kornhuber & Deecke 於 1964 在 Freiburg 發現。",
  },
  {
    q: "下列哪個 paradigm 屬於『反應式 (reactive) + 不需訓練』的代表？",
    options: ["Motor Imagery", "SCP", "P300 speller / SSVEP", "Sleep spindle BCI"],
    answer: 2,
    explain: "P300 speller 與 SSVEP 都靠外部刺激誘發、使用者注視即可，幾乎不需訓練。",
  },
  {
    q: "P300 在 BCI 中通常出現在刺激後多久？",
    options: ["~30 ms", "~100 ms", "~300 ms", "~800 ms"],
    answer: 2,
    explain: "P300 是 odd-ball 範式中對稀有 / 目標刺激約 300 ms 後產生的正向波；P3b 子成分是 BCI 拼字器的主力。",
  },
  {
    q: "SSVEP 的電極通常放在？",
    options: ["額葉 Fp1, Fp2", "枕葉 Oz, O1, O2 等", "腦幹下端", "胸前"],
    answer: 1,
    explain: "SSVEP 是視覺穩態反應，最強訊號出現在枕葉視覺皮質，常用 Oz、O1、O2、PO 等電極。",
  },
  {
    q: "Motor Imagery (MI) BCI 主要量測的訊號是？",
    options: [
      "P300 振幅",
      "對側運動皮質的 μ/β ERD/ERS",
      "視覺穩態反應",
      "心跳速率",
    ],
    answer: 1,
    explain: "MI BCI 的核心訊號就是運動皮質（C3、C4、Cz）μ、β 的 ERD/ERS。",
  },
  {
    q: "在 BCI 的訊號處理流程中，CSP 屬於哪一階段？",
    options: ["感測階段", "預處理 / Artefact 去除", "特徵抽取 (空間濾波)", "視覺反饋"],
    answer: 2,
    explain: "CSP（Common Spatial Pattern）是空間濾波 / 特徵抽取階段的方法，把高維 EEG 投影到能凸顯類別差異的子空間。",
  },
  {
    q: "CSP 的數學目標是？",
    options: [
      "最大化兩類別變異數的『商』 J(w) = (wᵀC₁w) / (wᵀC₂w)",
      "最小化所有類別變異",
      "計算訊號的傅立葉變換",
      "估計時間延遲",
    ],
    answer: 0,
    explain: "CSP 求解 Rayleigh quotient 的極值；對應廣義特徵值問題 C₁w = λC₂w。",
  },
  {
    q: "為什麼 CSP 需要『正則化』？",
    options: [
      "CSP 容易過擬合，且對雜訊敏感",
      "CSP 計算過慢",
      "CSP 無法處理單通道",
      "CSP 沒有數學定義",
    ],
    answer: 0,
    explain: "CSP 容易過擬合（小樣本時更明顯）並對偶發大干擾敏感，因此 Tikhonov、composite、invariant 等正則化變形被廣泛使用。",
  },
  {
    q: "Lotte & Guan 比較 11 種正則化 CSP，性能最佳的是？",
    options: [
      "Composite CSP",
      "Weighted Tikhonov regularized CSP",
      "Random projection CSP",
      "Maximum entropy CSP",
    ],
    answer: 1,
    explain: "他們的實驗顯示 weighted Tikhonov 正則化 CSP 在 17 位患者上表現最好，平均提升 3–4%，中位數提升 ~10%。",
  },
  {
    q: "MI BCI 在 CSP 前通常做的 bandpass 範圍是？",
    options: ["0.1–1 Hz", "8–30 Hz", "60–120 Hz", "200–500 Hz"],
    answer: 1,
    explain: "MI BCI 把 EEG 帶通到 8–30 Hz（涵蓋 μ 與 β），這是 ERD/ERS 訊號的主要頻段。",
  },
  {
    q: "多類別 BCI 中採用『Riemannian Geometry』分類器的主要原因是？",
    options: [
      "共變異數矩陣是 SPD（對稱正定），住在彎曲流形上，黎曼距離比歐式距離更合理",
      "Riemannian 計算速度比 LDA 快 1000 倍",
      "Riemannian 不需要訓練資料",
      "Riemannian 比較簡單",
    ],
    answer: 0,
    explain: "EEG 共變異數矩陣是 SPD，落在彎曲流形上。直接用歐式距離會失真，黎曼距離更合適，所以在多類別 MI 上表現優於 LDA / 多類別 CSP。",
  },
  {
    q: "P300 speller 的工作原理是？",
    options: [
      "持續播放音樂，使用者哼唱",
      "閃爍字母網格的列與欄，使用者注視目標字母，列與欄交叉處誘發較大 P300",
      "用 SSVEP 30 個不同頻率的 LED",
      "EMG 直接控制鍵盤",
    ],
    answer: 1,
    explain: "P300 speller 用 6×6 字母網格逐列、逐欄高亮，使用者注視目標字母時對應的列/欄會誘發較大 P300，即可解碼。",
  },
  {
    q: "下列 SSVEP speller 的描述何者正確？",
    options: [
      "只能拼一個字元",
      "最快可達 9.39 字母/分鐘，平均正確率約 87.6%",
      "完全沒有實用價值",
      "需要植入電極",
    ],
    answer: 1,
    explain: "Hwang 等的 30-LED SSVEP QWERTY speller 達 9.39 letters/min，正確率 87.58%，ITR ~40.72 bits/min。新版 filter-bank CCA 可達 267–325 bpm。",
  },
  {
    q: "ITR（Information Transfer Rate）公式中，下列何者『不影響』ITR？",
    options: [
      "每分鐘 trial 數 m",
      "命令數 N",
      "分類正確率 P",
      "EEG 取樣率 fs",
    ],
    answer: 3,
    explain: "ITR = m·[log₂N + P·log₂P + (1-P)·log₂((1-P)/(N-1))]，只依 m、N、P。取樣率不直接影響 ITR。",
  },
  {
    q: "Hybrid BCI 結合 EEG 與其他模態（fNIRS / fMRI / MEG）的核心動機是？",
    options: [
      "降低設備成本",
      "互補時間與空間解析度，提升 BCI 表現",
      "完全取代 EEG",
      "減少使用者訓練時間到 0",
    ],
    answer: 1,
    explain: "EEG 高時間 / 低空間解析；fMRI 反之；fNIRS 中等；MEG 不受顱骨影響。結合後互補，可提升分類準確率與穩定度。",
  },
  {
    q: "EEG + fNIRS BCI 的常見任務組合是？",
    options: [
      "靜息態與睡眠",
      "心算 (Mental Arithmetic) 與字鏈 (Word Chain)，5 秒短 trial",
      "看電視 10 分鐘",
      "深蹲與跳躍",
    ],
    answer: 1,
    explain: "Khan 等用 MA（連續減法）與 WC（接龍）做 5 秒短 trial，配合 shrinkage LDA，準確率可達 80–90%。",
  },
  {
    q: "EEG + MEG 同步 BCI 的研究結論是？",
    options: [
      "MEG 完全取代 EEG",
      "整合後比單一模態效能更好，但 MEG 的便攜性是限制",
      "EEG 比 MEG 解析度高",
      "兩者完全無互補",
    ],
    answer: 1,
    explain: "整合 EEG 與 MEG 提升 MI BCI 表現；但 MEG 需磁屏蔽室、冷凍系統，便攜性差，限制實用化（光抽幫浦磁強計可能改變這現況）。",
  },
  {
    q: "下列何者『不是』MI BCI 的特性？",
    options: [
      "需要使用者訓練數天",
      "屬於 active BCI",
      "用視覺刺激固定頻率閃爍誘發",
      "對側運動皮質有 μ/β ERD",
    ],
    answer: 2,
    explain: "視覺刺激固定頻率閃爍是 SSVEP 的描述，不是 MI。MI 是主動想像動作。",
  },
  {
    q: "為什麼 SCP（Slow Cortical Potential）BCI 適合 locked-in 病人？",
    options: [
      "SCP 完全不用訓練",
      "病人可以學習自主調節 SCP，產生二元決策訊號",
      "SCP 是高頻 γ",
      "SCP 不需電極",
    ],
    answer: 1,
    explain: "TTD（Thought Translation Device）讓 locked-in 病人經訓練學會自主調節 SCP（持續數百 ms 至數秒），用以做二元選擇。",
  },
  {
    q: "在 BCI 系統評估時，下列何者『不是』常用的效能指標？",
    options: [
      "分類正確率",
      "ITR (bits/min)",
      "Kappa 統計量 / 混淆矩陣",
      "EEG 電極價格",
    ],
    answer: 3,
    explain: "BCI 效能指標包括正確率、ITR、Kappa、敏感度 / 特異度 等；電極價格不是效能指標。",
  },
  {
    q: "下列哪個是 ERP-based BCI 的主要缺點？",
    options: [
      "完全不能用",
      "使用者必須等待相關刺激出現才能下指令",
      "需要植入電極",
      "頻譜解析度太差",
    ],
    answer: 1,
    explain: "P300、SSVEP 等 ERP-based BCI 需依賴外部刺激，使用者必須等該刺激出現才能下指令，無法完全自由發起動作。",
  },
];
window.QUESTIONS_CH17 = QUESTIONS_CH17;
