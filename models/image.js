const path = require('path');
const fs = require('fs');
const moment = require('moment');
const createLogger = require('../utils/logger');

// 創建圖片模型日誌記錄器
const logger = createLogger('Image');

class Image {
  constructor(db) {
    this.db = db;
  }

  // 保存圖片信息到數據庫
  save(name, fileName) {
    logger.info(`開始保存圖片: ${name}`);
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO images (name, image_file_name) VALUES (?, ?)';
      this.db.run(sql, [name, fileName], function(err) {
        if (err) {
          logger.error(`保存圖片失敗: ${name}`, err);
          reject(err);
        } else {
          const result = {
            id: this.lastID,
            name,
            image_file_name: fileName,
            uploaded_at: new Date()
          };
          logger.info(`保存圖片成功: ID=${this.lastID}, 文件名=${fileName}`);
          resolve(result);
        }
      });
    });
  }

  // 獲取所有圖片
  getAll() {
    logger.info(`開始獲取所有圖片`);
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM images ORDER BY uploaded_at DESC';
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          logger.error(`獲取所有圖片失敗`, err);
          reject(err);
        } else {
          logger.info(`獲取所有圖片成功: 共${rows.length}張圖片`);
          resolve(rows);
        }
      });
    });
  }

  // 根據ID獲取圖片
  getById(id) {
    logger.info(`開始獲取圖片: ID=${id}`);
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM images WHERE id = ?';
      this.db.get(sql, [id], (err, row) => {
        if (err) {
          logger.error(`獲取圖片失敗: ID=${id}`, err);
          reject(err);
        } else {
          logger.info(`獲取圖片成功: ID=${id}`, { found: !!row });
          resolve(row);
        }
      });
    });
  }

  // 生成圖片文件名
  static generateFileName(id, name) {
    logger.debug(`開始生成圖片文件名: ID=${id}, 名稱=${name}`);
    const timestamp = moment().format('YYYYMMDDHHMMSS');
    const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `${id}_${timestamp}_${sanitizedName}.png`;
    logger.debug(`生成圖片文件名成功: ${fileName}`);
    return fileName;
  }
}

module.exports = Image;