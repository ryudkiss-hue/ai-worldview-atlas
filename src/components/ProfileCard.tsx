import type { ProfileMatch } from '../lib/scoring'
import { matchCloseness } from '../lib/scoring'

interface ProfileCardProps {
  match: ProfileMatch
  rank: number
}

export function ProfileCard({ match, rank }: ProfileCardProps) {
  const closeness = matchCloseness(match.distance)
  return (
    <div className="rounded-lg border border-gray-200 p-4 mb-3">
      <p className="text-sm text-gray-500">Match #{rank}</p>
      <h3 className="text-xl font-semibold">{match.profile.name}</h3>
      <p className="text-lg font-bold text-blue-600 mt-1">{closeness}% match</p>
      <p className="text-gray-700 mt-1">{match.profile.summary}</p>
      <p className="text-sm text-gray-500 mt-2">Distance: {match.distance.toFixed(2)}</p>
    </div>
  )
}
