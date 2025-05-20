FROM node:18-alpine

# 創建應用目錄
WORKDIR /app

# 複製package.json和package-lock.json
COPY package*.json ./

# 安裝依賴
RUN npm ci --only=production

# 複製應用代碼
COPY . .

# 創建必要的目錄
RUN mkdir -p logs public/images
RUN chmod 777 logs public/images

# 暴露端口
EXPOSE 3000

# 啟動應用
CMD ["node", "app.js"]