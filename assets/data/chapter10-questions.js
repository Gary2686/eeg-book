/* ============================================================
   Chapter 10 題庫 — Localization of Brain Sources
   作者：葉欲禾 (Gary Yu-Ho YEH)
   ============================================================ */
const QUESTIONS_CH10 = [
  {
    q: "下列關於『正向問題 (forward problem)』敘述何者正確？",
    options: [
      "從頭皮 EEG 反推腦內源",
      "已知源位置，計算頭皮各電極的電位",
      "等同於 fMRI 的 BOLD 重建",
      "需要 ICA 才能計算",
    ],
    answer: 1,
    explain: "Forward problem 是給定源 → 算出電極電位，需要頭模型與導電率。Inverse 才是反推。",
  },
  {
    q: "為何反向問題 (inverse problem) 在 EEG 是 ill-posed？",
    options: [
      "因為 EEG 是負電壓",
      "未知源數遠多於電極數，無唯一解",
      "因為背景 EEG 是高斯",
      "因為頭骨完全絕緣",
    ],
    answer: 1,
    explain: "成千上萬個皮質源 vs 幾十到幾百個電極 → 欠定，需要先驗才能找出唯一合理解。",
  },
  {
    q: "下列何者『不』是常用的頭模型？",
    options: [
      "球形 (Spherical)",
      "邊界元素 (BEM)",
      "有限元素 (FEM)",
      "正弦頭模型 (Sinusoidal)",
    ],
    answer: 3,
    explain: "Sinusoidal 不是頭模型。球形、BEM、FEM 是三大主流。BEM 與 FEM 更貼近真實頭部。",
  },
  {
    q: "BEM 與 FEM 的主要差別是？",
    options: [
      "BEM 取分界面網格、FEM 取整個體積網格",
      "BEM 只能用於 fMRI、FEM 只能用於 EEG",
      "FEM 不需電極",
      "BEM 比 FEM 更精準",
    ],
    answer: 0,
    explain: "BEM 把表面（頭皮、顱骨、腦）三角網格化，計算量中等；FEM 把整個頭部離散為體網格 (四面體)，可處理各向異性但計算量大。",
  },
  {
    q: "EEG 觀測模型 X = L·S + N 中，L 是？",
    options: [
      "電極數",
      "Lead field matrix (源到電極的傳輸係數)",
      "雜訊功率",
      "源強度",
    ],
    answer: 1,
    explain: "L (有時記 G 或 H) 是 lead field matrix，每行表電極對某位置／方向源的靈敏度，由頭模型計算。",
  },
  {
    q: "ECD (Equivalent Current Dipole) 方法的核心假設是？",
    options: [
      "源由少數幾個有方向的偶極代表",
      "源遍布所有皮質位置",
      "源完全沒有方向",
      "源頻率為 0",
    ],
    answer: 0,
    explain: "ECD 假設訊號可由少數幾個 dipole 解釋，找出每個的 (位置、方向、強度)；適合幾個明顯的點源情境。",
  },
  {
    q: "Linear Distributed (LD) 方法相較於 ECD 的特色是？",
    options: [
      "不必預先指定源數量",
      "必須先指定源數量",
      "只能用於單通道",
      "不需要 lead field",
    ],
    answer: 0,
    explain: "LD 同時考慮所有可能位置（數千個固定 dipole），透過正規化解出每個的強度。",
  },
  {
    q: "MUSIC 演算法的核心是？",
    options: [
      "把觀測共變異矩陣分為訊號與雜訊子空間，搜尋 lead field 與訊號子空間吻合的位置",
      "對所有電極做 FFT",
      "估計訊號頻率",
      "等同於 PCA",
    ],
    answer: 0,
    explain: "MUSIC 把 Rₓ 特徵值分解出 Φₛ (訊號) 與 Φₑ (雜訊)；在 3D 網格找 a(ρ,θ) 與 Φₛ 子空間相關接近 1 的位置。",
  },
  {
    q: "RAP-MUSIC 相較於 MUSIC 的主要改進是？",
    options: [
      "用遞回方式逐一找源，每次將訊號子空間投影至已知源的正交補",
      "完全不需要 SVD",
      "只能找一個源",
      "比 MUSIC 慢 100 倍",
    ],
    answer: 0,
    explain: "RAP-MUSIC 找到第一個源後，把訊號子空間投影至其正交補；下次搜尋在『剩下空間』找下一源，更穩定。",
  },
  {
    q: "Minimum Norm Estimate (MNE) 的主要缺點是？",
    options: [
      "計算太慢",
      "傾向把源放在淺表，深源被低估",
      "需要 fMRI",
      "結果是負能量",
    ],
    answer: 1,
    explain: "MNE 找最小 ‖S‖² 的解，而深源因 lead field 衰減大，要產生相同電位需要更大的 S → 演算法會傾向選淺源。",
  },
  {
    q: "Weighted Minimum Norm (WMN) 為何在 MNE 之上加權？",
    options: [
      "補償深源、避免結果偏向淺表",
      "讓計算更慢",
      "壓制訊號雜訊比",
      "讓 EEG 與 fMRI 等價",
    ],
    answer: 0,
    explain: "WMN 用 W = diag(1/‖Lᵢ‖) 把深源的權重提高，補償 lead field 對深源的衰減。",
  },
  {
    q: "LORETA 相較於 WMN 多了什麼？",
    options: [
      "空間平滑性約束 (Laplacian operator)",
      "時間反向播放",
      "把訊號變雜訊",
      "刪除一半電極",
    ],
    answer: 0,
    explain: "LORETA = WMN + 空間 Laplacian 平滑。結果是『平滑的源分布圖』，是臨床最常用的方法之一。",
  },
  {
    q: "sLORETA 的特色是？",
    options: [
      "對 MNE 結果做標準化，使單一源無偏",
      "需要至少 1000 個電極",
      "只能用於 MEG",
      "比 LORETA 慢 100 倍",
    ],
    answer: 0,
    explain: "sLORETA 把 MNE 估計除以 resolution matrix 的對角開根號，得到 zero-localization-error 的單源估計。",
  },
  {
    q: "下列何者『最適合』有 1 個強源的情境？",
    options: [
      "sLORETA",
      "LORETA with p=1.5",
      "FOCUSS",
      "Dipole fitting with 10 dipoles",
    ],
    answer: 0,
    explain: "書中比較指出：單源時 sLORETA 表現最佳。多源時 LORETA (p=1.5) 較佳。",
  },
  {
    q: "FOCUSS 演算法的特性是？",
    options: [
      "迭代式 WMN，每輪用上一輪結果更新權重，結果越來越稀疏",
      "完全不需迭代",
      "永遠收斂到唯一全局最佳",
      "等同於 PCA",
    ],
    answer: 0,
    explain: "FOCUSS = FOCal Underdetermined System Solver。每輪用上一估計值當權重 → 偏向放大現有源、稀疏化結果。",
  },
  {
    q: "SSLOFO 是哪兩個演算法的串接？",
    options: [
      "sLORETA → FOCUSS",
      "MNE → MUSIC",
      "LCMV → Bayes",
      "FFT → ICA",
    ],
    answer: 0,
    explain: "Shrinking sLORETA-FOCUSS：先用 sLORETA 給良好初值，再用 FOCUSS 精化，並逐輪縮減源空間。",
  },
  {
    q: "LCMV beamformer 的設計目標是？",
    options: [
      "對感興趣位置維持單位增益，同時最小化其他位置造成的方差",
      "只放大雜訊",
      "等同於 Wiener 濾波",
      "限制取樣率",
    ],
    answer: 0,
    explain: "LCMV = Linearly Constrained Minimum Variance：W^T·H(ρ)=I 的約束下，最小化 Var(W^T·y)。",
  },
  {
    q: "LCMV 在『兩個源高度相關』時會發生什麼？",
    options: [
      "輸出互相抵消，定位『泡向腦中心』",
      "完全沒問題",
      "源變得更強",
      "源消失但雜訊變強",
    ],
    answer: 0,
    explain: "高度相關源在 LCMV 中相互消減，結果常產生不真實的腦中心源 (bleeding to center)。",
  },
  {
    q: "Deflation Beamformer 如何克服 LCMV 對相關源的問題？",
    options: [
      "加上『已定位源的零點 (null)』約束，反覆估計、迭代收斂",
      "完全不做約束",
      "只用 1 個電極",
      "增加雜訊",
    ],
    answer: 0,
    explain: "定位 ρ₁ 後，下一輪約束 W^T·H(ρ₁)=0；如此各源不會互相抵消，並逐次迭代到收斂。",
  },
  {
    q: "貝氏腦源定位的 MAP 估計式是？",
    options: [
      "ŝ = argmax p(s|x) ∝ p(x|s)·p(s)",
      "ŝ = argmin ‖x‖",
      "ŝ = 0",
      "ŝ = mean(x)",
    ],
    answer: 0,
    explain: "MAP = arg max p(s|x)，依貝氏定理 ∝ likelihood × prior。Prior 可加入空間/時間/解剖約束。",
  },
  {
    q: "變分貝氏 (Variational Bayes) 在腦源定位中的主要優點是？",
    options: [
      "用可分解的 q(θ)=Πq(θᵢ) 近似後驗，可同時估多參數",
      "不需任何模型",
      "完全消除所有雜訊",
      "等同於 LMS",
    ],
    answer: 0,
    explain: "VB 用較簡單可分解的分布近似真實後驗，可同步估 ECD 位置、振幅、潛時、噪聲變異數等。",
  },
  {
    q: "下列何者『最適合』作為腦源定位的空間先驗？",
    options: [
      "fMRI BOLD 活化圖譜",
      "心電圖 (ECG)",
      "脈搏",
      "體溫",
    ],
    answer: 0,
    explain: "fMRI 的高空間解析度活化區可作為 EEG 源定位的空間 prior，提升結果合理性。",
  },
  {
    q: "下列何種特性會讓 EEG 源定位比 MEG 更困難？",
    options: [
      "頭骨對 EEG 電場高度衰減（且非均質），但對 MEG 磁場較『透明』",
      "EEG 沒有時間解析度",
      "EEG 不能多通道",
      "EEG 需要液氦冷卻",
    ],
    answer: 0,
    explain: "顱骨對電場衰減極大且不均勻，導致 EEG lead field 非線性；MEG 磁場幾乎不受顱骨影響，定位較精準。",
  },
  {
    q: "下列關於『顱骨導電率隨年齡變化』敘述何者正確？",
    options: [
      "兒童腦/顱骨導電率比 ~10:1，老年人可達 50–80:1",
      "完全不變",
      "兒童 100:1，老年 1:1",
      "與年齡無關但與性別有關",
    ],
    answer: 0,
    explain: "書本提到 10 歲約 10:1、55 歲約 25:1、老年 50–80:1。臨床定位需考量受試者年齡。",
  },
  {
    q: "下列何者『不』是常用的 EEG 源定位軟體？",
    options: [
      "Brainstorm",
      "EEGLab",
      "Microsoft Excel",
      "FieldTrip",
    ],
    answer: 2,
    explain: "Excel 不是源定位軟體。Brainstorm、EEGLab、FieldTrip、LORETA、MNE 都是常用的工具。",
  },
  {
    q: "在源數量未知時，下列何種測試『最』可用於估計源數？",
    options: [
      "AIC、BIC、Wald test 等資訊準則",
      "看哪個電極阻抗最大",
      "看 EEG 振幅最大",
      "靠頭圍尺寸",
    ],
    answer: 0,
    explain: "AIC、BIC 用對數似然加上參數懲罰；Wald test 測試振幅／位置是否顯著不同於 0；Bai & He 的資訊準則法是穩健選擇。",
  },
  {
    q: "下列何者『不』是腦源定位的臨床應用？",
    options: [
      "癲癇灶定位、規劃手術切除範圍",
      "ERP (如 P3a/P3b) 源位置分析",
      "BCI 中找到運動皮層源",
      "估計受試者今天有沒有吃早餐",
    ],
    answer: 3,
    explain: "前三者皆為書中明確的臨床應用；後者不是 EEG 源定位的範疇。",
  },
];
window.QUESTIONS_CH10 = QUESTIONS_CH10;
