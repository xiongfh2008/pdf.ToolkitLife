/**
 * Early Language Detection
 * This script runs immediately to set the correct HTML lang attribute
 * before any content is rendered, preventing language mismatch
 */

const STORAGE_KEY = 'pdftoolkit_language';
const DEFAULT_LANGUAGE = 'en';

// Supported languages (sync with i18n/translations.ts)
const SUPPORTED_LANGUAGES = [
  'en', 'zh-CN', 'zh-TW', 'es', 'fr', 'de', 'ja', 'ko', 'ar', 'pt', 
  'ru', 'it', 'nl', 'pl', 'tr', 'vi', 'th', 'id', 'ms', 'hi', 'bn',
  'ur', 'fa', 'he', 'sv', 'da', 'fi', 'no', 'cs', 'el', 'ro'
];

function detectLanguage(): string {
  try {
    // 1. Check URL parameter first (for SEO and sharing)
    const urlParams = new URLSearchParams(window.location.search);
    const paramLang = urlParams.get('lang');
    if (paramLang && SUPPORTED_LANGUAGES.includes(paramLang)) {
      // Save preference for future visits
      localStorage.setItem(STORAGE_KEY, paramLang);
      return paramLang;
    }

    // 2. Check localStorage
    const savedLang = localStorage.getItem(STORAGE_KEY);
    if (savedLang && SUPPORTED_LANGUAGES.includes(savedLang)) {
      return savedLang;
    }

    // Check browser language
    const browserLang = navigator.language.toLowerCase();
    
    // Try exact match
    if (SUPPORTED_LANGUAGES.includes(browserLang)) {
      return browserLang;
    }

    // Try language code without region (e.g., 'zh' from 'zh-CN')
    const langCode = browserLang.split('-')[0];
    if (SUPPORTED_LANGUAGES.includes(langCode)) {
      return langCode;
    }

    // Try common mappings
    const langMap: Record<string, string> = {
      'zh': 'zh-CN',
      'zh-cn': 'zh-CN',
      'zh-hans': 'zh-CN',
      'zh-tw': 'zh-TW',
      'zh-hk': 'zh-TW',
      'zh-hant': 'zh-TW',
    };

    const mappedLang = langMap[browserLang] || langMap[langCode];
    if (mappedLang && SUPPORTED_LANGUAGES.includes(mappedLang)) {
      return mappedLang;
    }

    return DEFAULT_LANGUAGE;
  } catch (e) {
    // Fallback in case of any errors
    return DEFAULT_LANGUAGE;
  }
}

// Set HTML lang attribute immediately
if (typeof document !== 'undefined' && document.documentElement) {
  const detectedLang = detectLanguage();
  document.documentElement.lang = detectedLang;
}

