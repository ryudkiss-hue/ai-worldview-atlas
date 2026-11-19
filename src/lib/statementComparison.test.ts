import { describe, it, expect } from 'vitest'
import { expectedStance, answerStance, isOpposite } from './statementComparison'
import type { Profile, Question } from '../data/types'
import { profiles } from '../data/profiles'

const q = (agreeShiftsToward: 'A' | 'B'): Question => ({
  id: 1,
  pair: 2,
  axisId: 'ontological',
  horizon: 'T1',
  statement: 'test statement',
  agreeShiftsToward,
})
const at = (v: number): Profile => ({ ...profiles[0], coords: { ...profiles[0].coords, ontological: v } })

describe('expected answers', () => {
  it('maps an archetype’s position on the axis to an expected stance', () => {
    expect(expectedStance(q('A'), at(8))).toBe('strongly_agree')
    expect(expectedStance(q('A'), at(6))).toBe('strongly_agree')
    expect(expectedStance(q('A'), at(3))).toBe('agree')
    expect(expectedStance(q('A'), at(1.9))).toBe('no_lean')
    expect(expectedStance(q('A'), at(-2))).toBe('disagree')
    expect(expectedStance(q('A'), at(-7))).toBe('strongly_disagree')
  })

  it('flips for statements that pull toward pole B', () => {
    expect(expectedStance(q('B'), at(8))).toBe('strongly_disagree')
    expect(expectedStance(q('B'), at(-3))).toBe('agree')
  })

  it('flags only opposite sides, not differences in strength or no lean', () => {
    expect(isOpposite(answerStance(5), 'disagree')).toBe(true)
    expect(isOpposite(answerStance(1), 'agree')).toBe(true)
    expect(isOpposite(answerStance(5), 'agree')).toBe(false)
    expect(isOpposite(answerStance(4), 'no_lean')).toBe(false)
    expect(isOpposite(answerStance(undefined), 'disagree')).toBe(false)
  })
})
