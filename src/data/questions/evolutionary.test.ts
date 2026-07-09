import { describe, it, expect } from 'vitest'
import { evolutionaryQuestions } from './evolutionary'

describe('evolutionaryQuestions', () => {
  it('has 19 questions: 10 T1 and 9 T2', () => {
    expect(evolutionaryQuestions).toHaveLength(19)
    expect(evolutionaryQuestions.filter((q) => q.horizon === 'T1')).toHaveLength(10)
    expect(evolutionaryQuestions.filter((q) => q.horizon === 'T2')).toHaveLength(9)
  })

  it('uses ids 89 through 106 and 144 with no gaps or duplicates', () => {
    const ids = evolutionaryQuestions.map((q) => q.id).sort((a, b) => a - b)
    const expectedIds = [...Array.from({ length: 18 }, (_, i) => i + 89), 144].sort((a, b) => a - b)
    expect(ids).toEqual(expectedIds)
  })

  it('every question targets the evolutionary axis', () => {
    evolutionaryQuestions.forEach((q) => expect(q.axisId).toBe('evolutionary'))
  })
})
