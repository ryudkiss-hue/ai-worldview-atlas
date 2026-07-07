import { describe, it, expect } from 'vitest'
import { evolutionaryQuestions } from './evolutionary'

describe('evolutionaryQuestions', () => {
  it('has 18 questions: 9 T1 and 9 T2', () => {
    expect(evolutionaryQuestions).toHaveLength(18)
    expect(evolutionaryQuestions.filter((q) => q.horizon === 'T1')).toHaveLength(9)
    expect(evolutionaryQuestions.filter((q) => q.horizon === 'T2')).toHaveLength(9)
  })

  it('uses ids 79 through 96 with no gaps or duplicates', () => {
    const ids = evolutionaryQuestions.map((q) => q.id).sort((a, b) => a - b)
    expect(ids).toEqual(Array.from({ length: 18 }, (_, i) => i + 79))
  })

  it('every question targets the evolutionary axis', () => {
    evolutionaryQuestions.forEach((q) => expect(q.axisId).toBe('evolutionary'))
  })
})
