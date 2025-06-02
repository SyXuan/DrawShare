const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const createLogger = require('./utils/logger');
const i18n = require('./i18n');

// 創建應用程序日誌記錄器
const responseTimeLogger = createLogger('responseTime');
const logger = createLogger('app');

// 創建Express應用
const app = express();
const port = process.env.PORT || 3000;

// 設置中間件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 設置i18next中間件
app.use(i18n.handle);

// 響應時間記錄中間件
app.use((req, res, next) => {
  const start = process.hrtime();
  res.on('finish', () => {
    const diff = process.hrtime(start);
    const responseTime = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3); // 毫秒
    const clientIp = req.ip || req.headers['x-forwarded-for'] || '未知IP';
    responseTimeLogger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${responseTime} ms - IP: ${clientIp}`);
  });
  next();
});

// 設置靜態文件目錄
app.use(express.static(path.join(__dirname, 'public')));
app.use('/locales', express.static(path.join(__dirname, 'locales')));
if (!fs.existsSync(path.join(__dirname, 'public/uploads'))) {
  logger.info('上傳目錄不存在，創建"public/uploads"目錄');
  fs.mkdirSync(path.join(__dirname, 'public/uploads'));
}
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// 設置視圖引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 初始化數據庫
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  logger.info('數據目錄不存在，創建"data"目錄');
  fs.mkdirSync(dataDir);
}
const db = new sqlite3.Database(path.join(dataDir, 'drawing_share.db'), (err) => {
  if (err) {
    logger.error('無法連接到數據庫', err);
  } else {
    logger.info('已連接到SQLite數據庫');
    
    // 創建圖片表
    db.run(`CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      image_file_name TEXT,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

// 將數據庫實例添加到請求對象中
app.use((req, res, next) => {
  req.db = db;
  next();
});

// 導入路由
const uploadRouter = require('./routes/upload');
const imagesRouter = require('./routes/images');

// 使用路由
app.use('/upload', uploadRouter);
app.use('/images', imagesRouter);

// 首頁路由 - 顯示用戶名輸入頁面
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// 繪圖頁面路由
app.get('/draw', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'draw.html'));
});

// 啟動服務器
app.listen(port, () => {
  logger.info(`服務器運行在 http://localhost:${port}`);
});

module.exports = app;