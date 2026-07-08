import { describe, it, expect } from 'vitest'
import { legalMoralQuestions } from './legalMoral'

describe('legalMoralQuestions', () => {
  it('has 20 questions: 10 T1 and 10 T2', () => {
    expect(legalMoralQuestions).toHaveLength(20)
    expect(legalMoralQuestions.filter((q) => q.horizon === 'T1')).toHaveLength(10)
    expect(legalMoralQuestions.filter((q) => q.horizon === 'T2')).toHaveLength(10)
  })

  it('uses ids 69 through 88 with no gaps or duplicates', () => {
    const ids = legalMoralQuestions.map((q) => q.id).sort((a, b) => a - b)
    expect(ids).toEqual(Array.from({ length: 20 }, (_, i) => i + 69))
  })

  it('every question targets the legalMoral axis', () => {
    legalMoralQuestions.forEach((q) => expect(q.axisId).toBe('legalMoral'))
  })
})
