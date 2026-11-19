import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { axes } from '../data/axes'
import { questions, questionsForAxis } from '../data/questions'
import { questionsForMode } from '../data/shortForm'
import { profiles } from '../data/profiles'
import { profileReports } from '../data/profileReports'
import { stakeholderTags } from '../data/stakeholderTags'
import { useQuiz } from '../state/QuizContext'
import {
  computeRawAxisScores,
  scaleAxisScores,
  combineHorizons,
  classify,
  axesInAgreement,
  isCloseCall,
  isEqualWeights,
  CLOSE_CALL_MARGIN,
  CLOSE_CALL_MARGIN_SHORT,
  EQUAL_WEIGHTS,
  type AxisVector,
} from '../lib/scoring'
import { encodeShareLink, decodeShareLink } from '../lib/shareLink'
import { recordResult, type ResultHistoryEntry } from '../lib/resultHistory'
import { renderShareCardToBlob } from '../lib/shareCard'
import { pdf } from '@react-pdf/renderer'
import { ReportDocument } from '../lib/pdfReport'
import { RadarChart } from '../components/RadarChart'
import { ProfileCard } from '../components/ProfileCard'
import { ReportPreview } from '../components/ReportPreview'
import { MethodologySection } from '../components/MethodologySection'
import { ReflectiveBreakdown } from '../components/ReflectiveBreakdown'
import { PinnacleReflection } from '../components/PinnacleReflection'
import { manifestoContents } from '../data/manifestoContents'
import { MarkdownRenderer } from '../components/MarkdownRenderer'
import { coreArchetype, coreCode, describeCore, tierInfo, type CoreAxis } from '../data/coreThree'
import { biggestGaps, withAxisPositions } from '../lib/axisPositions'
import { failedAttentionChecks } from '../data/attentionChecks'
import { STUDY_FORM_URL } from '../data/study'
import { AxisWeightsPanel } from '../components/AxisWeightsPanel'
import { StatementComparison } from '../components/StatementComparison'

