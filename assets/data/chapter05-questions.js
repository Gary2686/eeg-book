/* ============================================================
   Chapter 5 題庫 — EEG Signal Decomposition
   作者：葉欲禾 (Gary Yu-Ho YEH)
   題庫格式：
     { q: 題目, options: [...], answer: 正解索引(從0起), explain: 解析 }
   ============================================================ */
const QUESTIONS_CH05 = [
  {
    q: "在 EEG 訊號處理中，所謂『盲源分離 (BSS)』的「盲」指的是什麼？",
    options: [
      "源訊號是看不見的盲信號",
      "我們對混合系統與源訊號的內容皆未知，只能從觀測到的混合訊號去估計",
      "電極遮蔽不到光線",
      "受測者眼睛是閉著的",
    ],
    answer: 1,
    explain: "BSS (Blind Source Separation) 中的『盲』指對源 s 與混合矩陣 H 皆未知；我們只看得到觀測 x，必須以統計假設（如獨立性、稀疏性、非高斯性）去反推 W 把 s 還原。",
  },
  {
    q: "下列哪一項是 5.2 節 Singular Spectrum Analysis (SSA) 的兩個主要階段？",
    options: [
      "分解 (Decomposition) 與重建 (Reconstruction)",
      "正規化與去趨勢",
      "傅立葉與小波",
      "編碼與解碼",
    ],
    answer: 0,
    explain: "SSA 的兩個互補階段：(1) Decomposition：嵌入成 Hankel 軌跡矩陣後做 SVD；(2) Reconstruction：把選定的特徵組進行對角平均 (Hankelization) 還原成時間序列。",
  },
  {
    q: "SSA 將一維時間序列嵌入成什麼形式的矩陣？",
    options: [
      "對稱正定矩陣",
      "Hankel 矩陣 (同一反對角元素相等)",
      "上三角矩陣",
      "Toeplitz 矩陣 (同一對角元素相等)",
    ],
    answer: 1,
    explain: "SSA 把序列以滑動窗構成『軌跡矩陣 (trajectory matrix)』，其每一條反對角線 i+j=const 元素相等，即 Hankel 矩陣。",
  },
  {
    q: "瞬時 BSS 模型 x(n) = H s(n) + v(n) 中，下列敘述何者正確？",
    options: [
      "H 隨時間快速變化",
      "源訊號到達各感測器存在顯著時間延遲",
      "源訊號同時抵達所有感測器，模型最簡單也最常用於 EEG",
      "必須使用非線性轉換才能解開",
    ],
    answer: 2,
    explain: "瞬時 (instantaneous) 模型假設源訊號『同時』到達感測器，沒有延遲。對 EEG 來說因為頻寬窄、傳播速度接近光速，可視為瞬時混合。",
  },
  {
    q: "為何在腦皮層 EEG 上『temporal BSS』可視為瞬時模型？",
    options: [
      "因為頭皮電極距離很遠",
      "因為頻寬低 (<100 Hz) 加上電磁波速度極快，時間延遲接近零",
      "因為訊號是離散的",
      "因為神經元彼此獨立",
    ],
    answer: 1,
    explain: "EEG 頻寬 <100 Hz，又以電磁波 (~3×10^8 m/s) 傳遞，跨電極延遲幾乎為零，所以可採用 instantaneous BSS 而不需 convolutive。",
  },
  {
    q: "ICA 與 PCA 的關鍵差異是？",
    options: [
      "ICA 用 SVD、PCA 用 EVD",
      "PCA 只要求成分『不相關 (uncorrelated)』，ICA 進一步要求成分『獨立 (independent)』",
      "ICA 只能處理線性、PCA 只能處理非線性",
      "兩者完全相同",
    ],
    answer: 1,
    explain: "PCA 僅以二階統計 (covariance) 找正交成分；ICA 利用高階統計或互訊息使成分彼此獨立。對非高斯源，獨立比不相關嚴格。",
  },
  {
    q: "Hyvärinen 與 Oja 提出的 fastICA 演算法是利用哪個統計量來分離源訊號？",
    options: [
      "二階共變異",
      "Kurtosis (峰度) — 衡量非高斯性",
      "中位數",
      "熵的負值的相反數",
    ],
    answer: 1,
    explain: "fastICA 透過最大化『峰度』(或負熵 negentropy) 萃取非高斯成分，一次取出一個源，再做 deflation 排除已抓到的源。對 spike 類訊號特別有效。",
  },
  {
    q: "SOBI (Second-Order Blind Identification) 利用什麼性質完成分離？",
    options: [
      "源訊號的高階累積量",
      "源訊號在『不同時間延遲』下的共變異矩陣可被聯合對角化，且訊號具非平穩性",
      "源訊號的稀疏性",
      "源訊號全為高斯分佈",
    ],
    answer: 1,
    explain: "SOBI 對白化後的觀測在多個時間延遲 τ 計算共變異矩陣，並同時對角化這組矩陣。只用二階統計，雜訊強健且適用近平穩源。",
  },
  {
    q: "Convolutive BSS 與 instantaneous BSS 的主要差別是？",
    options: [
      "前者假設源訊號獨立，後者不獨立",
      "前者考慮源到感測器的『延遲與多路徑』，混合是卷積，而非單純乘以矩陣",
      "前者只能在頻域、後者只能在時域",
      "兩者沒有差異",
    ],
    answer: 1,
    explain: "Convolutive 模型 x(n)=H(n)*s(n)+v(n) — 源訊號可能多路徑、多延遲到達 (anechoic 或 echoic)。聲學雞尾酒會問題即為典型例子。",
  },
  {
    q: "在 convolutive BSS 中，將問題轉到頻域以做 instantaneous BSS 後最棘手的問題是？",
    options: [
      "頻域訊號太短",
      "Permutation 問題 — 不同 frequency bin 分到的源順序可能不同，回時域時會錯亂",
      "頻域訊號全為實數",
      "訊號變得不獨立",
    ],
    answer: 1,
    explain: "頻域 BSS 內每個 bin 都是獨立的 instantaneous BSS，但 ICA 本身對源有 permutation 模糊；不同 bin 順序不一致時，回時域會把源混在一起。",
  },
  {
    q: "BSS 解出的 W 與真實混合矩陣 H 之間存在哪兩種固有模糊？",
    options: [
      "尺度 (scaling) 與置換 (permutation) 模糊",
      "時間與頻率模糊",
      "符號與絕對值模糊",
      "正交與非正交模糊",
    ],
    answer: 0,
    explain: "ICA 只用獨立性即可決定方向，但無法決定每個源的順序與振幅，因此 W = P D H^{-1}，P 為置換矩陣、D 為對角縮放矩陣。",
  },
  {
    q: "下列何者最能描述『稀疏訊號 (sparse signal)』？",
    options: [
      "幾乎每個樣本都有非零值",
      "訊號中大多數樣本為零或接近零，只少數樣本顯著非零",
      "訊號為純正弦波",
      "訊號的傅立葉頻譜為白雜訊",
    ],
    answer: 1,
    explain: "稀疏訊號的特徵就是『大多數時候安靜、少數時候有強脈衝』。EEG 中的眼動 spike、心電的 QRS、海馬 interictal discharge 都是典型例子。",
  },
  {
    q: "SCA (Sparse Component Analysis) 解決哪一種 BSS 困難？",
    options: [
      "源訊號高度相關時",
      "underdetermined 系統 — 源數比感測器多，傳統 BSS 無法求解",
      "混合是非線性",
      "源訊號完全為高斯",
    ],
    answer: 1,
    explain: "underdetermined 情況下混合矩陣不可逆，傳統 ICA 失效。SCA 假設『每個時刻只有少數源活躍』，利用稀疏性以叢集／L1 最佳化估混合矩陣與源。",
  },
  {
    q: "下列何者『不是』稀疏源恢復常見的演算法？",
    options: [
      "Matching Pursuit (MP) — 貪婪法",
      "Orthogonal Matching Pursuit (OMP) — 貪婪法",
      "Basis Pursuit (BP) / Smoothed L0 / FOCUSS — 鬆弛法",
      "Newton-Raphson 求平方根",
    ],
    answer: 3,
    explain: "Newton-Raphson 是一般非線性方程的數值求根法，與稀疏源恢復無直接關係。MP/OMP 屬貪婪家族，BP/Smoothed-L0/FOCUSS 屬鬆弛家族。",
  },
  {
    q: "L1-norm 最小化在稀疏恢復中扮演什麼角色？",
    options: [
      "用來計算高階累積量",
      "是 L0-norm 的凸鬆弛 — 用線性規劃就能求解，且解通常等價於 L0",
      "用來估計時間延遲",
      "用來計算共變異",
    ],
    answer: 1,
    explain: "L0-norm 不可微且 NP-hard，常以 L1-norm (絕對值總和) 作為凸鬆弛；在足夠稀疏的條件下兩者解相同。Basis Pursuit 即以此精神運作。",
  },
  {
    q: "為何要研究『非線性 BSS』？",
    options: [
      "因為 EEG 一定是非線性的",
      "因為某些情境（影像疊加飽和、組織振動引起的聲學混合等）混合系統本身為非線性，無法以線性 BSS 還原",
      "為了加速計算",
      "為了讓訊號變得獨立",
    ],
    answer: 1,
    explain: "x = f(As) + n 中 f 為非線性。例如半透明紙影像照相、皮膚下心肺音傳遞時組織會隨聲能振動，都是非線性混合，需 RBF 網路等非線性方法。",
  },
  {
    q: "Constrained BSS 主要做了什麼？",
    options: [
      "強制源訊號全部為正",
      "在 BSS 最佳化裡加入額外的先驗（如電生理、空間、頻譜限制），以提升估計準確度",
      "限制電極數量",
      "限制觀測時間長度",
    ],
    answer: 1,
    explain: "Constrained BSS 把臨床或統計先驗 (如 EOG 與 EEG 相關性、特定頻段、特定空間位置) 透過 Lagrange/penalty 加進代價函數，廣泛用於眼動偽影移除。",
  },
  {
    q: "『張量 (tensor)』是什麼樣的數學物件？",
    options: [
      "一定是 2×2 的矩陣",
      "多維陣列；一階為向量、二階為矩陣、三階以上稱高階張量",
      "一種特殊函數",
      "只能用於圖像處理",
    ],
    answer: 1,
    explain: "張量是 N-way 陣列。EEG 常以『通道×時間×頻率』或加上『segment / subject / trial』形成 3D/4D 張量，可保留多模態結構並一併分解。",
  },
  {
    q: "Tucker 與 PARAFAC 張量分解的主要差別？",
    options: [
      "Tucker 一定唯一、PARAFAC 不唯一",
      "Tucker 有 core tensor 可任意組合所以分解不唯一；PARAFAC 的 core 為超對角故分解通常唯一",
      "兩者完全相同",
      "只有 PARAFAC 能處理 3D",
    ],
    answer: 1,
    explain: "Tucker = 高階 PCA，core tensor 任意旋轉；PARAFAC 用超對角 core，類似 SVD 的高階推廣，唯一性條件較強（Kruskal rank 條件），對 BSS 特別有用。",
  },
  {
    q: "EEG 的時間×頻率×通道張量分解 (PARAFAC) 在實務上的典型用途為？",
    options: [
      "計算頭皮電阻",
      "從 STF 結構中萃取特定 atom，如眼動偽影、ERP 子成分、發作放電源等的時間/頻譜/空間特徵",
      "做傅立葉反轉",
      "去除高頻雜訊",
    ],
    answer: 1,
    explain: "把多通道 EEG 經 TF 轉換後堆成張量做 PARAFAC，可以同時得到每個成分的時域、頻域與空間特徵 (signatures)，常用於去除眨眼偽影 (STF-TS) 或定位癲癇源。",
  },
  {
    q: "PARAFAC2 相對於 PARAFAC 的主要優點是？",
    options: [
      "計算更快",
      "允許『某一模 (mode) 跨切片有變化』但仍保持唯一解，能處理非三線性的資料 (如非平穩訊號)",
      "只能處理 2D",
      "不需要交替最小平方 (ALS)",
    ],
    answer: 1,
    explain: "PARAFAC2 允許 A_k = P_k H，P_k 為正交且 A_k^T A_k 固定，這樣每一切片可以有不同 loading，特別適合分段非平穩 EEG。",
  },
  {
    q: "下列何者是 SOBIUM 與 FOOBI 兩種以張量解 underdetermined BSS 方法的關鍵差別？",
    options: [
      "SOBIUM 用一階矩、FOOBI 用三階矩",
      "SOBIUM 利用『二階』共變異矩陣的聯合對角化；FOOBI 利用『四階』累積量",
      "前者線性、後者非線性",
      "兩者皆需要源訊號完全相同",
    ],
    answer: 1,
    explain: "SOBIUM = Second-Order Blind Identification of Underdetermined Mixtures；FOOBI = Fourth-Order cumulant-based Blind Identification of Underdetermined Mixtures，可分離源數上限與訊號是否為複數有關。",
  },
  {
    q: "為何 EEG 中常見『相關源』（如 P3a 與 P3b）難用傳統 BSS 分離？",
    options: [
      "它們頻率太高",
      "傳統 BSS 依賴源獨立或不相關；相關源在時間、空間、頻率部分重疊，違反 ICA 假設",
      "它們振幅太小",
      "它們是雜訊",
    ],
    answer: 1,
    explain: "P3a/P3b 屬同一事件 (P300) 的子成分，時空頻部分重疊且高度相關。需用張量分解 (PARAFAC2)、CCA 或加入先驗的方法。",
  },
  {
    q: "Common Component Analysis (CCA-Common) 的核心假設是？",
    options: [
      "每個共變異矩陣彼此完全獨立",
      "多組高維共變異矩陣 X_t 可被同一個低維正交子空間 U 解釋：X_t = U Y_t U^T + E_t",
      "源訊號為高斯白雜訊",
      "源訊號為週期性",
    ],
    answer: 1,
    explain: "Common component analysis 在多個時段/受試者間找『共同的低維子空間』U；若只有一個共變異矩陣即退化為 PCA。可由張量分解求解。",
  },
  {
    q: "Canonical Correlation Analysis (CCA) 的目的是？",
    options: [
      "尋找兩組變數間的線性組合使其相關性最大化",
      "計算單一訊號的功率譜",
      "把時間訊號轉到頻域",
      "估計訊號峰度",
    ],
    answer: 0,
    explain: "CCA 估計 W_x, W_y 使得 corr(W_x X, W_y Y) 最大，常用於 EEG 中分離肌肉偽影 (因為肌電 EMG 偽影在連續時間樣本間相關性低)。",
  },
  {
    q: "對於 underdetermined 系統 (源比感測器多)，下列描述何者『錯誤』？",
    options: [
      "傳統 ICA 的反矩陣不可逆，所以 W = H^{-1} 無法直接寫出",
      "可利用稀疏性 (SCA)、k-SCA 或張量分解來估計混合矩陣",
      "若每瞬間最多 m-1 個源活躍 (m 為感測器數)，仍可正確識別混合矩陣",
      "因為不可解，只能放棄，沒有任何方法",
    ],
    answer: 3,
    explain: "underdetermined 並非無解 — 在稀疏假設或張量秩高於矩陣秩的條件下仍可恢復。SCA、k-SCA、SOBIUM、FOOBI 都是合理方案。",
  },
  {
    q: "下列何者『不』屬於本章介紹的 BSS 主要演算法系列？",
    options: [
      "Infomax / fastICA",
      "JADE / SOBI",
      "PARAFAC / PARAFAC2 / SOBIUM / FOOBI",
      "Bubble sort 排序",
    ],
    answer: 3,
    explain: "Bubble sort 是基本排序法，與 BSS 無關。其餘皆為 EEG BSS 常用工具：Infomax、fastICA、JADE 為傳統 ICA；SOBI 為二階；PARAFAC 等屬張量分解。",
  },
];

window.QUESTIONS_CH05 = QUESTIONS_CH05;
