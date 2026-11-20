import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { axes } from '../data/axes'
import type { AxisId } from '../data/types'
import { itemCounts } from '../lib/scoring'
import { encodeShareLink } from '../lib/shareLink'

/**
 * For the paper edition: enter the 16 net totals from the booklet (near term and long run for each axis), plus how many
 * statements were left as "no settled view" in each block, and see the same results page the online quiz gives,
 * including the exact archetype match.
 */
export function PaperScoresPage() {
  const navigate = useNavigate()
  const n1 = itemCounts('T1')
  const n2 = itemCounts('T2')
  const [values, setValues] = useState<Record<string, string>>({})
  const count = (axisId: AxisId, h: 'T1' | 'T2') => (h === 'T1' ? n1[axisId] : n2[axisId])
  const parsed = (key: string) => (values[key] === undefined || values[key].trim() === '' ? NaN : Number(values[key]))
  // Blank counts are optional: an empty box means every statement in that block was answered.
  const blanks = (axisId: AxisId, h: 'T1' | 'T2') => {
    const v = values[`${axisId}.${h}.blank`]
    return v === undefined || v.trim() === '' ? 0 : Number(v)
  }
  const label = (h: 'T1' | 'T2') => (h === 'T1' ? 'near term' : 'long run')
  const problems = axes.flatMap((a) =>
    (['T1', 'T2'] as const).flatMap((h) => {
      const out: string[] = []
      const b = blanks(a.id, h)
      const n = count(a.id, h)
      if (!(Number.isInteger(b) && b >= 0 && b <= n)) out.push(`${a.name}, ${label(h)}: — answers must be a whole number from 0 to ${n}`)
      const m = 2 * (n - (Number.isInteger(b) ? Math.min(Math.max(b, 0), n) : 0))
      const v = parsed(`${a.id}.${h}`)
      if (!(Number.isInteger(v) && Math.abs(v) <= m)) out.push(`${a.name}, ${label(h)}: the net must be a whole number from −${m} to +${m}`)
      return out
    }),
  )
  const filled = axes.reduce((k, a) => k + (['T1', 'T2'] as const).filter((h) => (values[`${a.id}.${h}`] ?? '').trim() !== '').length, 0)

  function submit() {
    const t1Raw = {} as Record<AxisId, number>
    const t2Raw = {} as Record<AxisId, number>
    const t1N = {} as Record<AxisId, number>
    const t2N = {} as Record<AxisId, number>
    axes.forEach((a) => {
      t1Raw[a.id] = parsed(`${a.id}.T1`)
      t2Raw[a.id] = parsed(`${a.id}.T2`)
      t1N[a.id] = n1[a.id] - blanks(a.id, 'T1')
      t2N[a.id] = n2[a.id] - blanks(a.id, 'T2')
    })
    navigate(`/results?d=${encodeShareLink({ t1Raw, t2Raw, t1N, t2N })}`)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <Link to="/" className="text-gray-500 hover:text-gray-700 text-xs font-semibold uppercase tracking-wider">
          AI Worldview Atlas
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-3">Results from the paper edition</h1>
      <p className="text-gray-700 mb-3">
        Copy the numbers from the booklet&apos;s totals page: for each axis, the near-term net and the long-run net (pole A points
        minus pole B points), and how many statements you answered with &mdash; in each block. If you didn&apos;t use &mdash;, leave
        those boxes empty. You&apos;ll see the same results the online quiz gives, including your closest archetypes.
      </p>
      <p className="text-sm text-gray-600 mb-6">
        Don&apos;t have the booklet?{' '}
        <a href={`${import.meta.env.BASE_URL}ai-worldview-atlas-paper.pdf`} className="text-blue-600 underline">
          Download it (PDF)
        </a>
        .
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b py-2">Axis</th>
              <th className="border-b py-2">Near-term net</th>
              <th className="border-b py-2"><span aria-hidden="true">Near-term &mdash;</span><span className="sr-only">Near-term statements left as no settled view</span></th>
              <th className="border-b py-2">Long-run net</th>
              <th className="border-b py-2"><span aria-hidden="true">Long-run &mdash;</span><span className="sr-only">Long-run statements left as no settled view</span></th>
            </tr>
          </thead>
          <tbody>
            {axes.map((a) => (
              <tr key={a.id}>
                <td className="py-2 pr-3">{a.name}</td>
                {(['T1', 'T2'] as const).flatMap((h) => [
                  <td key={h} className="py-2 pr-3">
                    <input
                      type="number"
                      inputMode="numeric"
                      step={1}
                      aria-label={`${a.name} ${h === 'T1' ? 'near-term' : 'long-run'} net`}
                      value={values[`${a.id}.${h}`] ?? ''}
                      onChange={(e) => setValues((v) => ({ ...v, [`${a.id}.${h}`]: e.target.value }))}
                      className="w-20 border border-gray-300 rounded px-2 py-1"
                    />
                  </td>,
                  <td key={`${h}.blank`} className="py-2 pr-3">
                    <input
                      type="number"
                      inputMode="numeric"
                      step={1}
                      min={0}
                      max={count(a.id, h)}
                      placeholder="0"
                      aria-label={`${a.name} ${h === 'T1' ? 'near-term' : 'long-run'} no settled view count`}
                      value={values[`${a.id}.${h}.blank`] ?? ''}
                      onChange={(e) => setValues((v) => ({ ...v, [`${a.id}.${h}.blank`]: e.target.value }))}
                      className="w-16 border border-gray-300 rounded px-2 py-1"
                    />
                  </td>,
                ])}
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
