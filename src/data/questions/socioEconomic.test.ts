import { describe, it, expect } from 'vitest'
import { socioEconomicQuestions } from './socioEconomic'

describe('socioEconomicQuestions', () => {
  it('has 18 questions: 9 T1 and 9 T2', () => {
    expect(socioEconomicQuestions).toHaveLength(18)
    expect(socioEconomicQuestions.filter((q) => q.horizon === 'T1')).toHaveLength(9)
    expect(socioEconomicQuestions.filter((q) => q.horizon === 'T2')).toHaveLength(9)
  })

  it('uses ids 29 through 46 with no gaps or duplicates', () => {
    const ids = socioEconomicQuestions.map((q) => q.id).sort((a, b) => a - b)
    expect(ids).toEqual(Array.from({ length: 18 }, (_, i) => i + 29))
  })

  it('every question targets the socioEconomic axis', () => {
    socioEconomicQuestions.forEach((q) => expect(q.axisId).toBe('socioEconomic'))
  })
})
