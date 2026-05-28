/* ============================================================
   Chapter 6 題庫 — Chaos and Dynamical Analysis
   作者：葉欲禾 (Gary Yu-Ho YEH) ・ 鄭鈞 (Jacob Cheng)
   ============================================================ */
const QUESTIONS_CH06 = [
  {
    q: "下列關於『大腦作為動態系統』的描述，何者最正確？",
    options: [
      "腦訊號永遠是線性、平穩的高斯過程",
      "腦訊號具高度非線性、非平穩特性，常以混沌動力學工具刻畫",
      "腦訊號完全是隨機白雜訊，無法描述",
      "腦訊號只能用傅立葉分析觀察",
    ],
    answer: 1,
    explain: "腦是高度複雜的非線性動態系統。睡眠分期、癲癇前驅、運動意念等狀態轉換都會表現出『混沌→有序』或反之的動態變化，是混沌分析的舞台。",
  },
  {
    q: "下列何者『不』是混沌系統的典型特性？",
    options: [
      "對初始條件極度敏感 (蝴蝶效應)",
      "存在確定性規則但行為看似隨機",
      "有正的 Lyapunov 指數",
      "輸出永遠週期性且可長期準確預測",
    ],
    answer: 3,
    explain: "混沌系統雖然有確定性規則，但對初始條件極敏感，導致長期不可預測。它不是純粹隨機，但也非規律週期。Lorenz、Rössler 系統皆為例。",
  },
  {
    q: "在資訊理論中，『熵 (entropy)』用來度量什麼？",
    options: [
      "訊號的均值",
      "訊號的不確定性／資訊量",
      "訊號的最大振幅",
      "訊號的中位數",
    ],
    answer: 1,
    explain: "熵 H = − ∫ p(x) log p(x) dx，衡量隨機變數的不確定性。熵越大代表越不可預測；雜訊會提高熵，所以熵對雜訊敏感。",
  },
  {
    q: "下列何者最能描述 Kolmogorov entropy (metric entropy)？",
    options: [
      "把相空間切成 hypercube，計算軌跡落入各 cube 的聯合機率所得的速率",
      "只是一階差分後的能量",
      "傅立葉頻譜的能量總和",
      "波形的最大斜率",
    ],
    answer: 0,
    explain: "Kolmogorov entropy 在相空間用 n-cube 估計軌跡的聯合分佈，計算 K_{n+1} − K_n，反映預測下一個 cube 所需的資訊量。對長序列必要但運算量大。",
  },
  {
    q: "Multiscale fluctuation-based dispersion entropy (MFDE) 解決什麼問題？",
    options: [
      "它只能處理週期訊號",
      "它在多個『時間尺度』上度量不規則性，能捕捉 EEG 的多尺度本質",
      "它比 FFT 更快",
      "它需要訊號為純高斯",
    ],
    answer: 1,
    explain: "SampEn、PerEn 等多在『單一時間尺度』上計算，無法捕捉生理訊號內含的多尺度。MFDE 結合 coarse-graining 與 FDispEn，是 EEG 複雜度量化的常用工具。",
  },
  {
    q: "Lyapunov 指數 λ 的意義是什麼？",
    options: [
      "訊號的振幅",
      "在相空間中『相鄰軌跡分離』或『誤差放大』的平均對數速率",
      "傅立葉的最大頻率",
      "訊號的取樣頻率",
    ],
    answer: 1,
    explain: "λ = lim 1/n Σ ln|f'(x_k)|。對初值 ε 微擾，誤差以 e^{λn} 放大。λ > 0 表混沌（軌跡發散）；λ < 0 表收斂、有序。",
  },
  {
    q: "若 Lyapunov 指數 λ > 0 代表什麼？",
    options: [
      "訊號完全規律",
      "訊號是雜訊",
      "系統具混沌行為 (軌跡發散、長期不可預測)",
      "系統靜止",
    ],
    answer: 2,
    explain: "λ > 0 是混沌的數值指紋。對 EEG，例如癲癇發作前後常可觀察到 λ 從正轉負，因為訊號從『無序混沌』收斂為『高度同步的有序振盪』。",
  },
  {
    q: "Quadratic iterator x(n+1) = α x(n)(1 − x(n)) 在 α = 3.8 下展現的行為是？",
    options: [
      "週期性振盪",
      "看似隨機但有確定性規則的混沌行為",
      "穩定收斂到 0",
      "發散到無限大",
    ],
    answer: 1,
    explain: "Logistic map 在 α > 3.57 進入混沌區。書中以 α = 3.8 為例，前 20 點像隨機，後期出現半規律的循環，正是混沌的典型表現。",
  },
  {
    q: "Kaplan–Yorke 猜想連結了哪兩種量？",
    options: [
      "傅立葉頻譜與小波",
      "Lyapunov 指數與奇異吸引子的維度 (Lyapunov 維度 D_L)",
      "熵與振幅",
      "互相關與互訊息",
    ],
    answer: 1,
    explain: "Kaplan–Yorke 猜想：D_L = m + (Σ_{k≤m} λ_k) / |λ_{m+1}|，由 Lyapunov 指數可直接估出奇異吸引子的維度，因為計算 λ 比直接量維度容易。",
  },
  {
    q: "下列何者為『碎形維度 (fractal dimension) D_f』的特性？",
    options: [
      "永遠為正整數",
      "可以是非整數，反映集合的『粗細結構』",
      "永遠 = 1",
      "與 Lyapunov 指數無關",
    ],
    answer: 1,
    explain: "碎形維度衡量奇異吸引子的『摺疊複雜度』，常為非整數 (例 Lorenz ≈ 2.06)。用 Kolmogorov capacity D_f = lim log M(ε) / log(1/ε) 估計。",
  },
  {
    q: "Correlation dimension D_r 的定義依賴於什麼？",
    options: [
      "傅立葉頻譜",
      "相關和 C(r)：在相空間中距離小於 r 的點對比例",
      "訊號的峰度",
      "標準差",
    ],
    answer: 1,
    explain: "D_r = lim_{r→0} log C(r) / log r。Grassberger–Procaccia 演算法可估出 D_r；最佳嵌入維度需滿足 m ≥ 2 D_f + 1。",
  },
  {
    q: "為了從一維時間序列建立相空間吸引子，需要兩個重要參數，分別是？",
    options: [
      "取樣頻率與量化位元",
      "時間延遲 τ 與嵌入維度 m",
      "傅立葉視窗長度與重疊率",
      "閾值與滑動視窗",
    ],
    answer: 1,
    explain: "Takens 嵌入定理：用 (x(t), x(t+τ), x(t+2τ), …, x(t+(m-1)τ)) 重建相空間。τ 太小→近共線；τ 太大→失去動態結構。",
  },
  {
    q: "估計最佳時間延遲 τ 常用的方法是？",
    options: [
      "FFT 峰值",
      "讓自相關函數第一次掉到極小值；或讓互訊息 (MI) 第一個局部極小",
      "讓平均值為 0",
      "讓標準差為 1",
    ],
    answer: 1,
    explain: "兩種常見做法：(1) 自相關第一次過零或落到小份額；(2) 互訊息第一個局部極小 — 後者對非線性更可靠。",
  },
  {
    q: "為何嵌入維度 m 必須滿足 m ≥ 2 D_f + 1？",
    options: [
      "讓 Lyapunov 計算更快",
      "確保吸引子在嵌入空間中不會自相交，能正確恢復原系統的拓樸",
      "為了避免過度擬合",
      "為了滿足 Nyquist",
    ],
    answer: 1,
    explain: "由 Whitney/Takens 定理，2 D_f + 1 是嵌入到歐式空間且保留拓樸的必要維度，避免不同點被『折疊』在同一處導致動態錯誤。",
  },
  {
    q: "下列何者『不』是 Detrended Fluctuation Analysis (DFA) 與相關方法常用的目的？",
    options: [
      "去除趨勢後估計長程相關性 (long-range correlation)",
      "在不同尺度上度量擾動 (fluctuation)",
      "對非平穩訊號仍能給出有意義指標",
      "計算訊號的直流偏移",
    ],
    answer: 3,
    explain: "DFA 旨在去除趨勢、跨尺度量化擾動的冪律關係 (scaling exponent α)，提供長程相關性的測量；不是用來算直流偏移。",
  },
  {
    q: "Approximate Entropy (ApEn) 的設計目的為何？",
    options: [
      "處理高頻雜訊",
      "可由短序列估出，且對 outliers (尖峰) 不敏感的複雜度量",
      "計算傅立葉相位",
      "求訊號最大振幅",
    ],
    answer: 1,
    explain: "ApEn = ψ_β^m − ψ_β^{m+1}，是 Pincus 1991 年提出的『實務化』熵度量。對短資料可用、抗尖峰干擾，門檻 β 通常設為訊號標準差的 0.1–0.25 倍。",
  },
  {
    q: "下列關於 ApEn 的敘述何者『錯誤』？",
    options: [
      "ApEn 對 outlier 比 entropy 更穩健",
      "ApEn 可用於短資料",
      "ApEn 計算時必須先指定嵌入維度 m 與門檻 β",
      "ApEn 必須讓資料先做傅立葉轉換",
    ],
    answer: 3,
    explain: "ApEn 直接在時間域上估計距離與重現，不需要傅立葉。它由 m、β、N 共同決定值。",
  },
  {
    q: "為什麼『噪音會增加熵』？",
    options: [
      "因為雜訊讓訊號變慢",
      "因為雜訊本身具有高不確定性，提升原訊號的不可預測性",
      "因為熵是頻譜的反向",
      "因為熵只看振幅",
    ],
    answer: 1,
    explain: "雜訊使資料更不可預測 (pdf 變寬)，因此熵會增加。這也是熵『不能完美區分噪音與混沌』的原因 — 兩者都會給出高熵值。",
  },
  {
    q: "下列何者『最不適合』判斷『訊號是混沌而非純雜訊』？",
    options: [
      "計算 Lyapunov 指數的正負",
      "畫相空間吸引子，看是否有結構性折疊",
      "計算相關維度是否為有限非整數",
      "只看熵值是否高",
    ],
    answer: 3,
    explain: "高熵可能是雜訊，也可能是混沌；要區分必須看吸引子結構、Lyapunov 指數、相關維度的有界性等。書中明確提到熵無法區分混沌與雜訊。",
  },
  {
    q: "以 AR 模型的『預測階數 (prediction order)』來分析訊號代表什麼？",
    options: [
      "高度相關的訊號需要『低階』AR；雜訊類訊號則需『高階』AR",
      "高度相關需高階",
      "與相關性無關",
      "永遠固定為 1",
    ],
    answer: 0,
    explain: "高度相關訊號 (如正弦) AR 階數低；雜訊類訊號 (取樣間相關性弱) 需要更多歷史樣本才能近似，AR 階數高。常用 AIC 來選擇階數。",
  },
  {
    q: "下列哪一個指標『不是』直接的混沌或複雜度測量？",
    options: [
      "Lyapunov 指數",
      "Correlation dimension",
      "Approximate entropy",
      "訊號平均值",
    ],
    answer: 3,
    explain: "平均值只是一階統計量，與複雜度無關。其餘三者皆衡量複雜度或混沌特性。",
  },
  {
    q: "Recurrence Quantification Analysis (RQA) 與 recurrence plot 的核心觀念是？",
    options: [
      "把訊號做傅立葉轉換",
      "在相空間中視覺化『何時系統回到過去曾經造訪的狀態 (recurrence)』，並對其圖樣作量化",
      "計算梯度下降",
      "計算 ICA",
    ],
    answer: 1,
    explain: "Recurrence plot 將相空間中軌跡兩兩比較距離；若小於閾值就標點。RQA 用對角線長度、確定性 (determinism) 等量化系統的規律性與混沌程度。",
  },
  {
    q: "Higher-order statistics (HOS) 與 bispectrum 主要目的是？",
    options: [
      "計算訊號的直流",
      "捕捉訊號中『非線性』與『非高斯』的相位耦合資訊，因為二階統計無法看到這些",
      "降低取樣率",
      "純粹計算共變異",
    ],
    answer: 1,
    explain: "二階 (功率譜) 對相位資訊不敏感；bispectrum (三階累積量的二維傅立葉) 可看出二次相位耦合 (QPC)，對非線性系統與非高斯訊號分析重要。",
  },
  {
    q: "下列何種情境最適合『多尺度熵』的應用？",
    options: [
      "EEG 中比較『健康人 vs. 失智症患者』在不同時間尺度上的複雜度差異",
      "計算電源電壓",
      "壓縮影片",
      "繪製時序圖",
    ],
    answer: 0,
    explain: "MFDE、MSE 等多尺度熵能跨多個 coarse-graining 尺度量化生理訊號的『複雜度跨尺度行為』，是研究老化、失智、心衰常用工具。",
  },
  {
    q: "若 EEG 從『清醒』轉到『深睡』，下列何項變化通常被觀察到？",
    options: [
      "信號頻率變高、振幅變小",
      "信號中低頻 (δ 波) 增強，整體複雜度 (熵 / 維度) 通常下降",
      "Lyapunov 指數一定變正",
      "完全不變",
    ],
    answer: 1,
    explain: "深睡時 δ 波 (1–4 Hz) 顯著、節律同步化，意味著系統變得『更有序』；多項複雜度指標 (熵、相關維度) 通常下降。",
  },
  {
    q: "在『癲癇發作前驅 (preictal)』階段，混沌量度的典型變化常為？",
    options: [
      "複雜度上升 (更混沌)",
      "複雜度下降 — 訊號從混沌變得較有序，可用於發作預測",
      "完全沒有變化",
      "永遠都是純雜訊",
    ],
    answer: 1,
    explain: "書中明白指出，發作前後神經生成器周邊訊號『由混沌漸轉有序』，這也是用 Lyapunov、相關維度做癲癇預測的物理基礎。",
  },
  {
    q: "下列何者『不』屬於本章談到的混沌/動力分析工具？",
    options: [
      "Lyapunov 指數",
      "Correlation / fractal dimension",
      "Detrended Fluctuation Analysis (DFA)",
      "Bubble sort 排序演算法",
    ],
    answer: 3,
    explain: "Bubble sort 是基本資料結構演算法，與動力分析無關。其他三項皆為本章重點工具。",
  },
];

window.QUESTIONS_CH06 = QUESTIONS_CH06;
