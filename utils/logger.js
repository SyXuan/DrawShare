const winston = require('winston');
const { format, transports } = winston;
const path = require('path');

// 自定義格式，包含時間戳、日誌級別、模塊名稱和消息
const customFormat = format.printf(({ level, message, timestamp, module }) => {
  return `[${timestamp}] [${level.toUpperCase()}] [${module}] ${message}`;
});

// 創建 Winston logger 實例
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    format.errors({ stack: true }),
    customFormat
  ),
  defaultMeta: { module: 'app' },
  transports: [
    // 控制台輸出
    new transports.Console({
      format: customFormat
    }),
    // 文件輸出 - 所有日誌
    new transports.File({ 
      filename: path.join(__dirname, '../logs/app.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // 文件輸出 - 僅錯誤日誌
    new transports.File({ 
      filename: path.join(__dirname, '../logs/error.log'), 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  ]
});

// 確保日誌目錄存在
const fs = require('fs');
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// 創建一個工廠函數，用於創建特定模塊的日誌記錄器
function createLogger(moduleName) {
  return {
    debug: (message, meta = {}) => {
      logger.debug(message, { ...meta, module: moduleName });
    },
    info: (message, meta = {}) => {
      logger.info(message, { ...meta, module: moduleName });
    },
    warn: (message, meta = {}) => {
      logger.warn(message, { ...meta, module: moduleName });
    },
    error: (message, error = null, meta = {}) => {
      if (error instanceof Error) {
        logger.error(`${message}: ${error.message}`, { 
          ...meta, 
          module: moduleName,
          stack: error.stack 
        });
      } else {
        logger.error(message, { 
          ...meta, 
          module: moduleName,
          additionalInfo: error 
        });
      }
    }
  };
}

module.exports = createLogger;