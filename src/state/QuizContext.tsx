import { createContext, useContext, useEffect, useReducer, useState, type ReactNode } from 'react'
import type { AxisId } from '../data/types'
import { axes } from '../data/axes'
import { questionsForAxis } from '../data/questions'
import { shuffleArray } from '../lib/shuffle'
import { type TTSSettings, getStoredTTSSettings, saveStoredTTSSettings } from '../lib/tts'
import { uiStrings } from '../data/uiStrings'
import { questions } from '../data/questions'
import { scenarios } from '../data/scenarios'
import { profiles } from '../data/profiles'
import { attentionChecks } from '../data/attentionChecks'

export type QuestionOrder = Record<AxisId, { t1: number[]; t2: number[] }>

/** Statement ids shown in one axis and horizon: the real statements plus any attention check placed there. */
function idsFor(axisId: AxisId, horizon: 'T1' | 'T2'): number[] {
  return [
    ...questionsForAxis(axisId).filter((q) => q.horizon === horizon).map((q) => q.id),
    ...attentionChecks.filter((c) => c.axisId === axisId && c.horizon === horizon).map((c) => c.id),
  ]
}

function buildQuestionOrder(): QuestionOrder {
  const order = {} as QuestionOrder
  axes.forEach((axis) => {
    order[axis.id] = { t1: shuffleArray(idsFor(axis.id, 'T1')), t2: shuffleArray(idsFor(axis.id, 'T2')) }
  })
  return order
}

interface QuizState {
  answers: Record<number, number>
  declinedQuestions: number[]
  questionOrder: QuestionOrder
  scenarioAnswers: Partial<Record<AxisId, 'A' | 'B'>>
  selectedStakeholderTags: string[]
  /** Answers to the optional attention checks, kept apart from the scored answers */
  checkAnswers: Record<number, number>
}

function buildInitialState(): QuizState {
  return {
    answers: {},
    declinedQuestions: [],
    questionOrder: buildQuestionOrder(),
    scenarioAnswers: {},
    selectedStakeholderTags: [],
    checkAnswers: {},
  }
}

/**
 * Progress is saved in this browser only, so a refresh or a closed tab doesn't lose 144 answers. The key carries
 * the item-set date: if statements change, old progress is dropped rather than applied to new wording.
 */
export const PROGRESS_KEY = 'atlas-quiz-progress-2026-11-13'
const VALID_ANSWERS = new Set([1, 2, 4, 5])

function sameIds(a: unknown, b: number[]): boolean {
  return Array.isArray(a) && a.length === b.length && [...a].sort((x, y) => x - y).join() === [...b].sort((x, y) => x - y).join()
}

/** Reads saved progress, keeping only what still fits the current item set. Anything malformed starts fresh. */
export function loadSavedProgress(): QuizState | null {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    if (!raw) return null
    const saved = JSON.parse(raw) as Partial<QuizState>
    const fresh = buildInitialState()
    const realIds = new Set(questions.map((q) => q.id))
    const checkIds = new Set(attentionChecks.map((c) => c.id))
    const pick = (obj: unknown, ids: Set<number>) =>
      Object.fromEntries(
        Object.entries(obj && typeof obj === 'object' ? obj : {}).filter(
          ([k, v]) => ids.has(Number(k)) && VALID_ANSWERS.has(v as number),
        ),
      ) as Record<number, number>
    const orderOk =
      saved.questionOrder &&
      axes.every(
        (a) =>
          sameIds(saved.questionOrder?.[a.id]?.t1, idsFor(a.id, 'T1')) &&
          sameIds(saved.questionOrder?.[a.id]?.t2, idsFor(a.id, 'T2')),
      )
    const answers = pick(saved.answers, realIds)
    return {
      answers,
      declinedQuestions: Array.isArray(saved.declinedQuestions)
        ? saved.declinedQuestions.filter((id) => realIds.has(id) && answers[id] === undefined)
        : [],
      questionOrder: orderOk ? (saved.questionOrder as QuestionOrder) : fresh.questionOrder,
      scenarioAnswers: Object.fromEntries(
        Object.entries(saved.scenarioAnswers ?? {}).filter(([k, v]) => axes.some((a) => a.id === k) && (v === 'A' || v === 'B')),
      ),
      selectedStakeholderTags: Array.isArray(saved.selectedStakeholderTags)
        ? saved.selectedStakeholderTags.filter((x) => typeof x === 'string')
        : [],
      checkAnswers: pick(saved.checkAnswers, checkIds),
    }
  } catch {
    return null
  }
}

function saveProgress(state: QuizState) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(state))
  } catch {
    // Storage can be full, blocked or unavailable (private windows); the quiz still works without it.
  }
}

type QuizAction =
  | { type: 'ANSWER'; questionId: number; value: number }
  | { type: 'DECLINE'; questionId: number }
  | { type: 'ANSWER_SCENARIO'; axisId: AxisId; choice: 'A' | 'B' }
  | { type: 'CLEAR_SCENARIO_ANSWERS' }
  | { type: 'SET_STAKEHOLDER_TAGS'; tagIds: string[] }
  | { type: 'ANSWER_CHECK'; checkId: number; value: number }
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
    case 'ANSWER_CHECK':
      return { ...state, checkAnswers: { ...state.checkAnswers, [action.checkId]: action.value } }
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
  checkAnswers: Record<number, number>
  /** True when answers or skipped statements were restored or entered, so there is something to continue */
  hasProgress: boolean
  setAnswer: (questionId: number, value: number) => void
  declineQuestion: (questionId: number) => void
  setScenarioAnswer: (axisId: AxisId, choice: 'A' | 'B') => void
  clearScenarioAnswers: () => void
  setStakeholderTags: (tagIds: string[]) => void
  setCheckAnswer: (checkId: number, value: number) => void
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
  const [state, dispatch] = useReducer(quizReducer, undefined, () => loadSavedProgress() ?? buildInitialState())
  useEffect(() => saveProgress(state), [state])
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
    checkAnswers: state.checkAnswers,
    hasProgress: Object.keys(state.answers).length + state.declinedQuestions.length > 0,
    setAnswer: (questionId, val) => dispatch({ type: 'ANSWER', questionId, value: val }),
    declineQuestion: (questionId) => dispatch({ type: 'DECLINE', questionId }),
    setScenarioAnswer: (axisId, choice) => dispatch({ type: 'ANSWER_SCENARIO', axisId, choice }),
    clearScenarioAnswers: () => dispatch({ type: 'CLEAR_SCENARIO_ANSWERS' }),
    setStakeholderTags: (tagIds) => dispatch({ type: 'SET_STAKEHOLDER_TAGS', tagIds }),
    setCheckAnswer: (checkId, val) => dispatch({ type: 'ANSWER_CHECK', checkId, value: val }),
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
