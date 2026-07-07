import { describe, it, expect } from 'vitest'
import { profiles } from './profiles'
import { axes } from './axes'

function distance(a: (typeof profiles)[number], b: (typeof profiles)[number]): number {
  return Math.sqrt(
    axes.reduce((sum, axis) => {
      const diff = a.coords[axis.id] - b.coords[axis.id]
      return sum + diff * diff
    }, 0),
  )
}

describe('profile redundancy guard', () => {
  it('has no mutual-nearest-neighbor pair closer than 5.0', () => {
    const tooClose: string[] = []
    for (let i = 0; i < profiles.length; i++) {
      for (let j = i + 1; j < profiles.length; j++) {
        const d = distance(profiles[i], profiles[j])
        if (d < 5.0) {
          tooClose.push(`${profiles[i].name} <-> ${profiles[j].name}: ${d.toFixed(2)}`)
        }
      }
    }
    expect(tooClose, `Pairs under the 5.0 threshold:\n${tooClose.join('\n')}`).toEqual([])
  })

  it('has exactly 34 profiles with unique ids', () => {
    expect(profiles).toHaveLength(34)
    expect(new Set(profiles.map((p) => p.id)).size).toBe(34)
  })
})
