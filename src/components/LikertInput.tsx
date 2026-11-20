import { useRef, type KeyboardEvent } from 'react'
import { useQuiz } from '../state/QuizContext'

interface LikertInputProps {
  questionId: number
  value: number | undefined
  declined?: boolean
  onChange: (value: number) => void
  onDecline?: () => void
  /** Id of the element holding the statement, so a screen reader announces the statement as the group's name */
  labelledBy?: string
}

// Four options with no neutral midpoint; "no settled view" is a separate, explicit choice that is left out of the score.
// Stored values keep the original 1-5 coding (3 is unused) so a value minus 3 gives -2, -1, +1, +2.
const OPTIONS: { key: string; value: number }[] = [
  { key: 'strongly_disagree', value: 1 },
  { key: 'disagree', value: 2 },
  { key: 'agree', value: 4 },
  { key: 'strongly_agree', value: 5 },
]

export function LikertInput({ questionId, value, declined = false, onChange, onDecline, labelledBy }: LikertInputProps) {
  const { t } = useQuiz()
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const selectedIndex = declined ? -1 : OPTIONS.findIndex((o) => o.value === value)

  // Behaves like a native radio group: one tab stop per statement, arrow keys move and select.
  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }
    let next: number
    if (e.key in keys) next = ((selectedIndex < 0 ? (keys[e.key] > 0 ? -1 : 0) : selectedIndex) + keys[e.key] + OPTIONS.length) % OPTIONS.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = OPTIONS.length - 1
    else return
    e.preventDefault()
    onChange(OPTIONS[next].value)
    refs.current[next]?.focus()
  }

  return (
    <div>
      <div
        role="radiogroup"
        {...(labelledBy ? { 'aria-labelledby': labelledBy } : { 'aria-label': 'Your answer' })}
        data-question-id={questionId}
        onKeyDown={onKeyDown}
        className="flex flex-wrap gap-2"
      >
        {OPTIONS.map(({ key, value: optionValue }, i) => {
          const isSelected = i === selectedIndex
          const label = t(key)
          return (
            <button
              key={optionValue}
              ref={(el) => {
                refs.current[i] = el
              }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected || (selectedIndex < 0 && i === 0) ? 0 : -1}
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
