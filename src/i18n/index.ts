import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n, {LanguageDetectorAsyncModule} from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import zh from './locales/zh.json';
import en from './locales/en.json';
import pt from './locales/pt.json';

export const locales = {
  zh: {translation: zh},
  en: {translation: en},
  pt: {translation: pt},
};

export const DEFAULT_LOCALE = 'zh';

export const defaultLanguage =
  RNLocalize.findBestAvailableLanguage(Object.keys(locales))?.languageTag ||
  DEFAULT_LOCALE;

export const currentLanguage = i18n.language || defaultLanguage;

const useLanguageStorage: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  detect: async callback => {
    const lang = await AsyncStorage.getItem('language');
    if (lang) {
      return callback(lang);
    }

    return callback(defaultLanguage);
  },
  init: () => null,
  cacheUserLanguage: async (language: string) => {
    AsyncStorage.setItem('language', language);
  },
};

i18n
  .use(useLanguageStorage)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    fallbackLng: defaultLanguage,
    resources: locales,
    react: {
      useSuspense: false,
    },
  });

export default i18n;
