/* ============================================================
   Chapter 8 題庫 — Brain Connectivity and Its Applications
   作者：葉欲禾 (Gary Yu-Ho YEH)
   ============================================================ */
const QUESTIONS_CH08 = [
  {
    q: "下列關於『功能性連結 (functional connectivity)』與『有效性連結 (effective connectivity)』敘述何者正確？",
    options: [
      "兩者完全等價",
      "功能性連結看時間相關，有效性連結強調方向性因果",
      "有效性連結不需要任何時間序列模型",
      "功能性連結只能用 fMRI 計算，無法用於 EEG",
    ],
    answer: 1,
    explain: "Functional connectivity 是雙向的時間相關／同步（如 Coherence、PLV）；effective connectivity 含方向（如 Granger、DTF、PDC）。",
  },
  {
    q: "EEG 連結性分析中『體積導體效應 (volume conduction)』的主要問題是？",
    options: [
      "會放大訊號振幅",
      "在多電極間造成零相位差的『假同步』",
      "讓 alpha 波消失",
      "讓 EEG 取樣率變低",
    ],
    answer: 1,
    explain: "體積導體會讓同一個源在多個電極幾乎『零相位差』被看到，看起來像同步但其實是同源訊號的線性混合。",
  },
  {
    q: "為何 Pearson 相關係數不是分析 EEG 連結性的好指標？",
    options: [
      "因為它計算太慢",
      "因為它不計算相位，無法控制體積導體",
      "因為它需要訊號為高斯分布",
      "因為它只能用於頻率 > 100 Hz 的訊號",
    ],
    answer: 1,
    explain: "Pearson 相關只看振幅關聯，不分相位，因此無法分辨真同步與體積導體造成的假同步。",
  },
  {
    q: "Spectral Coherence Coh²_ij(ω) 的值範圍是？",
    options: [
      "-1 到 1",
      "0 到 1",
      "0 到 π",
      "任意實數",
    ],
    answer: 1,
    explain: "Coherence 是正規化的交叉頻譜，介於 0–1。1 代表該頻率完美同步，0 代表無關。",
  },
  {
    q: "Phase Locking Value (PLV) 主要量測什麼？",
    options: [
      "兩通道振幅的乘積",
      "兩通道相位差的一致性",
      "兩通道在時間域的卷積",
      "兩通道訊號的能量總和",
    ],
    answer: 1,
    explain: "PLV 完全忽略振幅，只看每個瞬間相位差是否鎖在固定值；越鎖定值越接近 1。",
  },
  {
    q: "Phase-Slope Index (PSI) 提出的主要動機是？",
    options: [
      "克服獨立雜訊對連結性估計的影響並推斷方向",
      "取代 FFT",
      "計算腦波頻譜密度",
      "處理 fMRI 訊號的血氧成分",
    ],
    answer: 0,
    explain: "PSI 由 Nolte 等人 (2008) 提出。原理：cause 必須早於 effect → 相位斜率反映方向，且對獨立雜訊較穩健。",
  },
  {
    q: "Granger Causality 的核心定義是？",
    options: [
      "兩訊號振幅成正比即為因果",
      "若用 y 的過去能顯著改善對 x 的預測，則 y → x",
      "兩訊號頻譜相同即為因果",
      "x 與 y 必須有相同的雜訊分布",
    ],
    answer: 1,
    explain: "Granger (1969) 的定義基於『資訊預測』：加入 y 過去使預測 x 的誤差變小，就稱 y 是 x 的 Granger 原因。",
  },
  {
    q: "Granger Causality 是『真實的因果關係』嗎？",
    options: [
      "是，等同物理因果",
      "否，只是『資訊上能預測』的統計關係",
      "等於相關係數",
      "只在線性系統才是因果",
    ],
    answer: 1,
    explain: "Granger 因果是統計上的『預測幫助』，不等同物理因果。常見陷阱：第三變量可能同時影響 x, y 造成虛假 Granger 關係。",
  },
  {
    q: "DTF (Directed Transfer Function) 是基於下列哪一個模型？",
    options: [
      "單變量 AR 模型",
      "多變量自迴歸 (MVAR) 模型",
      "卡爾曼濾波器",
      "支持向量機",
    ],
    answer: 1,
    explain: "DTF 把多通道 EEG 擬合成 MVAR，再對係數矩陣做傅立葉轉換得到傳輸矩陣 H(ω)，由此定義方向性。",
  },
  {
    q: "DTF 相較於 Spectral Coherence 的主要優勢是？",
    options: [
      "比較好寫程式",
      "可區分方向性，且在頻譜重疊時仍可工作",
      "完全不受雜訊影響",
      "可估計訊號振幅",
    ],
    answer: 1,
    explain: "Coherence 只看同步、無方向；當兩個區域頻譜重疊時，Coherence 仍只能說『同步』。DTF 透過 MVAR 可分方向。",
  },
  {
    q: "PDC (Partial Directed Coherence) 與 DTF 最主要的差別是？",
    options: [
      "PDC 不需要 MVAR",
      "PDC 只反映直接連結，DTF 包含間接路徑",
      "PDC 只能用於 fMRI",
      "PDC 永遠優於 DTF",
    ],
    answer: 1,
    explain: "若 A→B→C，DTF 會顯示 A→C 有連結，PDC 會接近 0，只在直接路徑 (A→B、B→C) 顯示。",
  },
  {
    q: "短時 DTF (Short-time DTF, SDTF) 主要用於？",
    options: [
      "計算 24 小時平均連結",
      "追蹤腦連結的時變性，例如 BCI 運動執行期間",
      "做頻譜密度估計",
      "做訊號降採樣",
    ],
    answer: 1,
    explain: "SDTF 在短窗上估 MVAR，可看到時變的方向性，常用於分類左右手運動／想像。",
  },
  {
    q: "圖論中『度 (degree)』指的是？",
    options: [
      "節點訊號的振幅",
      "節點連結到幾個鄰居",
      "節點訊號的頻率",
      "節點的座標位置",
    ],
    answer: 1,
    explain: "Degree = 一個節點連到多少個其他節點。EEG 圖中代表該電極或腦區的『朋友數量』。",
  },
  {
    q: "下列何者最能描述『小世界網絡 (small-world network)』？",
    options: [
      "高集群係數 + 短平均路徑長度",
      "低集群係數 + 長平均路徑長度",
      "完全隨機連線",
      "只有單一節點被連到",
    ],
    answer: 0,
    explain: "Watts & Strogatz (1998) 經典結果：小世界網絡兼具規則網絡的高集群與隨機網絡的短路徑。",
  },
  {
    q: "下列關於『集群係數 (clustering coefficient)』的敘述何者正確？",
    options: [
      "它衡量節點振幅大小",
      "它衡量『我的朋友彼此也是朋友』的比例",
      "它與訊號頻率有關",
      "它必定大於 1",
    ],
    answer: 1,
    explain: "Clustering coefficient = 鄰居之間實際相連的比例。0 代表鄰居之間都不連，1 代表全部相連。",
  },
  {
    q: "下列何者最可能是腦中重要的『樞紐 (hub)』區域？",
    options: [
      "後扣帶皮層 (PCC) / 楔前葉 (precuneus)",
      "枕葉小角落的單一神經元",
      "顱骨表面",
      "蜘蛛膜",
    ],
    answer: 0,
    explain: "PCC / precuneus、mPFC 等為預設模式網絡 (DMN) 核心，是高 degree 與高中心性的腦樞紐。",
  },
  {
    q: "為何『樞紐失能 (hub failure)』被認為與 Alzheimer's 等疾病關聯特別大？",
    options: [
      "樞紐區域訊號特別小",
      "樞紐連結最多，失能會影響整個網絡",
      "樞紐位於腦幹",
      "樞紐沒有突觸",
    ],
    answer: 1,
    explain: "Hub 連結最多，等同網絡的『機場樞紐』。一旦失能，整個訊息流通受阻，會造成廣泛的認知缺損。",
  },
  {
    q: "Huang et al. (2010) 比較 AD、MCI 與 NC 的腦連結，下列何者『非』AD 常見的變化？",
    options: [
      "顳葉內部連結減少",
      "頂葉-枕葉直接連結增加 (代償)",
      "左右半球同名區域之間連結被破壞",
      "全腦所有連結一致下降",
    ],
    answer: 3,
    explain: "AD 並非『全降』。某些區域 (頂葉-枕葉、額葉) 反而增加，被解讀為認知代償。",
  },
  {
    q: "Stockwell transform (S-transform) 相較於短時傅立葉轉換 (STFT) 的特點是？",
    options: [
      "視窗大小與頻率成反比，不必預設變異數",
      "完全不需要傅立葉運算",
      "只能用於 DC 訊號",
      "需要 GPU 才能計算",
    ],
    answer: 0,
    explain: "S-transform 的高斯視窗變異數隨頻率改變 (1/f)，因此低頻有長窗、高頻有短窗，兼具時間與頻率解析度。",
  },
  {
    q: "EEG hyper-scanning 指的是？",
    options: [
      "對單人做 24 小時 EEG",
      "同時記錄兩位或多位受試者的 EEG，觀察跨腦同步",
      "用磁場掃描頭部",
      "用紅外線同步偵測腦溫",
    ],
    answer: 1,
    explain: "Hyper-scanning 是同時記錄多人 EEG，研究合作/競爭/社交情境下的『跨腦同步』與 hyper-connectivity。",
  },
  {
    q: "在連結性分析中，AIC (Akaike Information Criterion) 主要用來？",
    options: [
      "估計 MVAR 模型的最佳階數 p",
      "計算電極阻抗",
      "做 ICA 預處理",
      "估計腦溫",
    ],
    answer: 0,
    explain: "AIC 透過懲罰參數數量，選擇最佳預測階數 p。階數太低欠擬合、太高過擬合。",
  },
  {
    q: "下列關於 Structural Equation Modelling (SEM) 應用於 EEG 連結性的敘述何者正確？",
    options: [
      "SEM 只能單變量分析",
      "SEM 利用先驗的解剖/生理連結假設，限制可能的連結圖",
      "SEM 不能與其他方法結合",
      "SEM 不需要任何假設",
    ],
    answer: 1,
    explain: "SEM 先設定『可能有哪些連結』的解剖學先驗，再用最大似然 (ML) 估計連結強度。常用 LISREL 軟體實作。",
  },
  {
    q: "下列何種方法『不』屬於估計 EEG 有效性連結（含方向）的方法？",
    options: [
      "Granger Causality",
      "DTF",
      "PDC",
      "單純的 Pearson 相關係數",
    ],
    answer: 3,
    explain: "Pearson 相關是雙向的功能性指標，無方向性；前三者皆基於 AR/MVAR 模型，含方向。",
  },
  {
    q: "Diffusion Adaptation 用於腦連結性的優點是？",
    options: [
      "完全忽略電極之間的合作",
      "結合時間與空間演化，並允許節點間合作學習",
      "只能用單通道",
      "等同卡爾曼濾波",
    ],
    answer: 1,
    explain: "Diffusion adaptation 是合作式適應性濾波，把鄰近電極視為合作節點，利用 DTF/S-coherency 等估出的連結強度當權重。",
  },
  {
    q: "在以 LCMV beamformer 配合連結性研究時，下列何者最可能造成連結估計偏誤？",
    options: [
      "雜訊低且來源獨立",
      "源訊號高度相關 (correlated sources)",
      "電極全部接地",
      "訊號頻率為 0",
    ],
    answer: 1,
    explain: "LCMV 假設源獨立。若兩源高度相關 (例如雙側聽覺皮層同時被刺激)，輸出會互相抵消，造成『泡向腦中心』(bleeding to center) 的偽影。",
  },
  {
    q: "Pacemaker neurons (如 thalamus / septo-hippocampal) 在腦連結性分析裡的特殊地位是？",
    options: [
      "它們會造成多腦區的同步活化，可能呈現零相位差",
      "它們對 EEG 沒有貢獻",
      "它們只與小腦相連",
      "它們的訊號頻率超過 1 kHz",
    ],
    answer: 0,
    explain: "Thalamus 與 septo-hippocampal 系統有節律性放電，會把皮質遠端區域同步起來，可造成非體積導體型的零相位差同步。",
  },
];
window.QUESTIONS_CH08 = QUESTIONS_CH08;
