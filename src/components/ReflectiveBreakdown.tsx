import type { AxisId, ProfileReportContent } from '../data/types'
import type { AxisVector } from '../lib/scoring'
import { detectTension } from '../lib/scenarioTension'
import { axes } from '../data/axes'

interface ReflectiveBreakdownProps {
  content: ProfileReportContent
  scenarioAnswers: Partial<Record<AxisId, 'A' | 'B'>>
  combined: AxisVector
}

export function ReflectiveBreakdown({ content, scenarioAnswers, combined }: ReflectiveBreakdownProps) {
  const tenseAxes = detectTension(scenarioAnswers, combined)

  return (
    <section className="mt-8">
      <h3 className="text-xl font-semibold mb-3">Reflective Breakdown</h3>
      <p className="text-gray-700 mb-2">{content.reflectiveBreakdown.mindAssumption}</p>
      <p className="text-gray-700 mb-2">{content.reflectiveBreakdown.laborAssumption}</p>
      <p className="text-gray-700 mb-2">{content.reflectiveBreakdown.connectionAssumption}</p>
      {tenseAxes.length > 0 && (
        <div className="mt-4 space-y-1">
          {tenseAxes.map((axisId) => {
            const axis = axes.find((a) => a.id === axisId)!
            return (
              <p key={axisId} className="text-gray-700">
                Your scenario answer on the {axis.name} axis sits in tension with your computed
                score. That's worth sitting with, not resolving immediately.
              </p>
            )
          })}
        </div>
      )}
    </section>
  )
}
