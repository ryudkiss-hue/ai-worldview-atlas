import { describe, it, expect } from 'vitest'
import { geopoliticalQuestions } from './geopolitical'

describe('geopoliticalQuestions', () => {
  it('has 14 questions: 7 T1 and 7 T2', () => {
    expect(geopoliticalQuestions).toHaveLength(14)
    expect(geopoliticalQuestions.filter((q) => q.horizon === 'T1')).toHaveLength(7)
    expect(geopoliticalQuestions.filter((q) => q.horizon === 'T2')).toHaveLength(7)
  })

  it('uses ids 99 through 112 with no gaps or duplicates', () => {
    const ids = geopoliticalQuestions.map((q) => q.id).sort((a, b) => a - b)
    expect(ids).toEqual(Array.from({ length: 14 }, (_, i) => i + 99))
  })

  it('every question targets the geopolitical axis', () => {
    geopoliticalQuestions.forEach((q) => expect(q.axisId).toBe('geopolitical'))
  })
})
