import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { axes } from '../data/axes'
import { questions } from '../data/questions'
import { profiles } from '../data/profiles'
import { useQuiz } from '../state/QuizContext'
import {
  computeRawAxisScores,
  scaleAxisScores,
  combineHorizons,
  classify,
  type AxisVector,
} from '../lib/scoring'
import { encodeShareLink, decodeShareLink } from '../lib/shareLink'
import { RadarChart } from '../components/RadarChart'
import { ProfileCard } from '../components/ProfileCard'

export function ResultsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { answers, reset } = useQuiz()
  const [copied, setCopied] = useState(false)

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

  function handleShare() {
    const encoded = encodeShareLink({ t1Raw, t2Raw })
    const url = `${window.location.origin}${import.meta.env.BASE_URL}#/results?d=${encoded}`
    navigator.clipboard.writeText(url)
    setCopied(true)
  }

  function handleRetake() {
    reset()
    navigate('/')
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Your Results</h2>
      <RadarChart combined={combined} />

      <h3 className="text-xl font-semibold mt-8 mb-2">Closest Matches</h3>
      {topMatches.map((match, index) => (
        <ProfileCard key={match.profile.id} match={match} rank={index + 1} />
      ))}

      <h3 className="text-xl font-semibold mt-8 mb-2">Near-Term vs. Long-Term, by Axis</h3>
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

      <div className="flex gap-3 mt-6">
        <button type="button" onClick={handleShare} className="px-4 py-2 rounded bg-blue-600 text-white">
          {copied ? 'Link Copied!' : 'Copy Shareable Link'}
        </button>
        <button type="button" onClick={handleRetake} className="px-4 py-2 rounded border border-gray-300">
          Retake
        </button>
      </div>
    </div>
  )
}
