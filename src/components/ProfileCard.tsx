import type { ProfileMatch } from '../lib/scoring'
import { useQuiz } from '../state/QuizContext'

interface ProfileCardProps {
  match: ProfileMatch
  rank: number
  /** How many of the eight axes put you in the same tier as this archetype */
  agreement?: number
}

export function ProfileCard({ match, rank, agreement }: ProfileCardProps) {
  const { tProfileName, tProfileSummary, t } = useQuiz()

  return (
    <div className="rounded-lg border border-gray-200 p-4 mb-3">
      <p className="text-sm text-gray-500">{t('match_rank') || 'Match'} #{rank}</p>
      <h3 className="text-xl font-semibold">{tProfileName(match.profile.id)}</h3>
      {agreement !== undefined && (
        <p className="text-lg font-bold text-blue-600 mt-1">
          {agreement} of 8 {t('match_closeness')}
        </p>
      )}
      <p className="text-gray-700 mt-1">{tProfileSummary(match.profile.id)}</p>
      <p className="text-sm text-gray-500 mt-2">{t('distance') || 'Distance'}: {match.distance.toFixed(2)}</p>
    </div>
  )
}
