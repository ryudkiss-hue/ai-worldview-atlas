import { describe, it, expect } from 'vitest'
import { socioEconomicQuestions } from './socioEconomic'

describe('socioEconomicQuestions', () => {
  it('has 19 questions: 10 T1 and 9 T2', () => {
    expect(socioEconomicQuestions).toHaveLength(19)
    expect(socioEconomicQuestions.filter((q) => q.horizon === 'T1')).toHaveLength(10)
    expect(socioEconomicQuestions.filter((q) => q.horizon === 'T2')).toHaveLength(9)
  })

  it('uses ids 33 through 50 and 145 with no gaps or duplicates', () => {
    const ids = socioEconomicQuestions.map((q) => q.id).sort((a, b) => a - b)
    const expectedIds = [...Array.from({ length: 18 }, (_, i) => i + 33), 145].sort((a, b) => a - b)
    expect(ids).toEqual(expectedIds)
  })

  it('every question targets the socioEconomic axis', () => {
    socioEconomicQuestions.forEach((q) => expect(q.axisId).toBe('socioEconomic'))
  })
})
