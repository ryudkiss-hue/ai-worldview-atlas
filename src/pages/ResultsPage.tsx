import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { axes } from '../data/axes'
import { questions } from '../data/questions'
import { profiles } from '../data/profiles'
import { profileReports } from '../data/profileReports'
import { stakeholderTags } from '../data/stakeholderTags'
import { useQuiz } from '../state/QuizContext'
import {
  computeRawAxisScores,
  scaleAxisScores,
  combineHorizons,
  classify,
  matchCloseness,
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

export function ResultsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { answers, reset, scenarioAnswers, selectedStakeholderTags, declinedQuestions } = useQuiz()
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
  const hasNoData = !decoded && Object.keys(answers).length === 0

  const { t1Raw, t2Raw } = useMemo(() => {
    if (decoded) return decoded
    return {
      t1Raw: computeRawAxisScores(questions, answers, 'T1'),
      t2Raw: computeRawAxisScores(questions, answers, 'T2'),
    }
  }, [decoded, answers])

  const t1Scaled: AxisVector = scaleAxisScores(t1Raw)
  const t2Scaled: AxisVector = scaleAxisScores(t2Raw)
  const combined = combineHorizons(t1Scaled, t2Scaled)
  const matches = classify(combined, profiles)
  const topMatches = matches.slice(0, 3)
  const topMatch = topMatches[0]
  const topContent = profileReports[topMatch.profile.id]

  useEffect(() => {
    if (decoded || hasNoData || savedHistoryRef.current) return
    savedHistoryRef.current = true
    const priorHistory = recordResult(
      { t1Raw, t2Raw, topMatchId: topMatch.profile.id, topMatchName: topMatch.profile.name },
      Date.now(),
    )
    setPriorEntry(priorHistory.length > 0 ? priorHistory[priorHistory.length - 1] : null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decoded, hasNoData])

  const priorCombined = useMemo(() => {
    if (!priorEntry) return null
    return combineHorizons(scaleAxisScores(priorEntry.t1Raw), scaleAxisScores(priorEntry.t2Raw))
  }, [priorEntry])

  const selectedTagObjects = stakeholderTags.filter((tag) => selectedStakeholderTags.includes(tag.id))

  const topDeclineAxis = useMemo<{ name: string; count: number } | null>(() => {
    if (decoded || declinedQuestions.length === 0) return null
    let best: { name: string; count: number } | null = null
    axes.forEach((axis) => {
      const count = declinedQuestions.filter((qId) => questions.find((q) => q.id === qId)?.axisId === axis.id).length
      if (count > 0 && (!best || count > best.count)) best = { name: axis.name, count }
    })
    return best
  }, [decoded, declinedQuestions])

  async function handleShare() {
    const encoded = encodeShareLink({ t1Raw, t2Raw })
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

  function handleRetake() {
    if (!window.confirm('Retake the assessment? This clears your current answers and this result.')) {
      return
    }
    reset()
    navigate('/')
  }

  if (hasNoData) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">No Results Yet</h2>
        <p className="text-gray-700 mb-6">
          You haven't completed the assessment yet, so there's nothing to show here. Start from the
          beginning to get your results.
        </p>
        <Link to="/" className="inline-block px-6 py-3 rounded bg-blue-600 text-white text-lg">
          Start the Assessment
        </Link>
      </div>
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
        matchPercent: matchCloseness(topMatch.distance),
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
      <h2 className="text-2xl font-bold mb-4">Your Results</h2>
      <RadarChart combined={combined} comparisonProfile={{ name: topMatch.profile.name, coords: topMatch.profile.coords }} />

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

      {!decoded && declinedQuestions.length > 0 && (
        <div className="mt-4 border-l-4 border-gray-400 bg-gray-50 p-4">
          <h3 className="text-lg font-semibold mb-1">No Strong View</h3>
          <p className="text-gray-700">
            You marked {declinedQuestions.length} of {questions.length} questions as having no strong
            view{topDeclineAxis ? `, mostly on ${topDeclineAxis.name}` : ''}. A near-zero score on an
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

      <h3 className="text-xl font-semibold mt-8 mb-2">Closest Matches</h3>
      {topMatches.map((match, index) => (
        <ProfileCard key={match.profile.id} match={match} rank={index + 1} />
      ))}

      <div className="flex flex-wrap gap-3 mt-6">
        <button
          type="button"
          onClick={handleShare}
          className={`px-4 py-2 rounded text-white ${copyStatus === 'failed' ? 'bg-red-600' : 'bg-blue-600'}`}
        >
          {copyStatus === 'copied' ? 'Link Copied!' : copyStatus === 'failed' ? 'Copy Failed — Try Again' : 'Copy Shareable Link'}
        </button>
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={pdfStatus === 'generating'}
          className={`px-4 py-2 rounded text-white disabled:opacity-40 ${pdfStatus === 'failed' ? 'bg-red-600' : 'bg-blue-600'}`}
        >
          {pdfStatus === 'generating'
            ? 'Generating...'
            : pdfStatus === 'failed'
              ? 'Download Failed — Try Again'
              : 'Download PDF Report'}
        </button>
        <button
          type="button"
          onClick={handleDownloadImage}
          disabled={imageStatus === 'generating'}
          className={`px-4 py-2 rounded text-white disabled:opacity-40 ${imageStatus === 'failed' ? 'bg-red-600' : 'bg-blue-600'}`}
        >
          {imageStatus === 'generating'
            ? 'Generating...'
            : imageStatus === 'failed'
              ? 'Download Failed — Try Again'
              : 'Download Share Image'}
        </button>
        <button type="button" onClick={handleRetake} className="px-4 py-2 rounded border border-gray-300">
          Retake
        </button>
      </div>

      <h3 className="text-xl font-semibold mt-8 mb-2">Near-Term vs. Long-Term, by Axis</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b py-2">Axis</th>
              <th className="border-b py-2">Right Now</th>
              <th className="border-b py-2">Looking Ahead</th>
            </tr>
          </thead>
          <tbody>
            {axes.map((axis) => (
              <tr key={axis.id}>
                <td className="py-2">{axis.name}</td>
                <td className="py-2">{t1Scaled[axis.id].toFixed(1)}</td>
                <td className="py-2">{t2Scaled[axis.id].toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ReportPreview content={topContent} />
      <ReflectiveBreakdown content={topContent} scenarioAnswers={scenarioAnswers} combined={combined} />
      <MethodologySection />
      <PinnacleReflection archetypeName={topMatch.profile.name} />
    </div>
  )
}
