import { describe, it, expect } from 'vitest'
import { ontologicalQuestions } from './ontological'

describe('ontologicalQuestions', () => {
  it('has 18 questions: 9 T1 and 9 T2', () => {
    expect(ontologicalQuestions).toHaveLength(18)
    expect(ontologicalQuestions.filter((q) => q.horizon === 'T1')).toHaveLength(9)
    expect(ontologicalQuestions.filter((q) => q.horizon === 'T2')).toHaveLength(9)
  })

  it('uses ids 51 through 68 with no gaps or duplicates', () => {
    const ids = ontologicalQuestions.map((q) => q.id).sort((a, b) => a - b)
    expect(ids).toEqual(Array.from({ length: 18 }, (_, i) => i + 51))
  })

  it('every question targets the ontological axis', () => {
    ontologicalQuestions.forEach((q) => expect(q.axisId).toBe('ontological'))
  })
})
