import React, { useState, useEffect } from 'react';
import { Assessment } from '../pages/Assessment';
import { useTranslation, type Language } from '../hooks/useTranslation';

/**
 * Wrapper component that adds language switching to Assessment
 * Supports 11 languages across all 171 questions
 */
export const AssessmentWithLanguage: React.FC = () => {
  const { language, changeLanguage, supportedLanguages, languageNames } = useTranslation();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {/* Language Selector */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          zIndex: 1000,
          padding: '1rem',
          backgroundColor: '#fff',
          borderLeft: '1px solid #e0e0e0',
          borderBottom: '1px solid #e0e0e0',
          borderRadius: '0 0 0 8px',
        }}
      >
        {showLanguageSelector ? (
          <div style={{ minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Language:
            </label>
            <select
              value={language}
              onChange={(e) => {
                changeLanguage(e.target.value as Language);
                setShowLanguageSelector(false);
              }}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ddd',
                backgroundColor: '#fff',
                cursor: 'pointer',
                fontSize: '0.95rem',
              }}
            >
              {supportedLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {languageNames[lang as keyof typeof languageNames]}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowLanguageSelector(false)}
              style={{
                marginTop: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#f0f0f0',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              Done
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowLanguageSelector(true)}
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: 500,
            }}
          >
            🌐 {languageNames[language as keyof typeof languageNames]}
          </button>
        )}
      </div>

      {/* Assessment Content */}
      <div style={{ paddingRight: showLanguageSelector ? '220px' : '0' }}>
        <Assessment />
      </div>

      {/* Language Support Info */}
      <div
        style={{
          position: 'fixed',
          bottom: '1rem',
          left: '1rem',
          padding: '0.75rem',
          backgroundColor: '#fff',
          border: '1px solid #ddd',
          borderRadius: '6px',
          fontSize: '0.85rem',
          color: '#666',
          maxWidth: '300px',
        }}
      >
        <strong>Multilingual Assessment</strong>
        <p style={{ margin: '0.5rem 0 0 0' }}>
          Supports {supportedLanguages.length} languages across all 171 questions
        </p>
      </div>
    </div>
  );
};

export default AssessmentWithLanguage;
