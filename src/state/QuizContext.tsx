import { createContext, useContext, useReducer, useState, type ReactNode } from 'react'
import type { AxisId } from '../data/types'
import { axes } from '../data/axes'
import { questionsForAxis } from '../data/questions'
import { shuffleArray } from '../lib/shuffle'
import { type TTSSettings, getStoredTTSSettings, saveStoredTTSSettings } from '../lib/tts'
import { translations, type SupportedLanguage } from '../data/translations'

export type QuestionOrder = Record<AxisId, { t1: number[]; t2: number[] }>

function buildQuestionOrder(): QuestionOrder {
  const order = {} as QuestionOrder
  axes.forEach((axis) => {
    const axisQuestions = questionsForAxis(axis.id)
    const t1Ids = shuffleArray(axisQuestions.filter((q) => q.horizon === 'T1').map((q) => q.id))
    const t2Ids = shuffleArray(axisQuestions.filter((q) => q.horizon === 'T2').map((q) => q.id))
    order[axis.id] = { t1: t1Ids, t2: t2Ids }
  })
  return order
}

interface QuizState {
  answers: Record<number, number>
  declinedQuestions: number[]
  questionOrder: QuestionOrder
  scenarioAnswers: Partial<Record<AxisId, 'A' | 'B'>>
  selectedStakeholderTags: string[]
}

function buildInitialState(): QuizState {
  return {
    answers: {},
    declinedQuestions: [],
    questionOrder: buildQuestionOrder(),
    scenarioAnswers: {},
    selectedStakeholderTags: [],
  }
}

type QuizAction =
  | { type: 'ANSWER'; questionId: number; value: number }
  | { type: 'DECLINE'; questionId: number }
  | { type: 'ANSWER_SCENARIO'; axisId: AxisId; choice: 'A' | 'B' }
  | { type: 'CLEAR_SCENARIO_ANSWERS' }
  | { type: 'SET_STAKEHOLDER_TAGS'; tagIds: string[] }
  | { type: 'RESET' }

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'ANSWER':
      return {
        ...state,
        answers: { ...state.answers, [action.questionId]: action.value },
        declinedQuestions: state.declinedQuestions.filter((id) => id !== action.questionId),
      }
    case 'DECLINE': {
      const isDeclined = state.declinedQuestions.includes(action.questionId)
      if (isDeclined) {
        return { ...state, declinedQuestions: state.declinedQuestions.filter((id) => id !== action.questionId) }
      }
      const nextAnswers = { ...state.answers }
      delete nextAnswers[action.questionId]
      return { ...state, answers: nextAnswers, declinedQuestions: [...state.declinedQuestions, action.questionId] }
    }
    case 'ANSWER_SCENARIO':
      return { ...state, scenarioAnswers: { ...state.scenarioAnswers, [action.axisId]: action.choice } }
    case 'CLEAR_SCENARIO_ANSWERS':
      return { ...state, scenarioAnswers: {} }
    case 'SET_STAKEHOLDER_TAGS':
      return { ...state, selectedStakeholderTags: action.tagIds }
    case 'RESET':
      return { ...buildInitialState(), selectedStakeholderTags: state.selectedStakeholderTags }
    default:
      return state
  }
}

interface QuizContextValue {
  answers: Record<number, number>
  declinedQuestions: number[]
  questionOrder: QuestionOrder
  scenarioAnswers: Partial<Record<AxisId, 'A' | 'B'>>
  selectedStakeholderTags: string[]
  setAnswer: (questionId: number, value: number) => void
  declineQuestion: (questionId: number) => void
  setScenarioAnswer: (axisId: AxisId, choice: 'A' | 'B') => void
  clearScenarioAnswers: () => void
  setStakeholderTags: (tagIds: string[]) => void
  reset: () => void
  showSimplified: boolean
  setShowSimplified: (val: boolean) => void
  ttsSettings: TTSSettings
  setTtsSettings: (settings: TTSSettings) => void
  language: SupportedLanguage
  setLanguage: (lang: SupportedLanguage) => void
  t: (key: string) => string
  tQuestion: (id: number, type: 'statement' | 'simplifiedStatement') => string
  tScenario: (axisId: string, type: 'prompt' | 'optionA' | 'optionB') => string
  tAxis: (axisId: string, type: 'name' | 'poleA' | 'poleB') => string
  tProfileName: (profileId: string) => string
  tProfileSummary: (profileId: string) => string
}

const QuizContext = createContext<QuizContextValue | null>(null)

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, undefined, buildInitialState)
  const [showSimplified, setShowSimplified] = useState(false)
  const [ttsSettings, setTtsSettingsState] = useState<TTSSettings>(getStoredTTSSettings)
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem('app_language')
      if (saved && ['en', 'es', 'zh', 'fr', 'de'].includes(saved)) {
        return saved as SupportedLanguage
      }
    } catch {
      // Ignored
    }
    return 'en'
  })

  const setTtsSettings = (newSettings: TTSSettings) => {
    setTtsSettingsState(newSettings)
    saveStoredTTSSettings(newSettings)
  }

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang)
    try {
      localStorage.setItem('app_language', lang)
    } catch {
      // Ignored
    }
  }

  const t = (key: string): string => {
    return translations[language]?.ui[key] || translations['en']?.ui[key] || key
  }

  const tQuestion = (id: number, type: 'statement' | 'simplifiedStatement'): string => {
    const qStr = String(id)
    return translations[language]?.questions[qStr]?.[type] || translations['en']?.questions[qStr]?.[type] || ''
  }

  const tScenario = (axisId: string, type: 'prompt' | 'optionA' | 'optionB'): string => {
    return translations[language]?.scenarios[axisId]?.[type] || translations['en']?.scenarios[axisId]?.[type] || ''
  }

  const tAxis = (axisId: string, type: 'name' | 'poleA' | 'poleB'): string => {
    return translations[language]?.axes[axisId]?.[type] || translations['en']?.axes[axisId]?.[type] || ''
  }

  const tProfileName = (profileId: string): string => {
    return translations[language]?.profiles[profileId]?.name || translations['en']?.profiles[profileId]?.name || profileId
  }

  const tProfileSummary = (profileId: string): string => {
    return translations[language]?.profiles[profileId]?.summary || translations['en']?.profiles[profileId]?.summary || ''
  }

  const value: QuizContextValue = {
    answers: state.answers,
    declinedQuestions: state.declinedQuestions,
    questionOrder: state.questionOrder,
    scenarioAnswers: state.scenarioAnswers,
    selectedStakeholderTags: state.selectedStakeholderTags,
    setAnswer: (questionId, val) => dispatch({ type: 'ANSWER', questionId, value: val }),
    declineQuestion: (questionId) => dispatch({ type: 'DECLINE', questionId }),
    setScenarioAnswer: (axisId, choice) => dispatch({ type: 'ANSWER_SCENARIO', axisId, choice }),
    clearScenarioAnswers: () => dispatch({ type: 'CLEAR_SCENARIO_ANSWERS' }),
    setStakeholderTags: (tagIds) => dispatch({ type: 'SET_STAKEHOLDER_TAGS', tagIds }),
    reset: () => dispatch({ type: 'RESET' }),
    showSimplified,
    setShowSimplified,
    ttsSettings,
    setTtsSettings,
    language,
    setLanguage,
    t,
    tQuestion,
    tScenario,
    tAxis,
    tProfileName,
    tProfileSummary
  }

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>
}

export function useQuiz(): QuizContextValue {
  const context = useContext(QuizContext)
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider')
  }
  return context
}
