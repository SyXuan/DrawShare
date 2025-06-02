const i18next = require('i18next');
const i18nextMiddleware = require('i18next-http-middleware');
const Backend = require('i18next-fs-backend');
const path = require('path');

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: {
      loadPath: path.join(__dirname, 'locales/{{lng}}/{{ns}}.json'),
      addPath: path.join(__dirname, 'locales/{{lng}}/{{ns}}.missing.json')
    },
    fallbackLng: 'zh-TW',
    preload: ['zh-TW', 'en'],
    supportedLngs: ['zh-TW', 'en'],
    ns: ['translation'],
    defaultNS: 'translation',
    detection: {
      order: ['querystring', 'cookie', 'header'],
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupHeader: 'accept-language',
      caches: ['cookie']
    },
    interpolation: {
      escapeValue: false
    }
  });

// 導出i18next實例和中間件
module.exports = {
  i18next,
  handle: i18nextMiddleware.handle(i18next)
};