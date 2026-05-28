/* ============================================================
   Chapter 9 題庫 — Event-Related Brain Responses
   作者：葉欲禾 (Gary Yu-Ho YEH) ・ 鄭鈞 (Jacob Cheng)
   ============================================================ */
const QUESTIONS_CH09 = [
  {
    q: "EP 與 ERP 主要差別是？",
    options: [
      "完全相同，沒有差別",
      "ERP 通常涵蓋較長潛時、含認知成分；EP 較早期、含感覺成分",
      "EP 只在 fMRI 觀察",
      "ERP 不需任何刺激",
    ],
    answer: 1,
    explain: "EP（誘發電位）常指早期感覺成分（如 VEP P100）；ERP 更廣泛，包含晚期認知成分如 P300、N400。",
  },
  {
    q: "ERP 的振幅相對於背景 EEG 通常落在哪個範圍？",
    options: [
      "1–30 μV，比背景小，需要平均才看得到",
      "1 mV 以上",
      "大於 5 V",
      "永遠超過 100 μV",
    ],
    answer: 0,
    explain: "ERP 大約 1–30 μV，常被 50 μV 以上的背景 EEG 蓋住，因此傳統需要多次平均。",
  },
  {
    q: "下列何者是『內生 (endogenous)』ERP 成分？",
    options: [
      "P100",
      "N100",
      "P300",
      "刺激後 30 ms 的腦幹反應",
    ],
    answer: 2,
    explain: "P300 與認知歷程相關（注意、記憶更新），是內生成分；P100/N100 屬於外生，由刺激物理屬性決定。",
  },
  {
    q: "ERP 命名規則中，N400 的『N』與『400』分別代表什麼？",
    options: [
      "正極性 / 第 400 次試次",
      "負極性 / 約 400 ms 潛時",
      "正極性 / 400 Hz 頻率",
      "雜訊比 / 400 個樣本",
    ],
    answer: 1,
    explain: "字母 N = 負極性，數字 = 刺激後潛時 (ms)。N400 ≈ 400 ms 出現的負電位，與語意處理相關。",
  },
  {
    q: "MMN (Mismatch Negativity) 的關鍵特徵是？",
    options: [
      "需要受試者高度專注才能誘發",
      "對 standard 與 deviant 刺激的差異會自動偵測，受試者可不專心",
      "只在睡眠時出現",
      "潛時超過 1000 ms",
    ],
    answer: 1,
    explain: "MMN 由 Näätänen 1978 發現，屬前注意 (pre-attentive) 偵測：即使受試者在讀書，大腦仍會對偏異刺激自動產生 MMN。",
  },
  {
    q: "P3a 與 P3b 的主要差別是？",
    options: [
      "P3a 較早、額中央分布、由新奇刺激自動引發；P3b 較晚、頂葉分布、任務相關",
      "P3a 是負波、P3b 是正波",
      "P3a 只在睡眠出現",
      "兩者完全相同",
    ],
    answer: 0,
    explain: "P3a 短潛時、自動定向、額中央分布、衰減快；P3b 長潛時、任務相關、頂葉分布、衰減慢。",
  },
  {
    q: "Alzheimer's 患者的 flash VEP 最常見變化為？",
    options: [
      "P100 潛時延長 (~106 → ~135 ms) 並振幅變化",
      "完全消失",
      "潛時縮短一半",
      "振幅增加為原本的 10 倍",
    ],
    answer: 0,
    explain: "書本所述：AD 患者 flash VEP 的 P100 潛時延長、振幅可能變化；N130、P165、N220 也延長。",
  },
  {
    q: "下列何者『不』屬於 SSVEP 的特徵？",
    options: [
      "由 3.5–75 Hz 的固定頻率視覺刺激誘發",
      "大腦在刺激頻率（及諧波）產生穩定反應",
      "可用於 BCI 拼字器",
      "屬於 < 1 ms 的瞬態反應",
    ],
    answer: 3,
    explain: "SSVEP 是穩態 (steady-state) 反應，會持續產生與刺激頻率同步的振盪，不是瞬態。",
  },
  {
    q: "SSVEP-BCI 的選擇機制為何？",
    options: [
      "看哪個閃爍方塊讓 EEG 在該頻率能量最大",
      "看哪個按鈕被按下",
      "用眼動儀直接追眼球",
      "由 fMRI 偵測血氧",
    ],
    answer: 0,
    explain: "螢幕同時放多個不同頻率閃爍方塊。使用者注視哪一個，EEG 在該頻率（或諧波）的功率最強，由此判斷選擇。",
  },
  {
    q: "傳統平均法 (averaging) 抽取 ERP 的主要假設是？",
    options: [
      "ERP 完全相同，背景 EEG 為零均值雜訊",
      "ERP 隨機變化",
      "背景 EEG 為週期性訊號",
      "ERP 是負無限大",
    ],
    answer: 0,
    explain: "假設每次試次 ERP 相同（時間鎖定），背景 EEG 平均後互相抵消，留下 ERP。",
  },
  {
    q: "為何需要單試次 (single-trial) ERP 估計？",
    options: [
      "因為單試次比平均更安靜",
      "可追蹤試次間振幅、潛時變化（如疲勞、習慣化），並支援即時 BCI",
      "因為 fMRI 強制要求",
      "因為單試次不需要任何模型",
    ],
    answer: 1,
    explain: "平均會掩蓋試次間變異。單試次估計支援疲勞監測、即時 BCI 等應用。",
  },
  {
    q: "在 ERP 分析中，ICA 的常見用途是？",
    options: [
      "分離與背景 EEG / artefact 不同的 ERP 獨立成分",
      "把 ERP 變成正弦波",
      "計算 fMRI BOLD",
      "估計頭皮阻抗",
    ],
    answer: 0,
    explain: "ICA 假設 ERP 與 artefact (眼動、肌電) 為統計獨立成分，可分離出來。",
  },
  {
    q: "下列何者『不』是 ICA 在 EEG/ERP 應用上的限制？",
    options: [
      "最多只能分離 N 個源（N = 電極數）",
      "假設源在時間上獨立 — 短資料可能違反",
      "需要假設源空間分布固定",
      "ICA 不能處理任何雜訊",
    ],
    answer: 3,
    explain: "ICA 可在含雜訊資料運作；但前三項都是書中明列的真實限制。",
  },
  {
    q: "Kalman Filter 在 ERP 追蹤的優勢是？",
    options: [
      "比固定頻率帶通濾波更能處理非平穩的試次間變化",
      "完全不需要模型",
      "適用於非高斯且非線性系統",
      "比 Wiener 濾波更不需運算",
    ],
    answer: 0,
    explain: "Kalman 透過狀態空間模型動態追蹤緩變參數 (振幅/潛時)，比 Wiener 適合 ERP 的非平穩性。線性高斯假設下最優。",
  },
  {
    q: "當 ERP 模型為『非線性』時，下列何者最適合？",
    options: [
      "Wiener 濾波",
      "LMS",
      "Particle Filter",
      "簡單平均",
    ],
    answer: 2,
    explain: "Particle filter 用大量加權粒子近似後驗分布，可處理任意非線性與非高斯，適合 ERP 潛時/寬度等非線性參數。",
  },
  {
    q: "Rao-Blackwellised Particle Filter (RBPF) 的主要思想是？",
    options: [
      "把線性參數 (amplitude) 用 Kalman、非線性參數 (latency, width) 用 PF",
      "完全捨棄粒子",
      "只能用於 fMRI",
      "用 N⁴ 的粒子數",
    ],
    answer: 0,
    explain: "RBPF 結合 KF 與 PF：線性子問題用 KF 解、非線性子問題用 PF 解，效率比純 PF 高。",
  },
  {
    q: "變分貝氏 (Variational Bayes) 主要的最小化目標是？",
    options: [
      "KL 距離 KL(q‖p)，使近似分布 q 接近真實後驗 p",
      "歐氏距離",
      "頻率差",
      "電極阻抗",
    ],
    answer: 0,
    explain: "VB 用較簡單的可分解分布 q(θ)=Πq(θᵢ) 近似真正的後驗 p(θ|Y)，最小化 KL 距離。",
  },
  {
    q: "Adaptive Chirplet Transform (ACT) 使用幾個可調參數描述每個 chirplet？",
    options: [
      "1 個",
      "2 個",
      "4 個（時心、頻心、時寬、chirp rate）",
      "10 個",
    ],
    answer: 2,
    explain: "Chirplet 由高斯函數透過 scaling / chirping / time-shifting / frequency-shifting 形成，共 4 個可調參數。",
  },
  {
    q: "下列何者是 P300 Speller 的核心 paradigm？",
    options: [
      "Steady-state",
      "Oddball paradigm + row/column 閃爍偵測目標 P300",
      "Resting-state",
      "Photic driving",
    ],
    answer: 1,
    explain: "Farwell & Donchin (1988) 的 P300 speller：6×6 字母矩陣逐行逐列閃，目標字母列／行會引發 P300。",
  },
  {
    q: "下列何者描述了酒精依賴者的 ERP 變化？",
    options: [
      "P300 振幅顯著下降",
      "P300 振幅顯著增加",
      "N100 完全消失",
      "MMN 提前 1000 ms 出現",
    ],
    answer: 0,
    explain: "書本圖 9.2 顯示對照組與酒癮組平均 100 個受試者：酒精依賴者 P300 振幅明顯下降。",
  },
  {
    q: "MMN 振幅與『standard 跟 deviant 的差異程度』有何關係？",
    options: [
      "振幅成正比；潛時成反比",
      "振幅成反比；潛時成正比",
      "完全無關",
      "成立方關係",
    ],
    answer: 0,
    explain: "差異越大，MMN 振幅越大、潛時越短（大腦更快偵測到、反應更強）。",
  },
  {
    q: "下列關於 STFT 與 Wavelet 在 ERP 時頻分析的描述何者正確？",
    options: [
      "STFT 視窗長度固定；Wavelet 高頻短窗、低頻長窗",
      "Wavelet 完全沒有時間-頻率折衷限制",
      "STFT 比 Wavelet 更適合 ERP 短瞬態",
      "Wavelet 不需任何母小波",
    ],
    answer: 0,
    explain: "STFT 固定窗 → 解析度不變；Wavelet 對數採樣頻率，符合『高頻短時間、低頻長時間』的物理直覺。",
  },
  {
    q: "Prony 方法在 ERP 抽取中的主要假設是？",
    options: [
      "ERP 可表示為阻尼正弦的線性組合",
      "ERP 必為 delta 函數",
      "ERP 與雜訊互相關為無窮大",
      "ERP 頻率為 0",
    ],
    answer: 0,
    explain: "Prony 把訊號模型化為 Σ aᵢρᵢⁿ exp(jωᵢn) 的阻尼正弦展開，由極點位置推估頻率與衰減。",
  },
  {
    q: "Movement-Related Potential (MRP) 通常在運動執行前多久開始出現？",
    options: [
      "運動後 5 ms",
      "運動執行前約 1 秒，反映準備動作",
      "運動後 10 秒",
      "與運動無關",
    ],
    answer: 1,
    explain: "如 Bereitschaftspotential 等準備電位常在運動前 ~1 秒出現，反映運動意圖／規劃。",
  },
  {
    q: "下列何者『不』是 ERP 在 BCI 的常用訊號？",
    options: [
      "P300",
      "SSVEP",
      "Mu 與 Beta rhythm（運動想像）",
      "顱骨阻抗變化",
    ],
    answer: 3,
    explain: "BCI 常用 P300、SSVEP、Mu/Beta、N100/P200、SCP；顱骨阻抗變化不是腦電 BCI 的訊號來源。",
  },
  {
    q: "在 ERP 文獻中，CSD (Current Source Density) 圖相較於電位圖的優點是？",
    options: [
      "空間濾掉皮質遠端與深部活動，更反映表淺皮質源",
      "可看到深部腦幹活動",
      "完全不需電極",
      "等同 fMRI",
    ],
    answer: 0,
    explain: "CSD 透過拉普拉斯運算對空間做高通，把容積導體傳遞掉的遠端訊號濾除，留下表淺皮質源。",
  },
  {
    q: "下列何種狀況下 ICA 分離 ERP 訊號『可能會失敗』？",
    options: [
      "源完全獨立、雜訊低",
      "源高度相關（同步發放）或試次太少導致統計不充分",
      "電極數遠大於源數",
      "資料正規化過",
    ],
    answer: 1,
    explain: "ICA 假設源時間獨立。源高度相關（如同步發放的對稱腦區）會破壞獨立性；資料少也會導致統計不準。",
  },
];
window.QUESTIONS_CH09 = QUESTIONS_CH09;
