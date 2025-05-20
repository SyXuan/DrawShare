const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Image = require('../models/image');
const createLogger = require('../utils/logger');

// 創建上傳路由日誌記錄器
const logger = createLogger('Upload');

// 設置文件存儲
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../public/images'));
  },
  filename: function(req, file, cb) {
    // 文件名將在保存到數據庫後更新
    cb(null, Date.now() + '.png');
  }
});

// 文件過濾器 - 只接受圖片
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('只允許上傳圖片文件！'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 限制5MB
  }
});

// 處理圖片上傳
router.post('/', upload.single('image'), async (req, res) => {
  logger.info('開始處理新的上傳請求');
  try {
    // 檢查是否有文件上傳
    logger.debug('檢查上傳文件'); 
    if (!req.file) {
      logger.warn('未檢測到上傳文件');
      return res.status(400).json({ 
        success: false, 
        message: '沒有上傳文件' 
      });
    }

    // 檢查用戶名
    const name = req.body.name || '匿名用戶';
    logger.info('用戶名', { name });
    
    // 創建圖片模型實例
    const imageModel = new Image(req.db);
    logger.debug('創建圖片模型實例');
    
    // 保存到數據庫
    logger.info('開始保存圖片信息到數據庫', { tempFileName: req.file.filename });
    const savedImage = await imageModel.save(name, req.file.filename);
    logger.info('圖片信息已保存到數據庫', { imageId: savedImage.id });
    
    // 生成最終文件名
    const finalFileName = Image.generateFileName(savedImage.id, name);
    logger.info('生成最終文件名', { finalFileName });
    const oldPath = path.join(__dirname, '../public/images', req.file.filename);
    const newPath = path.join(__dirname, '../public/images', finalFileName);
    logger.debug('準備重命名文件', { oldPath, newPath });
    
    // 重命名文件
    fs.renameSync(oldPath, newPath);
    logger.info('文件重命名成功');
    
    // 更新數據庫中的文件名
    logger.debug('開始更新數據庫中的文件名');
    await new Promise((resolve, reject) => {
      req.db.run(
        'UPDATE images SET image_file_name = ? WHERE id = ?',
        [finalFileName, savedImage.id],
        (err) => {
          if (err) {
            logger.error('更新數據庫文件名失敗', err);
            reject(err);
          } else {
            logger.info('數據庫文件名更新成功');
            resolve();
          }
        }
      );
    });
    
    // 返回成功響應
    logger.info('上傳流程完成，返回成功響應', { imageId: savedImage.id });
    res.status(201).json({
      success: true,
      imageId: savedImage.id,
      message: '圖片上傳成功'
    });
  } catch (error) {
    logger.error('上傳過程發生錯誤', error);
    res.status(500).json({
      success: false,
      message: '服務器錯誤，上傳失敗'
    });
  }
});

module.exports = router;