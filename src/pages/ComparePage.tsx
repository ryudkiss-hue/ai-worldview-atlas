import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { axes } from '../data/axes'
import { describePosition } from '../lib/axisPositions'
import { resultFromShare, compareAxes, averageGap } from '../lib/compare'

/**
 * Two people's results side by side, from their share links. Everything happens in this browser: the links carry the
 * scores, and nothing is sent anywhere.
 */
export function ComparePage() {
  const [params] = useSearchParams()
  const [linkA, setLinkA] = useState(params.get('a') ?? '')
  const [linkB, setLinkB] = useState(params.get('b') ?? '')
  const [nameA, setNameA] = useState('')
  const [nameB, setNameB] = useState('')
  const a = useMemo(() => (linkA.trim() ? resultFromShare(linkA) : null), [linkA])
  const b = useMemo(() => (linkB.trim() ? resultFromShare(linkB) : null), [linkB])
  const rows = a && b ? compareAxes(a.combined, b.combined) : []
  const labelA = nameA.trim() || 'First person'
  const labelB = nameB.trim() || 'Second person'
  const same = rows.filter((r) => r.sameSide).length
  const widest = [...rows].sort((x, y) => y.gap - x.gap).slice(0, 2)
  const axisName = (id: string) => axes.find((x) => x.id === id)!.name

  const input = (label: string, value: string, set: (v: string) => void, name: string, setName: (v: string) => void, ok: boolean | null) => (
    <div className="flex flex-col gap-1">
      <label className="font-semibold">
        {label}&apos;s share link
        <textarea
          value={value}
          onChange={(e) => set(e.target.value)}
          rows={2}
          className="mt-1 w-full border border-gray-300 rounded px-2 py-1 font-mono text-xs"
          placeholder="Paste the link from Copy Shareable Link"
        />
      </label>
      <label className="text-sm text-gray-700">
        Name to show (optional)
        <input value={name} onChange={(e) => setName(e.target.value)} className="ml-2 border border-gray-300 rounded px-2 py-0.5" />
      </label>
      {ok === false && <p className="text-sm text-red-700">This doesn&apos;t look like a result link from this version of the Atlas.</p>}
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <Link to="/" className="text-gray-500 hover:text-gray-700 text-xs font-semibold uppercase tracking-wider">
          AI Worldview Atlas
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-3">Compare two results</h1>
      <p className="text-gray-700 mb-6">
        Paste two share links to see, axis by axis, where two people land and how far apart they are. This works for a pair of
        friends, a couple or a class discussion. The links carry the scores, so nothing is sent anywhere.
      </p>
      <div className="grid gap-6 sm:grid-cols-2">
        {input('First person', linkA, setLinkA, nameA, setNameA, linkA.trim() ? !!a : null)}
        {input('Second person', linkB, setLinkB, nameB, setNameB, linkB.trim() ? !!b : null)}
      </div>

      {a && b && (
        <section aria-labelledby="compare-summary" className="mt-8">
          <h2 id="compare-summary" className="text-xl font-semibold mb-2">
            {labelA} and {labelB}
          </h2>
          <p className="text-gray-700">
            These two results are about {averageGap(rows).toFixed(1)} points apart per axis, and on the same side of {same} of the 8 axes.
            {widest[0].gap >= 4 && (
              <>
                {' '}The widest gaps are on {axisName(widest[0].axisId)}
                {widest[1].gap >= 4 ? ` and ${axisName(widest[1].axisId)}` : ''}.
              </>
            )}
          </p>
          <p className="text-gray-700 mt-2">
            {labelA}&apos;s closest archetype is <b>{a.top.profile.name}</b>; {labelB}&apos;s is <b>{b.top.profile.name}</b>.
          </p>
          {(a.scores.mode === 'short' || b.scores.mode === 'short') && (
            <p className="text-sm text-gray-600 mt-2">
              At least one of these results comes from the 48-statement short version, so its scores are less precise.
            </p>
          )}
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border-b py-2 pr-3">Axis</th>
                  <th className="border-b py-2 pr-3">{labelA}</th>
                  <th className="border-b py-2 pr-3">{labelB}</th>
                  <th className="border-b py-2 pr-3">Gap</th>
                  <th className="border-b py-2">Same side?</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.axisId}>
                    <td className="py-2 pr-3">{axisName(r.axisId)}</td>
                    <td className="py-2 pr-3">{describePosition(r.axisId, r.a)}</td>
                    <td className="py-2 pr-3">{describePosition(r.axisId, r.b)}</td>
                    <td className="py-2 pr-3">{r.gap.toFixed(1)}</td>
                    <td className="py-2">{r.sameSide ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Scores run from −10 to +10, and &ldquo;same side&rdquo; means both are toward the same pole or both in the middle
            (from −2 to +2). A gap of a few points is within the noise of a questionnaire like this one.
          </p>
        </section>
      )}
    </div>
  )
}
