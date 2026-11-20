import type { AxisId } from '../data/types'
import { axes } from '../data/axes'
import { profiles } from '../data/profiles'
import { questionsForMode } from '../data/shortForm'
import { decodeShareLink, type ShareableScores } from './shareLink'
import { scaleAxisScores, combineHorizons, classify, tierOf, type AxisVector, type ProfileMatch } from './scoring'

/** Pulls the encoded result out of whatever someone pasted: a full share link, the part after "d=", or the code alone. */
export function extractShareCode(input: string): string {
  const text = input.trim()
  const m = text.match(/[?&]d=([^&#\s]+)/)
  return m ? decodeURIComponent(m[1]) : text
}

export interface ComparedResult {
  scores: ShareableScores
  combined: AxisVector
  top: ProfileMatch
}

/** Rebuilds a result from a share link the same way the results page does. Weights in the link reorder the match only. */
export function resultFromShare(input: string): ComparedResult | null {
  const scores = decodeShareLink(extractShareCode(input))
  if (!scores) return null
  const qs = questionsForMode(scores.mode ?? 'full')
  const combined = combineHorizons(
    scaleAxisScores(scores.t1Raw, 'T1', qs, scores.t1N),
    scaleAxisScores(scores.t2Raw, 'T2', qs, scores.t2N),
    qs,
    scores.t1N,
    scores.t2N,
  )
  return { scores, combined, top: classify(combined, profiles, scores.weights)[0] }
}

export interface AxisComparison {
  axisId: AxisId
  a: number
  b: number
  gap: number
  sameSide: boolean
}

export function compareAxes(a: AxisVector, b: AxisVector): AxisComparison[] {
  return axes.map((axis) => ({
    axisId: axis.id,
    a: a[axis.id],
    b: b[axis.id],
    gap: Math.abs(a[axis.id] - b[axis.id]),
    sameSide: tierOf(a[axis.id]) === tierOf(b[axis.id]),
  }))
}

/** Average gap per axis between two people, on the same scale as the gap shown for archetype matches. */
export function averageGap(rows: AxisComparison[]): number {
  return Math.sqrt(rows.reduce((s, r) => s + r.gap * r.gap, 0) / rows.length)
}
