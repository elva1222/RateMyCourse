# 修課評價系統

本專案為校園資訊網站期末專題，主題為「修課評價系統」。  
系統提供課程查詢、課程詳細資訊瀏覽、學生修課評價新增與平均評分顯示等功能，讓學生在選課前可以參考其他同學的修課心得。

## 專案參考來源

本專案參考 GitHub 上的 `Learnmore-smart/RateMinistere`。  
該專案主要提供教授搜尋與評價功能，本專題將其概念改造成以「課程」為核心的修課評價系統。

參考方向包含：

- 搜尋功能
- 評價功能
- 評論列表
- 詳細頁面設計

本專案並未直接使用原專案技術架構，而是依照課程要求使用 Vue、Express 與 SQLite 重新實作。

## 使用技術

### 前端

- Vue 3
- Vite
- JavaScript
- HTML
- CSS
- Axios

### 後端

- Node.js
- Express
- CORS
- SQLite3

### 資料庫

- SQLite

## 專案架構

```text
RateMyCourse
├── client
│   ├── src
│   │   ├── App.vue
│   │   └── main.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server
│   ├── app.js
│   ├── package.json
│   ├── package-lock.json
│   └── school.db
│
└── README.md