import { describe, it, expect } from 'vitest'
import { evolutionaryQuestions } from './evolutionary'

describe('evolutionaryQuestions', () => {
  it('has 14 questions: 7 T1 and 7 T2', () => {
    expect(evolutionaryQuestions).toHaveLength(14)
    expect(evolutionaryQuestions.filter((q) => q.horizon === 'T1')).toHaveLength(7)
    expect(evolutionaryQuestions.filter((q) => q.horizon === 'T2')).toHaveLength(7)
  })

  it('uses ids 71 through 84 with no gaps or duplicates', () => {
    const ids = evolutionaryQuestions.map((q) => q.id).sort((a, b) => a - b)
    expect(ids).toEqual(Array.from({ length: 14 }, (_, i) => i + 71))
  })

  it('every question targets the evolutionary axis', () => {
    evolutionaryQuestions.forEach((q) => expect(q.axisId).toBe('evolutionary'))
  })
})
