import type { Question } from '../data/types'
import { LikertInput } from './LikertInput'

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
  return (
    <section className="mb-8">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <ul className="space-y-5">
        {questions.map((question) => (
          <li key={question.id}>
            <p className="mb-2">
              {showSimplified && question.simplifiedStatement
                ? question.simplifiedStatement
                : question.statement}
            </p>
            <LikertInput
              questionId={question.id}
              value={answers[question.id]}
              declined={declinedQuestions.includes(question.id)}
              onChange={(value) => onAnswer(question.id, value)}
              onDecline={onDecline ? () => onDecline(question.id) : undefined}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
