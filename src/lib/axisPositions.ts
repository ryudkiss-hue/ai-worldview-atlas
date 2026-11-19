import { axes } from '../data/axes'
import type { AxisId, Profile } from '../data/types'
import { tierOf } from './scoring'

const signed = (v: number) => (v > 0 ? `+${v}` : `${v}`)

/** One line per axis describing a position in words, e.g. "+7, toward Owed some protection". */
export function describePosition(axisId: AxisId, value: number): string {
  const axis = axes.find((a) => a.id === axisId)!
  const tier = tierOf(value)
  const where = tier === 1 ? `toward ${axis.poleA}` : tier === -1 ? `toward ${axis.poleB}` : 'in the middle'
  return `${signed(Math.round(value * 10) / 10)}, ${where}`
}

/**
 * The archetype's live coordinates as a markdown list. Manifestos carry a marker where their hand-drawn chart used to
 * be; filling it from the data means the text can never show different numbers from the ones the quiz scores against.
 */
export function axisPositionsMarkdown(profile: Profile): string {
  const lines = axes.map((a) => `- **${a.name}**: ${describePosition(a.id, profile.coords[a.id])}`)
  return [
    `Positions run from −10 to +10; between −2 and +2 counts as the middle. These are the coordinates the quiz matches you against.`,
    '',
    ...lines,
  ].join('\n')
}

export const AXIS_POSITIONS_MARKER = '<!--axis-positions-->'

export function withAxisPositions(manifesto: string, profile: Profile): string {
  return manifesto.replace(AXIS_POSITIONS_MARKER, axisPositionsMarkdown(profile))
}

/** The axes on which two positions differ most, largest first (ties keep axis order). */
export function biggestGaps(a: Record<AxisId, number>, b: Record<AxisId, number>, count = 2, minGap = 0): AxisId[] {
  return axes
    .map((axis) => ({ id: axis.id, gap: Math.abs(a[axis.id] - b[axis.id]) }))
    .filter((g) => g.gap > minGap)
    .sort((x, y) => y.gap - x.gap)
    .slice(0, count)
    .map((g) => g.id)
}
