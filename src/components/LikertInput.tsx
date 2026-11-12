import { useQuiz } from '../state/QuizContext'

interface LikertInputProps {
  questionId: number
  value: number | undefined
  declined?: boolean
  onChange: (value: number) => void
  onDecline?: () => void
}

// Four options with no neutral midpoint; "no settled view" is a separate, explicit choice that scores 0.
// Stored values keep the original 1-5 coding (3 is unused) so a value minus 3 gives -2, -1, +1, +2.
const OPTIONS: { key: string; value: number }[] = [
  { key: 'strongly_disagree', value: 1 },
  { key: 'disagree', value: 2 },
  { key: 'agree', value: 4 },
  { key: 'strongly_agree', value: 5 },
]

export function LikertInput({ questionId, value, declined = false, onChange, onDecline }: LikertInputProps) {
  const { t } = useQuiz()

  return (
    <div>
      <div role="radiogroup" aria-label={`Question ${questionId} answer`} className="flex flex-wrap gap-2">
        {OPTIONS.map(({ key, value: optionValue }) => {
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
          {declined ? t('decline_selected') : t('decline_unselected')}
        </button>
      )}
    </div>
  )
}
