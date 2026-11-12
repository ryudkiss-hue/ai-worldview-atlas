import { useState } from 'react'
import { Link } from 'react-router-dom'
import { narrativeExperiments } from '../data/narrativeExperiments'
import { narrativeExperimentsB } from '../data/narrativeExperimentsB'
import { narrativeExperimentsC } from '../data/narrativeExperimentsC'
import { narrativeExperimentsD } from '../data/narrativeExperimentsD'
import { axes } from '../data/axes'
import { MarkdownRenderer } from '../components/MarkdownRenderer'

interface Experiment {
  title: string
  intro: string
  clash?: { external: string; internal: string }
  questions?: { q: string; subtext?: string; followups?: string[] }[]
  axes?: string[]
}

const ALL: [string, Experiment][] = Object.entries({
  ...narrativeExperiments,
  ...narrativeExperimentsB,
  ...narrativeExperimentsC,
  ...narrativeExperimentsD,
}) as [string, Experiment][]

const AXIS_ALIAS: Record<string, string> = {
  'legal-moral': 'legalMoral',
  'socio-economic': 'socioEconomic',
  'risk-profile': 'risk',
}
const axisName = (id: string) => axes.find((a) => a.id === (AXIS_ALIAS[id] ?? id))?.name ?? id

/** The 25 thought experiments, unscored: reflections that ground the axes in concrete situations. */
export function ThoughtExperimentsPage() {
  const [open, setOpen] = useState<string | null>(null)
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <Link to="/" className="text-gray-400 hover:text-gray-600 text-xs font-semibold uppercase tracking-wider">
          AI Worldview Atlas
        </Link>
        <Link to="/results" className="text-gray-500 hover:text-gray-700 text-xs font-semibold uppercase tracking-wider">
          Your results
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-3">Thought experiments</h1>
      <p className="text-gray-700 mb-6">
        {ALL.length} concrete situations that put the axes under pressure. None of them changes your scores. Each sets out a case,
        the tension inside it, and questions worth sitting with.
      </p>
      <ul className="space-y-3">
        {ALL.map(([key, ex]) => {
          const isOpen = open === key
          return (
            <li key={key} className="rounded-lg border border-gray-200">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : key)}
                className="w-full text-left p-4 flex justify-between items-start gap-3 hover:bg-gray-50"
              >
                <span>
                  <span className="font-semibold text-gray-900">{ex.title}</span>
                  {ex.axes && ex.axes.length > 0 && (
                    <span className="block text-xs text-gray-500 mt-1">{ex.axes.map(axisName).join(' · ')}</span>
                  )}
                </span>
                <span className="text-gray-400" aria-hidden="true">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 space-y-4 text-gray-800">
                  <MarkdownRenderer content={ex.intro} />
                  {ex.clash && (
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <p className="rounded bg-gray-50 border border-gray-200 p-3"><b>From outside:</b> {ex.clash.external}</p>
                      <p className="rounded bg-gray-50 border border-gray-200 p-3"><b>From inside:</b> {ex.clash.internal}</p>
                    </div>
                  )}
                  {ex.questions?.map((q) => (
                    <div key={q.q}>
                      <p className="font-semibold">{q.q}</p>
                      {q.subtext && <p className="text-sm text-gray-600">{q.subtext}</p>}
                      {q.followups && q.followups.length > 0 && (
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-gray-700">
                          {q.followups.map((f) => <li key={f}>{f}</li>)}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
