/* ============================================================
   Chapter 13 題庫 — EEG-Based Mental Fatigue Monitoring
   作者：葉欲禾 (Gary Yu-Ho YEH) ・ 鄭鈞 (Jacob Cheng)
   ============================================================ */
const QUESTIONS_CH13 = [
  {
    q: "下列何者最能描述『精神疲勞 (mental fatigue)』？",
    options: [
      "肌肉無法繼續正常功能",
      "腦活動下降、對外刺激反應變慢、認知效能變差的狀態",
      "完全失去意識",
      "心跳加快、血壓上升",
    ],
    answer: 1,
    explain: "Mental fatigue = 腦活動與對刺激反應力下降，可能伴隨 somnolence，也可能只是注意力降低；不一定要想睡。",
  },
  {
    q: "下列關於『physical fatigue』與『mental fatigue』的描述，何者正確？",
    options: [
      "兩者完全相同",
      "Physical fatigue 是肌肉問題；mental fatigue 是腦活動/認知問題",
      "Mental fatigue 一定伴隨想睡",
      "Physical fatigue 比 mental fatigue 更難量測",
    ],
    answer: 1,
    explain: "課本明確區分兩者；mental fatigue 可能伴隨嗜睡也可能只是注意力降低，不必然想睡。",
  },
  {
    q: "下列何者『不』屬於可能造成『暫時性』精神疲勞的因素？",
    options: ["時差", "睡眠不足", "長時間工作", "急性中風"],
    answer: 3,
    explain: "前三者皆為日常可逆的疲勞成因；急性中風是腦血管事件，屬神經內科急症而非單純疲勞。",
  },
  {
    q: "下列三種傳統 fatigue 評估法，何者主觀偏差最大？",
    options: [
      "EEG / ECG / EOG 等生理量測",
      "影片擷取臉部表情",
      "問卷自評 (psychometric)",
      "腦造影 fMRI",
    ],
    answer: 2,
    explain: "Psychometric 自評受心情、社會期待影響大；視訊 & 生理較客觀。",
  },
  {
    q: "下列哪一個比值在駕駛疲勞研究中最常被用作疲勞指標？",
    options: [
      "P_α / P_δ",
      "(P_θ + P_α) / (P_α + P_β)",
      "P_β / P_γ",
      "P_δ × P_γ",
    ],
    answer: 1,
    explain: "(θ+α)/(α+β) 是駕駛疲勞研究最常用的『單一數字』指標，疲勞時此比值上升。",
  },
  {
    q: "下列關於 θ、α、β 頻段的範圍何者『錯誤』？",
    options: [
      "θ：4–8 Hz",
      "α：8–13 Hz",
      "β：13–30 Hz",
      "γ：0.5–4 Hz",
    ],
    answer: 3,
    explain: "γ 通常 > 30 Hz；0.5–4 Hz 是 δ（delta）。",
  },
  {
    q: "Liu et al. 採用 KPCA + HMM + 複雜度特徵的方法，達到的 fatigue 分類準確率大約是？",
    options: ["50%", "65%", "84%", "100%"],
    answer: 2,
    explain: "課本：joint KPCA-HMM 方法準確率約 84%；也能顯著降維。",
  },
  {
    q: "下列何者描述 P300 在 mental fatigue 時的變化最正確？",
    options: [
      "振幅變大、延遲縮短",
      "振幅變小、延遲變長",
      "波形完全消失",
      "完全不變",
    ],
    answer: 1,
    explain: "疲勞 / 注意力下降時，P300 振幅↓ + 延遲↑ 是經典指標。",
  },
  {
    q: "P3a 與 P3b 的差別最接近下列哪一項？",
    options: [
      "P3a 對應預期目標、P3b 對應新奇刺激",
      "P3a 對應新奇 (novel) 刺激、自動轉向；P3b 對應預期目標、任務相關",
      "P3a 出現在 100 ms，P3b 出現在 500 ms",
      "兩者完全相同",
    ],
    answer: 1,
    explain: "P3a：前額/中央、對 novel 敏感、自動性；P3b：頂葉中央、對 target 敏感、與工作記憶投入相關。",
  },
  {
    q: "Spectral Coherence Value 公式 SCV(f) = |Sxy(f)|² / (Sxx(f)·Syy(f)) 量化的是？",
    options: [
      "單一通道的能量",
      "兩個通道在頻率 f 的線性相關強度",
      "EEG 的 DC 漂移",
      "ECG 的心跳率",
    ],
    answer: 1,
    explain: "SCV 是兩通道交叉譜密度 |Sxy|² 除以各自的譜密度，量化頻率 f 下的線性相關強度。",
  },
  {
    q: "下列哪一個『不是』量化 EEG 複雜度 / 不規則性的指標？",
    options: [
      "Approximate Entropy (ApEn)",
      "Kolmogorov complexity (Kc)",
      "Lempel-Ziv complexity (LZC)",
      "FFT 0 Hz 振幅",
    ],
    answer: 3,
    explain: "FFT 在 0 Hz 是 DC 分量，與複雜度無關；其他三者皆為公認的複雜度量。",
  },
  {
    q: "下列關於『跨受試者 (inter-subject) 變異』的解法，何者最常用？",
    options: [
      "忽略它",
      "用 transfer learning / domain adaptation 線上校準",
      "把所有人都當同一受試者建模",
      "改用 ECG 不用 EEG",
    ],
    answer: 1,
    explain: "Wu et al. (2017) 等以 fuzzy + 領域適應 + 正則化來解；近年 transfer learning 更是主流。",
  },
  {
    q: "Wang et al. 採用 PCANet 處理 32×20 的多通道 EEG，配合 SVM/KNN 分類疲勞，準確率達多少？",
    options: ["50%", "70%", "約 95%", "100%"],
    answer: 2,
    explain: "課本：PCANet 方案 claim up to 95% accuracy；並指出 parietal/occipital lobes 與疲勞相關。",
  },
  {
    q: "下列關於『深度學習方法』在 fatigue 偵測的描述，何者『錯誤』？",
    options: [
      "PCANet 可作為 EEG 特徵抽取器",
      "RFNN（遞迴模糊神經網路）能捕捉細微頻譜變化",
      "Bi-LSTM 可利用時序資訊",
      "深度學習絕不需要任何 EEG 預處理",
    ],
    answer: 3,
    explain: "即使深度學習很強，artefact、雜訊、跨日漂移仍需處理；眨眼/肌肉 artefact 處理通常仍不可少。",
  },
  {
    q: "下列哪一種腦區與 mental fatigue 的『效能監控』功能最相關？",
    options: [
      "枕葉視覺區",
      "anterior cingulate cortex (ACC) 與 striatum",
      "小腦",
      "腦幹延腦",
    ],
    answer: 1,
    explain: "Lorist et al.：mental fatigue 與 ACC + striatum 的多巴胺輸入下降相關；錯誤後的行為調整變差。",
  },
  {
    q: "下列何者『不』是 fatigue 監測在實務上的高風險應用？",
    options: ["長途駕駛", "飛行員", "ICU 醫護", "考古學田野紀錄"],
    answer: 3,
    explain: "考古學田野紀錄不屬於『需要持續長時間警覺 + 失誤代價極高』的場景。前三項皆為書中提到的典型應用。",
  },
  {
    q: "下列哪一個 ERP 元件反映『對偏離刺激的自動偵測』，與意識較無關？",
    options: ["P3a", "P3b", "MMN (Mismatch Negativity)", "N400"],
    answer: 2,
    explain: "MMN 是對 oddball 中偏離刺激的自動偵測波，可在不需注意的情況下出現；常用於昏迷/意識障礙評估。",
  },
  {
    q: "下列關於『EEG 頻段功率與疲勞』的描述何者最貼近 Craig et al. 結論？",
    options: [
      "單一頻段功率變化『非常顯著』、是最強指標",
      "單一頻段功率變化不大，但比值與其它特徵仍有用",
      "δ 是唯一可信指標",
      "γ 在所有受試者都同步上升",
    ],
    answer: 1,
    explain: "Craig et al.：傳統頻段功率變化不顯著；所以實務上常用比值、複雜度、ERP 等多元特徵。",
  },
  {
    q: "下列何者『不』屬於『連結性 (connectivity)』度量？",
    options: ["Coherence", "Phase Locking Value (PLV)", "Granger causality", "Sample variance"],
    answer: 3,
    explain: "Sample variance 只是單變量統計；其他三者皆為跨通道的連結性度量。",
  },
  {
    q: "下列關於『fatigue 與睡眠剝奪』的關係描述何者正確？",
    options: [
      "兩者完全無關",
      "睡眠不足會直接造成 mental fatigue，但 fatigue 不等於想睡",
      "Fatigue 完全等於睡眠剝奪",
      "Fatigue 只在白天發生，睡眠剝奪只在晚上發生",
    ],
    answer: 1,
    explain: "睡眠不足是 mental fatigue 的常見成因之一，但 mental fatigue 包含更廣（無聊、過久專注、單調環境也會）。",
  },
  {
    q: "若某受試者的 (θ+α)/(α+β) 比值在 60 分鐘內從 0.6 上升到 1.6，最合理的解讀是？",
    options: [
      "受試者越來越警覺",
      "受試者從 alert 漸進進入 fatigue 狀態",
      "EEG 訊號完全壞掉",
      "受試者開始做高強度運動",
    ],
    answer: 1,
    explain: "(θ+α)/(α+β) 上升代表 θ/α 占比相對上升或 β 占比下降，是典型 alert→fatigue 的演變。",
  },
  {
    q: "DSTCLN（Jeong et al.）是怎樣的網路？",
    options: [
      "純 MLP",
      "Deep Spatiotemporal CNN + Bi-LSTM 的組合",
      "純 RNN",
      "完全線性回歸",
    ],
    answer: 1,
    explain: "DSTCLN 用 CNN 抽空間-時間高階特徵，再以 Bi-LSTM 模型化長時依賴；用於 32 通道 EEG 偵測 2 類 / 5 類 drowsiness。",
  },
  {
    q: "下列對『drowsiness 與 fatigue』的關係描述何者最貼切？",
    options: [
      "兩者完全相同",
      "Drowsiness 偏向『想睡』；fatigue 包含 drowsiness 但也可能只是注意力降低",
      "Drowsiness 比 fatigue 更廣",
      "Fatigue 只在開車時出現",
    ],
    answer: 1,
    explain: "Drowsiness（嗜睡）是 fatigue 的一種表現；課本指出 mental fatigue 不必然伴隨想睡。",
  },
  {
    q: "下列關於『線上 fatigue 偵測』的描述，何者最不切實際？",
    options: [
      "需處理 artefact、即時運算",
      "可結合車輛環境特徵（道路、噪音）做 HMM 推估",
      "假設訓練資料與測試資料的分佈永遠一致",
      "需小量校準資料以適應新使用者",
    ],
    answer: 2,
    explain: "現實中 inter-subject 與 inter-day 差異大，分布不會一致；故 transfer learning / 線上校準是核心。",
  },
  {
    q: "下列哪一項是 fatigue 監測在『閉迴路』實務的可能應用？",
    options: [
      "車輛偵測到駕駛 fatigue 上升 → 震動方向盤 / 啟動自動駕駛",
      "讓駕駛永遠保持 fatigue 狀態",
      "完全關閉所有警告系統",
      "fatigue 越嚴重就讓駕駛繼續開",
    ],
    answer: 0,
    explain: "閉迴路系統的核心：偵測到 fatigue → 立即做出主動介入（警告、震動、接管）以避免事故。",
  },
];

window.QUESTIONS_CH13 = QUESTIONS_CH13;
