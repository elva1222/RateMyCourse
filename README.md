# 🎓 RateMyCourse | 全方位校園修課評價系統

這是一個為大學生設計的現代化修課評價平台。透過直觀的五維度評分系統與即時搜尋功能，幫助學生在選課季不再踩雷，輕鬆找到最適合自己的課程。

## 🌟 核心特色

- **五維度深度評價**：不僅僅是打星級，更包含作業壓力、通過率、考題難度、學習收穫及課程趣味。
- **現代化縮放介面**：採用全螢幕響應式佈局，完美適配各種解析度，提供極致的瀏覽體驗。
- **三大課程類別**：內建「必修」、「選修」、「通識」標籤，支援快速分類篩選。
- **學生自主共建**：開放學生自行新增課程卡片，打破資訊不對稱。
- **極速搜尋與排序**：可依最新發布、推薦度、作業量或通過率即時排序課程。

## 🛠️ 技術棧

### 前端 (Client)
- **Vue 3 (Composition API)**：高性能的響應式框架。
- **Vite**：下一代前端構建工具。
- **Axios**：優雅的非同步請求處理。
- **CSS 3**：現代化 Flex/Grid 佈局，實現無死角全螢幕效果。

### 後端 (Server)
- **Node.js + Express**：輕量、高效的 REST API 伺服器。
- **Better-SQLite3**：高性能的同步 SQLite 資料庫驅動，確保資料讀取穩定。
- **CORS**：完善的跨網域資源共享配置。

## 📁 專案結構

```text
RateMyCourse/
├── client/              # 前端 Vue 專案
│   ├── src/
│   │   ├── components/  # 模組化 UI 組件 (Navbar, CourseCard...)
│   │   ├── App.vue      # 應用核心容器
│   │   └── main.js
│   └── vite.config.js
└── server/              # 後端 Express 專案
    ├── app.js           # API 邏輯與資料庫初始化
    ├── school.db        # SQLite 資料庫檔案
    └── package.json
```

## 🚀 快速開始

### 1. 啟動後端伺服器
```bash
cd server
npm install
node app.js
```

### 2. 啟動前端介面
```bash
cd client
npm install
npm run dev
```

---
*本專案係基於校園資訊網站課程需求實作，旨在提供更透明、友好的校園學習環境。*