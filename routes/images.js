const express = require('express');
const router = express.Router();
const path = require('path');
const Image = require('../models/image');
const createLogger = require('../utils/logger');

// 創建圖片路由日誌記錄器
const logger = createLogger('Images');

// 獲取所有圖片
router.get('/', async (req, res) => {
  try {
    const imageModel = new Image(req.db);
    const images = await imageModel.getAll();
    
    // 添加圖片URL
    const imagesWithUrls = images.map(image => ({
      ...image,
      imageUrl: `/uploads/${image.image_file_name}`,
      thumbnailUrl: `/uploads/${image.image_file_name}`
    }));
    
    // 根據Accept頭返回JSON或渲染視圖
    if (req.accepts('html')) {
      res.render('images', { images: imagesWithUrls });
    } else {
      res.json(imagesWithUrls);
    }
  } catch (error) {
    logger.error('獲取圖片列表錯誤', error);
    res.status(500).json({ 
      success: false, 
      message: '獲取圖片列表失敗' 
    });
  }
});

// 根據ID獲取圖片
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const imageModel = new Image(req.db);
    const image = await imageModel.getById(id);
    
    if (!image) {
      return res.status(404).json({ 
        success: false, 
        message: '找不到圖片' 
      });
    }
    
    // 圖片文件路徑
    const imagePath = path.join(__dirname, '../public/uploads', image.image_file_name);
    
    // 根據Accept頭返回圖片文件或JSON數據
    if (req.accepts('image/*')) {
      res.sendFile(imagePath);
    } else if (req.accepts('html')) {
      res.render('image', { image: {
        ...image,
        imageUrl: `/uploads/${image.image_file_name}`,
        thumbnailUrl: `/uploads/${image.image_file_name}`
      }});
    } else {
      res.json({
        ...image,
        imageUrl: `/uploads/${image.image_file_name}`,
        thumbnailUrl: `/uploads/${image.image_file_name}`
      });
    }
  } catch (error) {
    logger.error('獲取圖片錯誤', error);
    res.status(500).json({ 
      success: false, 
      message: '獲取圖片失敗' 
    });
  }
});

module.exports = router;