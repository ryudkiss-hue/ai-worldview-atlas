import type { AxisId } from '../data/types'
import { axes } from '../data/axes'

export interface ShareableScores {
  t1Raw: Record<AxisId, number>
  t2Raw: Record<AxisId, number>
  /** Which version was taken; raw totals are scaled by the statements shown. Absent means the full quiz. */
  mode?: 'full' | 'short'
  /** How much each axis counts in matching. Absent means equal weights. */
  weights?: Record<AxisId, number>
  /** Statements answered per axis in each horizon ("no settled view" left out). Absent means all were answered. */
  t1N?: Record<AxisId, number>
  t2N?: Record<AxisId, number>
}

const WEIGHT_VALUES = [0.5, 1, 2]

/**
 * Version 4 adds the number of statements answered per axis and horizon, because "no settled view" now counts as
 * missing. Version 3 links (the same plain-language statements, from before that change) still open, read as if every
 * statement was answered. Links from earlier wordings are not decoded, because their scores came from different statements.
 */
export const SHARE_LINK_VERSION = 4
const READABLE_VERSIONS = [3, 4]

export function encodeShareLink(scores: ShareableScores): string {
  const orderedIds = axes.map((a) => a.id)
  const flat = [...orderedIds.map((id) => scores.t1Raw[id]), ...orderedIds.map((id) => scores.t2Raw[id])]
  const payload: Record<string, unknown> = { v: SHARE_LINK_VERSION, s: flat }
  if (scores.mode === 'short') payload.m = 's'
  if (scores.weights && orderedIds.some((id) => scores.weights![id] !== 1)) payload.w = orderedIds.map((id) => scores.weights![id])
  if (scores.t1N && scores.t2N) payload.n = [...orderedIds.map((id) => scores.t1N![id]), ...orderedIds.map((id) => scores.t2N![id])]
  return btoa(JSON.stringify(payload))
}

export function decodeShareLink(encoded: string): ShareableScores | null {
  try {
    const parsed = JSON.parse(atob(encoded))
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed) || !READABLE_VERSIONS.includes(parsed.v)) return null
    const flat: unknown = parsed.s
    const orderedIds = axes.map((a) => a.id)
    if (!Array.isArray(flat) || flat.length !== orderedIds.length * 2) return null
    if (!flat.every((v) => typeof v === 'number' && Number.isFinite(v))) return null
    const t1Raw = {} as Record<AxisId, number>
    const t2Raw = {} as Record<AxisId, number>
    orderedIds.forEach((id, index) => {
      t1Raw[id] = flat[index] as number
      t2Raw[id] = flat[orderedIds.length + index] as number
    })
    const result: ShareableScores = { t1Raw, t2Raw }
    if (parsed.m === 's') result.mode = 'short'
    const w: unknown = parsed.w
    if (Array.isArray(w) && w.length === orderedIds.length && w.every((v) => WEIGHT_VALUES.includes(v as number))) {
      result.weights = Object.fromEntries(orderedIds.map((id, i) => [id, w[i] as number])) as Record<AxisId, number>
    }
    const n: unknown = parsed.n
    if (Array.isArray(n) && n.length === orderedIds.length * 2 && n.every((v) => Number.isInteger(v) && v >= 0)) {
      result.t1N = Object.fromEntries(orderedIds.map((id, i) => [id, n[i] as number])) as Record<AxisId, number>
      result.t2N = Object.fromEntries(orderedIds.map((id, i) => [id, n[orderedIds.length + i] as number])) as Record<AxisId, number>
    }
    return result
  } catch {
    return null
  }
}
