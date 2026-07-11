import { useQuiz } from '../state/QuizContext'
import type { SupportedLanguage } from '../data/translations'

// Tier 1 languages with full translations (21)
// Tier 2: Single constructed language: tokipona (toki pona)
// Tier 3: Standard languages with translations (10): zh, el, uk, da, nb, la, tl, enm, ang, eo
const LANG_LABELS: Record<SupportedLanguage, string> = {
  // Tier 1: Major languages
  en: 'English',
  es: 'Español',
  hi: 'हिन्दी',
  ar: 'العربية',
  pt: 'Português',
  bn: 'বাংলা',
  ru: 'Русский',
  ja: '日本語',
  de: 'Deutsch',
  fr: 'Français',
  ko: '한국어',
  tr: 'Türkçe',
  vi: 'Tiếng Việt',
  it: 'Italiano',
  pl: 'Polski',
  id: 'Bahasa Indonesia',
  nl: 'Nederlands',
  he: 'עברית',
  sv: 'Svenska',
  cs: 'Čeština',
  ro: 'Română',
  // Tier 2: Constructed language
  tokipona: 'toki pona',
  // Tier 3: Additional languages
  zh: '中文',
  el: 'Ελληνικά',
  uk: 'Українська',
  da: 'Dansk',
  nb: 'Norsk Bokmål',
  la: 'Latīnum',
  tl: 'Tagalog',
  enm: 'Middle English',
  ang: 'Old English',
  eo: 'Esperanto',
}

export function LanguageSelector() {
  const { language, setLanguage } = useQuiz()

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="lang-select" className="sr-only">Select Language</label>
      <select
        id="lang-select"
        value={language}
        onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
        className="bg-white border border-gray-300 hover:border-gray-400 text-gray-700 text-sm font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      >
        {Object.entries(LANG_LABELS).map(([code, label]) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>
    </div>
  )
}
