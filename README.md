# DrawShare

這是一個簡單的繪圖分享Web應用，允許用戶在畫布上繪圖，並將作品上傳到伺服器進行分享。

## 功能特點

- 使用者輸入名字
- 畫布可以選擇顏色、清除
- 使用者可以下載當前的畫布
- 送出後上傳到伺服器顯示有沒有成功，沒成功就重試

## 技術棧

### 前端
- HTML5 Canvas
- Tailwind CSS
- JavaScript

### 後端
- Node.js
- Express.js
- SQLite
- EJS (模板引擎)

## 安裝與運行

### 前提條件

- Node.js (v14+)
- npm

### 安裝步驟

1. 克隆或下載此專案

2. 安裝依賴
   ```
   npm install
   ```

3. 啟動服務器
   ```
   npm start
   ```
   或者使用開發模式（自動重啟）
   ```
   npm run dev
   ```

4. 訪問應用
   打開瀏覽器，訪問 http://localhost:3000

## API 文檔

### 上傳圖片
- **URL**: `/upload`
- **方法**: POST
- **請求體**:
  - `image`: 圖片文件
  - `name`: 用戶名
- **響應**:
  ```json
  {
    "success": true,
    "imageId": 1,
    "message": "圖片上傳成功"
  }
  ```

### 獲取所有圖片
- **URL**: `/images`
- **方法**: GET
- **響應**: 圖片列表或HTML頁面（根據Accept頭）

### 獲取單個圖片
- **URL**: `/images/:id`
- **方法**: GET
- **響應**: 圖片文件、JSON數據或HTML頁面（根據Accept頭）

## 項目結構

```
├── app.js                # 主應用文件
├── routes/              # 路由文件
│   ├── upload.js        # 處理上傳
│   └── images.js        # 處理圖片獲取
├── models/              # 數據模型
│   └── image.js         # 圖片模型
├── public/              # 靜態文件
│   └── images/          # 上傳的圖片
├── views/               # EJS視圖
│   ├── images.ejs       # 圖片列表頁面
│   └── image.ejs        # 單個圖片頁面
└── design/              # 前端設計文件
```

## 許可證

MIT