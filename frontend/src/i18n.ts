import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enTranslation from './locales/en/translation.json'
import knTranslation from './locales/kn/translation.json'
import hiTranslation from './locales/hi/translation.json'
import taTranslation from './locales/ta/translation.json'
import teTranslation from './locales/te/translation.json'

const LOCALE_STORAGE_KEY = 'civic_memory_locale'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      kn: { translation: knTranslation },
      hi: { translation: hiTranslation },
      ta: { translation: taTranslation },
      te: { translation: teTranslation },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'kn', 'hi', 'ta', 'te'],
    load: 'languageOnly',
    nonExplicitSupportedLngs: true,
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: LOCALE_STORAGE_KEY,
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
  })

export { LOCALE_STORAGE_KEY }
export default i18n
