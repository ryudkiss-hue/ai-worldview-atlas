import React from 'react';

interface LanguageSwitcherProps {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
  languages?: Record<string, string>;
}

const DEFAULT_LANGUAGES = {
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
  el: 'Ελληνικά',
  uk: 'Українська',
  jbo: 'Lojban',
  tokipona: 'toki pona',
  da: 'Dansk',
  nb: 'Norsk',
  la: 'Latina',
  sv: 'Svenska',
  tl: 'Tagalog',
  enm: 'Middle English',
  ang: 'Old English',
  eo: 'Esperanto',
};

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLanguage,
  onLanguageChange,
  languages = DEFAULT_LANGUAGES,
}) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ marginRight: '0.5rem', fontWeight: 500 }}>
        Language:
      </label>
      <select
        value={currentLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        style={{
          padding: '0.5rem',
          borderRadius: '4px',
          border: '1px solid #ddd',
          backgroundColor: '#fff',
          cursor: 'pointer',
          fontSize: '1rem',
        }}
      >
        {Object.entries(languages).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;
