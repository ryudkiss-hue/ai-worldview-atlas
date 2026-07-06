import { createContext, useContext, useReducer, type ReactNode } from 'react'

interface QuizState {
  answers: Record<number, number>
}

type QuizAction =
  | { type: 'ANSWER'; questionId: number; value: number }
  | { type: 'RESET' }

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'ANSWER':
      return { answers: { ...state.answers, [action.questionId]: action.value } }
    case 'RESET':
      return { answers: {} }
    default:
      return state
  }
}

interface QuizContextValue {
  answers: Record<number, number>
  setAnswer: (questionId: number, value: number) => void
  reset: () => void
}

const QuizContext = createContext<QuizContextValue | null>(null)

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, { answers: {} })

  const value: QuizContextValue = {
    answers: state.answers,
    setAnswer: (questionId, val) => dispatch({ type: 'ANSWER', questionId, value: val }),
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
