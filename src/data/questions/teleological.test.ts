import { describe, it, expect } from 'vitest'
import { teleologicalQuestions } from './teleological'

describe('teleologicalQuestions', () => {
  it('has 14 questions: 7 T1 and 7 T2', () => {
    expect(teleologicalQuestions).toHaveLength(14)
    expect(teleologicalQuestions.filter((q) => q.horizon === 'T1')).toHaveLength(7)
    expect(teleologicalQuestions.filter((q) => q.horizon === 'T2')).toHaveLength(7)
  })

  it('uses ids 1 through 14 with no gaps or duplicates', () => {
    const ids = teleologicalQuestions.map((q) => q.id).sort((a, b) => a - b)
    expect(ids).toEqual(Array.from({ length: 14 }, (_, i) => i + 1))
  })

  it('every question targets the teleological axis', () => {
    teleologicalQuestions.forEach((q) => expect(q.axisId).toBe('teleological'))
  })
})
