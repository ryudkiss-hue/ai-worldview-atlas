import { useMemo, useState, type ReactNode } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ProgressBar } from '../../components/ProgressBar'
import { useCompass } from '../../compass/CompassContext'
import { CompassPlot } from '../../compass/CompassPlot'
import { ARCHETYPES, AXES, BAND, COMPASS_VERSION, ITEMS, SCALE, STAGES, TIERS, type Tier } from '../../compass/data'
import {
  AXIS_KEYS, DIAGNOSTICS, archetypeThinkers, cellCode, describeArchetype, findArchetype, isComplete, scoreCompass,
  signed, tierInfo, tierSymbol, type Answers,
} from '../../compass/engine'

const BY_ID = new Map(ITEMS.map((it) => [it[0], it]))
const FILE = (name: string) => `${import.meta.env.BASE_URL}compass/${name}`
const cap = (s: string) => s[0].toUpperCase() + s.slice(1)
const AXIS_LABEL = { x: 'X · Ontological', y: 'Y · Moral-agency', z: 'Z · Ecological' } as const

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100 gap-3">
        <Link to="/" className="text-gray-400 hover:text-gray-600 text-xs font-semibold uppercase tracking-wider">
          The AI Worldview Atlas
        </Link>
        <Link to="/compass" className="text-gray-500 hover:text-gray-700 text-xs font-semibold uppercase tracking-wider">
          The Synthetic Compass
        </Link>
      </div>
      {children}
    </div>
  )
}

const btn = 'px-6 py-2.5 rounded-lg font-bold transition focus:outline-none focus:ring-2 focus:ring-blue-400'
const primary = `${btn} bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed`
const secondary = `${btn} border border-gray-300 text-gray-700 hover:bg-gray-50`

