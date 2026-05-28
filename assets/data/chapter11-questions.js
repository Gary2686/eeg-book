/* ============================================================
   Chapter 11 題庫 — Epileptic Seizure Prediction, Detection, and Localization
   作者：葉欲禾 (Gary Yu-Ho YEH)
   ============================================================ */
const QUESTIONS_CH11 = [
  {
    q: "下列何者最能描述癲癇 (epilepsy) 的本質？",
    options: [
      "腦部血管堵塞導致缺氧",
      "一群神經元突發、短暫的過度同步電氣放電",
      "顱骨變形導致腦部受壓",
      "感染性腦膜炎引起的高燒",
    ],
    answer: 1,
    explain: "課本明確指出：seizures 是 sudden, brief, excessive electrical discharges in a group of neurons，並伴隨『hypersynchronous activity』。",
  },
  {
    q: "全球罹患癲癇人數估計約多少？",
    options: ["50 萬", "500 萬", "5,000 萬", "5 億"],
    answer: 2,
    explain: "課本：『Over 50 million people worldwide are diagnosed with epilepsy』，其中約 35 million 沒有得到適當治療。",
  },
  {
    q: "依書中分類，發作只局限於皮質某一小區的發作稱為？",
    options: ["Generalized seizure", "Tonic-clonic seizure", "Partial / focal seizure", "Absence seizure"],
    answer: 2,
    explain: "局限於皮質某區的發作稱 partial（或 focal）seizure；若放電瞬間擴及整個皮質則為 generalized。",
  },
  {
    q: "下列何者『不』屬於 generalized seizure 的次類型？",
    options: ["Absence (petit mal)", "Myoclonic", "Tonic–clonic (grand mal)", "Simple partial"],
    answer: 3,
    explain: "Simple partial 屬於 partial / focal seizure；generalized 包含 absence、clonic/tonic/tonic-clonic、myoclonic、atonic。",
  },
  {
    q: "「Inter-ictal」期指的是？",
    options: [
      "發作正在進行的當下",
      "兩次發作之間的『平常』時段",
      "發作後立刻的疲憊期",
      "發作前數分鐘的特殊期",
    ],
    answer: 1,
    explain: "Inter-ictal = 發作之間，平常無臨床症狀，但 EEG 可能出現孤立的 IED (interictal epileptiform discharge)。",
  },
  {
    q: "在發作前數分鐘到數小時、EEG 動力學指標已悄悄改變的時期稱為？",
    options: ["Ictal", "Pre-ictal", "Post-ictal", "Inter-ictal"],
    answer: 1,
    explain: "Pre-ictal（發作前期）：是 prediction（預測）演算法最重要的時段；STLmax 收斂、energy 上升等變化都在此時出現。",
  },
  {
    q: "下列關於 seizure detection 與 seizure prediction 的敘述，何者正確？",
    options: [
      "兩者是同一件事，無區別",
      "Detection 是發作前事先警告；Prediction 是發作後紀錄",
      "Detection 是發作『正在發生』時辨識；Prediction 是『發作前』給出警告",
      "Detection 只能用 iEEG，Prediction 只能用 scalp EEG",
    ],
    answer: 2,
    explain: "Detection = 偵測『正在發生』；Prediction = 在 ictal onset 之前就警告，給病人或閉迴路系統反應時間。",
  },
  {
    q: "下列何者是 Osorio et al. 提出的偵測演算法主要做的事？",
    options: [
      "計算 8–42 Hz 之短窗 / 長窗能量比",
      "在 1 Hz 以下計算 DC 漂移",
      "只用 gamma 波 (40–80 Hz) 的相位",
      "用心電圖 (ECG) 取代 EEG",
    ],
    answer: 0,
    explain: "Osorio 演算法在 8–42 Hz 計算 foreground (2 秒短窗) 與 background (約 30 分鐘長窗) 的能量比；比值飆高即視為 seizure event。",
  },
  {
    q: "下列哪種變換最常用於把非穩態 EEG 展到時間–頻率平面，且帶有多解析度特性？",
    options: ["快速傅立葉變換 FFT", "離散小波變換 DWT", "拉普拉斯變換", "Z 變換"],
    answer: 1,
    explain: "DWT 可在不同頻段使用不同解析度（粗略 + 細節），對非穩態的 EEG 比固定窗的 STFT 更合適；Subasi 結合 DWT 與 ANN 達 >80% 偵測率。",
  },
  {
    q: "Boonyakitanont et al. (2020) 在 CHB-MIT 兒童頭皮 EEG 資料庫達到的偵測準確率約為？",
    options: ["50%", "70%", "90% 以上", "100%"],
    answer: 2,
    explain: "他們用 CNN 設計時空特徵抽取器，依臨床決策準則達 over 90% accuracy。",
  },
  {
    q: "下列哪一個指標『最常』用於量化 EEG 的混沌度，並在發作預測中扮演核心角色？",
    options: [
      "信號峰度 (kurtosis)",
      "最大 Lyapunov 指數 (LLE, λ₁)",
      "EEG 振幅標準差",
      "FFT 0 Hz 分量",
    ],
    answer: 1,
    explain: "Iasemidis 等以 STLmax (短時 LLE) 量化動力混沌度；發現 pre-ictal 期多個皮質區的 STLmax 收斂 (dynamical entrainment)。",
  },
  {
    q: "若一系統的最大 Lyapunov 指數 λ₁ > 0，代表？",
    options: [
      "系統穩定不變",
      "系統收斂到固定點",
      "系統是『混沌』的，初始小擾動會指數放大",
      "系統完全是線性的",
    ],
    answer: 2,
    explain: "λ₁ > 0 表示相鄰軌跡指數分離，即敏感依賴初始條件 → 混沌。",
  },
  {
    q: "為何 scalp EEG 上直接套用傳統非線性方法 (TNM) 效果常不佳？",
    options: [
      "scalp EEG 取樣率太高",
      "scalp EEG 雜訊大、又被頭皮顱骨衰減與混疊",
      "scalp EEG 只能記錄 1 Hz 以下",
      "scalp EEG 沒有時間訊息",
    ],
    answer: 1,
    explain: "scalp EEG 易受眨眼、肌肉、ECG 等 artefact 污染；訊號又經顱骨衰減、源混疊。實務上常先做 BSS / ICA 還原近似 iEEG 的源訊號。",
  },
  {
    q: "Phase-Slope Index (PSI) 主要用於量化？",
    options: [
      "單一通道的振幅",
      "通道間方向性的功能連結（影響方向）",
      "EEG 的 DC 漂移",
      "腦溫度",
    ],
    answer: 1,
    explain: "PSI 是 spectral coherency 的虛部標準化版本，捕捉通道間的因果方向；用於 multi-channel ECoG 偵測 seizure。",
  },
  {
    q: "高頻振盪 (HFO) 中，與致癇區關聯最強的是？",
    options: ["delta (1–4 Hz)", "alpha (8–13 Hz)", "ripple (80–200 Hz)", "fast ripple (250–500 Hz)"],
    answer: 3,
    explain: "Fast ripples (250–500 Hz) 與致癇區相關性最高；多需用 iEEG/ECoG 才能可靠地觀察。",
  },
  {
    q: "下列何者『不』屬於常見的源定位 (source localization) 方法？",
    options: ["sLORETA", "Equivalent Current Dipole (ECD)", "LCMV beamformer", "FFT magnitude"],
    answer: 3,
    explain: "ECD、sLORETA、MNE、beamformer (LCMV) 都是 source localization 方法；FFT magnitude 只是頻譜大小，無空間資訊。",
  },
  {
    q: "對於藥物無效的『難治型』癲癇 (drug-resistant) 病人，下列何者『不』是常見的治療選項？",
    options: [
      "手術切除致癇區",
      "反應式神經刺激 (RNS) 或深腦電刺激 (DBS)",
      "迷走神經刺激 (VNS)",
      "口服維他命 C 增量",
    ],
    answer: 3,
    explain: "RNS、DBS、VNS、切除手術是難治型癲癇的標準選項；維他命 C 與癲癇治療無實證關聯。",
  },
  {
    q: "簡單能量特徵 E(n) = (1/L) Σ x²(n) 在偵測 seizure 時的依據是？",
    options: [
      "發作期 EEG 頻率變得低於 0.1 Hz",
      "發作期 EEG 振幅與能量通常上升",
      "發作期 EEG 完全消失",
      "發作期 EEG 振幅變零",
    ],
    answer: 1,
    explain: "課本提到：『seizures increase the average energy of the signals during the onset』，所以窗內能量是最常用的快速指標。",
  },
  {
    q: "下列關於『新生兒癲癇偵測』的描述，何者正確？",
    options: [
      "已經是解決的問題，準確率 100%",
      "新生兒癲癇模式較單一，最容易自動偵測",
      "目前演算法誤警率仍偏高，是開放的研究問題",
      "新生兒不會發生癲癇",
    ],
    answer: 2,
    explain: "課本明確指出新生兒癲癇偵測『still an open problem』；其發作型態多樣、EEG 雜訊大，目前演算法的 false alarm rate 仍高。",
  },
  {
    q: "EEG–fMRI 同步記錄主要解決的是什麼問題？",
    options: [
      "把 EEG 變成單一通道",
      "結合 EEG 的高時間解析度與 fMRI 的高空間解析度，更精準定位致癇區",
      "讓 EEG 訊號消失",
      "完全取代 EEG",
    ],
    answer: 1,
    explain: "EEG 時間好空間差、fMRI 反之；同步記錄可優勢互補。流程：以 EEG spike 為事件，與 HRF 卷積後當 fMRI regressor，找對應的 BOLD 區。",
  },
  {
    q: "下列何者最能描述 dynamical entrainment（動力夾合）這個現象？",
    options: [
      "發作後 EEG 永遠消失",
      "發作前數分到數小時，多個皮質區的 STLmax 漸進收斂到相似值",
      "發作中 EEG 振幅變零",
      "發作前 EEG 頻率變成 0 Hz",
    ],
    answer: 1,
    explain: "Iasemidis 等發現 TLE 病人在 pre-ictal 期，多個皮質區的 STLmax 進入相似的混沌水平，這是預測演算法的基礎。",
  },
  {
    q: "下列關於 IED (interictal epileptiform discharge) 的敘述，何者『錯誤』？",
    options: [
      "IED 通常出現在兩次發作之間",
      "IED 是癲癇病灶定位的重要線索",
      "在 inter-ictal 期看到 IED 不能用於協助診斷",
      "spike、sharp wave、spike-and-wave 都屬於 IED",
    ],
    answer: 2,
    explain: "IED 是 inter-ictal 期出現的棘波/銳波，正是臨床判讀癲癇並協助定位的關鍵；說『不能協助診斷』錯誤。",
  },
  {
    q: "下列哪一組『時間順序』正確？",
    options: [
      "Pre-ictal → Ictal → Post-ictal",
      "Post-ictal → Ictal → Pre-ictal",
      "Ictal → Inter-ictal → Pre-ictal",
      "Post-ictal → Pre-ictal → Ictal",
    ],
    answer: 0,
    explain: "正常順序：Inter-ictal → Pre-ictal → Ictal（發作）→ Post-ictal → 回到 Inter-ictal。",
  },
  {
    q: "用 BSS（盲源分離）處理 scalp EEG 後，再算 LLE 的目的是？",
    options: [
      "提高訊號雜訊比與還原近似 iEEG 的源訊號",
      "刻意降低訊號品質",
      "把多通道變成單一通道",
      "去除大腦的所有活動",
    ],
    answer: 0,
    explain: "scalp EEG 是多源混疊；BSS 可把獨立源拆出來，得到接近 iEEG 的『近源』訊號，再對其算 LLE 等非線性指標。",
  },
  {
    q: "下列關於『反應式神經刺激 (RNS)』與『閉迴路 DBS』的描述，何者正確？",
    options: [
      "它們需要醫師手動每 5 分鐘啟動一次",
      "靠『偵測到發作 onset → 立即電刺激打斷』來抑制發作",
      "只能用於失智症",
      "完全與 EEG 訊號無關",
    ],
    answer: 1,
    explain: "RNS / 閉迴路 DBS 是把 detection 演算法與電刺激合成系統：偵測到 onset 立刻給予電脈衝以中斷異常放電，屬難治型癲癇的選項。",
  },
  {
    q: "下列哪一項『最不』是 pre-ictal 期常見的 EEG 變化趨勢？",
    options: [
      "STLmax 漸進收斂",
      "signal energy 緩慢上升",
      "EEG 振幅瞬間歸零",
      "Dynamical similarity 下降",
    ],
    answer: 2,
    explain: "EEG 不會在 pre-ictal 突然歸零；其他三項都是大量文獻 (Iasemidis, Litt, Van Quyen) 報導過的 pre-ictal 變化。",
  },
];

window.QUESTIONS_CH11 = QUESTIONS_CH11;
