import { axes } from '../data/axes'
import { AXIS_WEIGHT_OPTIONS, isEqualWeights, type AxisWeights } from '../lib/scoring'
import type { AxisId } from '../data/types'

interface AxisWeightsPanelProps {
  weights: AxisWeights
  /** Absent on a shared link: the weights are shown but can't be changed */
  onChange?: (axisId: AxisId, weight: number) => void
  onReset?: () => void
}

/** Lets you say which axes matter more or less to you. Only the archetype ranking changes; your scores never do. */
export function AxisWeightsPanel({ weights, onChange, onReset }: AxisWeightsPanelProps) {
  const equal = isEqualWeights(weights)
  return (
    <section className="mt-8 rounded-lg border border-gray-200 p-4" aria-labelledby="weights-heading">
      <h3 id="weights-heading" className="text-xl font-semibold">
        What Matters Most to You?
      </h3>
      <p className="text-gray-700 mt-1 mb-4">
        {onChange
          ? 'By default every axis counts the same when you are matched to archetypes. If some questions matter more to you than others, say so here. "More" counts an axis twice as much and "Less" half as much. Your scores stay exactly the same; only the ranking of archetypes can change.'
          : equal
            ? 'Every axis counted the same in this match.'
            : 'The person who shared this result weighted some axes more or less than others when matching archetypes. Their scores are unchanged.'}
      </p>
      <ul className="space-y-3">
        {axes.map((axis) => (
          <li key={axis.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-gray-800 min-w-0">
              <span className="font-semibold">{axis.name}</span>
              <span className="text-gray-500 text-sm"> · {axis.question}</span>
            </span>
            <div role="radiogroup" aria-label={`How much ${axis.name} counts`} className="flex gap-1 shrink-0">
              {AXIS_WEIGHT_OPTIONS.map((opt) => {
                const selected = weights[axis.id] === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    disabled={!onChange}
                    onClick={() => onChange?.(axis.id, opt.value)}
                    className={`rounded-full border px-3 py-1 text-sm ${
                      selected ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-700'
                    } disabled:cursor-default`}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </li>
        ))}
      </ul>
      {onReset && !equal && (
        <button type="button" onClick={onReset} className="mt-4 text-sm text-blue-600 underline">
          Count every axis the same again
        </button>
      )}
    </section>
  )
}
