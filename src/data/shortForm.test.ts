import { describe, it, expect } from 'vitest'
import { SHORT_PAIR_IDS, shortQuestions, isInShortForm, questionsForMode } from './shortForm'
import { questions } from './questions'
import { axes } from './axes'

describe('short version', () => {
  it('has 48 statements: 24 complete mirrored pairs', () => {
    expect(shortQuestions).toHaveLength(48)
    SHORT_PAIR_IDS.forEach((id) => {
      const a = questions.find((q) => q.id === id)!
      const b = questions.find((q) => q.id === id + 1)!
      expect(a.pair).toBe(b.id)
      expect(b.pair).toBe(a.id)
      expect(a.axisId).toBe(b.axisId)
      expect(a.horizon).toBe(b.horizon)
      expect(new Set([a.agreeShiftsToward, b.agreeShiftsToward])).toEqual(new Set(['A', 'B']))
    })
  })

  it('gives every axis one near-term and two long-run pairs', () => {
    axes.forEach((axis) => {
      const items = shortQuestions.filter((q) => q.axisId === axis.id)
      expect(items.filter((q) => q.horizon === 'T1')).toHaveLength(2)
      expect(items.filter((q) => q.horizon === 'T2')).toHaveLength(4)
    })
  })

  it('looks statements up by mode', () => {
    expect(questionsForMode('full')).toBe(questions)
    expect(questionsForMode('short')).toBe(shortQuestions)
    expect(isInShortForm(SHORT_PAIR_IDS[0])).toBe(true)
    expect(isInShortForm(1)).toBe(false)
  })
})
