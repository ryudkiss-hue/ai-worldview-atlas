import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
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
  type AxisVector,
} from '../lib/scoring'
import { encodeShareLink, decodeShareLink } from '../lib/shareLink'
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
  const { answers, reset, scenarioAnswers, selectedStakeholderTags } = useQuiz()
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const [generatingPdf, setGeneratingPdf] = useState(false)
  const copyStatusResetRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    return () => clearTimeout(copyStatusResetRef.current)
  }, [])

  const sharedParam = searchParams.get('d')

  const { t1Raw, t2Raw } = useMemo(() => {
    if (sharedParam) {
      const decoded = decodeShareLink(sharedParam)
      if (decoded) return decoded
    }
    return {
      t1Raw: computeRawAxisScores(questions, answers, 'T1'),
      t2Raw: computeRawAxisScores(questions, answers, 'T2'),
    }
  }, [sharedParam, answers])

  const t1Scaled: AxisVector = scaleAxisScores(t1Raw)
  const t2Scaled: AxisVector = scaleAxisScores(t2Raw)
  const combined = combineHorizons(t1Scaled, t2Scaled)
  const matches = classify(combined, profiles)
  const topMatches = matches.slice(0, 3)
  const topMatch = topMatches[0]
  const topContent = profileReports[topMatch.profile.id]

  const selectedTagObjects = stakeholderTags.filter((tag) => selectedStakeholderTags.includes(tag.id))

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
    reset()
    navigate('/')
  }

  async function handleDownloadPdf() {
    setGeneratingPdf(true)
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
    } finally {
      setGeneratingPdf(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Your Results</h2>
      <RadarChart combined={combined} comparisonProfile={{ name: topMatch.profile.name, coords: topMatch.profile.coords }} />

      {selectedTagObjects.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-1">Your Stake</h3>
          <p className="text-gray-700">{selectedTagObjects.map((tag) => tag.name).join(', ')}</p>
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
          disabled={generatingPdf}
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-40"
        >
          {generatingPdf ? 'Generating...' : 'Download PDF Report'}
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
