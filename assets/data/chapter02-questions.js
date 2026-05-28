/* ============================================================
   Chapter 2 題庫 — EEG Waveforms
   作者：葉欲禾 (Gary Yu-Ho YEH) ・ 鄭鈞 (Jacob Cheng)
   ============================================================ */
const QUESTIONS_CH02 = [
  {
    q: "下列哪一組腦節律的『頻率範圍』與『生理意義』搭配正確？",
    options: [
      "α 波 8–13 Hz：閉眼放鬆時最明顯",
      "β 波 4–7.5 Hz：思考活躍時最強",
      "δ 波 14–26 Hz：深睡與嬰兒",
      "θ 波 0.5–4 Hz：高度刺激下出現",
    ],
    answer: 0,
    explain: "α 波 8–13 Hz、後腦勺枕葉、閉眼放鬆最明顯。β 是 14–26 Hz；δ 是 0.5–4 Hz；θ 是 4–7.5 Hz。",
  },
  {
    q: "誰首先在 1929 年的論文中描述 α 與 β 波？",
    options: ["Walter", "Berger", "Caton", "Andrews"],
    answer: 1,
    explain: "Hans Berger 在 1929 年發表的人類 EEG 紀錄中首次描述 α 與 β 波。δ 波是 Walter 1936 年命名；γ 是 Jasper & Andrews 1938。",
  },
  {
    q: "α 波最典型的位置是？",
    options: ["額葉", "中央區", "枕葉（後腦勺）", "耳後乳突"],
    answer: 2,
    explain: "α 波在後腦勺枕葉最明顯，閉眼時最強、睜眼會被『阻斷』。",
  },
  {
    q: "下列何者最接近頭皮 EEG 的正常振幅範圍？",
    options: ["1 – 5 mV", "10 – 100 μV", "200 – 500 μV", "1 – 5 nV"],
    answer: 1,
    explain: "頭皮 EEG 振幅約 10–100 μV；皮質直接量測 (ECoG) 才會達 0.5–1.5 mV。",
  },
  {
    q: "10-20 系統中，電極代號『Cz』指的是哪個位置？",
    options: ["左側中央", "右側額葉", "頭頂中線 (Vertex)", "枕葉中線"],
    answer: 2,
    explain: "z = zero（中線）；C = Central；Cz 正在頭頂正中央（Vertex），常作參考電極或紀錄 vertex 波。",
  },
  {
    q: "10-20 系統的電極命名規則中，下列何者錯誤？",
    options: [
      "奇數編號在左、偶數在右",
      "字母對應腦區（F=額、P=頂、O=枕、T=顳）",
      "z 代表中線",
      "數字越大表示離中線越近",
    ],
    answer: 3,
    explain: "數字越大表示離中線越遠（例如 F7 比 F3 更外側）。其餘三項都是正確規則。",
  },
  {
    q: "EEG 記錄系統中，電極阻抗的建議值約為？",
    options: [
      "應 < 5 kΩ 且通道之間差 < 1 kΩ",
      "應 > 100 kΩ 才安全",
      "越高越好，可阻擋雜訊",
      "與品質無關"
    ],
    answer: 0,
    explain: "課本：電極阻抗應 < 5 kΩ 且各通道間差距 < 1 kΩ。阻抗太高會把真實 EEG 蓋掉。",
  },
  {
    q: "下列何者『不是』 EEG 訊號調理階段常用的濾波器？",
    options: [
      "0.5 Hz 高通濾波器（去 baseline drift）",
      "50/60 Hz Notch 濾波器（去電源雜訊）",
      "50–70 Hz 低通濾波器（去高頻雜訊）",
      "1 kHz 帶通濾波器（強化 γ 波）"
    ],
    answer: 3,
    explain: "EEG 主要頻段 < 100 Hz，多在 100 Hz 以下使用低通；不需要 1 kHz 帶通。0.5 Hz HPF、50/60 Hz Notch、50–70 Hz LPF 都是標準配置。",
  },
  {
    q: "若 128 個電極以 500 Hz 採樣、16-bit 量化錄製 1 小時 EEG，所需儲存空間最接近？",
    options: ["0.45 MB", "0.45 GB", "4.5 GB", "45 GB"],
    answer: 1,
    explain: "128 × 60 × 60 × 500 × 16 bits ≈ 3.68 Gbits ≈ 0.45 GB（書本計算）。",
  },
  {
    q: "電皮質圖 ECoG（Electrocorticography）的主要特徵是？",
    options: [
      "把電極直接放在大腦皮質表面",
      "把電極貼在頭髮上",
      "用 fMRI 機台量測",
      "完全不需手術即可記錄"
    ],
    answer: 0,
    explain: "ECoG = iEEG，是把電極陣列直接置於暴露的大腦皮質表面，常用於癲癇灶定位與 BCI 復健。",
  },
  {
    q: "Stentrode™ 是什麼樣的裝置？",
    options: [
      "外接式頭戴 EEG 帽",
      "可由血管送入運動皮質附近的小型網管支架電極",
      "光學腦造影機",
      "fMRI 線圈"
    ],
    answer: 1,
    explain: "Stentrode 是約 4 mm 直徑的網管狀電極，從腦血管送入運動皮質附近，避免開顱手術，可協助癱瘓病人重建運動意圖訊號。",
  },
  {
    q: "睡眠分期中，N2 期最具代表性的 EEG 標記是？",
    options: [
      "α 波與 β 波",
      "Sleep spindle 與 K-complex",
      "持續 γ 波",
      "REM 動作偽訊"
    ],
    answer: 1,
    explain: "N2 期出現紡錘波 (sleep spindle, 11–15 Hz) 與 K-complex 是經典標記。深睡 N3 才是大量 δ；REM 期 EEG 反而類似清醒。",
  },
  {
    q: "下列何者『不是』睡眠障礙？",
    options: [
      "OSA 阻塞性睡眠呼吸中止",
      "Narcolepsy 嗜睡症",
      "PLMD 週期性肢動症",
      "Dyslexia 失讀症"
    ],
    answer: 3,
    explain: "Dyslexia 屬於發展性閱讀障礙（精神／神經發展類），不是睡眠障礙。其餘三項都是睡眠相關。",
  },
  {
    q: "精神疲勞 (Mental Fatigue) 對 EEG 的主要影響是？",
    options: [
      "節律本身大幅改變（α 完全消失）",
      "腦網路同步性與連結性下降，左右腦同步降低；ERP（如 P3b）振幅下降、潛伏期變長",
      "γ 波大量增加",
      "睡眠紡錘波出現在清醒時"
    ],
    answer: 1,
    explain: "課本指出疲勞主要不是改變節律本身，而是改變腦網路連結；ERP（特別 P3b）振幅下降、latency 增長。",
  },
  {
    q: "依 Valence Hypothesis，下列何者較符合？",
    options: [
      "正向情緒 → 左前額葉相對活化（α 下降）",
      "正向情緒 → 右前額葉相對活化",
      "負向情緒 → 左前額葉相對活化",
      "情緒與腦半球不對稱無關"
    ],
    answer: 0,
    explain: "Valence 假說：正向情緒對應左半球相對活化、α 功率下降；負向情緒則右半球更活躍。",
  },
  {
    q: "Alzheimer's Disease (AD) 患者的 EEG 典型變化是？",
    options: [
      "α 變慢、θ/δ 增加、β 可能下降",
      "γ 波突然完全消失",
      "出現持續性 14–16 Hz spindle",
      "EEG 變成完全平直"
    ],
    answer: 0,
    explain: "AD 的 EEG 後腦 α 變慢、θ 與 δ 活動增加、β 可能下降；嚴重時出現三相波與癲癇樣放電。",
  },
  {
    q: "下列哪一項 EEG 特徵最具 CJD (Creutzfeldt-Jakob Disease) 的特異性？",
    options: [
      "瀰漫 α 波增多",
      "每秒一次的週期性尖波複合 (periodic sharp wave complexes)",
      "β 波突增",
      "K-complex 在清醒時出現"
    ],
    answer: 1,
    explain: "CJD 發病後約 3 個月會出現大約每秒一次的週期性尖波複合，加上背景活動下降，是 EEG 高度特異性指標。",
  },
  {
    q: "Tonic–clonic 癲癇大發作 (Grand mal) 的 EEG 特徵是？",
    options: [
      "3 Hz 廣泛慢尖波複合",
      "6–12 Hz 規律尖波，全電極可見、額部最強",
      "20 Hz 微小波，僅 O1/O2 可見",
      "Sleep spindle 增加"
    ],
    answer: 1,
    explain: "Tonic-clonic 是最常見的癲癇大發作，6–12 Hz 規律尖波擴及全頭、額部最強。Petit mal 才是 3 Hz 慢尖波。",
  },
  {
    q: "區分癲癇 spike 與肌電/心電偽訊的主要方式是？",
    options: [
      "癲癇是一過性雜訊，偽訊才是規律重複",
      "癲癇 spike 規律重複且具特定形態；ECG QRS 約 1 Hz 形狀完全不同",
      "兩者完全無法區分",
      "癲癇 spike 永遠 > 1 mV"
    ],
    answer: 1,
    explain: "癲癇 spike 為規律、重複且具特定形態的波形；多數偽訊是一過性或雜訊樣；ECG QRS 約 1 Hz 形態與癲癇差很多。",
  },
  {
    q: "下列關於老化對 EEG 的影響，何者正確？",
    options: [
      "α 頻率上升",
      "α 頻率下降、θ/δ 慢波雙側性增多",
      "γ 波完全消失",
      "REM 睡眠時間明顯增加"
    ],
    answer: 1,
    explain: "老化最常見的 EEG 異常是 α 頻率下降；θ/δ 慢波雙側增多並與認知功能下降相關。REM 通常變短而非變長。",
  },
  {
    q: "在 BCI 應用中，用於記錄左右手指運動意圖最常選用的電極是？",
    options: ["Fp1 / Fp2", "C3 / C4", "O1 / O2", "T3 / T4"],
    answer: 1,
    explain: "C3 對應右手指、C4 對應左手指運動皮質（左右交叉）。μ 節律會在做（或想像）動作時下降，是 BCI 的核心特徵。",
  },
  {
    q: "下列何種藥物會使 EEG 出現顯著 β 波增強，並在停藥後仍持續約 2 週？",
    options: ["巴比妥 (Barbiturate)", "Lithium 鋰鹽", "Benzodiazepine 苯二氮平", "三環抗鬱劑"],
    answer: 2,
    explain: "苯二氮平類（如 Valium）會大幅增強 β 波並降低 α 振幅，效應停藥後可持續約兩週。",
  },
  {
    q: "深度麻醉到末期會出現什麼樣的 EEG 形態？",
    options: [
      "持續高頻 β 與 γ",
      "Burst-suppression（爆發-抑制）模式，最終 EEG 趨於平直",
      "持續 spindle",
      "α 波振幅顯著上升"
    ],
    answer: 1,
    explain: "麻醉初期出現額部快活動；深層出現慢且大的活動；末期出現 burst-suppression，最後 EEG 活動停止。",
  },
  {
    q: "μ Mu 節律的特點是？",
    options: [
      "由視覺皮質產生，與閉眼有關",
      "在中央 (Rolandic) 區與運動皮質有關，做或想像動作會被壓掉",
      "出現在 0.5–2 Hz 的深睡期",
      "和情緒處理無關"
    ],
    answer: 1,
    explain: "μ 節律位於 Rolandic 中央區，與運動皮質連動；實際動作或運動想像會把它壓掉，是 BCI 的關鍵特徵。",
  },
  {
    q: "下列何者是侵入式 (invasive) 紀錄的『非』典型方法？",
    options: [
      "ECoG（皮質貼附電極）",
      "Foramen ovale 電極（顳葉深部）",
      "Stentrode（血管內網管支架）",
      "標準頭皮 10-20 電極帽"
    ],
    answer: 3,
    explain: "標準 10-20 是非侵入式頭皮 EEG。其他三項都是侵入式或微創方法。",
  },
  {
    q: "在情緒辨識的機器學習研究中，下列哪一組特徵『不是』課文提到的常用特徵？",
    options: [
      "PSD（功率譜密度）",
      "DE（微分熵）",
      "DASM / RASM / ASM（不對稱性）",
      "心律變異 HRV"
    ],
    answer: 3,
    explain: "課文列出的情緒辨識特徵為 PSD、DE、DASM、RASM、ASM、DCAU；HRV 來自心電而非 EEG。",
  },
  {
    q: "依 Sharbrough 的分類，下列何者不屬於『非特異性 EEG 異常』的三大類？",
    options: [
      "瀰漫間歇性慢波（δ 為主）",
      "雙側持續性異常 EEG",
      "局部持續性異常 EEG",
      "三分鐘規則的眼動偽訊"
    ],
    answer: 3,
    explain: "Sharbrough 提出三大類：(i) 瀰漫間歇性慢波 (ii) 雙側持續性異常 (iii) 局部持續性異常。眼動偽訊屬於生理偽訊範疇。",
  },
  {
    q: "K-complex 與 sleep spindle 主要出現在哪一個睡眠期？",
    options: ["清醒", "N1", "N2", "REM"],
    answer: 2,
    explain: "K-complex 與 spindle 是 N2 期的標記，延伸至 N3 深睡（也含大量 δ）。REM 期 EEG 反而像清醒。",
  },
];

window.QUESTIONS_CH02 = QUESTIONS_CH02;