/* ---------------- intro ---------------- */
export function CompassIntroPage() {
  const navigate = useNavigate()
  const { answers, reset } = useCompass()
  const answered = ITEMS.filter((it) => answers[it[0]] !== undefined).length
  const done = isComplete(answers)
  const firstOpen = STAGES.find((s) => ITEMS.some((it) => it[4] === s.n && answers[it[0]] === undefined))?.n ?? 1
  const [confirmReset, setConfirmReset] = useState(false)

  return (
    <Shell>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">The Synthetic Compass</h1>
        <p className="text-gray-700 mb-4">
          A three-axis typology of how people think about artificial minds: what a mind is, how we should treat one, and what kind of
          future intelligence should build.
        </p>
        <p className="text-sm text-gray-500">
          120 statements in six stages, about 20 to 30 minutes. Your answers place you among 27 archetypes. They're saved only in this
          browser, so you can stop and come back later.
        </p>
      </div>

      <div className="space-y-3 mb-8">
        {AXES.map((a) => (
          <div key={a.key} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <p className="font-semibold text-gray-800">{AXIS_LABEL[a.key]}: {a.question}</p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-semibold">−10 {a.neg.name}</span> to <span className="font-semibold">+10 {a.pos.name}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="mb-8 rounded-lg border-l-4 border-blue-600 bg-blue-50 p-4 text-sm text-gray-700 space-y-2">
        <p className="font-semibold text-gray-800">Two terms used throughout</p>
        <p>
          <b>AI system</b> means any artificial system that takes in information and acts on it, from a chat assistant to a robot.{' '}
          <b>Robot</b> means an AI system with a physical body.
        </p>
        <p>
          When a statement describes what a system says or asks for, take it at face value as something the system does; you don't
          have to believe anything about its inner life to answer. Some statements describe systems more capable than today's; answer
          about what you think would be true or right if such systems existed.
        </p>
        <p>There is no neutral option. If you aren't sure, choose the side you lean toward.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {done ? (
          <button type="button" className={primary} onClick={() => navigate('/compass/results')}>See my results</button>
        ) : (
          <button type="button" className={primary} onClick={() => navigate(`/compass/stage/${firstOpen}`)}>
            {answered ? `Continue (${answered} of 120 answered)` : 'Start'}
          </button>
        )}
        {answered > 0 && !confirmReset && (
          <button type="button" className={secondary} onClick={() => setConfirmReset(true)}>Start over</button>
        )}
        {confirmReset && (
          <span className="flex items-center gap-2 text-sm text-gray-700">
            Clear all {answered} answers?
            <button type="button" className={secondary} onClick={() => { reset(); setConfirmReset(false) }}>Yes, clear them</button>
            <button type="button" className={secondary} onClick={() => setConfirmReset(false)}>Keep them</button>
          </span>
        )}
      </div>

      <div className="text-sm text-gray-600 text-center space-y-1">
        <p><Link className="underline" to="/compass/archetypes">The 27 archetypes and how scoring works</Link></p>
        <p>
          Also available: a <a className="underline" href={FILE('synthetic-compass-paper.pdf')}>printable paper edition</a> with tally
          scoring (PDF), and a <a className="underline" href={FILE('SyntheticCompassForm.gs')}>Google Forms version</a> (an Apps Script
          that builds and scores the form).
        </p>
      </div>
    </Shell>
  )
}

/* ---------------- one stage of 20 statements ---------------- */
export function CompassStagePage() {
  const { stage } = useParams<{ stage: string }>()
  const navigate = useNavigate()
  const { answers, order, setAnswer } = useCompass()
  const n = Number(stage)
  const st = STAGES.find((s) => s.n === n)
  if (!st) return <Navigate to="/compass" replace />
  const ids = order[n]
  const answered = ITEMS.filter((it) => answers[it[0]] !== undefined).length
  const stageDone = ids.every((id) => answers[id] !== undefined)
  const left = ids.filter((id) => answers[id] === undefined).length

  return (
    <Shell>
      <ProgressBar current={answered} total={ITEMS.length} label={`Stage ${n} of 6 · ${answered} of 120 answered`} />
      <h2 className="text-2xl font-bold mt-4 mb-6">{st.title}</h2>
      <ol className="space-y-5">
        {ids.map((id, k) => {
          const it = BY_ID.get(id)!
          return (
            <li key={id} className="border-b border-gray-100 pb-4">
              <p className="mb-2 text-gray-800">
                <span className="text-gray-400 text-sm mr-2">{(n - 1) * 20 + k + 1}.</span>
                {it[5]}
              </p>
              <div role="radiogroup" aria-label={`Statement ${(n - 1) * 20 + k + 1}`} className="flex flex-wrap gap-2">
                {SCALE.map((s) => {
                  const on = answers[id] === s.value
                  return (
                    <button key={s.value} type="button" role="radio" aria-checked={on} onClick={() => setAnswer(id, s.value)}
                      className={`rounded-full border px-3 py-1 text-sm ${on ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                      {s.label}
                    </button>
                  )
                })}
              </div>
            </li>
          )
        })}
      </ol>
      <div className="flex justify-between items-center mt-8 gap-3">
        <button type="button" className={secondary} onClick={() => navigate(n === 1 ? '/compass' : `/compass/stage/${n - 1}`)}>Back</button>
        <span className="text-sm text-gray-500">{stageDone ? '' : `${left} left in this stage`}</span>
        <button type="button" className={primary} disabled={!stageDone}
          onClick={() => { window.scrollTo?.(0, 0); navigate(n === 6 ? '/compass/results' : `/compass/stage/${n + 1}`) }}>
          {n === 6 ? 'See my results' : 'Next stage'}
        </button>
      </div>
    </Shell>
  )
}

/* ---------------- results ---------------- */
function Bar({ label, right, value, lo, hi, centered }: { label: string; right: string; value: number; lo: number; hi: number; centered?: boolean }) {
  const pct = ((value - lo) / (hi - lo)) * 100
  const mid = centered ? ((0 - lo) / (hi - lo)) * 100 : 0
  const left = Math.min(pct, mid)
  const width = Math.abs(pct - mid)
  return (
    <div>
      <div className="flex justify-between text-sm"><span>{label}</span><span className="font-mono">{right}</span></div>
      <div className="relative h-2.5 rounded-full bg-gray-200 overflow-hidden">
        {centered && <span className="absolute top-0 bottom-0 w-px bg-gray-500" style={{ left: `${mid}%` }} />}
        <span className="absolute top-0 bottom-0 rounded-full bg-gray-700" style={{ left: `${left}%`, width: `${width}%` }} />
      </div>
    </div>
  )
}

export function CompassResultsPage() {
  const { answers } = useCompass()
  const [showAll, setShowAll] = useState(false)
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle')
  const done = isComplete(answers)
  const r = useMemo(() => (done ? scoreCompass(answers as Answers) : null), [done, answers])
  if (!r) return <Navigate to="/compass" replace />
  const a = r.archetype
  const summary = [
    `The Synthetic Compass (v${COMPASS_VERSION})`,
    `Archetype: ${a.name} (${cellCode(a.tiers)})`,
    `Coordinates: X ${signed(r.S.x)}  Y ${signed(r.S.y)}  Z ${signed(r.S.z)}`,
    `Closest archetypes: ${r.profile.slice(0, 3).map((p) => `${p.archetype.name} ${p.percent}%`).join(', ')}`,
    ...STAGES.map((s, i) => `${s.sub}: ${r.modules[i]}%`),
    `Tension flags: ${r.diagnostics.length ? r.diagnostics.map((d) => DIAGNOSTICS[d].name).join(', ') : 'none'}`,
  ].join('\n')

  async function copy() {
    try {
      await navigator.clipboard.writeText(summary)
      setCopied('ok')
    } catch {
      setCopied('fail')
    }
  }

  return (
    <Shell>
      <section className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Your archetype · {cellCode(a.tiers)}</p>
        <h1 className="text-3xl font-bold mt-1">{a.name}</h1>
        <p className="text-gray-600 italic mt-1">{a.tagline}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {AXIS_KEYS.map((k, i) => (
            <span key={k} className="text-xs rounded-full border border-gray-300 px-2.5 py-0.5 text-gray-600">
              <b className="text-gray-800">{'XYZ'[i]}{tierSymbol(a.tiers[i])}</b> {tierInfo(k, a.tiers[i]).label}
            </span>
          ))}
        </div>
        <p className="mt-4 text-gray-800">{describeArchetype(a)}</p>
        <p className="mt-3 text-sm text-gray-500">
          Related thinkers and works, one group per axis: {archetypeThinkers(a)}. Each made arguments close to one part of this
          position; none of them necessarily holds all of it.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">Coordinates</h2>
        <div className="grid grid-cols-3 gap-3 mb-3">
          {AXIS_KEYS.map((k) => (
            <div key={k} className="rounded-lg border border-gray-200 p-3">
              <p className="text-xs text-gray-500">{AXIS_LABEL[k]}</p>
              <p className="font-mono text-xl">{signed(r.S[k])}</p>
            </div>
          ))}
        </div>
        {r.closeCalls.length > 0 && (
          <p className="text-sm text-gray-600 mb-3">
            Your {r.closeCalls.map((k) => k.toUpperCase()).join(' and ')} score{r.closeCalls.length > 1 ? 's are' : ' is'} within 1 point
            of a tier boundary (±{BAND}), so a few changed answers could make you {r.profile[1].archetype.name}, the closest neighboring
            archetype.
          </p>
        )}
        <CompassPlot x={r.S.x} y={r.S.y} z={r.S.z} />
        <p className="text-xs text-gray-500 mt-2">
          X runs left to right and Y bottom to top. Your dot's color shows Z, from violet (post-biological) to green (ecological), repeated
          on the gauge. Dashed lines mark the tier boundaries at −{BAND} and +{BAND}.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">Archetype profile</h2>
        <div className="space-y-2">
          {(showAll ? r.profile : r.profile.slice(0, 5)).map((p, i) => (
            <Bar key={p.archetype.name} label={`${p.archetype.name}${i === 0 ? ' · your archetype' : ''}`} right={`${p.percent}%`}
              value={p.percent} lo={0} hi={100} />
          ))}
        </div>
        <button type="button" className="text-sm underline text-gray-600 mt-2" onClick={() => setShowAll((v) => !v)}>
          {showAll ? 'Show the five closest' : 'Show all 27 archetypes'}
        </button>
        <p className="text-xs text-gray-500 mt-2">
          How close your coordinates sit to each archetype's prototype point, which lies at −4, 0 or +4 on each axis. Every archetype is
          measured the same way, and your own is always the closest.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">Axis facets</h2>
        {AXIS_KEYS.map((k) => (
          <div key={k} className="mb-4 space-y-2">
            <p className="text-xs text-gray-500">{AXIS_LABEL[k]} · overall {signed(r.S[k])}</p>
            {r.facets[k].map((f) => (
              <Bar key={f.name} label={f.items < 8 ? `${f.name} · low precision, ${f.items} statements` : f.name} right={signed(f.value)}
                value={f.value} lo={-10} hi={10} centered />
            ))}
          </div>
        ))}
        {r.mixed.length > 0 && (
          <p className="text-sm rounded-lg bg-amber-50 border border-amber-200 p-3 text-gray-700">
            <b>Mixed axis.</b> Your {r.mixed.map((k) => k.toUpperCase()).join(' and ')} score combines themes that point in opposite
            directions, so the single number hides a split in your views.
          </p>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">Module scores</h2>
        <div className="space-y-2">
          {STAGES.map((s, i) => (
            <Bar key={s.n} label={`${s.sub} · Stage ${s.n}`} right={`${r.modules[i]}%`} value={r.modules[i]} lo={0} hi={100} centered={false} />
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">Each score measures agreement with its stage's main theme. 50% is balanced.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">Tension diagnostics</h2>
        {r.diagnostics.length ? (
          <div className="space-y-2">
            {r.diagnostics.map((d) => (
              <p key={d} className="text-sm rounded-lg bg-gray-50 border border-gray-200 p-3">
                <b>{DIAGNOSTICS[d].name}.</b> {DIAGNOSTICS[d].text(r.S)}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600">None of the three tension diagnostics triggered for your answers.</p>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">Summary</h2>
        <textarea readOnly value={summary} aria-label="Results summary"
          className="w-full h-40 font-mono text-xs bg-gray-50 border border-gray-200 rounded-lg p-3" />
        <div className="flex items-center gap-3 mt-2">
          <button type="button" className={secondary} onClick={copy}>Copy summary</button>
          <span className="text-sm text-gray-500" role="status">
            {copied === 'ok' ? 'Copied.' : copied === 'fail' ? 'Copying was blocked; select the text and copy it instead.' : ''}
          </span>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link to="/compass/archetypes" className={secondary}>All 27 archetypes</Link>
        <Link to="/compass/stage/1" className={secondary}>Review my answers</Link>
      </div>
    </Shell>
  )
}

/* ---------------- reference ---------------- */
export function CompassReferencePage() {
  const { answers } = useCompass()
  const mine = isComplete(answers) ? scoreCompass(answers as Answers).archetype : null
  const range = (t: Tier) => (t > 0 ? `+${BAND} to +10` : t < 0 ? `−10 to −${BAND}` : `between −${BAND} and +${BAND}`)
  return (
    <Shell>
      <h1 className="text-3xl font-bold mb-3">The 27 archetypes</h1>
      <p className="text-gray-700 mb-6">
        Each axis is split into three tiers: negative from −10 to −{BAND}, middle between −{BAND} and +{BAND}, and positive from +{BAND}{' '}
        to +10. Your three tiers together pick one of 3 × 3 × 3 = 27 archetypes. Each description is built from one sentence per axis,
        so the same tier always reads the same way. Related thinkers made arguments close to one tier; none of them necessarily holds a
        whole profile.
      </p>

      <div className="space-y-4 mb-8">
        {AXIS_KEYS.map((k, i) => (
          <div key={k} className="rounded-lg border border-gray-200 p-4">
            <p className="font-semibold mb-2">{AXIS_LABEL[k]}</p>
            <div className="space-y-3">
              {([-1, 0, 1] as Tier[]).map((t) => {
                const info = TIERS[k][String(t) as '-1' | '0' | '1']
                const on = mine && mine.tiers[i] === t
                return (
                  <div key={t} className={on ? 'border-l-4 border-blue-600 pl-3' : 'pl-4'}>
                    <p className="text-xs text-gray-500">{'XYZ'[i]}{tierSymbol(t)} · {range(t)}{on ? ' · your tier' : ''}</p>
                    <p className="text-sm text-gray-800"><b>{cap(info.label)}.</b> {info.sentence}</p>
                    <p className="text-xs text-gray-500">Related: {info.thinkers}</p>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {([-1, 0, 1] as Tier[]).map((xt) => (
        <div key={xt} className="mb-6">
          <h2 className="text-lg font-bold mb-2">X{tierSymbol(xt)} · {cap(TIERS.x[String(xt) as '-1' | '0' | '1'].label)}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {([1, 0, -1] as Tier[]).flatMap((yt) => ([-1, 0, 1] as Tier[]).map((zt) => {
              const ar = findArchetype([xt, yt, zt])
              const me = mine === ar
              return (
                <div key={ar.name} className={`rounded-lg border p-3 text-sm ${me ? 'border-blue-600 ring-1 ring-blue-600' : 'border-gray-200'}`}>
                  <p className="text-xs text-gray-500 flex justify-between"><span>{cellCode(ar.tiers)}</span>{me && <span className="text-blue-700 font-semibold">You</span>}</p>
                  <p className="font-semibold">{ar.name}</p>
                  <p className="text-gray-600">{ar.tagline}</p>
                </div>
              )
            }))}
          </div>
        </div>
      ))}
      <p className="text-xs text-gray-500 mb-8">
        In each group, rows run from Y+ at the top to Y− at the bottom, and columns from Z− on the left to Z+ on the right.
      </p>

      <h2 className="text-lg font-bold mb-2">How scoring works</h2>
      <div className="text-sm text-gray-700 space-y-2 mb-6">
        <p>
          Each statement counts toward one or two of the three axes. Agreeing with some statements moves you toward an axis's positive
          end, and agreeing with others toward its negative end. Strong answers count twice as much as mild ones, and some statements carry
          more weight than others. Your total on each axis is scaled to run from −10 to +10.
        </p>
        <p>
          Every statement has a mirrored partner on the same topic that takes the opposite stance with the same weight. Because of that,
          someone who agrees with everything, or disagrees with everything, lands at the exact center. Your scores come from where you
          take sides, not from a general habit of agreeing.
        </p>
        <p>
          The archetype profile measures your distance to each archetype's prototype point in the same way for all {ARCHETYPES.length},
          so no archetype is treated as the right answer.
        </p>
      </div>
      <Link to="/compass" className={secondary}>Back to the Compass</Link>
    </Shell>
  )
}
