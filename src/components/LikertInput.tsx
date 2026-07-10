import { useQuiz } from '../state/QuizContext'

interface LikertInputProps {
  questionId: number
  value: number | undefined
  declined?: boolean
  onChange: (value: number) => void
  onDecline?: () => void
}

const LABELS_KEYS = ['strongly_disagree', 'disagree', 'neutral', 'agree', 'strongly_agree']

export function LikertInput({ questionId, value, declined = false, onChange, onDecline }: LikertInputProps) {
  const { t } = useQuiz()

  return (
    <div>
      <div role="radiogroup" aria-label={`Question ${questionId} answer`} className="flex flex-wrap gap-2">
        {LABELS_KEYS.map((key, index) => {
          const optionValue = index + 1
          const isSelected = !declined && value === optionValue
          const label = t(key)
          return (
            <button
              key={optionValue}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(optionValue)}
              className={`rounded-full border px-3 py-1 text-sm ${
                isSelected ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-700'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>
      {onDecline && (
        <button
          type="button"
          onClick={onDecline}
          aria-pressed={declined}
          className={`mt-2 text-sm underline ${declined ? 'text-blue-700 font-semibold' : 'text-gray-500'}`}
        >
          {declined ? t('decline_selected') || "I don't have a strong view on this (selected)" : t('decline_unselected') || "I don't have a strong view on this"}
        </button>
      )}
    </div>
  )
}
