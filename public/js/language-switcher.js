// 語言切換器組件
document.addEventListener('DOMContentLoaded', function() {
  // 創建語言切換器
  createLanguageSwitcher();
});

// 創建語言切換器
function createLanguageSwitcher() {
  // 檢查是否已存在語言切換器
  if (document.getElementById('language-switcher')) {
    return;
  }
  
  // 創建語言切換器容器
  const switcher = document.createElement('div');
  switcher.id = 'language-switcher';
  switcher.className = 'language-switcher';
  
  // 創建中文選項
  const zhOption = document.createElement('button');
  zhOption.className = 'lang-option';
  zhOption.textContent = '中文';
  zhOption.onclick = function() { changeLanguage('zh-TW'); };
  
  // 創建英文選項
  const enOption = document.createElement('button');
  enOption.className = 'lang-option';
  enOption.textContent = 'English';
  enOption.onclick = function() { changeLanguage('en'); };
  
  // 添加選項到切換器
  switcher.appendChild(zhOption);
  switcher.appendChild(enOption);
  
  // 添加切換器到頁面
  document.body.appendChild(switcher);
  
  // 添加樣式
  addLanguageSwitcherStyles();
  
  // 高亮當前語言
  highlightCurrentLanguage();
}

// 添加語言切換器樣式
function addLanguageSwitcherStyles() {
  // 檢查是否已存在樣式
  if (document.getElementById('language-switcher-styles')) {
    return;
  }
  
  const style = document.createElement('style');
  style.id = 'language-switcher-styles';
  style.textContent = `
    .language-switcher {
      position: fixed;
      top: 20px;
      right: 20px;
      display: flex;
      gap: 8px;
      z-index: 1000;
      background-color: rgba(255, 255, 255, 0.95);
      padding: 8px 12px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(0, 0, 0, 0.1);
    }
    
    .lang-option {
      padding: 6px 12px;
      border: 1px solid #e2e8f0;
      background-color: #ffffff;
      cursor: pointer;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      color: #4a5568;
      transition: all 0.2s ease;
    }
    
    .lang-option:hover {
      background-color: #f7fafc;
      border-color: #cbd5e0;
    }
    
    .lang-option.active {
      background-color: #4299e1;
      color: white;
      border-color: #3182ce;
    }
  `;
  
  document.head.appendChild(style);
}

// 高亮當前語言
function highlightCurrentLanguage() {
  const currentLang = i18next.language;
  const options = document.querySelectorAll('.lang-option');
  
  options.forEach(option => {
    option.classList.remove('active');
    if ((currentLang === 'zh-TW' && option.textContent === '中文') ||
        (currentLang === 'en' && option.textContent === 'English')) {
      option.classList.add('active');
    }
  });
}

// 切換語言
function changeLanguage(lng) {
  i18next.changeLanguage(lng, function() {
    // 本地化頁面元素
    $(document).localize();
    
    // 更新動態內容
    updateDynamicContent();
    
    // 高亮當前語言
    highlightCurrentLanguage();
    
    // 保存語言偏好
    localStorage.setItem('i18nextLng', lng);
  });
}