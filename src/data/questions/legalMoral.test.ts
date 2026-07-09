import { describe, it, expect } from 'vitest'
import { legalMoralQuestions } from './legalMoral'

describe('legalMoralQuestions', () => {
  it('has 21 questions: 11 T1 and 10 T2', () => {
    expect(legalMoralQuestions).toHaveLength(21)
    expect(legalMoralQuestions.filter((q) => q.horizon === 'T1')).toHaveLength(11)
    expect(legalMoralQuestions.filter((q) => q.horizon === 'T2')).toHaveLength(10)
  })

  it('uses ids 69 through 88 and 143 with no gaps or duplicates', () => {
    const ids = legalMoralQuestions.map((q) => q.id).sort((a, b) => a - b)
    const expectedIds = [...Array.from({ length: 20 }, (_, i) => i + 69), 143].sort((a, b) => a - b)
    expect(ids).toEqual(expectedIds)
  })

  it('every question targets the legalMoral axis', () => {
    legalMoralQuestions.forEach((q) => expect(q.axisId).toBe('legalMoral'))
  })
})
