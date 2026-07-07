import type { AxisId } from '../data/types'
import type { AxisVector } from './scoring'

const TENSION_THRESHOLD = 2

export function detectTension(
  scenarioAnswers: Partial<Record<AxisId, 'A' | 'B'>>,
  combined: AxisVector,
): AxisId[] {
  const tenseAxes: AxisId[] = []
  ;(Object.keys(scenarioAnswers) as AxisId[]).forEach((axisId) => {
    const choice = scenarioAnswers[axisId]
    if (!choice) return
    const score = combined[axisId]
    if (Math.abs(score) < TENSION_THRESHOLD) return
    const computedPole = score > 0 ? 'A' : 'B'
    if (choice !== computedPole) {
      tenseAxes.push(axisId)
    }
  })
  return tenseAxes
}
