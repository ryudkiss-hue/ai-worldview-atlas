import { useState } from 'react'
import type { Profile, Question } from '../data/types'
import { axes } from '../data/axes'
import { STANCE_LABELS, answerStance, expectedStance, isOpposite } from '../lib/statementComparison'

interface StatementComparisonProps {
  /** The statements you were shown (all 144, or the 48 in the short version) */
  questions: Question[]
  answers: Record<number, number>
  declinedQuestions: number[]
  /** Your closest archetypes, closest first */
  profiles: Profile[]
}

/** Your answer to each statement next to the answer each of your top archetypes would be expected to give. */
export function StatementComparison({ questions, answers, declinedQuestions, profiles }: StatementComparisonProps) {
  const [onlyOpposite, setOnlyOpposite] = useState(false)
  const top = profiles[0]

  return (
    <section className="mt-8" aria-labelledby="statement-comparison-heading">
      <h3 id="statement-comparison-heading" className="text-xl font-semibold mb-2">
        Statement by Statement
      </h3>
      <p className="text-gray-700 mb-2">
        Your answer to each statement, next to the answer your closest archetypes would be expected to give. The archetypes never
        answered these statements. Their answers here are estimates from where each one sits on that statement&apos;s axis: one
        well toward the pole a statement pulls toward is expected to agree, one well toward the other pole to disagree, and one
        near the middle has no clear lean. A difference in strength isn&apos;t flagged, only taking opposite sides.
      </p>
      <label className="flex items-center gap-2 text-sm text-gray-700 mb-4 cursor-pointer">
        <input type="checkbox" checked={onlyOpposite} onChange={(e) => setOnlyOpposite(e.target.checked)} className="w-4 h-4" />
        Only show statements where you and {top.name} take opposite sides
      </label>

      {axes.map((axis) => {
        const items = questions.filter((q) => q.axisId === axis.id).sort((a, b) => a.id - b.id)
        const oppositeTop = items.filter((q) => isOpposite(answerStance(answers[q.id]), expectedStance(q, top)))
        const shown = onlyOpposite ? oppositeTop : items
        return (
          <details key={axis.id} className="mb-2 rounded-lg border border-gray-200">
            <summary className="cursor-pointer p-3 text-gray-900">
              <span className="font-semibold">{axis.name}</span>
              <span className="text-sm text-gray-600">
                {' '}
                · opposite sides from {top.name} on {oppositeTop.length} of {items.length}
              </span>
            </summary>
            {shown.length === 0 ? (
              <p className="px-3 pb-3 text-sm text-gray-500">No statements here where you take opposite sides.</p>
            ) : (
              <ul className="px-3 pb-3 space-y-3">
                {shown.map((q) => {
                  const yours = answerStance(answers[q.id])
                  const yourLabel = yours
                    ? STANCE_LABELS[yours]
                    : declinedQuestions.includes(q.id)
                      ? 'No settled view'
                      : 'Not answered'
                  return (
                    <li key={q.id} className="border-t border-gray-100 pt-3">
                      <p className="text-gray-800">{q.statement}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{q.horizon === 'T1' ? 'Right now' : 'Looking ahead'}</p>
                      <dl className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
                        <div className="flex gap-2 min-w-0">
                          <dt className="font-semibold text-gray-700">You:</dt>
                          <dd className="text-gray-900">{yourLabel}</dd>
                        </div>
                        {profiles.map((p) => {
                          const theirs = expectedStance(q, p)
                          const opposite = isOpposite(yours, theirs)
                          return (
                            <div key={p.id} className="flex flex-wrap gap-x-2 min-w-0">
                              <dt className="text-gray-600">{p.name}:</dt>
                              <dd className={opposite ? 'text-amber-800 font-semibold' : 'text-gray-700'}>
                                {STANCE_LABELS[theirs]}
                                {opposite && ' (opposite)'}
                              </dd>
                            </div>
                          )
                        })}
                      </dl>
                    </li>
                  )
                })}
              </ul>
            )}
          </details>
        )
      })}
    </section>
  )
}