export function ResultsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const {
    answers,
    reset,
    scenarioAnswers,
    selectedStakeholderTags,
    declinedQuestions,
    checkAnswers,
    mode,
    setMode,
    axisWeights,
    setAxisWeight,
    resetWeights,
    t,
    tProfileName,
    tProfileSummary,
    tAxis,
  } = useQuiz()
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const [pdfStatus, setPdfStatus] = useState<'idle' | 'generating' | 'failed'>('idle')
  const [imageStatus, setImageStatus] = useState<'idle' | 'generating' | 'failed'>('idle')
  const [priorEntry, setPriorEntry] = useState<ResultHistoryEntry | null>(null)
  const copyStatusResetRef = useRef<ReturnType<typeof setTimeout>>()
  const savedHistoryRef = useRef(false)

  useEffect(() => {
    return () => clearTimeout(copyStatusResetRef.current)
  }, [])

  const sharedParam = searchParams.get('d')
  const decoded = useMemo(() => (sharedParam ? decodeShareLink(sharedParam) : null), [sharedParam])
  const staleLink = !!sharedParam && !decoded
  // Scores are scaled by the statements actually shown: all 144, or the 48 of the short version.
  const resultMode = decoded ? (decoded.mode ?? 'full') : mode
  const modeQuestions = questionsForMode(resultMode)
  const hasNoData = !decoded && !modeQuestions.some((q) => answers[q.id] !== undefined)
  const modeDeclined = declinedQuestions.filter((id) => modeQuestions.some((q) => q.id === id))

  const { t1Raw, t2Raw } = useMemo(() => {
    if (decoded) return decoded
    return {
      t1Raw: computeRawAxisScores(modeQuestions, answers, 'T1'),
      t2Raw: computeRawAxisScores(modeQuestions, answers, 'T2'),
    }
  }, [decoded, answers, modeQuestions])

  const t1Scaled: AxisVector = scaleAxisScores(t1Raw, 'T1', modeQuestions)
  const t2Scaled: AxisVector = scaleAxisScores(t2Raw, 'T2', modeQuestions)
  const combined = combineHorizons(t1Scaled, t2Scaled, modeQuestions)
  // Weights change only which archetypes rank closest; equal weights give the ordinary distance.
  const weights = decoded ? (decoded.weights ?? EQUAL_WEIGHTS) : axisWeights
  const weighted = !isEqualWeights(weights)
  const matches = classify(combined, profiles, weighted ? weights : undefined)
  const topMatches = matches.slice(0, 3)
  const topMatch = topMatches[0]
  const closeCall = isCloseCall(matches, resultMode === 'short' ? CLOSE_CALL_MARGIN_SHORT : CLOSE_CALL_MARGIN)
  const remainingFull = questions.filter((q) => answers[q.id] === undefined && !declinedQuestions.includes(q.id)).length
  const closeCallAxes = closeCall ? biggestGaps(matches[0].profile.coords, matches[1].profile.coords, 3, 1) : []
  const missedChecks = decoded ? [] : failedAttentionChecks(checkAnswers)
  const core = coreArchetype(combined)

  const [inspectedProfileId, setInspectedProfileId] = useState<string>(topMatch.profile.id)
  const [activeTab, setActiveTab] = useState<'summary' | 'manifesto'>('summary')

  // Keep state updated if topMatch changes
  useEffect(() => {
    setInspectedProfileId(topMatch.profile.id)
  }, [topMatch.profile.id])

  const inspectedMatch = useMemo(() => {
    return topMatches.find((m) => m.profile.id === inspectedProfileId) || topMatch
  }, [topMatches, inspectedProfileId, topMatch])

  const inspectedContent = useMemo(() => {
    return profileReports[inspectedMatch.profile.id]
  }, [inspectedMatch.profile.id])

  useEffect(() => {
    if (decoded || hasNoData || savedHistoryRef.current) return
    savedHistoryRef.current = true
    const priorHistory = recordResult(
      { t1Raw, t2Raw, topMatchId: topMatch.profile.id, topMatchName: topMatch.profile.name, mode: resultMode },
      Date.now(),
    )
    setPriorEntry(priorHistory.length > 0 ? priorHistory[priorHistory.length - 1] : null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decoded, hasNoData])

  const priorCombined = useMemo(() => {
    if (!priorEntry) return null
    const qs = questionsForMode(priorEntry.mode ?? 'full')
    return combineHorizons(scaleAxisScores(priorEntry.t1Raw, 'T1', qs), scaleAxisScores(priorEntry.t2Raw, 'T2', qs), qs)
  }, [priorEntry])

  const selectedTagObjects = stakeholderTags.filter((tag) => selectedStakeholderTags.includes(tag.id))

  const topDeclineAxis = useMemo<{ name: string; count: number } | null>(() => {
    if (decoded || modeDeclined.length === 0) return null
    let best: { name: string; count: number } | null = null
    axes.forEach((axis) => {
      const count = modeDeclined.filter((qId) => questions.find((q) => q.id === qId)?.axisId === axis.id).length
      if (count > 0 && (!best || count > best.count)) best = { name: axis.name, count }
    })
    return best
  }, [decoded, modeDeclined])

  async function handleShare() {
    const encoded = encodeShareLink({ t1Raw, t2Raw, mode: resultMode, weights })
    const url = `${window.location.origin}${import.meta.env.BASE_URL}#/results?d=${encoded}`
    clearTimeout(copyStatusResetRef.current)
    try {
      await navigator.clipboard.writeText(url)
      setCopyStatus('copied')
    } catch {
      setCopyStatus('failed')
    }
    copyStatusResetRef.current = setTimeout(() => setCopyStatus('idle'), 2500)
  }

  function handleFinishFull() {
    setMode('full')
    const next = axes.find((a) => questionsForAxis(a.id).some((q) => answers[q.id] === undefined && !declinedQuestions.includes(q.id)))
    navigate(next ? `/quiz/${next.number}` : '/results')
  }

  function handleRetake() {
    if (!window.confirm('Retake the assessment? This clears your current answers and this result.')) {
      return
    }
    reset()
    navigate('/')
  }

  if (hasNoData) {
    return (
      staleLink ? (
        <div className="max-w-2xl mx-auto p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">This link is from an earlier version</h2>
          <p className="text-gray-700 mb-6">
            The Atlas's statements have been reworded since this link was made, so its result can't be shown
            here. Take the current assessment to get a result you can share.
          </p>
          <Link to="/" className="inline-block px-6 py-3 rounded bg-blue-600 text-white text-lg">
            {t('start_assessment')}
          </Link>
        </div>
      ) : (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">{t('no_results_yet') || 'No Results Yet'}</h2>
        <p className="text-gray-700 mb-6">
          {t('no_results_desc') || "You haven't completed the assessment yet, so there's nothing to show here. Start from the beginning to get your results."}
        </p>
        <Link to="/" className="inline-block px-6 py-3 rounded bg-blue-600 text-white text-lg">
          {t('start_assessment')}
        </Link>
      </div>
      )
    )
  }

  async function handleDownloadPdf() {
    setPdfStatus('generating')
    try {
      const doc = (
        <ReportDocument
          combined={combined}
          t1Scaled={t1Scaled}
          t2Scaled={t2Scaled}
          topMatches={topMatches}
          profileReports={profileReports}
        />
      )
      const blob = await pdf(doc).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `tiam-report-${topMatch.profile.id}.pdf`
      link.click()
      URL.revokeObjectURL(url)
      setPdfStatus('idle')
    } catch {
      setPdfStatus('failed')
    }
  }

  async function handleDownloadImage() {
    setImageStatus('generating')
    try {
      const blob = await renderShareCardToBlob({
        archetypeName: topMatch.profile.name,
        summary: topMatch.profile.summary,
        axesInAgreement: axesInAgreement(combined, topMatch.profile),
        combined,
      })
      if (!blob) {
        setImageStatus('failed')
        return
      }
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `tiam-share-${topMatch.profile.id}.png`
      link.click()
      URL.revokeObjectURL(url)
      setImageStatus('idle')
    } catch {
      setImageStatus('failed')
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{t('worldview_atlas')}</span>
      </div>

      <h2 className="text-2xl font-bold mb-4">{t('results_title')}</h2>
      <RadarChart combined={combined} comparisonProfile={{ name: tProfileName(topMatch.profile.id), coords: topMatch.profile.coords }} />

      {resultMode === 'short' && (
        <div className="mt-4 border-l-4 border-indigo-500 bg-indigo-50 p-4">
          <h3 className="text-lg font-semibold mb-1">{decoded ? 'From the Short Version' : 'You Took the Short Version'}</h3>
          <p className="text-gray-700">
            This result comes from {modeQuestions.length} of the {questions.length} statements, six per axis instead of eighteen.
            Each score sits on the same −10 to +10 scale but rests on fewer answers, so one answer moves it more and your closest
            archetype is less certain. Treat it as a first look.
          </p>
          {!decoded && remainingFull > 0 && (
            <button
              type="button"
              onClick={handleFinishFull}
              className="mt-3 px-4 py-2 rounded bg-indigo-600 text-white font-semibold"
            >
              Answer the other {remainingFull} for the full result
            </button>
          )}
        </div>
      )}

      {selectedTagObjects.length > 0 && (
        <div className="mt-4 border-l-4 border-amber-500 bg-amber-50 p-4">
          <h3 className="text-lg font-semibold mb-1">Your Stake</h3>
          <p className="text-gray-700 mb-2">{selectedTagObjects.map((tag) => tag.name).join(', ')}</p>
          <p className="text-gray-700">
            Your match above came only from your belief-question answers; your stake played no part in
            that math. It might still be shaping how you answered, or it might not. Either way, this
            isn&apos;t a verdict on your view. Just something worth asking yourself.
          </p>
        </div>
      )}

      {!decoded && modeDeclined.length > 0 && (
        <div className="mt-4 border-l-4 border-gray-400 bg-gray-50 p-4">
          <h3 className="text-lg font-semibold mb-1">No Settled View</h3>
          <p className="text-gray-700">
            You marked {modeDeclined.length} of {modeQuestions.length} statements as having no settled
            view{topDeclineAxis ? `, mostly on ${topDeclineAxis.name}` : ''}. Each counts as zero. A near-zero score on an
            axis can mean a genuinely balanced position, or it can mean this. The math can&apos;t tell
            those apart on its own — only you can.
          </p>
        </div>
      )}

      {!decoded && priorEntry && priorCombined && (
        <div className="mt-4 border-l-4 border-emerald-500 bg-emerald-50 p-4">
          <h3 className="text-lg font-semibold mb-1">Compared to Your Last Attempt</h3>
          <p className="text-gray-700 mb-3">
            Last taken {new Date(priorEntry.timestamp).toLocaleDateString()}, you matched closest to{' '}
            <strong>{priorEntry.topMatchName}</strong>
            {(priorEntry.mode ?? 'full') !== resultMode && ` (using the ${priorEntry.mode === 'short' ? 'short' : 'full'} version)`}
            {priorEntry.topMatchId === topMatch.profile.id
              ? ' — the same match as this time.'
              : `. This time it's ${topMatch.profile.name}.`}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border-b py-2">Axis</th>
                  <th className="border-b py-2">Then</th>
                  <th className="border-b py-2">Now</th>
                  <th className="border-b py-2">Change</th>
                </tr>
              </thead>
              <tbody>
                {axes.map((axis) => {
                  const before = priorCombined[axis.id]
                  const now = combined[axis.id]
                  const delta = now - before
                  return (
                    <tr key={axis.id}>
                      <td className="py-1">{axis.name}</td>
                      <td className="py-1">{before.toFixed(1)}</td>
                      <td className="py-1">{now.toFixed(1)}</td>
                      <td className="py-1">
                        {delta === 0 ? '—' : `${delta > 0 ? '+' : ''}${delta.toFixed(1)}`}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            No test-retest reliability study backs this tool, so treat any shift as a prompt to reflect,
            not a precise measurement of how your views actually moved.
          </p>
        </div>
      )}

      {missedChecks.length > 0 && (
        <div className="mt-4 border-l-4 border-amber-500 bg-amber-50 p-4">
          <h3 className="text-lg font-semibold mb-1">A Check Statement Was Answered Differently</h3>
          <p className="text-gray-700">
            {missedChecks.length === 1 ? 'One of the two check statements' : 'Both check statements'} asked for a particular
            answer and got a different one. That often just means a quick tap, but if you were moving fast, your scores may
            be less reliable than usual. Your answers are saved, so you can go back and look over any axis.
          </p>
        </div>
      )}

      {closeCall && (
        <div className="mt-4 border-l-4 border-sky-500 bg-sky-50 p-4">
          <h3 className="text-lg font-semibold mb-1">This Was a Close Call</h3>
          <p className="text-gray-700">
            {topMatch.profile.name} and {matches[1].profile.name} are almost exactly as close to you as each other. When the
            gap is this small, a slightly different set of statements on the same themes would give a different first match
            about half the time, so read both.
          </p>
          {closeCallAxes.length > 0 && (
            <p className="text-gray-700 mt-2">Where the two differ most:</p>
          )}
          {closeCallAxes.length > 0 && (
            <ul className="list-disc pl-5 mt-1 text-gray-700 text-sm space-y-1">
              {closeCallAxes.map((id) => {
                const axis = axes.find((a) => a.id === id)!
                const f = (v: number) => (v > 0 ? `+${v.toFixed(1)}` : v.toFixed(1))
                return (
                  <li key={id}>
                    <strong>{axis.name}</strong>: {topMatch.profile.name} {f(matches[0].profile.coords[id])},{' '}
                    {matches[1].profile.name} {f(matches[1].profile.coords[id])}; you {f(combined[id])}.
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}

      <h3 className="text-xl font-semibold mt-8 mb-2">{t('closest_archetype')}</h3>
      {topMatches.map((match, index) => (
        <ProfileCard
          key={match.profile.id}
          match={match}
          rank={index + 1}
          agreement={axesInAgreement(combined, match.profile)}
          combined={combined}
        />
      ))}
      <p className="text-sm text-gray-500">
        Matches are ranked by how far apart you are across all eight axes, shown as the average gap per axis. &quot;Same
        side&quot; counts the axes where you and the archetype fall in the same band (toward pole A, the middle from −2 to +2,
        or toward pole B). The two can disagree: an archetype just over a band boundary on several axes shares fewer sides
        with you but can still be closer overall than one that matches your sides and is far away on one axis.
        {weighted && ' These matches use the axis weights below, so gaps on the axes that count more pull harder.'}
      </p>

      <AxisWeightsPanel
        weights={weights}
        onChange={decoded ? undefined : setAxisWeight}
        onReset={decoded ? undefined : resetWeights}
      />

      <section className="mt-8 rounded-lg border border-gray-200 p-4" aria-labelledby="core-three-heading">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Your core three · {coreCode(core.tiers)}</p>
        <h3 id="core-three-heading" className="text-xl font-semibold mt-1">{core.name}</h3>
        <p className="text-gray-600 italic">{core.tagline}</p>
        <p className="text-gray-800 mt-2">{describeCore(core)}</p>
        <p className="text-sm text-gray-500 mt-2">
          A second reading from three axes about AI systems themselves and what they are for: X is Machine Experience, Y is Moral
          Standing, and Z is Growth and Limits read from the growth-first end (Z−) to the within-limits end (Z+). Your tiers on
          these three pick one of 27 archetypes. Related thinkers, one group per axis:{' '}
          {(['x', 'y', 'z'] as CoreAxis[]).map((k, i) => tierInfo(k, core.tiers[i]).thinkers).join('; ')}. Each argued something
          close to one part; none necessarily holds all of it.
        </p>
      </section>

      <div className="flex flex-wrap gap-3 mt-6">
        <button
          type="button"
          onClick={handleShare}
          className={`px-4 py-2 rounded text-white ${copyStatus === 'failed' ? 'bg-red-600' : 'bg-blue-600'}`}
        >
          {copyStatus === 'copied' ? t('link_copied') : copyStatus === 'failed' ? 'Copy Failed — Try Again' : t('share_link')}
        </button>
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={pdfStatus === 'generating'}
          className={`px-4 py-2 rounded text-white disabled:opacity-40 ${pdfStatus === 'failed' ? 'bg-red-600' : 'bg-blue-600'}`}
        >
          {pdfStatus === 'generating'
            ? t('loading_audio')
            : pdfStatus === 'failed'
              ? 'Download Failed — Try Again'
              : t('download_report')}
        </button>
        <button
          type="button"
          onClick={handleDownloadImage}
          disabled={imageStatus === 'generating'}
          className={`px-4 py-2 rounded text-white disabled:opacity-40 ${imageStatus === 'failed' ? 'bg-red-600' : 'bg-blue-600'}`}
        >
          {imageStatus === 'generating'
            ? t('loading_audio')
            : imageStatus === 'failed'
              ? 'Download Failed — Try Again'
              : t('download_image')}
        </button>
        <button type="button" onClick={handleRetake} className="px-4 py-2 rounded border border-gray-300">
          {t('retake') || 'Retake'}
        </button>
      </div>

      <h3 className="text-xl font-semibold mt-8 mb-2">{t('axis_comparison') || 'Near-Term vs. Long-Term, by Axis'}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b py-2">{t('axis') || 'Axis'}</th>
              <th className="border-b py-2">{t('right_now') || 'Right Now'}</th>
              <th className="border-b py-2">{t('looking_ahead') || 'Looking Ahead'}</th>
            </tr>
          </thead>
          <tbody>
            {axes.map((axis) => (
              <tr key={axis.id}>
                <td className="py-2">{tAxis(axis.id, 'name')}</td>
                <td className="py-2">{t1Scaled[axis.id].toFixed(1)}</td>
                <td className="py-2">{t2Scaled[axis.id].toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!decoded && (
        <StatementComparison
          questions={modeQuestions}
          answers={answers}
          declinedQuestions={declinedQuestions}
          profiles={topMatches.map((m) => m.profile)}
        />
      )}

      <div className="border-t border-gray-200 mt-12 pt-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">{t('view_report_manifesto') || 'Report and the Case for This View'}</h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {topMatches.map((match) => (
            <button
              key={match.profile.id}
              type="button"
              onClick={() => setInspectedProfileId(match.profile.id)}
              className={`px-4 py-2 rounded-full border text-sm font-semibold transition ${
                inspectedProfileId === match.profile.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {tProfileName(match.profile.id)}
            </button>
          ))}
        </div>

        {/* Tab buttons */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('summary')}
            className={`py-3 px-6 font-semibold border-b-2 transition ${
              activeTab === 'summary'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {t('summary_report') || 'Summary Report'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manifesto')}
            className={`py-3 px-6 font-semibold border-b-2 transition ${
              activeTab === 'manifesto'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {t('full_manifesto') || 'The Case for This View'}
          </button>
        </div>

        {/* Tab content */}
        {activeTab === 'summary' ? (
          <div className="space-y-8 animate-fadeIn">
            <ReportPreview content={inspectedContent} />
            <ReflectiveBreakdown content={inspectedContent} scenarioAnswers={scenarioAnswers} combined={combined} />
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-6 md:p-8 border border-gray-200 shadow-sm animate-fadeIn">
            <MarkdownRenderer
              content={
                manifestoContents[inspectedMatch.profile.id]
                  ? withAxisPositions(manifestoContents[inspectedMatch.profile.id], inspectedMatch.profile)
                  : '*Not available for this viewpoint.*'
              }
            />
          </div>
        )}
      </div>

      <p className="mt-8 text-gray-700">
        Want to test your views against harder cases?{' '}
        <Link to="/thought-experiments" className="text-blue-600 underline">Read the thought experiments</Link>. They don&apos;t
        change your scores.
      </p>
      <p className="mt-4 text-gray-700">
        Curious about AI as a friend, partner or therapist?{' '}
        <Link to="/intimacy" className="text-blue-600 underline">Try the focus module on synthetic intimacy</Link>. It has its own
        score and a summary of the research, and it doesn&apos;t change this result.
      </p>

      {STUDY_FORM_URL && (
        <p className="mt-4 text-gray-700">
          This quiz hasn&apos;t been validated yet.{' '}
          <a href={STUDY_FORM_URL} target="_blank" rel="noreferrer" className="text-blue-600 underline">
            Take it once more in the study version
          </a>{' '}
          to help test whether it measures what it claims to. It asks for consent first and no name.
        </p>
      )}

      <MethodologySection />
      <PinnacleReflection archetypeName={topMatch.profile.name} />
    </div>
  )
}
