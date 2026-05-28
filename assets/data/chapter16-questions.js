/* ============================================================
   Chapter 16 題庫 — EEG As A Biomarker for Psychiatric and
                    Neurodevelopmental Disorders
   作者：葉欲禾 (Gary Yu-Ho YEH) ・ 鄭鈞 (Jacob Cheng)
   ============================================================ */
const QUESTIONS_CH16 = [
  {
    q: "下列何者『不屬於』神經發育疾病 (NDDs)？",
    options: ["ADHD", "ASD", "思覺失調 (Schizophrenia)", "庫賈氏症 (CJD)"],
    answer: 3,
    explain: "ADHD、ASD、思覺失調都被歸入 NDDs。CJD 是普利昂引起的神經退化性疾病，不是 NDD。",
  },
  {
    q: "在 ADHD 的 EEG 研究上，最早被報告的特徵（Jasper 等人，1938）是？",
    options: [
      "額中央區的 EEG 節律變慢",
      "枕葉 α 波消失",
      "全腦 γ 大量增加",
      "睡眠紡錘波頻率變高",
    ],
    answer: 0,
    explain: "Jasper 等人在 1938 年觀察到 ADHD（當時稱為『行為問題兒童』）有額中央區的慢化現象，這是 EEG 在 ADHD 的最早線索。",
  },
  {
    q: "ADHD 最廣為使用的單變量 EEG 指標是？",
    options: [
      "Cz 的 α/β 比",
      "Cz 的 θ/β 比",
      "Pz 的 P300 振幅",
      "Fz 的 δ 能量",
    ],
    answer: 1,
    explain: "ADHD 兒童 θ 上升、β 下降，所以 Cz 的 θ/β ratio 是最知名的單變量指標（約 0.6–3.0）。",
  },
  {
    q: "θ/β ratio 在 ADHD 診斷上有什麼主要限制？",
    options: [
      "完全沒有臨床意義",
      "有強烈年齡效應，從兒童到成年自然下降，需用年齡校正",
      "只能在睡眠中測量",
      "只在女性身上有用",
    ],
    answer: 1,
    explain: "Nuwer 等人指出 θ/β 比值隨年齡顯著下降，對成人 ADHD 鑑別力低，必須建立年齡基準線。",
  },
  {
    q: "在 ADHD 患者的 ERP 中，下列哪一個成分通常下降，反映自動錯誤偵測受損？",
    options: ["N100", "ERN", "VEP", "Late positive complex"],
    answer: 1,
    explain: "ERN（error-related negativity，發生在錯誤反應後 50–100 ms）在 ADHD 中振幅下降，反映自動錯誤偵測受損；Pe 同樣下降。",
  },
  {
    q: "ASD 在腦連結度上的標誌性模式是？",
    options: [
      "本地短距連結 ↓、跨半球長距連結 ↑",
      "本地短距連結 ↑、跨半球長距連結 ↓",
      "所有頻段都顯著下降",
      "γ 完全消失",
    ],
    answer: 1,
    explain: "ASD 兒童早期腦過度發育導致『過度的局部連結 + 不足的長距離連結』，這也是社交統合困難的可能基礎。",
  },
  {
    q: "把 EEG 訊號轉成 bispectrum 2D 圖像、再用 LSDA 維度縮減 + PNN 分類，是哪一種疾病的常見做法？",
    options: ["AD", "ASD", "失眠", "CJD"],
    answer: 1,
    explain: "在 ASD 的 EEG 分析中，作者把 HOS（高階譜，含 bispectrum）轉成圖像，用 LSDA + PNN 只用 5 個特徵就達到優異效果。",
  },
  {
    q: "下列何者『不是』憂鬱症 EEG 的典型發現？",
    options: [
      "HFD（Higuchi 分形維度）比健康人高",
      "Sample Entropy 比健康人高",
      "P300 振幅顯著上升",
      "左右額葉 α 不對稱",
    ],
    answer: 2,
    explain: "憂鬱症患者的 P300 振幅是『下降』而非上升；其餘三項都是常被報告的憂鬱症 EEG 特徵。",
  },
  {
    q: "對於 rTMS 治療反應者，下列敘述何者正確？",
    options: [
      "憂鬱者 HFD 全頻段下降；躁鬱者 δ、θ 上升",
      "兩種疾病的 HFD 反應完全相同",
      "rTMS 完全無法改變 EEG",
      "只有 γ 頻段會變化",
    ],
    answer: 0,
    explain: "Klonowski 等發現：憂鬱反應者 rTMS 後 HFD 在幾乎全頻段下降；躁鬱反應者在 δ、θ 上升 — 同指標反方向，用以區分兩種疾病。",
  },
  {
    q: "BP（躁鬱症）與思覺失調的 EEG 相同點包括？",
    options: [
      "兩者都有半球內 α coherence 上升",
      "兩者完全沒有任何重疊",
      "都會出現 PSWC",
      "都會在所有頻段下降",
    ],
    answer: 0,
    explain: "兩者都在半球內顯示 α coherence 上升；不同的是：BP 高頻能量 ↑、思覺失調低頻跨半球連結 ↑。",
  },
  {
    q: "思覺失調的 EEG 在『靜息態複雜度 (LZC)』上的表現是？",
    options: [
      "完全等於健康人",
      "靜息態 LZC 上升，但執行任務時下降（與健康者相反）",
      "靜息態與任務態都下降",
      "靜息態與任務態都上升",
    ],
    answer: 1,
    explain: "Fernández 等發現思覺失調的 LZC 在靜息態高於健康人，做任務時反而下降；健康者反過來。這個『翻轉』是有意思的鑑別點。",
  },
  {
    q: "下列何者『不是』思覺失調 EEG 的典型特徵？",
    options: [
      "δ 增加，前扣帶與顳葉融合迴最強",
      "γ 在靜息態升高，與症狀嚴重度相關",
      "MMN 與 P3a 振幅顯著下降",
      "完全沒有 EEG 異常",
    ],
    answer: 3,
    explain: "思覺失調有很多 EEG 異常：δ、γ、MMN、P3a 都有變化。選項 D 是錯誤敘述。",
  },
  {
    q: "GAD（廣泛性焦慮症）患者在 EEG 上，擔憂時最明顯的頻段變化是？",
    options: [
      "α 大幅上升",
      "γ 明顯升高（治療後接近正常）",
      "δ 顯著下降",
      "θ 完全消失",
    ],
    answer: 1,
    explain: "Oathes 等發現 GAD 患者 worry 期間 γ 明顯高於基線與放鬆狀態；療程後 γ 趨近正常。",
  },
  {
    q: "焦慮的 EEG + 眼動多模態分析中，常用的特徵融合方法是？",
    options: [
      "FFT",
      "Group Sparse CCA (GSCCA)",
      "Bessel transform",
      "Linear regression only",
    ],
    answer: 1,
    explain: "Group Sparse CCA 把兩種模態的特徵以相關性投影到共同空間，並透過 group sparsity 處理區域結構資訊。",
  },
  {
    q: "失眠分析常結合的『另一種感測資料』是？",
    options: ["EMG 肌電", "Actigraphy 活動量計", "ECoG 皮質腦波", "PET 正子造影"],
    answer: 1,
    explain: "Actigraphy 量手腕活動量，便宜且非侵入；與 PSG (含 EEG) 結合是失眠常見方案。",
  },
  {
    q: "下列關於 schizotypal（分裂型）的敘述何者正確？",
    options: [
      "完全等同於思覺失調",
      "是介於正常與思覺失調之間，且可能發展為思覺失調",
      "屬於癲癇的一種",
      "與睡眠失調完全相同",
    ],
    answer: 1,
    explain: "Schizotypy 是分裂型人格，非精神病性但有怪異感知、社交退縮，被視為思覺失調的譜系傾向。",
  },
  {
    q: "用 LORETA 比較思覺失調與分裂型 / 憂鬱，前扣帶 δ 的變化是？",
    options: [
      "思覺失調 δ 上升、分裂型/憂鬱 δ 下降",
      "兩者一樣",
      "思覺失調 δ 下降、分裂型/憂鬱 δ 上升",
      "完全沒變化",
    ],
    answer: 0,
    explain: "在 LORETA 分析中，思覺失調的前扣帶 δ 明顯上升；分裂型與憂鬱反而呈 δ、θ、β 下降。",
  },
  {
    q: "下列何者『最不可能』是 ASD 的 EEG 特徵？",
    options: [
      "γ 頻段相位同步異常",
      "sample entropy 等複雜度指標的改變",
      "局部短距連結 ↑、長距連結 ↓",
      "整個皮質 δ 大幅持續放電",
    ],
    answer: 3,
    explain: "整體 δ 持續性放電比較像思覺失調或某些昏迷狀態，不是 ASD 的典型特徵。",
  },
  {
    q: "在 ADHD 多變量機器學習中，下列何者『不是』常用特徵？",
    options: [
      "分形維度 (Higuchi, Petrosian, Katz)",
      "自迴歸係數",
      "Wavelet 係數",
      "心電 PR 間期",
    ],
    answer: 3,
    explain: "PR 間期屬於 ECG，不是 EEG 特徵。其他三項都是 ADHD 多變量分析常用的 EEG 特徵。",
  },
  {
    q: "下列哪一組 ERP 成分常用於評估 ADHD 的衝動控制與錯誤偵測？",
    options: [
      "VEP (visual evoked potential)",
      "P200, P300, N200, ERN, Pe",
      "Slow cortical potential drift",
      "Sleep spindle",
    ],
    answer: 1,
    explain: "P200/P300 評估注意力、N200 評估反應抑制、ERN/Pe 評估錯誤偵測 — 都是 ADHD 文獻中標準的 ERP 組合。",
  },
  {
    q: "elastic net 在 ADHD EEG 分類研究中為何優於 LASSO？",
    options: [
      "elastic net 同時用 L1 + L2 正則化，提升結果穩定性",
      "elastic net 比較快",
      "elastic net 不需要訓練資料",
      "兩者完全相同",
    ],
    answer: 0,
    explain: "elastic net 的解 = arg min wᵀ(XᵀX + λ₂I)/(1+λ₂)w - 2yᵀXw + λ₁||w||₁；λ₂ 提升穩定性，這是 elastic net 比純 LASSO 的優勢。",
  },
  {
    q: "在憂鬱症的 Stroop ERP 研究中，下列觀察何者正確？",
    options: [
      "P300 與 N450 振幅都『下降』，反應時間延長",
      "P300 上升、N450 下降",
      "所有 ERP 都不變",
      "只有 N100 變化",
    ],
    answer: 0,
    explain: "Stroop 一致 / 不一致任務下，憂鬱患者 P300 與 N450 都明顯下降；反應時間延長約 40 ms。",
  },
  {
    q: "在思覺失調的 EEG 機器學習研究中，下列何者『不是』常用的特徵提取技術？",
    options: [
      "Isomap",
      "EM-PCA",
      "PLS 非線性回歸",
      "Bayesian Network Inference (BNI)",
    ],
    answer: 3,
    explain: "Aristizabal 等用 PLS、EM-PCA、Isomap 三種特徵，再用演化算法優化、Adaboost/Naïve Bayes 分類；BNI 不是其方法。",
  },
  {
    q: "對於 BP 與思覺失調的鑑別，研究者使用了什麼樣的視覺刺激方法？",
    options: [
      "閉眼放鬆",
      "16 Hz 光刺激 95 秒，誘發 SSVEP 並評估統計量",
      "聽覺 odd-ball",
      "完全沒有刺激",
    ],
    answer: 1,
    explain: "Hess 等用 16 Hz 光刺激 95 秒，誘發 SSVEP，用 mean/skewness/kurtosis 等統計量在額部與枕部顯示兩組顯著差異。",
  },
  {
    q: "下列關於 EEG 在精神疾病應用的『正確』總結是？",
    options: [
      "EEG 單獨可以確診所有精神疾病",
      "EEG 是輔助生物標記，結合行為、病史與多模態可大幅提升準確度",
      "EEG 與精神疾病無關",
      "只有 fMRI 才有用，EEG 沒貢獻",
    ],
    answer: 1,
    explain: "因為症狀重疊嚴重，沒有任何單一 EEG 特徵能獨立確診。但結合多模態（EEG + 行為 + 病史 + 影像）可顯著提升準確度。",
  },
];
window.QUESTIONS_CH16 = QUESTIONS_CH16;
