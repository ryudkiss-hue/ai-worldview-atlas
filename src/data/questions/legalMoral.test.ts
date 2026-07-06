import { describe, it, expect } from 'vitest'
import { legalMoralQuestions } from './legalMoral'

describe('legalMoralQuestions', () => {
  it('has 14 questions: 7 T1 and 7 T2', () => {
    expect(legalMoralQuestions).toHaveLength(14)
    expect(legalMoralQuestions.filter((q) => q.horizon === 'T1')).toHaveLength(7)
    expect(legalMoralQuestions.filter((q) => q.horizon === 'T2')).toHaveLength(7)
  })

  it('uses ids 57 through 70 with no gaps or duplicates', () => {
    const ids = legalMoralQuestions.map((q) => q.id).sort((a, b) => a - b)
    expect(ids).toEqual(Array.from({ length: 14 }, (_, i) => i + 57))
  })

  it('every question targets the legalMoral axis', () => {
    legalMoralQuestions.forEach((q) => expect(q.axisId).toBe('legalMoral'))
  })
})
