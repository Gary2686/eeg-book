# EEG Signal Processing &amp; Machine Learning — 互動式教材

依 Sanei &amp; Chambers, *EEG Signal Processing and Machine Learning, 2nd Edition* (2022) 設計的線上互動課程。**18 章完整內容、互動 SVG 圖示、隨機 10 題測驗**。

> 作者與授課：葉欲禾 (Gary Yu-Ho YEH) ・ 鄭鈞 (Jacob Cheng)

## 線上瀏覽

部署到 GitHub Pages 後可由 `https://gary2686.github.io/eeg-book/` 直接開啟。

## 章節列表

| # | 標題 | 主題 |
|---|------|------|
| 1 | Introduction to EEG | 神經元、動作電位、EEG 產生機制 |
| 2 | EEG Waveforms | α/β/θ/δ/γ 節律、10-20 電極系統 |
| 3 | EEG Signal Modelling | Hodgkin-Huxley、Morris-Lecar、GMM |
| 4 | Fundamentals of EEG Signal Processing | Wavelet、EMD、PCA |
| 5 | EEG Signal Decomposition | ICA、BSS、Tensor 分解 |
| 6 | Chaos &amp; Dynamical Analysis | 熵、Lyapunov、碎形、DFA |
| 7 | Machine Learning for EEG | SVM、CNN、RNN、CSP、遷移學習 |
| 8 | Brain Connectivity | Coherence、Granger、PDC、圖論 |
| 9 | Event-Related Brain Responses | P300、N100/N400、MMN、SSVEP |
| 10 | Localization of Brain Sources | Dipole、MUSIC、LORETA、Beamforming |
| 11 | Epileptic Seizure | 偵測、預測、定位、HFO |
| 12 | Sleep Recognition | 五階段、紡錘波、自動評分 |
| 13 | Mental Fatigue Monitoring | θ/α 指標、駕駛/飛行員 |
| 14 | Emotion Recognition | Valence-Arousal、DEAP/SEED |
| 15 | Neurodegenerative Diseases | AD、MCI、Parkinson |
| 16 | Psychiatric &amp; Neurodevelopmental | 思覺失調、ADHD、自閉症 |
| 17 | BCI (Brain-Computer Interfacing) | P300、SSVEP、動作想像 |
| 18 | Joint Analysis (Multimodal) | EEG+fMRI/MEG/fNIRS |

## 檔案結構

```
eeg-book/
├── index.html                # 課程首頁
├── chapters/                 # 各章 HTML
│   ├── chapter01.html
│   ├── chapter02.html
│   └── ...
├── assets/
│   ├── css/main.css          # 共用樣式
│   ├── js/
│   │   ├── api.js            # 後端 API stub（含 localStorage 備援）
│   │   ├── quiz-engine.js    # 通用測驗引擎
│   │   ├── chapter01.js      # 各章互動 JS
│   │   └── ...
│   └── data/
│       ├── chapter01-questions.js  # 各章題庫
│       └── ...
├── .nojekyll                 # 告訴 GitHub Pages 不要跑 Jekyll
└── README.md
```

## 本機開發

```bash
cd eeg-book
python -m http.server 8088
# 開啟 http://127.0.0.1:8088
```

## 後端串接（未來）

目前所有測驗成績都存在學生瀏覽器的 `localStorage`，可離線使用。要切到中央資料庫只需：

1. 編輯 `assets/js/api.js`，把 `USE_BACKEND = true`、`API_BASE` 改成你的後端網址。
2. 後端實作三個端點：

| Method | Path | Body / Response |
|--------|------|------------------|
| POST | `/api/quiz/submit` | `{chapterId, score, total, answers, durationMs, studentId, ts}` → `{ok}` |
| GET  | `/api/quiz/:chapter/bank` | → 題庫陣列 |
| POST | `/api/log` | `{name, details, ts, studentId}` → `{ok}` |

## 換主題色

打開 `assets/css/main.css`，修改最上方 `:root` 內的 CSS 變數即可整站換色。

## 章節擴增 / 改寫

每章三個檔案：HTML（教材內容）+ questions.js（題庫）+ chapterXX.js（互動）。新增章節只需仿照既有結構即可。

---

© 版權所有　葉欲禾 (Gary Yu-Ho YEH) ・ 鄭鈞 (Jacob Cheng)
