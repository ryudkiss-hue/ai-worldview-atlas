import type { AxisId } from '../data/types'
import { axes } from '../data/axes'

export interface ShareableScores {
  t1Raw: Record<AxisId, number>
  t2Raw: Record<AxisId, number>
}

export function encodeShareLink(scores: ShareableScores): string {
  const orderedIds = axes.map((a) => a.id)
  const flat = [
    ...orderedIds.map((id) => scores.t1Raw[id]),
    ...orderedIds.map((id) => scores.t2Raw[id]),
  ]
  return btoa(JSON.stringify(flat))
}

export function decodeShareLink(encoded: string): ShareableScores | null {
  try {
    const flat: number[] = JSON.parse(atob(encoded))
    const orderedIds = axes.map((a) => a.id)
    if (!Array.isArray(flat) || flat.length !== orderedIds.length * 2) return null

    const t1Raw = {} as Record<AxisId, number>
    const t2Raw = {} as Record<AxisId, number>
    orderedIds.forEach((id, index) => {
      const t1Value = flat[index]
      const t2Value = flat[orderedIds.length + index]
      if (typeof t1Value !== 'number' || Number.isNaN(t1Value)) return
      if (typeof t2Value !== 'number' || Number.isNaN(t2Value)) return
      t1Raw[id] = t1Value
      t2Raw[id] = t2Value
    })

    if (Object.keys(t1Raw).length !== orderedIds.length) return null
    if (Object.keys(t2Raw).length !== orderedIds.length) return null
    return { t1Raw, t2Raw }
  } catch {
    return null
  }
}
