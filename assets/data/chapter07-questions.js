/* ============================================================
   Chapter 7 題庫 — Machine Learning for EEG Analysis
   作者：葉欲禾 (Gary Yu-Ho YEH) ・ 鄭鈞 (Jacob Cheng)
   ============================================================ */
const QUESTIONS_CH07 = [
  {
    q: "下列關於『監督式 vs. 非監督式學習』的描述何者正確？",
    options: [
      "監督式不需要任何標籤；非監督式需要標籤",
      "監督式以已知標籤訓練、最小化預測誤差；非監督式僅靠資料分布做分群",
      "兩者完全相同",
      "監督式只能做迴歸，非監督式只能做分類",
    ],
    answer: 1,
    explain: "監督式：已知 (x, y) → 訓練模型；非監督式：只有 x，靠聚類等找結構；半監督結合兩者。",
  },
  {
    q: "EEG 處理中『降維』的主要目的之一不包括？",
    options: [
      "降低 outliers 與雜訊的影響",
      "改善分類器表現",
      "讓資料變多",
      "去除冗餘特徵",
    ],
    answer: 2,
    explain: "降維反而會讓資料『更精簡』；目的是減冗、抗雜訊、加速訓練、避免 curse of dimensionality。PCA 是最常見的降維工具。",
  },
  {
    q: "PCA (主成分分析) 透過什麼數學工具實現？",
    options: [
      "傅立葉轉換",
      "奇異值分解 (SVD)，X = UΣV^T",
      "貝氏推論",
      "卷積",
    ],
    answer: 1,
    explain: "PCA 找共變異矩陣最大特徵向量；可由 SVD 直接得到。NMF 限制因子非負；sNMF 加上稀疏限制。",
  },
  {
    q: "k-means 演算法的主要缺點之一是？",
    options: [
      "對初始化敏感、可能落入局部最小",
      "保證收斂到全域最小",
      "不需要設定 k",
      "永遠最快",
    ],
    answer: 0,
    explain: "k-means 對初始質心敏感、要事先指定 k。ISODATA 與 Gap statistics 可協助動態決定 k。",
  },
  {
    q: "DBSCAN 與 k-means 最大的差別是？",
    options: [
      "DBSCAN 必須指定 k；k-means 不用",
      "DBSCAN 不需指定群數、可發現任意形狀群、會標記雜訊樣本",
      "k-means 更能處理噪聲",
      "兩者完全相同",
    ],
    answer: 1,
    explain: "DBSCAN 只需 epsilon 與 minPts；可偵測任意形狀的群並標識雜訊點。但對參數選擇敏感。",
  },
  {
    q: "Fuzzy c-means 與 k-means 的主要差別？",
    options: [
      "Fuzzy 是硬分群、k-means 是軟分群",
      "Fuzzy 允許每個樣本以『不同隸屬度』屬於多個群；k-means 嚴格屬於一群",
      "Fuzzy 不能用",
      "k-means 不能聚類",
    ],
    answer: 1,
    explain: "FCM 給每個樣本一組 [0,1] 隸屬度，靠近中心隸屬度高；fuzzifier m 控制模糊程度。m→1 退化為 k-means、m→∞ 完全模糊。",
  },
  {
    q: "Linear Discriminant Analysis (LDA) 的核心思想是？",
    options: [
      "最大化類間散度與最小化類內散度之比",
      "最小化所有點到中心的距離",
      "讓所有類等大",
      "只用峰度分類",
    ],
    answer: 0,
    explain: "LDA 找投影方向 w，使 J = (w S_b w^T) / (w S_w w^T) 極大化，即 inter-class scatter / intra-class scatter。對 BCI、失智症 EEG 分類常用。",
  },
  {
    q: "下列何者『不』是支援向量機 (SVM) 的核心要素？",
    options: [
      "最大化邊際 (margin)",
      "支援向量 (support vectors)",
      "核函數 (kernel)",
      "梯度下降找標籤",
    ],
    answer: 3,
    explain: "SVM 是二次規劃 (QP) 問題，求解的是凸最佳化；不需傳統梯度下降找標籤。Margin、SV、Kernel 是 SVM 三大支柱。",
  },
  {
    q: "SVM 的 slack 變數 ξ_i 與 C 參數扮演什麼角色？",
    options: [
      "用於正規化頻譜",
      "允許部分樣本違反邊際 (軟邊際)，C 決定『誤分懲罰』的權重",
      "用於計算 SVD",
      "用於選取特徵",
    ],
    answer: 1,
    explain: "ξ ≥ 0 允許資料越過 margin。C 大→近似硬邊際 (overfit 風險高)；C 小→寬鬆，對 outlier 不敏感。C 通常由 cross-validation 選。",
  },
  {
    q: "為什麼 SVM 要用『kernel trick』？",
    options: [
      "為了壓縮資料",
      "為了把線性不可分的資料隱式映射到高維空間，使其線性可分；只需內積 K(x,z)=<φ(x),φ(z)>",
      "為了讓 SVM 變慢",
      "為了改變分類數",
    ],
    answer: 1,
    explain: "Mercer 定理保證合法 kernel 對應某個 RKHS。常用 RBF kernel K(u,v) = exp(-||u-v||²/(2σ²))，能處理高度非線性。",
  },
  {
    q: "k-Nearest Neighbour (KNN) 的主要缺點是？",
    options: [
      "在高維空間 (>10-15 維) 中距離失去鑑別度，且每次預測都要算全部距離",
      "需要長時間訓練",
      "不能做分類",
      "永遠最差",
    ],
    answer: 0,
    explain: "KNN 為 lazy learner — 訓練快、預測慢；高維空間『最近與最遠』距離差距變小，導致分類失準（curse of dimensionality）。",
  },
  {
    q: "下列何者為單層感知器 (perceptron) 的局限？",
    options: [
      "只能解線性可分問題；無法解 XOR 等非線性問題",
      "需要 GPU 才能訓練",
      "只能用於影像",
      "無法收斂",
    ],
    answer: 0,
    explain: "Minsky & Papert 1969 年指出單層 perceptron 不能解 XOR；加上 hidden layer (MLP) 才能解非線性問題。",
  },
  {
    q: "ReLU 相對於 sigmoid 的優勢是？",
    options: [
      "ReLU 飽和、容易消失梯度",
      "ReLU 在正區段不飽和、計算簡單，能緩解深層網路的『梯度消失』問題",
      "ReLU 沒有非線性",
      "ReLU 完全線性",
    ],
    answer: 1,
    explain: "Sigmoid 兩端飽和、梯度趨於 0 → 深層難訓練。ReLU(z)=max(0,z) 在正區段為線性、計算成本低，是現代 DNN 主流。",
  },
  {
    q: "Backpropagation 是什麼？",
    options: [
      "一種卷積",
      "一種根據鏈鎖律由輸出層反向計算各層權重梯度的訓練演算法",
      "一種池化",
      "一種正規化",
    ],
    answer: 1,
    explain: "由輸出端誤差出發，用鏈鎖律一路把梯度傳回去更新權重，是訓練前饋網路、CNN、RNN 的標準工具。",
  },
  {
    q: "CNN 中『卷積層』與『池化層』的角色分別是？",
    options: [
      "卷積層做加法、池化層做乘法",
      "卷積層偵測局部特徵；池化層合併、縮減維度並增進對位移的不變性",
      "兩者皆只是線性層",
      "兩者皆做正規化",
    ],
    answer: 1,
    explain: "CNN 四大特性：局部連結、權重共享、池化、多層堆疊。池化常用 max-pooling，提供 translation invariance 並降維。",
  },
  {
    q: "RNN / LSTM 主要用於什麼類型的資料？",
    options: [
      "序列資料（時間序列、語音、文字）",
      "靜態影像分類",
      "二維幾何形狀",
      "純隨機雜訊",
    ],
    answer: 0,
    explain: "RNN 透過隱狀態傳遞時間依賴。LSTM 加入 input/forget/output gate 與 cell state，能學習長期依賴，常用於語音、EEG、自然語言。",
  },
  {
    q: "Autoencoder (AE) 的訓練目標是？",
    options: [
      "預測未來序列",
      "把輸入壓縮成 latent code，再從 code 重建出與輸入相近的輸出，最小化重建誤差",
      "把輸出隨機化",
      "只做分類",
    ],
    answer: 1,
    explain: "AE = encoder (x→h) + decoder (h→x̂)。常用於降維、特徵學習、去噪 (DAE)、生成 (VAE)。",
  },
  {
    q: "VAE 與一般 AE 的關鍵差別是？",
    options: [
      "VAE 沒有解碼器",
      "VAE 在 latent 加上機率分佈假設 (常 N(μ, Σ))，可用於『生成新樣本』，並用 KL divergence 規範分佈",
      "VAE 比 AE 更簡單",
      "VAE 不能訓練",
    ],
    answer: 1,
    explain: "VAE 是 generative model；encoder 輸出分佈參數，sample z 後解碼；損失含重建誤差 + KL(q(z|x) || N(0,I))。",
  },
  {
    q: "GAN (Generative Adversarial Network) 的訓練過程是？",
    options: [
      "只訓練 generator",
      "Generator 與 Discriminator 互相對抗：G 嘗試生成像真實的樣本，D 嘗試分辨真假",
      "只訓練 discriminator",
      "兩者完全合作",
    ],
    answer: 1,
    explain: "GAN 是 minimax 兩玩家賽局。理想收斂時 G 完美重現真實分佈，D 對任意輸入都輸出 0.5。Goodfellow 2014 提出。",
  },
  {
    q: "Transfer Learning 在 EEG 上的典型用途為？",
    options: [
      "把在大型影像資料 (如 ImageNet) 上預訓練的 CNN 微調後用於 EEG 分類",
      "重新訓練整個網路",
      "丟棄所有預訓練權重",
      "只用線性層",
    ],
    answer: 0,
    explain: "Transfer learning：凍結前段、fine-tune 後段 fully-connected 層。EEG 資料常有限，遷移大型模型參數可顯著提升表現。",
  },
  {
    q: "Reinforcement Learning (RL) 的核心概念是？",
    options: [
      "用標籤監督學習",
      "Agent 從環境互動中以『獎勵 / 懲罰』學習最佳行為策略",
      "純非監督的聚類",
      "只做迴歸",
    ],
    answer: 1,
    explain: "RL 透過試錯與 reward 訊號學習；Q-learning 是經典演算法；近年深度強化學習 (DRL) 結合 DNN，廣泛應用。",
  },
  {
    q: "Common Spatial Pattern (CSP) 在 BCI 中的目的為？",
    options: [
      "找空間濾波器，使一類訊號變異最大、另一類變異最小，藉以區分兩類腦狀態",
      "估計訊號平均",
      "做傅立葉降頻",
      "計算熵",
    ],
    answer: 0,
    explain: "CSP 求 w_CSP = arg max (w^T C_1 w) / (w^T C_2 w)，等價於 C_2^{-1} C_1 的特徵向量。對左右手運動意念分類等二類 BCI 極為成功。",
  },
  {
    q: "下列何者『不』是 CSP 的常見限制？",
    options: [
      "對 outliers / 雜訊敏感",
      "容易 overfit",
      "假設資料為高斯分佈 (非高斯時表現下降)",
      "完全不需 spatial filtering",
    ],
    answer: 3,
    explain: "CSP『就是』一種 spatial filtering — 反過來說。其缺點是噪音敏感、overfit、依賴高斯假設。常用 Tikhonov 等正規化改進。",
  },
  {
    q: "Hidden Markov Model (HMM) 的三大基本問題不包括？",
    options: [
      "給定 λ=(A,B,π) 和觀察 O，求 p(O|λ) — Forward/Backward 演算法",
      "求最可能的狀態序列 — Viterbi 演算法",
      "由觀察與狀態數估出 λ — Baum-Welch 演算法",
      "用 kernel trick 把狀態空間映到高維",
    ],
    answer: 3,
    explain: "HMM 三大問題為：(1) 評估 (Forward/Backward) (2) 解碼 (Viterbi) (3) 學習 (Baum-Welch / EM)。Kernel trick 屬於 SVM。",
  },
  {
    q: "Naïve Bayes 分類器的『naïve』假設是？",
    options: [
      "所有類等可能",
      "在類標籤已知下，特徵之間彼此獨立",
      "資料為高斯",
      "標籤是隨機的",
    ],
    answer: 1,
    explain: "p(x_1,...,x_n | y) = Π p(x_i | y)。即使現實中常不成立，此假設讓估計變一維，速度極快、樣本需求低，在許多任務表現出色。",
  },
  {
    q: "k-fold cross-validation 的目的是？",
    options: [
      "讓資料變多",
      "在『有限資料』下評估模型泛化能力，並有效利用每個樣本",
      "去除雜訊",
      "做傅立葉分析",
    ],
    answer: 1,
    explain: "把訓練資料切 k 等分，輪流以 1 份當驗證、k-1 份訓練；取平均誤差，能在資料有限時降低評估變異性。",
  },
  {
    q: "什麼是 outlier 對機器學習的影響？",
    options: [
      "完全無影響",
      "可能在訓練時把決策邊界拉偏，提高交叉驗證誤差",
      "讓模型完美",
      "讓 SVM 自動忽略它們",
    ],
    answer: 1,
    explain: "outlier 與類心距離大、可能屬於任何類或雜訊。健壯的分類器（如 SVM 軟邊際、k-medoid 聚類）能降低其影響；前處理也很重要。",
  },
  {
    q: "Random Forest 與單棵 Decision Tree 相比，主要優勢為？",
    options: [
      "速度更慢但結果一定差",
      "用 bagging + 隨機特徵子集訓練多棵樹，平均後降低變異、抗 overfit、對 outlier 較不敏感",
      "只用一棵樹",
      "不能用於分類",
    ],
    answer: 1,
    explain: "Random forest 通常自動處理特徵重要性，幾乎無需剪枝、抗 overfit。XGBoost、AdaBoost 等 boosting 則用序列學習修正前一輪錯誤。",
  },
  {
    q: "Graph Convolutional Network (GCN) 的核心輸入除了特徵矩陣 X 外，還需要？",
    options: [
      "傅立葉頻譜",
      "圖的結構資訊，如鄰接矩陣 A",
      "純隨機矩陣",
      "彩色影像",
    ],
    answer: 1,
    explain: "GCN 把卷積推廣到圖：Z = softmax(Â · ReLU(Â X W^(0)) · W^(1))，其中 Â 由鄰接矩陣加自連結並對稱正規化。對腦連結建模特別合適。",
  },
  {
    q: "下列哪一個是 EEG 深度學習常見的應用？",
    options: [
      "睡眠分期 / 癲癇偵測 / 情緒識別 / 運動意念 BCI / 失智症與精神疾病輔助診斷",
      "計算電池電量",
      "壓縮影片",
      "繪製股票走勢",
    ],
    answer: 0,
    explain: "EEG + DL 已在睡眠、癲癇、ADHD、失智、麻醉深度、心情/情緒識別、BCI 等領域取得實用成果（書中 7.3.9.7 詳列）。",
  },
];

window.QUESTIONS_CH07 = QUESTIONS_CH07;
