import { describe, it, expect } from 'vitest'
import { legalMoralQuestions } from './legalMoral'

describe('legalMoralQuestions', () => {
  it('has 18 questions: 9 T1 and 9 T2', () => {
    expect(legalMoralQuestions).toHaveLength(18)
    expect(legalMoralQuestions.filter((q) => q.horizon === 'T1')).toHaveLength(9)
    expect(legalMoralQuestions.filter((q) => q.horizon === 'T2')).toHaveLength(9)
  })

  it('uses ids 69 through 86 with no gaps or duplicates', () => {
    const ids = legalMoralQuestions.map((q) => q.id).sort((a, b) => a - b)
    expect(ids).toEqual(Array.from({ length: 18 }, (_, i) => i + 69))
  })

  it('every question targets the legalMoral axis', () => {
    legalMoralQuestions.forEach((q) => expect(q.axisId).toBe('legalMoral'))
  })
})
