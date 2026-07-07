import { describe, it, expect } from 'vitest'
import { archetypeClusters } from './archetypeClusters'
import { profiles } from './profiles'

describe('archetypeClusters', () => {
  it('covers every profile id exactly once', () => {
    const allIds = archetypeClusters.flatMap((c) => c.profileIds)
    expect(allIds).toHaveLength(profiles.length)
    expect(new Set(allIds).size).toBe(profiles.length)
    const profileIdSet = new Set(profiles.map((p) => p.id))
    allIds.forEach((id) => expect(profileIdSet.has(id)).toBe(true))
  })

  it('has 7 clusters with unique ids and names', () => {
    expect(archetypeClusters).toHaveLength(7)
    expect(new Set(archetypeClusters.map((c) => c.id)).size).toBe(7)
    expect(new Set(archetypeClusters.map((c) => c.name)).size).toBe(7)
  })
})
