import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuiz } from '../state/QuizContext'
import { LikertInput } from '../components/LikertInput'
import {
  DISPLAY_ORDER,
  INTIMACY_BOTTOM_LINE,
  INTIMACY_DECLINED,
  INTIMACY_POLES,
  describeLean,
  intimacyResearch,
  intimacySources,
  intimacyStatements,
  intimacyThemes,
  scoreIntimacy,
  type IntimacySource,
} from '../data/intimacyModule'

const fmt = (v: number) => (v > 0 ? `+${v.toFixed(1)}` : v.toFixed(1))
const sourceById = new Map(intimacySources.map((s) => [s.id, s]))

/** A −10..+10 bar: guarded on the left, open on the right. */
function LeanBar({ score, label }: { score: number; label: string }) {
  const pct = ((score + 10) / 20) * 100
  return (
    <div>
      <div className="relative h-3 rounded-full bg-gray-100 border border-gray-200" role="img" aria-label={`${label}: ${fmt(score)} on a scale from −10 guarded to +10 open`}>
        <div className="absolute inset-y-0 left-1/2 w-px bg-gray-400" aria-hidden="true" />
        <div
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600 border-2 border-white shadow"
          style={{ left: `${pct}%` }}
          aria-hidden="true"
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{INTIMACY_POLES.guarded}</span>
        <span>{INTIMACY_POLES.open}</span>
      </div>
    </div>
  )
}

