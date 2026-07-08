import { describe, it, expect } from 'vitest'
import { riskQuestions } from './risk'

describe('riskQuestions', () => {
  it('has 18 questions: 9 T1 and 9 T2', () => {
    expect(riskQuestions).toHaveLength(18)
    expect(riskQuestions.filter((q) => q.horizon === 'T1')).toHaveLength(9)
    expect(riskQuestions.filter((q) => q.horizon === 'T2')).toHaveLength(9)
  })

  it('uses ids 15 through 32 with no gaps or duplicates', () => {
    const ids = riskQuestions.map((q) => q.id).sort((a, b) => a - b)
    expect(ids).toEqual(Array.from({ length: 18 }, (_, i) => i + 15))
  })

  it('every question targets the risk axis', () => {
    riskQuestions.forEach((q) => expect(q.axisId).toBe('risk'))
  })
})
