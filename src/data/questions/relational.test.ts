import { describe, it, expect } from 'vitest'
import { relationalQuestions } from './relational'

describe('relationalQuestions', () => {
  it('has 14 questions: 7 T1 and 7 T2', () => {
    expect(relationalQuestions).toHaveLength(14)
    expect(relationalQuestions.filter((q) => q.horizon === 'T1')).toHaveLength(7)
    expect(relationalQuestions.filter((q) => q.horizon === 'T2')).toHaveLength(7)
  })

  it('uses ids 85 through 98 with no gaps or duplicates', () => {
    const ids = relationalQuestions.map((q) => q.id).sort((a, b) => a - b)
    expect(ids).toEqual(Array.from({ length: 14 }, (_, i) => i + 85))
  })

  it('every question targets the relational axis', () => {
    relationalQuestions.forEach((q) => expect(q.axisId).toBe('relational'))
  })
})
