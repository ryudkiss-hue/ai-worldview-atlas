import { describe, it, expect } from 'vitest'
import { riskQuestions } from './risk'

describe('riskQuestions', () => {
  it('has 14 questions: 7 T1 and 7 T2', () => {
    expect(riskQuestions).toHaveLength(14)
    expect(riskQuestions.filter((q) => q.horizon === 'T1')).toHaveLength(7)
    expect(riskQuestions.filter((q) => q.horizon === 'T2')).toHaveLength(7)
  })

  it('uses ids 15 through 28 with no gaps or duplicates', () => {
    const ids = riskQuestions.map((q) => q.id).sort((a, b) => a - b)
    expect(ids).toEqual(Array.from({ length: 14 }, (_, i) => i + 15))
  })

  it('every question targets the risk axis', () => {
    riskQuestions.forEach((q) => expect(q.axisId).toBe('risk'))
  })
})
