// 首頁相關功能
function startDrawing() {
    const username = document.getElementById('username').value.trim();
    if (username) {
        // 保存用戶名到 localStorage
        localStorage.setItem('username', username);
        
        // 重定向到繪圖頁面
        window.location.href = '/draw';
    }
}

// 繪圖頁面相關功能
document.addEventListener('DOMContentLoaded', function() {
    // 檢查當前頁面是否為繪圖頁面
    if (document.querySelector('.draw-container')) {
        // 等待i18next初始化完成
        if (i18next.isInitialized) {
            const username = localStorage.getItem('username') || i18next.t('common.guest');
            document.getElementById('username-display').textContent = username;
        } else {
            i18next.on('initialized', function() {
                const username = localStorage.getItem('username') || i18next.t('common.guest');
                document.getElementById('username-display').textContent = username;
            });
        }
        
        // 初始化畫布
        initCanvas();
    }
});

function initCanvas() {
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    const container = document.querySelector('.canvas-container');
    
    // 設置畫布大小為容器大小
    function resizeCanvas() {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        // 設置白色背景
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // 初始化和窗口大小變化時調整畫布大小
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // 繪圖變量
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let currentColor = '#000000';
    let brushSize = 5;
    
    // 歷史記錄
    let history = [];
    let currentStep = -1;
    
    // 保存當前畫布狀態
    function saveState() {
        // 如果當前不是最新狀態，刪除之後的歷史記錄
        if (currentStep < history.length - 1) {
            history = history.slice(0, currentStep + 1);
        }
        
        // 保存當前畫布狀態
        history.push(canvas.toDataURL());
        currentStep = history.length - 1;
        
        // 更新上一步按鈕狀態
        updateUndoButton();
    }
    
    // 更新上一步按鈕狀態
    function updateUndoButton() {
        const undoBtn = document.getElementById('undo-btn');
        undoBtn.disabled = currentStep <= 0;
    }
    
    // 上一步功能
    function undo() {
        if (currentStep > 0) {
            currentStep--;
            const img = new Image();
            img.onload = function() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            };
            img.src = history[currentStep];
            updateUndoButton();
        }
    }
    
    // 更新筆刷大小顯示
    const brushSizeInput = document.getElementById('brush-size');
    const sizeDisplay = document.getElementById('size-display');
    
    brushSizeInput.addEventListener('input', function() {
        brushSize = this.value;
        sizeDisplay.textContent = `${brushSize}`;
    });
    
    // 繪圖事件處理
    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = getCoordinates(e);
        // 開始新的繪圖時保存狀態
        saveState();
    }
    
    function draw(e) {
        if (!isDrawing) return;
        
        const [x, y] = getCoordinates(e);
        
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = brushSize;
        ctx.strokeStyle = currentColor;
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        [lastX, lastY] = [x, y];
    }
    
    function stopDrawing() {
        if (isDrawing) {
            isDrawing = false;
            // 繪圖結束時保存狀態
            saveState();
        }
    }
    
    // 獲取鼠標/觸摸坐標
    function getCoordinates(e) {
        let x, y;
        
        if (e.type.includes('touch')) {
            const rect = canvas.getBoundingClientRect();
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else {
            const rect = canvas.getBoundingClientRect();
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        }
        
        return [x, y];
    }
    
    // 添加事件監聽器
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // 觸摸事件支持
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);
    
    // 顏色選擇
    const colorOptions = document.querySelectorAll('.color-option');
    const colorPicker = document.getElementById('color-picker');
    const colorPreview = document.getElementById('color-preview');
    
    // 更新顏色預覽
    colorPreview.style.backgroundColor = colorPicker.value;
    
    // 預設顏色選項點擊事件
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            // 移除之前的活動狀態
            document.querySelector('.color-option.active').classList.remove('active');
            // 設置新的活動顏色
            this.classList.add('active');
            currentColor = this.dataset.color;
            // 同步更新顏色選擇器
            colorPicker.value = currentColor;
            colorPreview.style.backgroundColor = currentColor;
        });
    });
    
    // 自定義顏色選擇器事件
    colorPicker.addEventListener('input', function() {
        // 更新當前顏色
        currentColor = this.value;
        colorPreview.style.backgroundColor = currentColor;
        
        // 移除預設顏色的活動狀態
        const activeOption = document.querySelector('.color-option.active');
        if (activeOption) {
            activeOption.classList.remove('active');
        }
    });
    
    // 點擊顏色預覽也可以打開顏色選擇器
    colorPreview.addEventListener('click', function() {
        colorPicker.click();
    });
    
    // 清除畫布
    document.getElementById('clear-btn').addEventListener('click', function() {
        saveState(); // 保存清除前的狀態
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveState(); // 保存清除後的狀態
    });
    
    // 上一步按鈕
    document.getElementById('undo-btn').addEventListener('click', undo);
    
    // 初始化時保存空白畫布狀態
    saveState();
    
    // 下載畫布
    document.getElementById('download-btn').addEventListener('click', function() {
        const link = document.createElement('a');
        const date = new Date().toISOString().slice(0, 10);
        link.download = i18next.t('pages.draw.drawingFilename', {date: date});
        link.href = canvas.toDataURL();
        link.click();
    });
    
    // 檢查畫布是否為空白
    function isCanvasBlank() {
        const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        
        // 檢查每個像素點，如果有非白色像素，則畫布不為空
        for (let i = 0; i < pixelData.length; i += 4) {
            // 檢查RGB值是否都為255（白色）
            if (pixelData[i] !== 255 || pixelData[i + 1] !== 255 || pixelData[i + 2] !== 255) {
                return false; // 找到非白色像素，畫布不為空
            }
        }
        
        return true; // 所有像素都是白色，畫布為空
    }
    
    // 送出畫布
    document.getElementById('submit-btn').addEventListener('click', function() {
        // 檢查畫布是否為空白
        if (isCanvasBlank()) {
            // 顯示錯誤提示，加入用戶名稱
            const username = localStorage.getItem('username') || i18next.t('common.guest');
            alert(i18next.t('pages.draw.emptyCanvasAlert', {username: username}));
            return;
        }
        
        // 顯示加載狀態
        const submitBtn = document.getElementById('submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${i18next.t('pages.draw.uploadingStatus')}`;
        submitBtn.disabled = true;
        
        // 獲取畫布數據
        const imageData = canvas.toDataURL('image/png');
        
        // 保存畫布數據到 localStorage 用於展示
        localStorage.setItem('lastDrawing', imageData);
        
        // 創建表單數據
        const formData = new FormData();
        formData.append('name', localStorage.getItem('username') || i18next.t('common.guest'));
        
        // 將 base64 圖片數據轉換為 Blob
        const blob = dataURItoBlob(imageData);
        formData.append('image', blob, 'drawing.png');
        
        // 發送 AJAX 請求
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(i18next.t('errors.uploadFailed'));
            }
            return response.json();
        })
        .then(data => {
            // 使用客戶端日誌模塊
            const logger = Logger.createLogger('DrawingApp');
            logger.info('上傳成功', data);
            // 恢復按鈕狀態
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // 創建成功對話框
            const successDialog = document.createElement('div');
            successDialog.className = 'success-dialog';
            successDialog.innerHTML = `
                <div class="success-dialog-content">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h2>${i18next.t('pages.draw.uploadSuccess.title')}</h2>
                    <p>${i18next.t('pages.draw.uploadSuccess.message')}</p>
                    <div class="success-actions">
                        <button id="download-now-btn" class="btn btn-secondary">
                            <i class="fas fa-download"></i> ${i18next.t('pages.draw.uploadSuccess.downloadButton')}
                        </button>
                        <button id="goto-gallery-btn" class="btn btn-primary">
                            <i class="fas fa-images"></i> ${i18next.t('pages.draw.uploadSuccess.galleryButton')}
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(successDialog);
            
            // 添加樣式
            const style = document.createElement('style');
            style.textContent = `
                .success-dialog {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                .success-dialog-content {
                    background-color: white;
                    border-radius: 12px;
                    padding: 24px;
                    text-align: center;
                    max-width: 90%;
                    width: 360px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                }
                .success-icon {
                    font-size: 48px;
                    color: #38a169;
                    margin-bottom: 16px;
                }
                .success-dialog-content h2 {
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 8px;
                    color: #2d3748;
                }
                .success-dialog-content p {
                    color: #4a5568;
                    margin-bottom: 20px;
                }
                .success-actions {
                    display: flex;
                    justify-content: center;
                    gap: 12px;
                }
            `;
            document.head.appendChild(style);
            
            // 下載按鈕事件
            document.getElementById('download-now-btn').addEventListener('click', function() {
                const link = document.createElement('a');
                const date = new Date().toISOString().slice(0, 10);
                link.download = i18next.t('pages.draw.drawingFilename', {date: date});
                link.href = imageData;
                link.click();
            });
            
            // 前往畫廊按鈕事件
            document.getElementById('goto-gallery-btn').addEventListener('click', function() {
                window.location.href = '/images';
            });
        })
        .catch(error => {
            // 使用客戶端日誌模塊
            const logger = Logger.createLogger('DrawingApp');
            logger.error('上傳錯誤', error);
            alert(i18next.t('pages.draw.uploadError'));
            // 恢復按鈕狀態
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    });
    
    // 輔助函數：將 dataURI 轉換為 Blob
    function dataURItoBlob(dataURI) {
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        
        return new Blob([ab], {type: mimeString});
    }
}