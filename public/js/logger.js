/**
 * 客戶端日誌模塊 - 提供統一的日誌記錄功能
 */
const Logger = (function() {
  // 日誌級別
  const LogLevel = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3
  };

  // 當前環境的日誌級別
  const currentLevel = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' ? 
                      LogLevel.DEBUG : LogLevel.INFO;

  // 日誌級別對應的樣式
  const styles = {
    [LogLevel.DEBUG]: 'color: #6c757d',
    [LogLevel.INFO]: 'color: #0d6efd',
    [LogLevel.WARN]: 'color: #ffc107; font-weight: bold',
    [LogLevel.ERROR]: 'color: #dc3545; font-weight: bold'
  };

  // 日誌級別對應的名稱
  const levelNames = {
    [LogLevel.DEBUG]: 'DEBUG',
    [LogLevel.INFO]: 'INFO',
    [LogLevel.WARN]: 'WARN',
    [LogLevel.ERROR]: 'ERROR'
  };

  /**
   * 創建特定模塊的日誌記錄器
   * @param {string} moduleName - 模塊名稱
   * @returns {object} - 日誌記錄器對象
   */
  function createLogger(moduleName) {
    return {
      /**
       * 記錄調試級別日誌
       * @param {string} message - 日誌消息
       * @param {object} [data] - 附加數據
       */
      debug: function(message, data) {
        logMessage(LogLevel.DEBUG, moduleName, message, data);
      },

      /**
       * 記錄信息級別日誌
       * @param {string} message - 日誌消息
       * @param {object} [data] - 附加數據
       */
      info: function(message, data) {
        logMessage(LogLevel.INFO, moduleName, message, data);
      },

      /**
       * 記錄警告級別日誌
       * @param {string} message - 日誌消息
       * @param {object} [data] - 附加數據
       */
      warn: function(message, data) {
        logMessage(LogLevel.WARN, moduleName, message, data);
      },

      /**
       * 記錄錯誤級別日誌
       * @param {string} message - 日誌消息
       * @param {Error|object} [error] - 錯誤對象或附加數據
       * @param {object} [data] - 附加數據
       */
      error: function(message, error, data) {
        if (error instanceof Error) {
          logMessage(LogLevel.ERROR, moduleName, message, { errorMessage: error.message, ...data });
          console.error(error); // 輸出完整錯誤堆棧
        } else {
          logMessage(LogLevel.ERROR, moduleName, message, error || data);
        }
      }
    };
  }

  /**
   * 內部日誌記錄函數
   * @param {number} level - 日誌級別
   * @param {string} moduleName - 模塊名稱
   * @param {string} message - 日誌消息
   * @param {object} [data] - 附加數據
   */
  function logMessage(level, moduleName, message, data) {
    if (level < currentLevel) return;

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${levelNames[level]}] [${moduleName}]`;
    
    if (data) {
      console.log(`%c${prefix} ${message}`, styles[level], data);
    } else {
      console.log(`%c${prefix} ${message}`, styles[level]);
    }
  }

  return {
    createLogger: createLogger
  };
})();