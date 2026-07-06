import { describe, it, expect } from 'vitest'
import { axes, getAxisById } from './axes'

describe('axes', () => {
  it('has exactly 8 axes numbered 1-8 in order', () => {
    expect(axes).toHaveLength(8)
    axes.forEach((axis, index) => {
      expect(axis.number).toBe(index + 1)
    })
  })

  it('has a unique id for every axis', () => {
    const ids = new Set(axes.map((a) => a.id))
    expect(ids.size).toBe(8)
  })

  it('getAxisById finds an existing axis and returns undefined for unknown ids', () => {
    expect(getAxisById('geopolitical')?.name).toBe('Geopolitical')
    expect(getAxisById('not-real')).toBeUndefined()
  })
})
