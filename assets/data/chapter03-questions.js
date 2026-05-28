/* ============================================================
   Chapter 3 題庫 — EEG Signal Modelling
   作者：葉欲禾 (Gary Yu-Ho YEH)
   ============================================================ */
const QUESTIONS_CH03 = [
  {
    q: "EEG 訊號建模可以從三個角度切入，下列何者『不是』本章描述的三條軸？",
    options: [
      "由下而上：生理（離子通道→神經元→群體）",
      "由上而下：直接用統計訊號處理刻劃 EEG",
      "硬體實作：把方程式變成電子電路",
      "由內而外：用 MRI 影像對 EEG 進行三維重建"
    ],
    answer: 3,
    explain: "本章的三條軸是生理模型、資料模型、電子電路模型；MRI 重建不在第 3 章建模架構之內。",
  },
  {
    q: "Hodgkin–Huxley 模型的『四條 ODE』描述了什麼？",
    options: [
      "膜電位 + Na 活化 m + Na 不活化 h + K 活化 n",
      "心律、肌電、眼電、皮電",
      "α、β、δ、θ 四個節律振幅",
      "AR(1)、AR(2)、AR(3)、AR(4) 四個階數"
    ],
    answer: 0,
    explain: "HH 模型由四條 ODE 描述膜電位 E(t) 與三個閘門變數 m、h、n 的時間演化。",
  },
  {
    q: "下列何者『不是』Hodgkin–Huxley 模型的離子電流組成？",
    options: ["I_Na", "I_K", "I_leak", "I_Cl"],
    answer: 3,
    explain: "HH 把總膜電流寫為 I_memb = Cm·dE/dt + I_Na + I_K + I_leak，沒有獨立的 Cl⁻ 電流項。",
  },
  {
    q: "在 HH 模型中，I_Na 的時序與 I_K 的時序，哪一個敘述正確？",
    options: [
      "兩者同時開啟、同時關閉",
      "Na⁺ 快開快關，K⁺ 緩慢開、緩慢關",
      "K⁺ 比 Na⁺ 快",
      "兩者皆與電壓無關"
    ],
    answer: 1,
    explain: "Na⁺ 通道快速活化、又被 h 變數快速關閉；K⁺ 通道則由 n 緩慢活化、緩慢去活化。這個時序差就是 AP 形狀的關鍵。",
  },
  {
    q: "Morris–Lecar 模型相對於 Hodgkin–Huxley 模型的最大特點是？",
    options: [
      "更複雜，使用 8 條 ODE",
      "用 Ca²⁺ + K⁺ 兩條電流、兩個變數的簡化版",
      "完全只有線性微分方程式",
      "不能描述爆發 (bursting) 行為"
    ],
    answer: 1,
    explain: "Morris-Lecar 模型把 HH 簡化為以 Ca²⁺ + K⁺ + leak 三電流、E 與 wₖ 兩個變數的方程組；改變參數後可呈現 bursting。",
  },
  {
    q: "Integrate-and-Fire 模型的本質是？",
    options: [
      "用詳細離子通道方程式描述每個 AP 形狀",
      "把神經元視為『累積輸入、達到閾值就 fire 並重置』的單元",
      "用 MRI 影像直接擬合",
      "假設神經元永遠不重置"
    ],
    answer: 1,
    explain: "IF 模型把神經元簡化為帶閾值的累加器，省略 AP 形狀，計算極快，適合構建大型神經網路。",
  },
  {
    q: "在 Phase-Coupled (WCO) 模型中，主要追蹤的是什麼？",
    options: [
      "每個神經元的精確膜電位",
      "腦區振盪器的相位 (phase) 與相位差",
      "EEG 振幅的絕對值",
      "電極間阻抗"
    ],
    answer: 1,
    explain: "Weakly Coupled Oscillator 模型專注追蹤腦區振盪器之間的相位與相位差，是研究腦區同步、用 DCM 推因果結構的基礎。",
  },
  {
    q: "下列哪個模型由 Lopes da Silva 等人提出，含『興奮性 + 抑制性』兩族群與回饋環，可生成 EEG α 節律？",
    options: ["GARCH", "Local EEG Model (LEM)", "Prony", "GMM"],
    answer: 1,
    explain: "LEM 把神經元分成興奮、抑制兩族群，互相回饋，輸入白雜訊就能輸出類 EEG 訊號，是早期 α 節律建模的代表。",
  },
  {
    q: "EEG 群體模型常用『兩條指數差』描述什麼？",
    options: ["AR 模型的階數", "突觸後電位 (PSP) hₑ(t)、hᵢ(t)", "K-complex 形狀", "電極阻抗"],
    answer: 1,
    explain: "課文：hₑ(t) = A·[exp(-a₁t) − exp(-a₂t)]、hᵢ(t) 同形式，用兩條指數差來模擬興奮/抑制突觸後電位。",
  },
  {
    q: "AR 模型 y[n] = − Σ aₖ y[n−k] + x[n] 中，x[n] 通常被假設為什麼？",
    options: [
      "週期性正弦訊號",
      "零均值白雜訊",
      "其他神經元的 AP",
      "電極阻抗"
    ],
    answer: 1,
    explain: "AR 模型的驅動訊號通常假設為零均值白雜訊；對應地，模型的輸出反映系統的頻譜特性。",
  },
  {
    q: "決定 AR/ARMA 模型階數最常用的準則是？",
    options: ["Akaike 資訊準則 (AIC)", "Nyquist 準則", "Faraday 定律", "Heisenberg 準則"],
    answer: 0,
    explain: "課文：AIC(p,q) = ln σ² + 2(p+q)/N，藉由最大化對數似然 (相當於最小化 AIC) 來自動選擇 AR/ARMA 階數。",
  },
  {
    q: "MVAR 模型相比 AR 模型的主要不同是？",
    options: [
      "處理多通道資料，每通道也用其他通道過去樣本預測自己",
      "只能處理單一通道",
      "完全不需估計係數",
      "輸出是 fMRI 影像"
    ],
    answer: 0,
    explain: "MVAR 是多變量 AR，每通道由所有通道的過去樣本共同預測；可衍生 DTF 量化 EEG 訊號傳遞方向。",
  },
  {
    q: "Prony's Method 把訊號模型為什麼形式？",
    options: [
      "高斯混合疊加",
      "阻尼正弦的加權和（從 AR 極點讀頻率與阻尼）",
      "傅立葉級數",
      "矩形脈衝串"
    ],
    answer: 1,
    explain: "Prony 用 AR 模型求極點，極點的 z-平面角度給出頻率、半徑給出阻尼，能把訊號展開為阻尼正弦的和，常用於 EP 建模。",
  },
  {
    q: "對於有色 (非白) 雜訊污染的訊號，Prony's method 的表現會？",
    options: [
      "完全不受影響",
      "可能不夠成功，因為雜訊資訊不易與訊號分離",
      "比白雜訊還更準",
      "自動降為傅立葉轉換"
    ],
    answer: 1,
    explain: "課文指出：當訊號被白雜訊污染時 Prony 表現尚可；非白雜訊則難以與訊號分離，表現會下降。",
  },
  {
    q: "GARCH 模型最早是為了解決什麼問題？",
    options: [
      "心電圖診斷",
      "金融時間序列的時變波動率 (volatility) 預測",
      "fMRI 影像分割",
      "電極阻抗校正"
    ],
    answer: 1,
    explain: "GARCH 由 Engle 提出，原本用於財金時變波動率，獲 2003 諾貝爾經濟學獎，後被引入訊號處理用以建模非線性變異。",
  },
  {
    q: "下列何者是 GARCH 家族的延伸，能處理『正/負衝擊不對稱』與『銳尖過渡』？",
    options: [
      "EGARCH / GJR-GARCH / TGARCH 等",
      "FIR / IIR 濾波器",
      "PCA / ICA",
      "Wavelet / Wigner-Ville"
    ],
    answer: 0,
    explain: "EGARCH、GJR-GARCH、TGARCH、APGARCH、QGARCH 等是 GARCH 家族延伸，用不同形式的 g(.)、h(.) 處理不對稱與銳尖過渡。",
  },
  {
    q: "Gaussian Mixture Model (GMM) 的核心想法是？",
    options: [
      "把 EEG 寫成傅立葉級數",
      "用一群不同均值、不同變異的高斯加權疊加去逼近資料分布",
      "把 EEG 視為 AR(1) 過程",
      "只用單一高斯描述分布"
    ],
    answer: 1,
    explain: "GMM：p(x|θ) = Σ wₖ·𝒩(x; μₖ, σₖ)。用一群高斯加權疊加去逼近任意多峰分布。",
  },
  {
    q: "估計 GMM 參數最常用的演算法是？",
    options: ["EM (Expectation-Maximization)", "LMS", "FFT", "Kalman Filter"],
    answer: 0,
    explain: "GMM 一般用 EM 演算法迭代估計權重、均值、變異。樣本太少、有重複資料或秩缺乏時可能出現變異塌縮，需要正則化。",
  },
  {
    q: "下列何種訊號『不是』課文提到 GMM 適合建模的對象？",
    options: ["EEG", "EOG", "EMG / ECG", "光纖通訊訊號"],
    answer: 3,
    explain: "課文提到 GMM 可建模 EEG、EOG、EMG、ECG 等生理訊號，也用於 MRI 腦影像分割。光纖通訊不在範疇。",
  },
  {
    q: "Lewis 電子膜模型的設計思想是？",
    options: [
      "用主動濾波器實現 Na、K 電導，並把生物膜電壓乘 100 對應到電子電路範圍",
      "完全不參考 HH 方程式",
      "只用一個電晶體",
      "用 MEMS 量子閘"
    ],
    answer: 0,
    explain: "Lewis 電子膜模型是 HH 方程式的硬體實現，用主動濾波器模擬 Na/K 電導，並以 100 倍電壓放大以利電路設計。",
  },
  {
    q: "Harmon 神經元模型的特色是？",
    options: [
      "電路超簡單，使用單穩態多諧振盪器 (T1, T2) 在電容充至 ~1.5 V 時觸發 AP",
      "需要 46 顆電晶體",
      "完全以光學元件實現",
      "永遠不發射 spike"
    ],
    answer: 0,
    explain: "Harmon 為了極簡電路，用 5 個興奮輸入累積在 0.02 μF 電容上，達到 1.5 V 觸發單穩態多諧振盪器 T1/T2 產生 AP。",
  },
  {
    q: "Roy 電子膜模型 vs Lewis 電子膜模型，下列何者正確？",
    options: [
      "Roy 用 FET + op-amp + RC，追求簡單；Lewis 追求 HH 方程式的高度準確",
      "Roy 比 Lewis 還要精準",
      "兩者完全相同",
      "Roy 用真空管，Lewis 用 IC"
    ],
    answer: 0,
    explain: "Roy 主要用 FET、op-amp、RC，目標是『簡單』；Lewis 則追求高度貼近 HH 方程式的『精準』。",
  },
  {
    q: "1991 年 Mahowald & Douglas 在電子神經元上的重要貢獻是？",
    options: [
      "首次提出 GARCH",
      "用 CMOS VLSI 實作神經元，功耗約 60 μW，面積 < 0.1 mm²",
      "首次發表 fMRI",
      "首次發表 Hodgkin-Huxley 方程式"
    ],
    answer: 1,
    explain: "他們用 CMOS VLSI 實作精確模擬新皮質神經元 spike 的電路，功耗極低，奠定後續神經形態 (neuromorphic) 運算的基礎。",
  },
  {
    q: "傳統 Integrate-and-Fire 假設神經元閾值是常數；本章 3.6 節指出實際情況如何？",
    options: [
      "閾值受到前面 AP 歷史的非線性影響，會抬升又回落",
      "閾值永遠等於 0 mV",
      "閾值僅由 K⁺ 通道決定",
      "閾值與時間完全無關"
    ],
    answer: 0,
    explain: "課文：閾值會被 AP 發射歷史以非線性方式影響；用『動態閾值』可解釋同樣輸入有時 fire、有時不 fire。",
  },
  {
    q: "Jansen-Rit 模型如何模擬皮質柱？",
    options: [
      "錐體細胞 + 局部抑制 + 局部興奮三族群，可生成 α、β、誘發電位",
      "只用單一神經元",
      "只用 Hodgkin-Huxley 一條方程式",
      "完全用線性 FIR 濾波器"
    ],
    answer: 0,
    explain: "Jansen-Rit 把皮質柱建模成三個族群：錐體細胞、興奮性與抑制性中間神經元，回饋耦合後能產生 α/β 等節律與誘發電位。",
  },
  {
    q: "下列何者『不』屬於 EEG 訊號的『資料驅動 (數學) 模型』？",
    options: ["AR / ARMA / MVAR", "Prony's Method", "Gaussian Mixture Model", "Hodgkin-Huxley 方程式"],
    answer: 3,
    explain: "AR/ARMA/MVAR、Prony、GMM 都是由資料估計參數的『數學模型』；Hodgkin-Huxley 是『生理模型』。",
  },
  {
    q: "多通道 EEG 經 MVAR 模型可衍生出何種重要量度，可用於 EEG 內訊號傳遞方向分析？",
    options: ["DTF (Directed Transfer Function)", "MSE", "PSD", "DCT"],
    answer: 0,
    explain: "DTF 從 MVAR 的轉移矩陣推出，可量化哪一個通道在某頻率上『推動』另一個通道，是 EEG causality 分析重點。",
  },
  {
    q: "下列何者最符合『EEG 是非線性、非平穩訊號』的描述？",
    options: [
      "EEG 永遠是嚴格平穩、線性可分",
      "EEG 訊號的混合與產生有非線性成分；統計特性也會隨時間改變，僅在短窗（如 10 秒）內近似平穩",
      "EEG 等於穩態正弦波",
      "EEG 與時間無關"
    ],
    answer: 1,
    explain: "EEG 整體屬於非線性、非平穩；常以 10 秒短窗作 quasi-stationary 假設，這也是後續 Wavelet/EMD 等工具登場的理由。",
  },
];

window.QUESTIONS_CH03 = QUESTIONS_CH03;
