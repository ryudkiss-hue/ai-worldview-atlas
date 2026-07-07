import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { AxisId } from '../data/types'
import { axes } from '../data/axes'
import { questionsForAxis } from '../data/questions'
import { shuffleArray } from '../lib/shuffle'

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
  questionOrder: QuestionOrder
  scenarioAnswers: Partial<Record<AxisId, 'A' | 'B'>>
  selectedStakeholderTags: string[]
}

function buildInitialState(): QuizState {
  return {
    answers: {},
    questionOrder: buildQuestionOrder(),
    scenarioAnswers: {},
    selectedStakeholderTags: [],
  }
}

type QuizAction =
  | { type: 'ANSWER'; questionId: number; value: number }
  | { type: 'ANSWER_SCENARIO'; axisId: AxisId; choice: 'A' | 'B' }
  | { type: 'SET_STAKEHOLDER_TAGS'; tagIds: string[] }
  | { type: 'RESET' }

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'ANSWER':
      return { ...state, answers: { ...state.answers, [action.questionId]: action.value } }
    case 'ANSWER_SCENARIO':
      return { ...state, scenarioAnswers: { ...state.scenarioAnswers, [action.axisId]: action.choice } }
    case 'SET_STAKEHOLDER_TAGS':
      return { ...state, selectedStakeholderTags: action.tagIds }
    case 'RESET':
      return buildInitialState()
    default:
      return state
  }
}

interface QuizContextValue {
  answers: Record<number, number>
  questionOrder: QuestionOrder
  scenarioAnswers: Partial<Record<AxisId, 'A' | 'B'>>
  selectedStakeholderTags: string[]
  setAnswer: (questionId: number, value: number) => void
  setScenarioAnswer: (axisId: AxisId, choice: 'A' | 'B') => void
  setStakeholderTags: (tagIds: string[]) => void
  reset: () => void
}

const QuizContext = createContext<QuizContextValue | null>(null)

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, undefined, buildInitialState)

  const value: QuizContextValue = {
    answers: state.answers,
    questionOrder: state.questionOrder,
    scenarioAnswers: state.scenarioAnswers,
    selectedStakeholderTags: state.selectedStakeholderTags,
    setAnswer: (questionId, val) => dispatch({ type: 'ANSWER', questionId, value: val }),
    setScenarioAnswer: (axisId, choice) => dispatch({ type: 'ANSWER_SCENARIO', axisId, choice }),
    setStakeholderTags: (tagIds) => dispatch({ type: 'SET_STAKEHOLDER_TAGS', tagIds }),
    reset: () => dispatch({ type: 'RESET' }),
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
