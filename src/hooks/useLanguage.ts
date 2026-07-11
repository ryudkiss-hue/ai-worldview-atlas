import { useState, useEffect } from 'react';

const STORAGE_KEY = 'assessment-language';
const DEFAULT_LANGUAGE = 'en';
const SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'zh', 'ja', 'pt', 'it', 'ko', 'ar', 'ru', 'el', 'uk', 'jbo', 'tokipona', 'da', 'nb', 'la', 'sv', 'tl', 'enm', 'ang', 'eo', 'pie', 'laa'];

export const useLanguage = () => {
  const [language, setLanguage] = useState<string>(DEFAULT_LANGUAGE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
      setLanguage(stored);
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0].toLowerCase();
      if (SUPPORTED_LANGUAGES.includes(browserLang)) {
        setLanguage(browserLang);
      }
    }
    setIsLoading(false);
  }, []);

  const switchLanguage = (newLanguage: string) => {
    if (SUPPORTED_LANGUAGES.includes(newLanguage)) {
      setLanguage(newLanguage);
      localStorage.setItem(STORAGE_KEY, newLanguage);
    }
  };

  return {
    language,
    switchLanguage,
    isLoading,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };
};

export default useLanguage;
