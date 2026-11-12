import type { AxisId } from '../data/types'
import { axes } from '../data/axes'

export interface ShareableScores {
  t1Raw: Record<AxisId, number>
  t2Raw: Record<AxisId, number>
}

/** Version 2 = the merged 144-statement Atlas. Links from the earlier question set (a bare array) are not decoded. */
export const SHARE_LINK_VERSION = 2

export function encodeShareLink(scores: ShareableScores): string {
  const orderedIds = axes.map((a) => a.id)
  const flat = [...orderedIds.map((id) => scores.t1Raw[id]), ...orderedIds.map((id) => scores.t2Raw[id])]
  return btoa(JSON.stringify({ v: SHARE_LINK_VERSION, s: flat }))
}

export function decodeShareLink(encoded: string): ShareableScores | null {
  try {
    const parsed = JSON.parse(atob(encoded))
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed) || parsed.v !== SHARE_LINK_VERSION) return null
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
    return { t1Raw, t2Raw }
  } catch {
    return null
  }
}
