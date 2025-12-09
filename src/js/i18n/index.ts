/**
 * Internationalization (i18n) System
 * Supports 30+ languages with automatic detection and manual switching
 */

import { translations } from './translations';

const STORAGE_KEY = 'pdftoolkit_language';
const DEFAULT_LANGUAGE = 'en';

class I18n {
  private currentLanguage: string;
  private translations: Record<string, Record<string, string>>;

  constructor() {
    this.translations = translations;
    this.currentLanguage = this.detectLanguage();
  }

  /**
   * Detect user's preferred language from browser settings or localStorage
   */
  private detectLanguage(): string {
    // 1. Check URL parameter first (for SEO and sharing)
    const urlParams = new URLSearchParams(window.location.search);
    const paramLang = urlParams.get('lang');
    if (paramLang && this.translations[paramLang]) {
      return paramLang;
    }

    // 2. Check localStorage
    const savedLang = localStorage.getItem(STORAGE_KEY);
    if (savedLang && this.translations[savedLang]) {
      return savedLang;
    }

    // Check browser language
    const browserLang = navigator.language.toLowerCase();
    
    // Try exact match
    if (this.translations[browserLang]) {
      return browserLang;
    }

    // Try language code without region (e.g., 'zh' from 'zh-CN')
    const langCode = browserLang.split('-')[0];
    if (this.translations[langCode]) {
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
    if (mappedLang && this.translations[mappedLang]) {
      return mappedLang;
    }

    return DEFAULT_LANGUAGE;
  }

  /**
   * Get translated text by key
   */
  t(key: string): string {
    const translation = this.translations[this.currentLanguage]?.[key];
    
    if (translation) {
      return translation;
    }

    // Fallback to English
    const fallback = this.translations[DEFAULT_LANGUAGE]?.[key];
    if (fallback) {
      return fallback;
    }

    // Return key if no translation found
    // console.warn(`Missing translation for key: ${key} in language: ${this.currentLanguage}`);
    return key;
  }

  /**
   * Change current language
   */
  setLanguage(lang: string): void {
    if (!this.translations[lang]) {
      console.error(`Language not supported: ${lang}`);
      return;
    }

    this.currentLanguage = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    
    // Update URL with lang parameter without reloading
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.pushState({}, '', url);

    this.updatePageTranslations();
  }

  /**
   * Get current language code
   */
  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  /**
   * Get all available languages
   */
  getAvailableLanguages(): Array<{ code: string; name: string; nativeName: string }> {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文' },
      { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文' },
      { code: 'ja', name: 'Japanese', nativeName: '日本語' },
      { code: 'ko', name: 'Korean', nativeName: '한국어' },
      { code: 'de', name: 'German', nativeName: 'Deutsch' },
      { code: 'fr', name: 'French', nativeName: 'Français' },
      { code: 'it', name: 'Italian', nativeName: 'Italiano' },
      { code: 'es', name: 'Spanish', nativeName: 'Español' },
      { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
      { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
      { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
      { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
      { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
      { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu' },
      { code: 'th', name: 'Thai', nativeName: 'ภาษาไทย' },
      { code: 'he', name: 'Hebrew', nativeName: 'עברית' },
      { code: 'ru', name: 'Russian', nativeName: 'Русский' },
      { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
      { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
      { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
      { code: 'fa', name: 'Persian', nativeName: 'فارسی' },
      { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
      { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
      { code: 'pl', name: 'Polish', nativeName: 'Polski' },
      { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
      { code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
      { code: 'da', name: 'Danish', nativeName: 'Dansk' },
      { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
      { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
      { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
    ];
  }

  /**
   * Update all page elements with data-i18n attribute
   */
  updatePageTranslations(): void {
    // 1. Update HTML lang attribute
    document.documentElement.lang = this.currentLanguage;

    // 2. Update elements with data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach((element) => {
      const key = element.getAttribute('data-i18n');
      if (key) {
        const translatedText = this.t(key);
        if (element.hasAttribute('data-i18n-placeholder')) {
          (element as HTMLInputElement).placeholder = translatedText;
        } else {
          element.textContent = translatedText;
        }
      }
    });

    // 3. Update page title
    // Check if the page has a specific title key (e.g., 'page.about.title')
    // If not, try to construct one or use the default logic
    const titleKey = document.documentElement.getAttribute('data-i18n-title');
    if (titleKey) {
        document.title = this.t(titleKey);
    } else {
        // Fallback: Update the suffix " - PDFToolkit" if it exists
        const appName = this.t('app.name');
        if (document.title.includes(' - ')) {
            const parts = document.title.split(' - ');
            // Preserve the first part (page name), update the brand name
            document.title = `${parts[0]} - ${appName}`;
        }
    }

    // 4. Update SEO Meta Tags
    this.updateMetaTags();
    this.updateCanonicalAndOg();

    // Dispatch event for dynamic components
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: this.currentLanguage } 
    }));
  }

  /**
   * Update SEO meta tags (description, keywords) based on current language
   */
  private updateMetaTags(): void {
    const updateMeta = (name: string, content: string) => {
        let meta = document.querySelector(`meta[name="${name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', name);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    };

    // Update Description
    const descriptionKey = document.documentElement.getAttribute('data-i18n-description') || 'meta.description';
    const description = this.t(descriptionKey);
    // Only update if translation exists and isn't just the key itself
    if (description && description !== descriptionKey) {
        updateMeta('description', description);
    }

    // Update Keywords
    const keywordsKey = document.documentElement.getAttribute('data-i18n-keywords') || 'meta.keywords';
    const keywords = this.t(keywordsKey);
    if (keywords && keywords !== keywordsKey) {
        updateMeta('keywords', keywords);
    }
  }

  /**
   * Update Canonical URL and Open Graph tags based on current language
   */
  private updateCanonicalAndOg(): void {
    const baseUrl = 'https://pdf.voguegale.com/';
    const currentLang = this.currentLanguage;
    
    // Construct new URL
    // If default language (en), use clean URL, otherwise append query param
    const newUrl = currentLang === DEFAULT_LANGUAGE 
        ? baseUrl 
        : `${baseUrl}?lang=${currentLang}`;

    // 1. Update Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', newUrl);

    // 2. Update OG:URL
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
        ogUrl = document.createElement('meta');
        ogUrl.setAttribute('property', 'og:url');
        document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', newUrl);

    // 3. Update OG:Locale
    // Convert hyphenated codes (zh-CN) to underscore format (zh_CN) for OG
    const ogLocaleValue = currentLang.replace('-', '_');
    let ogLocale = document.querySelector('meta[property="og:locale"]');
    if (!ogLocale) {
        ogLocale = document.createElement('meta');
        ogLocale.setAttribute('property', 'og:locale');
        document.head.appendChild(ogLocale);
    }
    ogLocale.setAttribute('content', ogLocaleValue);
  }
}

// Create singleton instance
export const i18n = new I18n();

// Initialize translations on page load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    i18n.updatePageTranslations();
  });
}
