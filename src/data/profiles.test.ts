import { describe, it, expect } from 'vitest'
import { profiles } from './profiles'
import { axes } from './axes'

describe('profiles', () => {
  it('has exactly 24 profiles with unique ids and names', () => {
    expect(profiles).toHaveLength(24)
    expect(new Set(profiles.map((p) => p.id)).size).toBe(24)
    expect(new Set(profiles.map((p) => p.name)).size).toBe(24)
  })

  it('defines a coordinate for every axis, within -10..10', () => {
    profiles.forEach((profile) => {
      axes.forEach((axis) => {
        const value = profile.coords[axis.id]
        expect(typeof value).toBe('number')
        expect(value).toBeGreaterThanOrEqual(-10)
        expect(value).toBeLessThanOrEqual(10)
      })
    })
  })
})
