import { createContext, useContext, useReducer, useState, type ReactNode } from 'react'
import type { AxisId } from '../data/types'
import { axes } from '../data/axes'
import { questionsForAxis } from '../data/questions'
import { shuffleArray } from '../lib/shuffle'
import { type TTSSettings, getStoredTTSSettings, saveStoredTTSSettings } from '../lib/tts'
import { uiStrings } from '../data/uiStrings'
import { questions } from '../data/questions'
import { scenarios } from '../data/scenarios'
import { profiles } from '../data/profiles'

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
  ttsSettings: TTSSettings
  setTtsSettings: (settings: TTSSettings) => void
  /** The Atlas is English only. */
  language: 'en'
  t: (key: string) => string
  tQuestion: (id: number, type?: 'statement' | 'simplifiedStatement') => string
  tScenario: (axisId: string, type: 'prompt' | 'optionA' | 'optionB') => string
  tAxis: (axisId: string, type: 'name' | 'poleA' | 'poleB') => string
  tProfileName: (profileId: string) => string
  tProfileSummary: (profileId: string) => string
}

const QuizContext = createContext<QuizContextValue | null>(null)

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, undefined, buildInitialState)
  const [ttsSettings, setTtsSettingsState] = useState<TTSSettings>(getStoredTTSSettings)

  const setTtsSettings = (newSettings: TTSSettings) => {
    setTtsSettingsState(newSettings)
    saveStoredTTSSettings(newSettings)
  }

  const t = (key: string): string => uiStrings[key] || key

  const tQuestion = (id: number, _type: 'statement' | 'simplifiedStatement' = 'statement'): string =>
    questions.find((q) => q.id === id)?.statement || ''

  const tScenario = (axisId: string, type: 'prompt' | 'optionA' | 'optionB'): string =>
    scenarios.find((s) => s.axisId === axisId)?.[type] || ''

  const tAxis = (axisId: string, type: 'name' | 'poleA' | 'poleB'): string => axes.find((a) => a.id === axisId)?.[type] || ''

  const tProfileName = (profileId: string): string => profiles.find((p) => p.id === profileId)?.name || profileId

  const tProfileSummary = (profileId: string): string => profiles.find((p) => p.id === profileId)?.summary || ''

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
    ttsSettings,
    setTtsSettings,
    language: 'en',
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
