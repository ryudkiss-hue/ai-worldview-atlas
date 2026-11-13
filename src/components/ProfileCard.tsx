import type { AxisVector, ProfileMatch } from '../lib/scoring'
import { useQuiz } from '../state/QuizContext'
import { axes } from '../data/axes'
import { biggestGaps } from '../lib/axisPositions'

interface ProfileCardProps {
  match: ProfileMatch
  rank: number
  /** How many of the eight axes put you in the same tier as this archetype */
  agreement?: number
  /** Your scores, to name the axes where you and the archetype are furthest apart */
  combined?: AxisVector
}

const fmt = (v: number) => (v > 0 ? `+${v.toFixed(1)}` : v.toFixed(1))

export function ProfileCard({ match, rank, agreement, combined }: ProfileCardProps) {
  const { tProfileName, tProfileSummary, t } = useQuiz()
  // Average gap per axis (root mean square): the same order as the ranking, in points on the -10..+10 scale
  const averageGap = match.distance / Math.sqrt(axes.length)
  const gaps = combined ? biggestGaps(combined, match.profile.coords, 2, 1) : []

  return (
    <div className="rounded-lg border border-gray-200 p-4 mb-3">
      <p className="text-sm text-gray-500">{t('match_rank') || 'Match'} #{rank}</p>
      <h3 className="text-xl font-semibold">{tProfileName(match.profile.id)}</h3>
      <p className="text-lg font-bold text-blue-600 mt-1">About {averageGap.toFixed(1)} points apart per axis</p>
      {agreement !== undefined && (
        <p className="text-sm text-gray-600">
          Same side as you on {agreement} of 8 axes
        </p>
      )}
      <p className="text-gray-700 mt-1">{tProfileSummary(match.profile.id)}</p>
      {combined && gaps.length > 0 && (
        <p className="text-sm text-gray-600 mt-2">
          Furthest apart on{' '}
          {gaps
            .map((id) => {
              const axis = axes.find((a) => a.id === id)!
              return `${axis.name} (you ${fmt(combined[id])}, this archetype ${fmt(match.profile.coords[id])})`
            })
            .join(' and ')}
          .
        </p>
      )}
      <p className="text-sm text-gray-500 mt-2">{t('distance') || 'Distance'}: {match.distance.toFixed(2)}</p>
    </div>
  )
}
