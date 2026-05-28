/* ============================================================
   Chapter 18 題庫 — Joint Analysis of EEG and Other
                    Simultaneously Recorded Modalities
   作者：葉欲禾 (Gary Yu-Ho YEH)
   ============================================================ */
const QUESTIONS_CH18 = [
  {
    q: "為什麼要同步記錄 EEG 與其他造影模態？",
    options: [
      "純粹是為了多花錢買設備",
      "互補時間解析度（EEG）與空間解析度（fMRI/MEG/fNIRS）",
      "EEG 已經完美，不需要其他模態",
      "為了減少資料量",
    ],
    answer: 1,
    explain: "EEG 時間解析度好但空間差；fMRI 與 MEG/fNIRS 在空間上比較好。同步記錄能互補。",
  },
  {
    q: "BOLD（Blood Oxygenation Level Dependence）是？",
    options: [
      "直接量神經元放電的方法",
      "fMRI 中反映血氧變化的訊號",
      "EEG 的一種頻段",
      "MEG 的雜訊源",
    ],
    answer: 1,
    explain: "BOLD 是 fMRI 的核心訊號，反映 deoxyhaemoglobin（HbR）濃度變化造成的 NMR 訊號變化。",
  },
  {
    q: "下列關於 HbO 與 HbR 磁性的敘述何者正確？",
    options: [
      "HbO 順磁性、HbR 反磁性",
      "HbO 反磁性、HbR 順磁性",
      "兩者磁性相同",
      "兩者完全沒有磁性",
    ],
    answer: 1,
    explain: "氧合血紅蛋白 HbO 是反磁性（不影響磁場）；去氧 HbR 是順磁性（造成磁敏感度變化）。所以神經活動 → HbR ↓ → BOLD ↑。",
  },
  {
    q: "HRF（血氧反應函數）的峰值通常出現在刺激後幾秒？",
    options: ["0.1 秒", "1 秒", "5–6 秒", "30 秒"],
    answer: 2,
    explain: "HRF 通常用兩個 gamma 函數差建模，主峰約在刺激後 5–6 秒；之後有下衝再回到基線。",
  },
  {
    q: "下列何者『不是』fMRI 的常見資料格式？",
    options: ["DICOM", "ANALYZE", "NIFTI", "EDF (European Data Format)"],
    answer: 3,
    explain: "EDF 是 EEG / 多導生理訊號格式。fMRI 用 DICOM、ANALYZE、NIFTI 三種主要格式。",
  },
  {
    q: "fMRI 的兩種主要實驗設計是？",
    options: [
      "Block design 與 Event-related design",
      "Wavelet design 與 Spectrum design",
      "Static design 與 Dynamic design",
      "Single design 與 Group design",
    ],
    answer: 0,
    explain: "Block design 是固定週期交替（SNR 高）；Event-related 是隨機刺激（可看時間細節）。兩者各有優點。",
  },
  {
    q: "fNIRS 用的近紅外光波長範圍大致是？",
    options: ["300–500 nm", "650–950 nm（NIR window）", "1500–2000 nm", "10 μm 以上"],
    answer: 1,
    explain: "fNIRS 用約 700–1000 nm 的近紅外光，這段是生物組織『透明窗口』，能穿過頭皮、顱骨到皮質表層。",
  },
  {
    q: "Modified Beer–Lambert Law 中的 DPF（differential path-length factor）是用來？",
    options: [
      "修正光因為散射而走得比直線更長的事實",
      "標準化光強度單位",
      "計算 EEG 的振幅",
      "去除 60 Hz 干擾",
    ],
    answer: 0,
    explain: "光在組織中會散射，實際路徑長於 source-detector 直線距離。DPF 把這個額外路徑因素加進去，避免低估吸收。",
  },
  {
    q: "MEG 量測的是？",
    options: [
      "神經元的電位差",
      "神經元電流產生的磁場",
      "血液中的氧含量",
      "細胞膜的離子濃度",
    ],
    answer: 1,
    explain: "MEG 量神經元電活動所產生的磁場（每個來源近似為電流偶極 ECD）。磁場不會被顱骨衰減。",
  },
  {
    q: "MEG 相對於 EEG 的主要優點是？",
    options: [
      "磁場通過顱骨不受扭曲，空間解析度較好",
      "設備便宜便攜",
      "可在家中操作",
      "完全沒有雜訊",
    ],
    answer: 0,
    explain: "MEG 的磁場直接穿透顱骨，無體積傳導扭曲，空間解析度比 EEG 好；但設備極貴、需磁屏蔽、冷凍。",
  },
  {
    q: "EEG 在 MRI 環境下兩大偽影是？",
    options: [
      "α 與 β 偽影",
      "Gradient artefact 與 BCG artefact",
      "EOG 與 EMG 偽影",
      "60 Hz 與電源偽影",
    ],
    answer: 1,
    explain: "MRI 中：Gradient artefact 來自影像取得時的磁場梯度變化；BCG artefact 來自電極因心跳在磁場中微動所感應的訊號。",
  },
  {
    q: "Gradient artefact 的特性是？",
    options: [
      "幅度可達 EEG 平均的 100 倍，但時間上相當穩定",
      "完全隨機、無法去除",
      "只在 EEG 振幅小於 10 μV 時出現",
      "與心跳同步",
    ],
    answer: 0,
    explain: "Gradient artefact 振幅極高（~100× EEG），但因為來自固定的成像序列，時間相當穩定，可以用平均樣板 (AAS) 去除。",
  },
  {
    q: "AAS（Average Artefact Subtraction）的核心觀念是？",
    options: [
      "對所有資料做 PCA",
      "用對齊 trigger 的多次偽影平均作為樣板，從原訊號減掉",
      "用 ICA 自動分離出所有來源",
      "用 wavelet 多解析度過濾",
    ],
    answer: 1,
    explain: "AAS 在偽影時間穩定時最有效：把對齊的多次偽影平均成樣板，再從每段訊號減掉樣板。",
  },
  {
    q: "BCG（彈道心動圖）偽影為何特別難處理？",
    options: [
      "它非常微弱，幾乎看不見",
      "它形狀會隨心跳節律、姿勢、運動而變動，不適合單一樣板",
      "它只在 γ 頻段出現",
      "它與 EEG 的時間尺度完全不同",
    ],
    answer: 1,
    explain: "BCG 是『擬週期但會變』，不像 gradient 那麼穩定。要用 adaptive AAS、ICA、OBS、DHT 等更彈性的方法。",
  },
  {
    q: "OBS（Optimal Basis Set）用什麼方法建構 BCG 樣板？",
    options: [
      "PCA 取前幾個主成分",
      "FFT 取最低頻成分",
      "Wavelet 取奇數係數",
      "MFCC（語音特徵）",
    ],
    answer: 0,
    explain: "Niazy 等的 OBS：把每段 BCG trial 堆起來做 PCA，取前幾個主成分作為基函數，用以擬合與減除每個 trial 的 BCG。",
  },
  {
    q: "ICA 用於 BCG 偽影去除的最大挑戰是？",
    options: [
      "ICA 計算量太大",
      "決定要剔除幾個 IC 作為 BCG（文獻數字從 1 到 6 不等，刪少有殘留、刪多會失去資訊）",
      "ICA 完全無法分離 BCG",
      "ICA 需要 ECG 參考訊號",
    ],
    answer: 1,
    explain: "ICA 不依賴 ECG 也能分離 BCG，但選對剔除幾個元件是難題：剔太少 BCG 殘留、剔太多會傷到 EEG。",
  },
  {
    q: "Ferdowsi 等的『混合 ICA + DHT』方法主要在解決什麼問題？",
    options: [
      "純 ICA 對選元件數敏感、純 DHT 需要大量基函數，混合可同時改善",
      "讓 EEG 振幅變大 100 倍",
      "降低取樣率",
      "完全取代 fMRI",
    ],
    answer: 0,
    explain: "ICA 先取出 BCG 相關元件，再用 DHT 對每個 BCG 來源建模，這樣對偽影時變更穩健，也減少 DHT 需要的基函數數量。",
  },
  {
    q: "GLM（General Linear Model）在 fMRI 中是用來？",
    options: [
      "去除頭部運動偽影",
      "把每個 voxel 的時間序列分解成『刺激 × HRF』組合，找出顯著激活的 voxel",
      "計算 EEG 的功率譜",
      "降取樣到 1 Hz",
    ],
    answer: 1,
    explain: "GLM 是 fMRI 標準做法：x = Yb + e，Y 是刺激 × HRF 的設計矩陣，解 b 後對 voxel 做 t-test，挑出顯著激活區。",
  },
  {
    q: "下列何種模態的『時間解析度』最差？",
    options: ["EEG", "MEG", "fMRI", "fNIRS"],
    answer: 2,
    explain: "EEG、MEG 都是毫秒級；fNIRS 約 500 ms / 掃；fMRI 則是 1–2 秒 / 切片，時間解析度最差。",
  },
  {
    q: "下列何種模態『不受顱骨影響』？",
    options: ["EEG（受顱骨衰減 ~100×）", "MEG（磁場直接穿透）", "ECG", "EOG"],
    answer: 1,
    explain: "MEG 量磁場，磁場通過顱骨不會被扭曲。EEG 訊號被顱骨大幅衰減。",
  },
  {
    q: "EEG-driven fMRI 融合策略的典型用法是？",
    options: [
      "用 EEG 特徵（如 ERP 振幅）構造 GLM regressor，找出對應 BOLD 變化",
      "用 fMRI 訊號重建 EEG 通道",
      "完全忽略 EEG 資訊",
      "只看 ECG 訊號",
    ],
    answer: 0,
    explain: "EEG-driven fMRI：把 EEG 量到的事件、ERP 振幅或頻段能量做為 GLM 的迴歸子，去尋找對應的 fMRI 激活。",
  },
  {
    q: "fMRI-driven EEG 融合策略的核心目的是？",
    options: [
      "用 fMRI 找出激活區，作為 EEG 反推源頭問題的『先驗 / 約束』",
      "完全取代 EEG 訊號",
      "把 fMRI 降頻到 1 kHz",
      "計算心跳速率",
    ],
    answer: 0,
    explain: "EEG 反推源頭解（inverse problem）有多義性。把 fMRI 的高空間解析度當作 prior，可大幅改善 EEG 源定位。",
  },
  {
    q: "對稱式（symmetric）EEG–fMRI 融合的代表方法是？",
    options: [
      "Tensor decomposition + HOPLS（高階偏最小二乘）",
      "簡單 paired t-test",
      "FFT only",
      "60 Hz notch filter",
    ],
    answer: 0,
    explain: "對稱式融合同時學兩種模態的潛在表徵，常用張量分解（Tucker 模型）+ HOPLS 找跨模態的關聯。",
  },
  {
    q: "EEG + fNIRS 整合的最大優勢是？",
    options: [
      "兩者都是頭皮上記錄、沒有電磁干擾，整合非常容易",
      "fNIRS 比 EEG 貴 100 倍",
      "兩者完全測同一個東西，整合無意義",
      "fNIRS 需要磁屏蔽室",
    ],
    answer: 0,
    explain: "fNIRS 用光、EEG 用電，互不干擾；兩者都在頭皮上做非侵入記錄，整合最容易，常用於 BCI、新生兒監測、精神疾病。",
  },
  {
    q: "在 fNIRS 訊號中，一個典型的『BOLD-like』反應是？",
    options: [
      "HbO 上升、HbR 下降，HbT 小幅上升",
      "HbO 下降、HbR 上升",
      "兩者皆下降",
      "兩者完全不變",
    ],
    answer: 0,
    explain: "任務啟動時血流補償 → HbO 顯著上升、HbR 略下降，HbT (= HbO + HbR) 小幅上升，與 fMRI 的 BOLD 機制一致。",
  },
  {
    q: "下列關於 EEG + MEG 同步的結論何者『最為正確』？",
    options: [
      "兩者整合一定優於 EEG 單獨",
      "兩者整合常常很相似，有時 EEG 反而優於合併（因 MEG 雜訊較高），但 MEG 對深層源頭與導電率敏感度高",
      "MEG 完全沒有用",
      "兩者必須在不同實驗室同時錄",
    ],
    answer: 1,
    explain: "研究顯示兩者大致一致，整合不一定總是優於 EEG 單獨（MEG 雜訊高）；MEG 的優勢在於對深層源頭、導電率變化的敏感度。",
  },
  {
    q: "為什麼說 OPM（光抽幫浦磁強計）可能改變 MEG 的格局？",
    options: [
      "OPM 不需冷凍、體積小，未來可能讓 MEG 變便攜",
      "OPM 比傳統 MEG 貴 100 倍",
      "OPM 是 fNIRS 的一種",
      "OPM 是 EEG 的舊名",
    ],
    answer: 0,
    explain: "傳統 SQUID MEG 需冷凍 + 磁屏蔽，極不便攜；OPM 是新型磁感測器，不需低溫、體積小，未來可大幅降低 MEG 使用門檻。",
  },
];
window.QUESTIONS_CH18 = QUESTIONS_CH18;
