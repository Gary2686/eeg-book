/* ============================================================
   Chapter 12 題庫 — Sleep Recognition, Scoring, and Abnormalities
   作者：葉欲禾 (Gary Yu-Ho YEH) ・ 鄭鈞 (Jacob Cheng)
   ============================================================ */
const QUESTIONS_CH12 = [
  {
    q: "根據課本，一個完整的睡眠週期 (cycle) 大約持續多久？",
    options: ["10 分鐘", "30 分鐘", "90 分鐘 (一個半小時)", "4 小時"],
    answer: 2,
    explain: "從 Stage I 到 REM 結束一個 cycle 約 1.5 小時。整夜有 4–5 個 cycle。",
  },
  {
    q: "下列哪一個 stage『佔總睡眠時間最多』，約 40–50%？",
    options: ["N1 (淺眠)", "N2 (紡錘 + K)", "N3 (慢波)", "REM"],
    answer: 1,
    explain: "課本明確指出：Stage II (N2) 佔 40–50%；REM 佔 20–25%；N1 約 5–10%；N3+N4 合計 ~20%。",
  },
  {
    q: "下列何者是 N2 階段特有的『K-complex』描述？",
    options: [
      "11–15 Hz 的紡錘波",
      "一個 sharp negative spike + 一個 slow component 的複合波，常為對外刺激的反應",
      "0.5–4 Hz 的 delta 慢波",
      "與 REM 同步出現的快速眼動",
    ],
    answer: 1,
    explain: "K-complex 是 N2 的標誌：初始 sharp 負向波 + 接著的慢波，最大值在 vertex，常為孤立的或對外界刺激的反應。",
  },
  {
    q: "Sleep spindle（紡錘波）的典型頻率範圍與最小振幅大約為？",
    options: [
      "0.5–4 Hz、振幅 5 μV",
      "8–13 Hz、振幅 2 μV",
      "11–15 Hz、振幅約 15 μV",
      "30–80 Hz、振幅 1 μV",
    ],
    answer: 2,
    explain: "依 Malinowska et al. 列表：紡錘波 11–15 Hz、持續 0.5–2.5 s、最小振幅約 15 μV。",
  },
  {
    q: "下列關於 REM 期的描述何者『錯誤』？",
    options: [
      "EEG 與 wake 相似，呈低振幅快波",
      "眼球快速移動、心跳呼吸快而不規律",
      "大部分肌肉嚴重麻痺 (atonia)",
      "整夜 REM 都比 NREM 多",
    ],
    answer: 3,
    explain: "REM 約佔 20–25% 總睡眠；NREM 才佔大宗。其他三項都是 REM 的典型特徵。",
  },
  {
    q: "下列何者『不』屬於 NREM 期主要的 EEG 特徵？",
    options: [
      "Sleep spindle",
      "K-complex",
      "Delta 慢波",
      "Sawtooth waves（鋸齒波）",
    ],
    answer: 3,
    explain: "Sawtooth wave 是 REM 期的典型；NREM 標誌則是紡錘波、K-complex、delta。",
  },
  {
    q: "REM Sleep Behavior Disorder (RBD) 的核心特徵是？",
    options: [
      "整晚都在打鼾",
      "REM 期肌肉麻痺不完全或缺失，病人會『演夢』",
      "永遠睡不到 REM",
      "REM 期心跳停止",
    ],
    answer: 1,
    explain: "RBD 病人 REM 應有的 atonia 不全 → 病人會跟著夢境動作（喊叫、揮拳、跳下床）。",
  },
  {
    q: "下列關於褪黑激素 (melatonin) 的描述何者正確？",
    options: [
      "由腎臟分泌、白天分泌量最大",
      "由松果體分泌、夜間達峰",
      "由腦下垂體分泌、與睡眠無關",
      "由肝臟分泌、與光線無關",
    ],
    answer: 1,
    explain: "Melatonin 由松果體分泌、夜間達峰，是光線授時 (zeitgeber) 對生理時鐘調控的下游分子。",
  },
  {
    q: "下列何者最能描述生理時鐘 (circadian rhythm) 的核心調控腦區？",
    options: ["小腦", "下視丘 (hypothalamus)", "腦幹延腦", "海馬"],
    answer: 1,
    explain: "下視丘的 SCN（書中稱 hypothalamus 調控）是生理時鐘的核心起搏器；光線資訊由視網膜傳入並重置之。",
  },
  {
    q: "Polysomnography (PSG) 一般『不』包含下列哪一種訊號？",
    options: ["EEG (腦)", "EOG (眼動)", "EMG (肌肉)", "MRI 影像"],
    answer: 3,
    explain: "PSG 是 EEG + EOG + EMG + ECG + SpO₂ + 氣流/呼吸動作 + 打鼾等。MRI 影像不屬於 PSG。",
  },
  {
    q: "下列關於 OSA 與 CSA 的描述何者正確？",
    options: [
      "OSA = 中樞型；CSA = 阻塞型",
      "OSA = 阻塞型，上呼吸道堵塞；CSA = 中樞型，呼吸中樞失常",
      "兩者完全相同",
      "OSA 只發生於兒童，CSA 只發生於老人",
    ],
    answer: 1,
    explain: "OSA = Obstructive Sleep Apnea（呼吸道阻塞）；CSA = Central Sleep Apnea（中樞失調，肺與上呼吸道同時停止）。",
  },
  {
    q: "EEG 在睡眠呼吸中止症診斷的角色為何？",
    options: [
      "完全沒用",
      "可透過 C3 / C4 間的 coherence / mutual information 評估同步性，輔助分辨 OSA / CSA / 控制組",
      "只能看血氧",
      "EEG 只能用於兒童",
    ],
    answer: 1,
    explain: "研究顯示中央 C3-C4 同步性 (coherence、MI) 在 SAS 患者顯著不同；可與 SpO₂、打鼾聲結合做分類。",
  },
  {
    q: "Matching Pursuit (MP) 在睡眠 EEG 分析中的角色是？",
    options: [
      "計算心電圖 R-peak",
      "把訊號分解為一組 Gabor 原子，用時頻原子的位置/頻率/寬度描述 spindle 與 K-complex",
      "做 FFT 取代",
      "去除眨眼 artefact",
    ],
    answer: 1,
    explain: "MP 自適應分解到 Gabor 原子，每個 spindle 或 K-complex 對應時頻平面的一個 blob，方便偵測/分類。",
  },
  {
    q: "alpha-EEG anomaly 是哪一種疾病的常見現象？",
    options: ["OSA", "Fibromyalgia (纖維肌痛)", "Narcolepsy", "RBD"],
    answer: 1,
    explain: "FMS 病人 N3 深睡期會有 α 波入侵（本來應為 δ）— 稱 alpha-EEG anomaly，與睡眠後仍疲憊感相關。",
  },
  {
    q: "下列關於『睡眠剝奪』的描述何者正確？",
    options: [
      "對認知毫無影響",
      "連續清醒 24 小時後，前額葉與頂葉聯合區代謝顯著下降，判斷力變差",
      "睡眠剝奪會增強記憶力",
      "睡眠剝奪會降低心跳變異",
    ],
    answer: 1,
    explain: "課本：24 小時持續清醒後，prefrontal 與 parietal associational area 代謝下降；高層認知任務最先受影響。",
  },
  {
    q: "下列哪一階段最容易喚醒？",
    options: ["N1", "N2", "N3", "REM"],
    answer: 0,
    explain: "N1 是入睡的過渡，腦電仍接近 wake，最容易被喚醒。N3 反之最難。",
  },
  {
    q: "成人 EEG 中『閉眼時後腦明顯、張眼即消失』的節律是？",
    options: ["delta", "theta", "alpha (α 波)", "beta"],
    answer: 2,
    explain: "α 波 (8–13 Hz) 集中於 O1/O2，閉眼放鬆出現、張眼或專注被『阻斷』，是 wake 的典型節律。",
  },
  {
    q: "下列哪一個工具是『麻醉深度監測』中最常用、把 EEG 整合為 0–100 指標的？",
    options: ["BIS (雙頻譜指數)", "ECG R 波", "SpO₂", "EOG saccade"],
    answer: 0,
    explain: "BIS = Bispectral Index，整合時域、頻域、高階譜特徵；0 = flat EEG，100 = fully awake。",
  },
  {
    q: "下列關於『自動睡眠分期 (sleep scoring)』的描述何者『錯誤』？",
    options: [
      "通常以 20–30 秒為一個 epoch",
      "可結合 wavelet / matching pursuit 等時頻特徵",
      "Prochazka 等用 Decision Tree / NN 可達 85–97% 準確率",
      "目前已完美取代人工，無需專家審視",
    ],
    answer: 3,
    explain: "自動評分準確率雖高，但仍須專家覆核，特別是邊界 epoch；尚未『完美取代』人工。",
  },
  {
    q: "下列關於整夜 hypnogram 的描述何者正確？",
    options: [
      "REM 全部集中在前 30 分鐘",
      "N3 通常多在前半夜，REM 多在後半夜",
      "整夜一直保持在 N3",
      "REM 與 NREM 完全不會交替",
    ],
    answer: 1,
    explain: "前半夜以 SWS (N3) 為主，越往後 REM 段越長；第一段 REM 約 10 分鐘，最後一段可超過 60 分鐘。",
  },
  {
    q: "為什麼酒精雖然能助入睡，卻仍會影響睡眠品質？",
    options: [
      "酒精完全沒有影響",
      "酒精壓抑 REM、讓人停留在淺眠，整體更不深層",
      "酒精會延長 N3",
      "酒精會放大紡錘波振幅",
    ],
    answer: 1,
    explain: "課本：酒精助人入淺眠卻削減 REM；REM 不足會影響記憶鞏固與情緒調節。",
  },
  {
    q: "下列何者是 N1 期的常見 EEG 特徵？",
    options: [
      "K-complex",
      "θ (4–6 Hz) 出現、α 漸退、可能出現 vertex wave",
      "δ 慢波占主導",
      "大量紡錘波 11–15 Hz",
    ],
    answer: 1,
    explain: "N1 是 wake → sleep 的過渡：α 阻斷或漸退、θ (4–6 Hz) 漸增、晚期可見 vertex wave（parietal humps）。",
  },
  {
    q: "下列何者『不』屬於睡眠中常見可被 EEG/PSG 監測的障礙？",
    options: [
      "Sleep apnea",
      "Narcolepsy (猝睡症)",
      "Restless leg syndrome",
      "中風 (stroke) 的急性發作",
    ],
    answer: 3,
    explain: "急性中風是神經內科急症，靠 CT/MRI 與臨床評估；不是 PSG 監測的範疇。其他三項都是常見的睡眠障礙。",
  },
  {
    q: "下列關於睡眠中『大腦活動』的描述何者正確？",
    options: [
      "睡眠是完全被動的休息狀態",
      "睡眠是活躍的動態過程，REM 期腦代謝甚至上升約 20%",
      "睡眠中大腦完全關機",
      "睡眠時神經元都不放電",
    ],
    answer: 1,
    explain: "現代神經科學公認：睡眠是活躍動態過程；REM 期腦代謝可比 wake 高約 20%。並非被動關機。",
  },
  {
    q: "下列關於 N3/SWS 的描述何者正確？",
    options: [
      "完全沒有 delta 波",
      "若 epoch 中 SWA 佔 20–50% 為 N3、>50% 為 N4（合稱 SWS）",
      "N3 與 REM 完全相同",
      "N3 不會分泌生長激素",
    ],
    answer: 1,
    explain: "依 R&K 標準：SWA 佔 epoch 20–50% → N3；>50% → N4；現代 AASM 把 N3、N4 合稱 N3。生長激素主要在深睡分泌。",
  },
];

window.QUESTIONS_CH12 = QUESTIONS_CH12;
