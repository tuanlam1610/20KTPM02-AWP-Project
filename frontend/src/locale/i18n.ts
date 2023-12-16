import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import vn from './vn/vn.json';
import en from './en/en.json';

const resources = {
  en: {
    translation: {
      text: en,
    },
  },
  vn: {
    translation: {
      text: vn,
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'vn',
  fallbackLng: 'vn',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
