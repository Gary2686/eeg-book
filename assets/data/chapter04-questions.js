/* ============================================================
   Chapter 4 題庫 — Fundamentals of EEG Signal Processing
   作者：葉欲禾 (Gary Yu-Ho YEH) ・ 鄭鈞 (Jacob Cheng)
   ============================================================ */
const QUESTIONS_CH04 = [
  {
    q: "為何 EEG 訊號通常被視為『non-stationary（非平穩）』？",
    options: [
      "因為 EEG 振幅永遠等於 0",
      "因為 EEG 在不同時段（睜眼/閉眼、清醒/睡眠、正常/癲癇）統計特性會明顯改變",
      "因為 EEG 永遠是嚴格平穩的",
      "因為 EEG 不含頻率資訊"
    ],
    answer: 1,
    explain: "EEG 在不同生理狀態下平均與共變異特性會變；實務上以 10 秒左右的短窗近似平穩 (quasi-stationary)。",
  },
  {
    q: "Skewness、Kurtosis、Negentropy、KL distance 都是用來：",
    options: [
      "估算頭顱大小",
      "刻劃訊號分布的偏離 Gaussian 程度（高階統計量）",
      "計算 ADC 量化誤差",
      "估算電極阻抗"
    ],
    answer: 1,
    explain: "這些都是描述分布形狀與分布距離 Gaussian 程度的工具，被用來判別 EEG 的非高斯性與非平穩性。",
  },
  {
    q: "下列何者『不是』本章列出的訊號分段五準則 d₁~d₅？",
    options: [
      "自相關差 (d₁)",
      "Kurtosis 差 (d₂)",
      "AR 預測殘差 (d₄)",
      "電極阻抗差 (d_imp)"
    ],
    answer: 3,
    explain: "課文五準則分別是：d₁ 自相關、d₂ kurtosis、d₃ 週期圖、d₄ AR 殘差、d₅ AR 頻譜。電極阻抗不在這五項。",
  },
  {
    q: "為何 STFT 無法同時取得高時間與高頻率解析度？",
    options: [
      "因為 ADC 速度不夠",
      "因為 Heisenberg 不確定性原理 σ²_t · σ²_ω ≥ 1/4",
      "因為頻率沒辦法被測量",
      "因為 Fourier 永遠是錯的"
    ],
    answer: 1,
    explain: "STFT 受 Heisenberg 不確定性限制：時間窗越窄頻率越糊、反之亦然。",
  },
  {
    q: "Wavelet 變換相比 STFT 的主要優勢是？",
    options: [
      "Wavelet 完全不需取樣",
      "Wavelet 採用『高頻窄視窗、低頻寬視窗』的多尺度設計，較適合非平穩訊號",
      "Wavelet 只能處理線性訊號",
      "Wavelet 等於 DFT"
    ],
    answer: 1,
    explain: "Wavelet 的尺度參數 a 自動調整時間/頻率窗大小，對 EEG 等多頻段共存且非平穩的訊號特別合適。",
  },
  {
    q: "Synchro-Squeezed Wavelet Transform (SSWT) 的核心想法是？",
    options: [
      "把連續 Wavelet 結果按真實瞬時頻率重新分配能量，得到更銳利的時頻圖",
      "把 Wavelet 完全取代為傅立葉",
      "用神經網路替代 Wavelet",
      "把訊號全部變成正弦"
    ],
    answer: 0,
    explain: "SSWT 用 ω(a,b) = -i/W·∂W/∂b 估計候選 IF，把能量擠回真實 IF 的頻率 bin，使時頻圖更清晰且仍可重建原訊號。",
  },
  {
    q: "Wigner-Ville 分布 (WVD) 的主要缺點是？",
    options: [
      "完全沒有解析度",
      "對多分量訊號會產生『交叉項 (cross-terms)』",
      "無法處理離散時間",
      "只能處理 1D 訊號"
    ],
    answer: 1,
    explain: "WVD 解析度極佳，但兩個訊號加總會在中間頻率產生不存在的『交叉項』；Pseudo-WVD 或 Cohen's class（含 Choi-Williams）用低通核來壓抑它們。",
  },
  {
    q: "Choi-Williams 分布屬於什麼類別？",
    options: [
      "Wavelet",
      "Cohen's class（用 2D 鐘形核壓抑 WVD 交叉項）",
      "FIR 濾波",
      "ICA"
    ],
    answer: 1,
    explain: "Choi-Williams 用 φ(τ, ν) = exp(-ν²τ² / (4π²σ)) 鐘形核與 WVD 卷積，是 Cohen's class 最知名成員。",
  },
  {
    q: "Empirical Mode Decomposition (EMD) 的特點是？",
    options: [
      "需要事先選擇 mother wavelet",
      "完全由資料驅動，把訊號分解為一系列『瞬時頻率/振幅都可變』的 IMF",
      "只能處理線性平穩訊號",
      "等同於 PCA"
    ],
    answer: 1,
    explain: "EMD 不需基底函數；透過 sifting 找到的 IMF 描述瞬時振盪。底層理論是 Hilbert-Huang Transform。",
  },
  {
    q: "EMD sifting 過程的第一步是？",
    options: [
      "做 FFT",
      "找出訊號的所有局部極值 (maxima/minima)，並用 cubic spline 連成上下包絡",
      "把訊號乘以白雜訊",
      "用 PCA 旋轉"
    ],
    answer: 1,
    explain: "課文：第一步找極值、第二步用 cubic spline 連 maxima/minima 成上下包絡，再計算平均 m₁。",
  },
  {
    q: "EMD 常見問題 'mode mixing' 的解法之一是？",
    options: [
      "完全不做 sifting",
      "Ensemble EMD (EEMD)：加白雜訊多次平均，或更進一步用 CEEMDAN",
      "把資料丟掉",
      "改用 DFT"
    ],
    answer: 1,
    explain: "EEMD 對原始訊號加白雜訊多次跑 EMD，再平均 IMF，能緩解 mode mixing；CEEMDAN 提供更佳完整重建。",
  },
  {
    q: "Coherency 與 DTF 的關鍵差別是？",
    options: [
      "Coherency 反映同步、無方向資訊；DTF 從 MVAR 推出，能判別因果方向",
      "兩者完全等價",
      "DTF 只能用在單通道",
      "Coherency 只能在時間域使用"
    ],
    answer: 0,
    explain: "Coherency 量化兩通道頻譜同步度但無方向；DTF 透過 MVAR 的 H(ω) 推出方向性，能判別誰推動誰。",
  },
  {
    q: "MVAR 模型常使用哪個演算法估計係數？",
    options: ["Levinson-Wiggins-Robinson (LWR)", "FFT", "PCA", "K-means"],
    answer: 0,
    explain: "MVAR 多通道係數常用 LWR 演算法估計；模型階數可用 AIC 選擇。",
  },
  {
    q: "下列關於 Granger Causality 的敘述，何者正確？",
    options: [
      "X causes Y 表示加上 X 的過去能更好預測 Y",
      "Granger 因果與時間順序無關",
      "Granger 只能處理 fMRI",
      "Granger 需要 32 個以上的通道才能算"
    ],
    answer: 0,
    explain: "Granger 的定義就是『加上 X 的過去後能改善對 Y 的預測』；它是雙變量 AR 的延伸，多通道時 DTF 更實用。",
  },
  {
    q: "EEG 訊號常用的數位濾波組合，下列何者『不是』典型配置？",
    options: [
      "Highpass 0.5 Hz",
      "Lowpass 50–70 Hz",
      "Notch 50 / 60 Hz",
      "Bandpass 2–4 kHz"
    ],
    answer: 3,
    explain: "EEG 主要頻段在 100 Hz 以下，2–4 kHz 帶通並不合理。HPF 0.5、LPF 50–70、Notch 50/60 才是標準配置。",
  },
  {
    q: "LMS 自適應濾波器的收斂參數 μ 需滿足？",
    options: [
      "μ < 0",
      "0 < μ < 1 / λ_max（λ_max 為自相關矩陣的最大特徵值）",
      "μ > 100",
      "μ = π"
    ],
    answer: 1,
    explain: "為了穩定，LMS 步長 μ 必須是正的且小於 1/λ_max；太大會發散、太小則收斂慢。",
  },
  {
    q: "比較 LMS 與 RLS 的特點，何者正確？",
    options: [
      "LMS 收斂慢但運算最簡單；RLS 收斂快但對實時計算數值較不穩",
      "LMS 永遠比 RLS 準",
      "RLS 完全不需要任何乘法",
      "兩者完全相同"
    ],
    answer: 0,
    explain: "LMS 用瞬時梯度，運算量小但對相關訊號收斂慢；RLS 用遺忘因子 γ 加權最小平方，收斂快但實時計算數值較不穩。",
  },
  {
    q: "Wiener Filter 的最優權重 w* 的封閉解是？",
    options: [
      "w = R⁻¹ p（R 為自相關矩陣、p 為輸入-參考互相關）",
      "w = log(R)",
      "w = R + p",
      "w = exp(p)"
    ],
    answer: 0,
    explain: "Wiener 最小化 MSE 的最優解：w = R⁻¹ p。實作上多以 LMS/RLS 迭代逼近，避免直接求逆。",
  },
  {
    q: "下列何者最能描述『眼動 (Eye-blink) 偽訊』在 EEG 上的特徵與處理？",
    options: [
      "偽訊只出現在 O1/O2，使用 Notch 即可去除",
      "在 FP1/FP2 振幅特別大；常用自適應濾波或 ICA 移除",
      "永遠無法被偵測",
      "偽訊頻率永遠 > 100 Hz"
    ],
    answer: 1,
    explain: "眨眼會在最前額 FP1/FP2 留下大振幅低頻訊號；常做法：用 FP1/FP2 當參考做自適應濾波，或用 ICA 把它隔離成獨立分量再剔除。",
  },
  {
    q: "下列關於 PCA 的敘述，何者正確？",
    options: [
      "PCA 的基底與資料無關",
      "PCA 找一組正交基底，使資料的能量集中在少數主成分上；常用 SVD 實作",
      "PCA 完全等同於 DFT",
      "PCA 只能用在 1D 資料"
    ],
    answer: 1,
    explain: "PCA 的核心是用資料的共變異矩陣特徵分解（或對資料做 SVD），找一組正交基底最大化能量集中度。",
  },
  {
    q: "SVD 分解 A = UΣVᴴ 中，Σ 對角線上的數值代表什麼？",
    options: [
      "電極阻抗",
      "奇異值，反映各主方向上的訊號能量大小，由大到小排列",
      "FFT 頻率",
      "Wavelet 尺度"
    ],
    answer: 1,
    explain: "Σ 的對角元素為奇異值 σᵢ = √λᵢ，由大到小排列；大奇異值對應主訊號子空間、小奇異值對應雜訊子空間。",
  },
  {
    q: "Moore-Penrose pseudo-inverse 的常見用途是？",
    options: [
      "解最小二乘 (LS) 問題、處理矩陣不可逆或秩缺乏的情況",
      "做 FFT",
      "估計阻抗",
      "解卷積方程"
    ],
    answer: 0,
    explain: "A† = U Σ† Vᴴ 是 SVD 推出的廣義逆，能在 A 為矩形/秩缺乏時解最小二乘問題，是 PCA、ICA 等演算法的根基。",
  },
  {
    q: "在 PCA 中，把『前 K 個主成分以外的子空間』丟掉，再重建訊號，能達成什麼？",
    options: [
      "提高雜訊",
      "降維 + 去雜訊，把訊號子空間與雜訊子空間分離",
      "增加維度",
      "把訊號全部變成 0"
    ],
    answer: 1,
    explain: "保留前 K 個主成分等於只保留訊號子空間，把對應小奇異值的雜訊去掉，是 PCA 典型的『子空間濾波』。",
  },
  {
    q: "MVAR 模型階數 p 一般用什麼自動選？",
    options: [
      "Akaike 資訊準則 (AIC)",
      "電極數",
      "病人年齡",
      "電源頻率"
    ],
    answer: 0,
    explain: "AIC 同時懲罰模型複雜度與配適度，是 AR/ARMA/MVAR 階數最常見的自動選擇方法。",
  },
  {
    q: "下列哪一個情況最適合用 'Bandpass 8–13 Hz' 濾波？",
    options: [
      "想專注分析閉眼放鬆時的 α 節律",
      "想去除 60 Hz 電源",
      "想保留心電 QRS",
      "想觀察 200 Hz 以上的振盪"
    ],
    answer: 0,
    explain: "8–13 Hz 是 α 頻段；BPF 限制在這個範圍可以專注分析 α 節律的振幅與同步性。",
  },
  {
    q: "Cohen's class 中『φ(τ, ν) = exp(-ν²τ²/(4π²σ))』所定義的時頻分布稱為？",
    options: [
      "Choi-Williams 分布",
      "Hartley 變換",
      "Hilbert-Huang 變換",
      "Daubechies wavelet"
    ],
    answer: 0,
    explain: "Choi-Williams 用鐘形核 φ(τ,ν) = exp(-ν²τ²/(4π²σ)) 與 WVD 卷積，達到壓抑交叉項並保留主要時頻特徵的目的。",
  },
  {
    q: "下列何者『不是』PCA 在 EEG 上的常見用途？",
    options: ["濾波／去雜訊", "降維", "白化作為 ICA 前處理", "估計頭顱厚度"],
    answer: 3,
    explain: "PCA 常用於濾波、降維、白化（ICA 前處理）與 BSS；估計頭顱厚度需要解剖影像，不是 PCA 的工作。",
  },
  {
    q: "下列關於 SSWT 的敘述，何者『不』正確？",
    options: [
      "可從 W(a,b) 估計候選瞬時頻率",
      "把能量重新映射到最接近真實 IF 的頻率 bin",
      "可從重新映射後的表達重建原訊號",
      "對純線性平穩訊號才有意義，非平穩訊號完全不能用"
    ],
    answer: 3,
    explain: "SSWT 設計初衷正是為了處理非平穩、非線性訊號；它能保留可重建性，且讓時頻圖更銳利。",
  },
  {
    q: "下列哪個工具最適合『偵測 EEG 內訊息從電極 i 流到 j 的方向』？",
    options: ["Coherency", "DTF (Directed Transfer Function)", "Skewness", "Kurtosis"],
    answer: 1,
    explain: "Coherency 是雙向同步度；DTF 從 MVAR 的轉移矩陣推出，能定向量化從 i 到 j 的因果耦合。",
  },
];

window.QUESTIONS_CH04 = QUESTIONS_CH04;
