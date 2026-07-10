import type { Question } from '../data/types'
import { LikertInput } from './LikertInput'
import { AudioPlayerButton } from './AudioPlayerButton'
import { useQuiz } from '../state/QuizContext'

interface AxisHorizonGroupProps {
  title: string
  questions: Question[]
  answers: Record<number, number>
  declinedQuestions?: number[]
  onAnswer: (questionId: number, value: number) => void
  onDecline?: (questionId: number) => void
  showSimplified?: boolean
}

export function AxisHorizonGroup({
  title,
  questions,
  answers,
  declinedQuestions = [],
  onAnswer,
  onDecline,
  showSimplified = false,
}: AxisHorizonGroupProps) {
  const { tQuestion } = useQuiz()

  return (
    <section className="mb-8">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <ul className="space-y-5">
        {questions.map((question) => {
          const typeKey = showSimplified ? 'simplifiedStatement' : 'statement'
          const textToRead = tQuestion(question.id, typeKey) || question.statement
          return (
            <li key={question.id}>
              <div className="flex items-start justify-between gap-4 mb-2">
                <p className="flex-1 text-gray-800 leading-relaxed">{textToRead}</p>
                <AudioPlayerButton text={textToRead} questionId={question.id} />
              </div>
              <LikertInput
                questionId={question.id}
                value={answers[question.id]}
                declined={declinedQuestions.includes(question.id)}
                onChange={(value) => onAnswer(question.id, value)}
                onDecline={onDecline ? () => onDecline(question.id) : undefined}
              />
            </li>
          )
        })}
      </ul>
    </section>
  )
}
