import { describe, it, expect } from 'vitest'
import { geopoliticalQuestions } from './geopolitical'

describe('geopoliticalQuestions', () => {
  it('has 18 questions: 9 T1 and 9 T2', () => {
    expect(geopoliticalQuestions).toHaveLength(18)
    expect(geopoliticalQuestions.filter((q) => q.horizon === 'T1')).toHaveLength(9)
    expect(geopoliticalQuestions.filter((q) => q.horizon === 'T2')).toHaveLength(9)
  })

  it('uses ids 125 through 142 with no gaps or duplicates', () => {
    const ids = geopoliticalQuestions.map((q) => q.id).sort((a, b) => a - b)
    expect(ids).toEqual(Array.from({ length: 18 }, (_, i) => i + 125))
  })

  it('every question targets the geopolitical axis', () => {
    geopoliticalQuestions.forEach((q) => expect(q.axisId).toBe('geopolitical'))
  })
})
