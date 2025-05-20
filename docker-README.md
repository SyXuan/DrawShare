# 繪圖分享應用 Docker 部署指南

本文檔提供了使用 Docker 和 Docker Compose 部署繪圖分享應用的說明。

## 前提條件

- 安裝 [Docker](https://docs.docker.com/get-docker/)
- 安裝 [Docker Compose](https://docs.docker.com/compose/install/)

## 部署步驟

### 1. 構建並啟動容器

在項目根目錄執行以下命令：

```bash
docker-compose up -d
```

這將在後台啟動應用。首次運行時會構建 Docker 鏡像。

### 2. 查看日誌

```bash
docker-compose logs -f
```

### 3. 停止應用

```bash
docker-compose down
```

## 數據持久化

應用使用以下卷進行數據持久化：

- `./logs:/app/logs` - 應用日誌
- `./public/images:/app/public/images` - 上傳的圖片
- `./drawing_share.db:/app/drawing_share.db` - SQLite 數據庫

## 訪問應用

部署成功後，可通過以下地址訪問應用：

- 主頁：http://localhost:3000
- 繪圖頁面：http://localhost:3000/draw
- 圖片列表：http://localhost:3000/images

## 環境變量

可以在 `docker-compose.yml` 文件中修改以下環境變量：

- `NODE_ENV` - 運行環境 (production/development)
- `PORT` - 應用端口

## 故障排除

如果遇到問題，請檢查：

1. Docker 和 Docker Compose 是否正確安裝
2. 端口 3000 是否被其他應用佔用
3. 檢查容器日誌：`docker-compose logs`