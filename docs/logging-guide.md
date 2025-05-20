# 日誌系統使用指南

## 概述

本項目實現了統一的日誌記錄系統，遵循Node.js最佳實踐，確保所有日誌格式一致、易於閱讀和分析。日誌系統分為服務器端和客戶端兩部分。

## 服務器端日誌

### 特點

- 使用Winston日誌庫，業界標準的Node.js日誌解決方案
- 支持多種日誌級別：debug、info、warn、error
- 結構化日誌格式，包含時間戳、日誌級別、模塊名稱和消息內容
- 同時輸出到控制台和文件
- 自動創建日誌目錄和文件

### 使用方法

```javascript
// 引入日誌模塊
const createLogger = require('../utils/logger');

// 創建特定模塊的日誌記錄器
const logger = createLogger('ModuleName');

// 使用不同級別記錄日誌
logger.debug('調試信息');
logger.info('一般信息', { additionalData: 'value' });
logger.warn('警告信息');
logger.error('錯誤信息', error); // 可以傳入Error對象
```

## 客戶端日誌

### 特點

- 與服務器端日誌格式保持一致
- 根據環境自動調整日誌級別（開發環境顯示所有日誌，生產環境只顯示info及以上級別）
- 使用彩色輸出增強可讀性

### 使用方法

```javascript
// 創建特定模塊的日誌記錄器
const logger = Logger.createLogger('ClientModuleName');

// 使用不同級別記錄日誌
logger.debug('調試信息');
logger.info('一般信息', { additionalData: 'value' });
logger.warn('警告信息');
logger.error('錯誤信息', error); // 可以傳入Error對象
```

## 日誌最佳實踐

1. **選擇合適的日誌級別**
   - DEBUG: 詳細的調試信息，僅在開發環境有用
   - INFO: 一般操作信息，表示應用正常運行
   - WARN: 潛在問題或即將發生的問題
   - ERROR: 錯誤和異常情況

2. **結構化日誌內容**
   - 使用簡潔明了的消息描述事件
   - 將變量和詳細信息作為第二個參數傳遞
   - 例如：`logger.info('用戶登錄成功', { userId: 123, ip: '192.168.1.1' });`

3. **模塊命名規範**
   - 使用有意義的模塊名稱，通常是類名或文件名
   - 保持一致性，例如：'UserService', 'AuthController'

4. **錯誤日誌處理**
   - 始終傳遞完整的Error對象，而不僅僅是錯誤消息
   - 包含足夠的上下文信息以便於調試

5. **避免過度日誌**
   - 不要在循環中記錄大量重複信息
   - 避免記錄敏感信息（密碼、令牌等）

## 日誌文件位置

- 所有服務器日誌存儲在 `/logs` 目錄下
  - `app.log`: 包含所有級別的日誌
  - `error.log`: 僅包含錯誤級別的日誌