import { describe, it, expect } from 'vitest'
import { ontologicalQuestions } from './ontological'

describe('ontologicalQuestions', () => {
  it('has 14 questions: 7 T1 and 7 T2', () => {
    expect(ontologicalQuestions).toHaveLength(14)
    expect(ontologicalQuestions.filter((q) => q.horizon === 'T1')).toHaveLength(7)
    expect(ontologicalQuestions.filter((q) => q.horizon === 'T2')).toHaveLength(7)
  })

  it('uses ids 47 through 60 with no gaps or duplicates', () => {
    const ids = ontologicalQuestions.map((q) => q.id).sort((a, b) => a - b)
    expect(ids).toEqual(Array.from({ length: 14 }, (_, i) => i + 47))
  })

  it('every question targets the ontological axis', () => {
    ontologicalQuestions.forEach((q) => expect(q.axisId).toBe('ontological'))
  })
})
