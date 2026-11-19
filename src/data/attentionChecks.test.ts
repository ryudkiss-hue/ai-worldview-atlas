import { describe, it, expect } from 'vitest'
import { attentionChecks, failedAttentionChecks, isAttentionCheck } from './attentionChecks'
import { questions } from './questions'

describe('attention checks', () => {
  it('never share an id with a scored statement', () => {
    attentionChecks.forEach((c) => expect(questions.some((q) => q.id === c.id)).toBe(false))
    expect(isAttentionCheck(901)).toBe(true)
    expect(isAttentionCheck(1)).toBe(false)
  })

  it('flags only checks that were answered differently from what they ask; skipped checks are fine', () => {
    expect(failedAttentionChecks({})).toEqual([])
    expect(failedAttentionChecks({ 901: 2, 902: 5 })).toEqual([])
    expect(failedAttentionChecks({ 901: 4 }).map((c) => c.id)).toEqual([901])
  })
})
