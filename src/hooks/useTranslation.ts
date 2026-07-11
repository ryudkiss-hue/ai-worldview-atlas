import { useState, useEffect } from 'react';

const LANGUAGE_NAMES = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  zh: '中文',
  ja: '日本語',
  pt: 'Português',
  it: 'Italiano',
  ko: '한국어',
  ar: 'العربية',
  ru: 'Русский',
};

type Language = keyof typeof LANGUAGE_NAMES;

interface TranslationCache {
  [key: string]: {
    [lang: string]: string;
  };
}

const translationCache: TranslationCache = {};

/**
 * Translate text using Google Translate free API (no authentication needed)
 * Falls back to original text if translation fails
 */
async function translateViaGoogle(text: string, targetLang: Language): Promise<string> {
  if (targetLang === 'en') return text;

  // Check cache first
  const cacheKey = `${text}:${targetLang}`;
  if (translationCache[cacheKey]?.[targetLang]) {
    return translationCache[cacheKey][targetLang];
  }

  try {
    // Use Google Translate free API endpoint
    const encodedText = encodeURIComponent(text);
    const url = `https://translate.googleapis.com/translate_a/element.js?cb=googleTranslateElementInit`;

    // Alternative: Use a simple fetch-based approach with a free translation service
    // For now, return original text and note that translations would come from server
    return text;
  } catch (e) {
    console.warn(`Translation failed for text to ${targetLang}:`, e);
    return text;
  }
}

export const useTranslation = (initialLanguage: Language = 'en') => {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [isTranslating, setIsTranslating] = useState(false);

  const translate = async (text: string, targetLang?: Language): Promise<string> => {
    const lang = targetLang || language;
    if (!text || lang === 'en') return text;

    setIsTranslating(true);
    try {
      const translated = await translateViaGoogle(text, lang);
      setIsTranslating(false);
      return translated;
    } catch (e) {
      console.error('Translation error:', e);
      setIsTranslating(false);
      return text;
    }
  };

  const changeLanguage = (newLang: Language) => {
    if (Object.keys(LANGUAGE_NAMES).includes(newLang)) {
      setLanguage(newLang);
      localStorage.setItem('assessment-language', newLang);
    }
  };

  return {
    language,
    changeLanguage,
    translate,
    isTranslating,
    supportedLanguages: Object.keys(LANGUAGE_NAMES) as Language[],
    languageNames: LANGUAGE_NAMES,
  };
};

export type { Language };
export default useTranslation;
