/* ============================================================
   Chapter 14 題庫 — EEG-Based Emotion Recognition and Classification
   作者：葉欲禾 (Gary Yu-Ho YEH)
   ============================================================ */
const QUESTIONS_CH14 = [
  {
    q: "Ekman 提出的 6 種基本情緒『不』包含下列哪一個？",
    options: ["anger", "disgust", "fear", "boredom"],
    answer: 3,
    explain: "Ekman 6 種：anger、disgust、fear、joy、sadness、surprise；boredom 不在內。",
  },
  {
    q: "Russell 的 Circumplex Model of Affects 用哪兩個軸描述情緒？",
    options: [
      "Frequency × Amplitude",
      "Valence × Arousal",
      "Excitement × Boredom",
      "Pleasure × Wakefulness",
    ],
    answer: 1,
    explain: "二維框架：Valence（正負/愉悅度）× Arousal（激動程度）；幾乎所有情緒辨識資料庫都用這對軸。",
  },
  {
    q: "下列關於 emotion / mood / affect 的描述何者『錯誤』？",
    options: [
      "Emotion 較短暫、強烈，多有明確刺激",
      "Mood 較緩、較長期、背景式",
      "Affect 涵蓋 emotion 與 mood",
      "Mood 比 emotion 更短暫且強烈",
    ],
    answer: 3,
    explain: "Mood 比 emotion 更長期、更不易察覺、且強度較低。",
  },
  {
    q: "下列關於 valence model 與 direction model 對『anger』的預測差異？",
    options: [
      "兩者都預測 anger 活化右 PFC",
      "Valence model 預測右 PFC（負情緒）；Direction Model 預測左 PFC（接近型情緒）",
      "兩者都預測 anger 活化小腦",
      "兩者都沒有預測",
    ],
    answer: 1,
    explain: "Valence model：依正負給予 PFC 半球；Direction Model 看『趨/避』— anger 雖負但是『趨』，活化左 PFC，後續實驗較支持後者。",
  },
  {
    q: "杏仁體 (amygdala) 位於哪個大腦結構內？",
    options: [
      "枕葉外側",
      "顳葉深部 (deep within the temporal lobe)",
      "小腦",
      "額葉表面",
    ],
    answer: 1,
    explain: "杏仁體是顳葉深部的杏仁狀核團；是邊緣系統的關鍵，與恐懼、憤怒等情緒密切相關。",
  },
  {
    q: "下列哪一個 ERP 元件與『臉』本身最敏感、約在 170 ms？",
    options: ["P100", "N170", "LPP", "P3a"],
    answer: 1,
    explain: "N170 在側枕顳葉電極上，是『臉處理』的指標；快樂與恐懼臉的 N170 振幅大於中性。",
  },
  {
    q: "下列哪一個 ERP 元件對情緒『激動強度』最敏感、出現在約 400–600 ms？",
    options: ["P100", "N100", "LPP (Late Positive Potential)", "MMN"],
    answer: 2,
    explain: "LPP（又稱 LPC）在中央頂葉，越激動振幅越大；對情緒圖、單字、影片都有效。",
  },
  {
    q: "下列關於 EPN (Early Posterior Negativity) 的描述何者正確？",
    options: [
      "EPN 出現於 50 ms 內、額葉",
      "EPN 在 210–350 ms 顳枕區，情緒激發圖比中性大",
      "EPN 只對音樂敏感",
      "EPN 是 P 波次成分",
    ],
    answer: 1,
    explain: "EPN 是 emotional pictures vs neutral 的早期負向差異波，250–300 ms 顳枕區最明顯。",
  },
  {
    q: "下列關於『frontal alpha asymmetry (FAA)』的解讀，何者正確？",
    options: [
      "FAA 越正代表右 PFC 越活躍",
      "FAA = ln(α_F4) − ln(α_F3)；越正代表左 PFC 越活躍（偏正情緒/接近）",
      "α 越大代表該半球越活躍",
      "FAA 跟情緒完全無關",
    ],
    answer: 1,
    explain: "α 大 = 該腦區較不活躍（α 抑制反向解讀）；F4 的 α 大、F3 的 α 小 → 左 PFC 較活躍 → FAA 偏正 → 多與正向情緒/接近行為關聯。",
  },
  {
    q: "下列哪一個資料庫是 32 受試者、看 40 段音樂 MV、含 valence/arousal/dominance/liking 標註？",
    options: ["DEAP", "SEED", "ImageNet", "CHB-MIT"],
    answer: 0,
    explain: "DEAP (2012) = 32 受試者、32 通道 EEG + 周邊生理、40 段音樂 MV、四維情緒標註。",
  },
  {
    q: "下列關於 SEED 資料庫的描述何者正確？",
    options: [
      "由 MIT 發布，僅 8 通道",
      "由上海交大發布，62 通道、看正/負/中性影片，同受試者多日重測",
      "DEAP 與 SEED 是同一個資料庫",
      "SEED 只測腦磁圖 MEG",
    ],
    answer: 1,
    explain: "SEED 由 SJTU BCMI 實驗室發布，62 通道 EEG、3 類影片、跨日測，可研究情緒識別的穩定性。",
  },
  {
    q: "下列哪一項『不』屬於 EEG 情緒辨識的常用特徵？",
    options: [
      "PSD（θ/α/β/γ 頻段功率）",
      "Frontal alpha asymmetry",
      "Differential entropy (DE)",
      "fMRI BOLD 訊號",
    ],
    answer: 3,
    explain: "fMRI BOLD 不是 EEG 特徵；其他三項都是 EEG-based emotion 辨識的常用特徵。",
  },
  {
    q: "下列『跨受試者泛化 (cross-subject)』在情緒辨識的主要挑戰是？",
    options: [
      "每個人的 EEG 特徵分布相同，沒有問題",
      "每個人的 EEG 特徵分布差異大，新受試者上模型表現會退化",
      "EEG 取樣率太低",
      "情緒只有一種，分類太容易",
    ],
    answer: 1,
    explain: "Inter-subject variability 是 EEG 情緒辨識最大挑戰；常用 domain adaptation、transfer learning、adversarial training 緩解。",
  },
  {
    q: "Zheng et al. 觀察到『負情緒』時，哪些頻段在哪些區域顯著上升？",
    options: [
      "頂枕 α + 中央 β",
      "頂枕 δ + 額葉 γ",
      "枕葉 γ + 顳葉 α",
      "中央 δ + 顳葉 θ",
    ],
    answer: 1,
    explain: "Zheng et al.：負情緒在頂枕區 δ 與前額 γ 顯著上升；正情緒則側顳葉 β γ 上升。",
  },
  {
    q: "下列關於『情感運算 (affective computing, AfC)』的描述何者正確？",
    options: [
      "由 Rosalind Picard 在 1995/97 提出",
      "是一門純粹的心理學",
      "與 EEG 完全無關",
      "只關心硬體加速",
    ],
    answer: 0,
    explain: "AfC 由 Rosalind Picard 1995 年論文 + 1997 年書籍發起，跨心理學、計算機科學、生醫工程。",
  },
  {
    q: "下列哪一個關鍵腦區與『接近型 / 趨向型』情緒的左 PFC 偏側化『最相關』？",
    options: [
      "小腦",
      "前額葉皮質 (PFC)",
      "視交叉",
      "脊髓",
    ],
    answer: 1,
    explain: "PFC（前額葉皮質）是情緒評估與控制的核心；左 PFC 與接近型/正情緒、右 PFC 與迴避型/負情緒相關（valence + direction model）。",
  },
  {
    q: "P300 的 P3a 與 P3b 在『情緒處理』上的差別最接近？",
    options: [
      "兩者完全相同",
      "P3a 對 novel 刺激敏感（自動轉向）、P3b 對 target 敏感（任務驅動）",
      "P3a 是負波、P3b 是正波",
      "P3a 出現在 50 ms、P3b 出現在 600 ms",
    ],
    answer: 1,
    explain: "P3a 在前額/中央、對 novel 反應；P3b 在頂葉中央、與工作記憶投入相關。angry 臉 P3a 較小、P3b 較大。",
  },
  {
    q: "下列何者『不』是常見的『跨受試者泛化』解法？",
    options: [
      "Domain adaptation",
      "Transfer learning（少量校準微調）",
      "Adversarial training（學『無法判斷受試者』的特徵）",
      "讓所有人都用相同的 EEG 模板",
    ],
    answer: 3,
    explain: "強迫所有人用相同模板會忽略個體差異、降低準確率；前三者皆是常見有效的方法。",
  },
  {
    q: "下列關於『慢性疼痛』的 EEG 特徵描述何者正確？",
    options: [
      "δ 完全消失",
      "θ 振盪顯著上升，額區 β/γ 異常",
      "α 上升至最大",
      "完全沒有任何節律變化",
    ],
    answer: 1,
    explain: "課本：chronic pain 最被注意到的是 θ 振盪顯著上升；側面抑制下降可能也造成異常 γ。",
  },
  {
    q: "下列哪一項是『VR 用於情緒誘發』的優勢？",
    options: [
      "永遠比真實場景更安全",
      "提供強烈沉浸感、可控制變數、便於同步 EEG 紀錄",
      "可以取代所有臨床診斷",
      "不需要任何感測器",
    ],
    answer: 1,
    explain: "VR HMD 隔離外界刺激、可重現實驗條件、誘發強度高，且能與 EEG 同步記錄，是新興的 affective research 平台。",
  },
  {
    q: "Lateral temporal areas 在 EEG 上對正情緒和負情緒的反應差異是？",
    options: [
      "兩者完全相同",
      "正情緒時 β、γ 顯著高於負情緒",
      "負情緒時 β、γ 顯著高於正情緒",
      "兩者都沒有節律變化",
    ],
    answer: 1,
    explain: "Zheng et al. 觀察：正情緒在側顳葉 β / γ 上升；負情緒在頂枕 δ + 額 γ 上升。",
  },
  {
    q: "下列關於『多模態情緒辨識』的描述何者『錯誤』？",
    options: [
      "可結合 EEG、ECG、GSR、呼吸、臉部表情",
      "通常比單模態更穩健",
      "EEG 是唯一能直接觀察腦活動的工具",
      "多模態一定比單模態便宜",
    ],
    answer: 3,
    explain: "多模態硬體成本更高、整合分析也更複雜；前三項描述皆正確。",
  },
  {
    q: "下列哪一個情緒『最有可能』位於 Valence-Arousal 平面的「正 valence + 低 arousal」象限？",
    options: ["Excited", "Angry", "Calm (平靜)", "Fear"],
    answer: 2,
    explain: "Calm = 正 valence + 低 arousal；excited 是高 arousal 的正；angry/fear 都在負 valence。",
  },
  {
    q: "下列關於 ASD/ADHD 兒童使用情緒/生理偵測器的描述何者最正確？",
    options: [
      "完全沒幫助",
      "可協助大人理解兒童內在實際情緒/激動程度，避免誤判為『無故攻擊』",
      "只能拿來懲罰兒童",
      "可以取代所有教育",
    ],
    answer: 1,
    explain: "課本提出 ASD 兒童表面冷靜但心率可能已超過 120 bpm；客觀生理偵測幫助大人理解真實情緒狀態。",
  },
  {
    q: "下列何者最能描述『情緒對記憶的 subsequent memory effect』？",
    options: [
      "情緒刺激比中性刺激不易被記住",
      "情緒刺激（正/負）比中性刺激更容易被編碼進記憶",
      "只有負情緒會影響記憶",
      "情緒與記憶完全無關",
    ],
    answer: 1,
    explain: "課本綜整 ERP 研究：emotional 刺激比 neutral 更早出現 subsequent memory effect → 更佳的編碼資源，是情緒『放大記憶』的證據。",
  },
];

window.QUESTIONS_CH14 = QUESTIONS_CH14;
