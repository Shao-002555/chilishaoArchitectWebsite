# 開發者文件 (Development Documentation)

## 1. 專案概述 (Project Overview)
本網站為建築師個人作品集網站，採用 **靜態網站架構 (Static Site)**，並結合 **JavaScript 動態渲染** 技術。主要內容（如專案、想法、技能）與頁面邏輯分離，數據儲存於 JSON 檔案中，便於非技術人員透過編輯資料檔即可更新網站內容。

## 2. 技術架構 (Technical Architecture)

### 核心技術
- **HTML5**: 語義化標籤結構。
- **CSS3**: 使用 CSS Variables 定義全站主題，Reset CSS 統一樣式。
- **JavaScript (ES6+)**: Vanilla JS (純 JS)，無依賴大型框架 (如 React/Vue)。
- **JSON**: 作為簡易的資料庫 (Database)，儲存內容數據。

### 資料流向 (Data Flow)
1. 用戶訪問頁面 (如 `projects.html`)。
2. 瀏覽器載入 HTML 與 `main.js`。
3. `main.js` 偵測當前頁面存在的 DOM 容器 (如 `projects-grid`)。
4. `main.js` 非同步請求對應的 JSON 檔案 (如 `data/projects.json`)。
5. 解析 JSON 資料並動態生成 HTML 插入頁面。

## 3. 目錄結構 (Directory Structure)

```text
portfolio/
├── *.html                  # 各頁面入口文件 (index, projects, about...)
├── navbar.html             # 共用導航欄組件 (由 JS 動態載入)
├── assets/                 # 靜態資源目錄
│   ├── css/
│   │   ├── reset.css       # 瀏覽器樣式重置
│   │   ├── variables.css   # 全站變數 (顏色, 字體, 間距)
│   │   └── style.css       # 主要樣式表
│   ├── js/
│   │   ├── main.js         # 核心邏輯 (路由判斷, JSON 渲染, 資料綁定)
│   │   ├── form.js         # 表單處理
│   │   ├── scroll.js       # 滾動與導航特效
│   │   └── pdf-viewer.js   # PDF 預覽邏輯
│   └── images/             # 圖片資源庫
└── data/                   # 內容資料庫 (JSON format)
    ├── projects.json       # 專案列表與詳情
    ├── ideas.json          # 想法/文章數據
    ├── about.json          # 個人簡介與經歷
    └── skills.json         # 技能列表
```

## 4. 核心邏輯說明 (Core Logic)

### 頁面組件化 (Partial Loading)
- **導航欄 (Navbar)**: `index.html` 與其他頁面透過 `fetch('navbar.html')` 動態載入導航欄，並利用 `active` class 自動標記當前頁面。

### 核心控制器 (`assets/js/main.js`)
`main.js` 使用 IIFE 封裝，依據 DOM id 的存在與否來決定執行何種邏輯：
- **首頁 (`index.html`)**: 偵測 `featured-projects`，讀取 `projects.json` 並顯示精選專案 (前 3 筆或特定標記)。
- **專案列表 (`projects.html`)**: 偵測 `projects-grid`，讀取 `projects.json` 渲染完整列表。
- **專案詳情 (`project-detail.html`)**: 
    - 取得 URL 參數 `?id=xx`。
    - 搜尋 `projects.json` 中對應 id 的資料。
    - 渲染標題、描述、圖片牆 (Gallery)。
- **關於 (`about.html`)**: 渲染 `about.json` 與 `skills.json`。

## 5. 內容維護指南 (Content Maintenance)

### 新增專案 (Add Project)
1. 準備圖片放入 `assets/images/ProjectImage/`。
2.編輯 `data/projects.json`，新增一筆物件：
```json
{
  "id": "unique-id",
  "title": "Project Name",
  "date": "2023",
  "category": "Category Name",
  "description": "Short summary...",
  "details": ["Paragraph 1", "Paragraph 2"],
  "image": "assets/images/ProjectImage/cover.jpg",
  "gallery": [
    "assets/images/ProjectImage/img1.jpg",
    "assets/images/ProjectImage/img2.jpg"
  ]
}
```

### 新增想法 (Add Idea)
編輯 `data/ideas.json`，遵循現有格式新增項目。

## 6. CSS 樣式系統 (Styling System)
- **Variables**: 修改 `variables.css` 可一次性調整全站主色調、字體與間距。
- **Responsive**: 使用 Media Queries (`@media (max-width: 768px)`) 支援 RWD 響應式佈局。

## 7. 未來開發注意事項 (Notes for Future Devs)
1. **圖片路徑**: 在 JSON 中引用圖片時，請使用相對路徑 (相對於 html 檔案的位置)，通常為 `assets/images/...`。
2. **ID 唯一性**: `projects.json` 中的 `id` 必須唯一，這是詳情頁路由的依據。
3. **安全性**: `main.js` 中已包含 `escapeHTML` 函式，渲染文字內容時請務必使用此函式以防範 XSS 攻擊。
4. **Git協作**: 修改 JSON 檔案時請注意 JSON 語法格式 (逗號、引號)，避免造成解析錯誤導致頁面空白。
