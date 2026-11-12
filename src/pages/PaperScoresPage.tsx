import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { axes } from '../data/axes'
import type { AxisId } from '../data/types'
import { itemCounts } from '../lib/scoring'
import { encodeShareLink } from '../lib/shareLink'

/**
 * For the paper edition: enter the 16 net totals from the booklet (near term and long run for each axis) and see
 * the same results page the online quiz gives, including the exact archetype match.
 */
export function PaperScoresPage() {
  const navigate = useNavigate()
  const n1 = itemCounts('T1')
  const n2 = itemCounts('T2')
  const [values, setValues] = useState<Record<string, string>>({})
  const max = (axisId: AxisId, h: 'T1' | 'T2') => 2 * (h === 'T1' ? n1[axisId] : n2[axisId])
  const parsed = (key: string) => (values[key] === undefined || values[key].trim() === '' ? NaN : Number(values[key]))
  const problems = axes.flatMap((a) =>
    (['T1', 'T2'] as const).flatMap((h) => {
      const v = parsed(`${a.id}.${h}`)
      const m = max(a.id, h)
      return Number.isInteger(v) && Math.abs(v) <= m ? [] : [`${a.name}, ${h === 'T1' ? 'near term' : 'long run'}: a whole number from −${m} to +${m}`]
    }),
  )
  const filled = Object.values(values).filter((v) => v.trim() !== '').length

  function submit() {
    const t1Raw = {} as Record<AxisId, number>
    const t2Raw = {} as Record<AxisId, number>
    axes.forEach((a) => {
      t1Raw[a.id] = parsed(`${a.id}.T1`)
      t2Raw[a.id] = parsed(`${a.id}.T2`)
    })
    navigate(`/results?d=${encodeShareLink({ t1Raw, t2Raw })}`)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <Link to="/" className="text-gray-400 hover:text-gray-600 text-xs font-semibold uppercase tracking-wider">
          AI Worldview Atlas
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-3">Results from the paper edition</h1>
      <p className="text-gray-700 mb-6">
        Copy the net totals from the booklet&apos;s totals page: for each axis, the near-term net and the long-run net (pole A points
        minus pole B points). You&apos;ll see the same results the online quiz gives, including your closest archetypes.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b py-2">Axis</th>
              <th className="border-b py-2">Near-term net</th>
              <th className="border-b py-2">Long-run net</th>
            </tr>
          </thead>
          <tbody>
            {axes.map((a) => (
              <tr key={a.id}>
                <td className="py-2 pr-3">{a.name}</td>
                {(['T1', 'T2'] as const).map((h) => (
                  <td key={h} className="py-2 pr-3">
                    <input
                      type="number"
                      inputMode="numeric"
                      step={1}
                      min={-max(a.id, h)}
                      max={max(a.id, h)}
                      aria-label={`${a.name} ${h === 'T1' ? 'near-term' : 'long-run'} net`}
                      value={values[`${a.id}.${h}`] ?? ''}
                      onChange={(e) => setValues((v) => ({ ...v, [`${a.id}.${h}`]: e.target.value }))}
                      className="w-24 border border-gray-300 rounded px-2 py-1"
                    />
                    <span className="block text-xs text-gray-500">−{max(a.id, h)} to +{max(a.id, h)}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filled === 16 && problems.length > 0 && (
        <ul className="mt-4 text-sm text-red-700 list-disc pl-5">
          {problems.map((p) => <li key={p}>{p}</li>)}
        </ul>
      )}
      <button
        type="button"
        onClick={submit}
        disabled={problems.length > 0}
        className="mt-6 px-6 py-3 rounded bg-blue-600 text-white disabled:opacity-40 disabled:cursor-not-allowed"
      >
        See my results
      </button>
    </div>
  )
}