function Cites({ ids }: { ids: string[] }) {
  return (
    <span className="text-sm text-gray-500">
      {' '}
      (
      {ids.map((id, i) => {
        const s = sourceById.get(id) as IntimacySource
        return (
          <span key={id}>
            {i > 0 && '; '}
            <a href={s.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
              {s.cite}
            </a>
          </span>
        )
      })}
      )
    </span>
  )
}

/** Optional focus module on AI companionship. Scored on its own; never part of the Atlas axes or archetype match. */
export function IntimacyPage() {
  const { intimacyAnswers, setIntimacyAnswer, resetIntimacy } = useQuiz()
  const [confirmReset, setConfirmReset] = useState(false)
  const byId = new Map(intimacyStatements.map((q) => [q.id, q]))
  const ordered = DISPLAY_ORDER.map((id) => byId.get(id)!)
  const score = scoreIntimacy(intimacyAnswers)
  const done = score.answered === intimacyStatements.length
  const declinedCount = intimacyStatements.filter((q) => intimacyAnswers[q.id] === INTIMACY_DECLINED).length

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

      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Focus module · optional</p>
      <h1 className="text-3xl font-bold mt-1 mb-3">Friends, partners and therapists</h1>
      <p className="text-gray-700 mb-3">
        People now turn to AI chatbots as best friends, romantic partners and stand-in therapists. These {intimacyStatements.length}{' '}
        statements ask what you think that does to attachment, critical thinking, our sense of who we are, loneliness, intimacy
        and our ties to each other. It takes about five minutes.
      </p>
      <p className="text-gray-700 mb-3">
        Your answers give a separate score from <strong>{INTIMACY_POLES.guarded}</strong> (−10) to <strong>{INTIMACY_POLES.open}</strong>{' '}
        (+10). They never change your Atlas scores or archetype match, and they aren&apos;t included in share links. Every statement
        has a mirrored partner, and neither end of the scale is the right answer.
      </p>
      <p className="text-sm text-gray-500 mb-6">
        Answers are saved in this browser only. If you&apos;re going through something hard right now, someone you trust or a local
        support line will help more than a quiz.
      </p>

      <ul className="space-y-5">
        {ordered.map((q) => {
          const value = intimacyAnswers[q.id]
          const declined = value === INTIMACY_DECLINED
          return (
            <li key={q.id}>
              <p className="text-gray-800 leading-relaxed mb-2">{q.statement}</p>
              <LikertInput
                questionId={q.id}
                value={declined ? undefined : value}
                declined={declined}
                onChange={(v) => setIntimacyAnswer(q.id, v)}
                onDecline={() => setIntimacyAnswer(q.id, INTIMACY_DECLINED)}
              />
            </li>
          )
        })}
      </ul>

      <p className="text-sm text-gray-500 mt-4" aria-live="polite">
        {score.answered} of {intimacyStatements.length} answered
      </p>

      {done && (
        <section className="mt-8 rounded-lg border border-gray-200 p-5" aria-labelledby="intimacy-result">
          <h2 id="intimacy-result" className="text-2xl font-bold mb-1">
            Your lean: {describeLean(score.overall)}
          </h2>
          <p className="text-gray-600 mb-4">Overall {fmt(score.overall)} on the −10 to +10 scale.</p>
          <LeanBar score={score.overall} label="Overall" />
          <p className="text-gray-700 mt-4">
            <strong>{INTIMACY_POLES.open}</strong>: {INTIMACY_POLES.openDescription} <strong>{INTIMACY_POLES.guarded}</strong>:{' '}
            {INTIMACY_POLES.guardedDescription} Most thoughtful people land somewhere in between, and many lean differently theme by
            theme.
          </p>
          {declinedCount > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              You marked {declinedCount} as no settled view. Each counts as zero, which pulls a theme toward the middle.
            </p>
          )}

          <h3 className="text-lg font-semibold mt-6 mb-3">Theme by theme</h3>
          {(['The roles AI plays', 'What it may change'] as const).map((group) => (
            <div key={group} className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">{group}</p>
              <ul className="space-y-4">
                {intimacyThemes
                  .filter((t) => t.group === group)
                  .map((theme) => (
                    <li key={theme.id}>
                      <p className="text-gray-800 font-medium">
                        {theme.name}: <span className="font-normal text-gray-600">{describeLean(score.byTheme[theme.id])} ({fmt(score.byTheme[theme.id])})</span>
                      </p>
                      <LeanBar score={score.byTheme[theme.id]} label={theme.name} />
                      <p className="text-sm text-gray-600 italic mt-1">{theme.reflection}</p>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
          <p className="text-sm text-gray-500 mt-4">
            Each theme rests on just two statements, so treat these as conversation starters, not measurements. Like the rest of the
            site, this module hasn&apos;t been validated.
          </p>
        </section>
      )}

      <section className="mt-10" aria-labelledby="intimacy-research">
        <h2 id="intimacy-research" className="text-2xl font-bold mb-2">
          What the research says
        </h2>
        <p className="text-gray-700 mb-4">
          {done
            ? 'Here is what professional bodies, public-health researchers, peer-reviewed studies and reporters have found so far, on both sides.'
            : 'You may want to answer first, so this doesn’t shape your answers. It covers what professional bodies, public-health researchers, peer-reviewed studies and reporters have found so far, on both sides.'}
        </p>
        <p className="text-gray-800 bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">{INTIMACY_BOTTOM_LINE}</p>
        {intimacyResearch.map((section) => (
          <details key={section.heading} className="mb-3 rounded-lg border border-gray-200">
            <summary className="cursor-pointer p-4 font-semibold text-gray-900">
              {section.heading}
              {done && (
                <span className="font-normal text-gray-500 text-sm">
                  {' '}
                  · your lean:{' '}
                  {section.themes
                    .map((id) => `${intimacyThemes.find((t) => t.id === id)!.short} ${fmt(score.byTheme[id])}`)
                    .join(', ')}
                </span>
              )}
            </summary>
            <div className="px-4 pb-4 space-y-3">
              <p className="text-sm font-semibold text-emerald-700">Evidence and arguments on the open side</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {section.benefits.map((b) => (
                  <li key={b.text}>
                    {b.text}
                    <Cites ids={b.sources} />
                  </li>
                ))}
              </ul>
              <p className="text-sm font-semibold text-amber-700">Evidence and arguments on the guarded side</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {section.concerns.map((c) => (
                  <li key={c.text}>
                    {c.text}
                    <Cites ids={c.sources} />
                  </li>
                ))}
              </ul>
            </div>
          </details>
        ))}

        <h3 className="text-lg font-semibold mt-6 mb-2">Sources</h3>
        <ol className="list-decimal pl-7 space-y-2 text-sm text-gray-700">
          {intimacySources.map((s) => (
            <li key={s.id}>
              <a href={s.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                {s.title}
              </a>
              . {s.publisher}, {s.date}. <span className="text-gray-500">{s.kind}.</span>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link to="/" className="px-4 py-2 rounded border border-gray-300">
          Back to the Atlas
        </Link>
        {score.answered > 0 &&
          (confirmReset ? (
            <span className="flex flex-wrap items-center gap-2 text-sm">
              Clear your answers to this module?
              <button
                type="button"
                onClick={() => {
                  resetIntimacy()
                  setConfirmReset(false)
                }}
                className="px-3 py-1 rounded bg-red-600 text-white"
              >
                Clear
              </button>
              <button type="button" onClick={() => setConfirmReset(false)} className="px-3 py-1 rounded border border-gray-300">
                Keep
              </button>
            </span>
          ) : (
            <button type="button" onClick={() => setConfirmReset(true)} className="px-4 py-2 rounded border border-gray-300">
              Start this module over
            </button>
          ))}
      </div>
    </div>
  )
}
