// 客戶端i18n初始化
document.addEventListener('DOMContentLoaded', function() {
  // 初始化i18next
  i18next
    .use(i18nextHttpBackend)
    .use(i18nextBrowserLanguageDetector)
    .init({
      fallbackLng: 'zh-TW',
      supportedLngs: ['zh-TW', 'en'],
      ns: ['translation'],
      defaultNS: 'translation',
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json'
      },
      detection: {
        order: ['querystring', 'cookie', 'localStorage', 'navigator'],
        lookupQuerystring: 'lng',
        lookupCookie: 'i18next',
        lookupLocalStorage: 'i18nextLng',
        caches: ['localStorage', 'cookie']
      },
      interpolation: {
        escapeValue: false
      }
    }, function(err, t) {
      if (err) {
        console.error('i18n initialization error:', err);
        return;
      }
      
      // 初始化jqueryI18next
      jqueryI18next.init(i18next, $, {
        tName: 't',
        i18nName: 'i18n',
        handleName: 'localize',
        selectorAttr: 'data-i18n',
        targetAttr: 'i18n-target',
        optionsAttr: 'i18n-options',
        useOptionsAttr: false,
        parseDefaultValueFromContent: true
      });
      
      // 本地化頁面元素
      $(document).localize();
      
      // 更新動態內容
      updateDynamicContent();
      
      // 初始化語言切換器
      if (typeof createLanguageSwitcher === 'function') {
        createLanguageSwitcher();
      }
    });
});

// 更新動態生成的內容
function updateDynamicContent() {
  // 更新用戶名顯示
  const usernameDisplay = document.getElementById('username-display');
  if (usernameDisplay) {
    const username = localStorage.getItem('username') || i18next.t('common.guest');
    usernameDisplay.textContent = username;
  }
  
  // 更新其他可能的動態內容
  const downloadBtn = document.getElementById('download-btn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function() {
      const link = document.createElement('a');
      const date = new Date().toISOString().slice(0, 10);
      link.download = i18next.t('pages.draw.drawingFilename', {date: date});
      // 其餘下載邏輯保持不變
    }, {once: true});
  }
}

// 語言切換功能
function changeLanguage(lng) {
  i18next.changeLanguage(lng, function(err, t) {
    if (err) {
      console.error('Language change error:', err);
      return;
    }
    $(document).localize();
    updateDynamicContent();
    
    // 保存語言偏好
    localStorage.setItem('i18nextLng', lng);
    
    // 更新語言切換器狀態
    if (typeof highlightCurrentLanguage === 'function') {
      highlightCurrentLanguage();
    }
  });
}