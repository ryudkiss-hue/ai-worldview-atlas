import { describe, it, expect } from 'vitest'
import { relationalQuestions } from './relational'

describe('relationalQuestions', () => {
  it('has 18 questions: 9 T1 and 9 T2', () => {
    expect(relationalQuestions).toHaveLength(18)
    expect(relationalQuestions.filter((q) => q.horizon === 'T1')).toHaveLength(9)
    expect(relationalQuestions.filter((q) => q.horizon === 'T2')).toHaveLength(9)
  })

  it('uses ids 107 through 124 with no gaps or duplicates', () => {
    const ids = relationalQuestions.map((q) => q.id).sort((a, b) => a - b)
    expect(ids).toEqual(Array.from({ length: 18 }, (_, i) => i + 107))
  })

  it('every question targets the relational axis', () => {
    relationalQuestions.forEach((q) => expect(q.axisId).toBe('relational'))
  })
})
