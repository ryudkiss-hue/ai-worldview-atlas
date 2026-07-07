import { describe, it, expect } from 'vitest'
import type { Question, Profile } from '../data/types'
import {
  computeRawAxisScores,
  scaleAxisScores,
  combineHorizons,
  classify,
  matchCloseness,
} from './scoring'

const fixtureQuestions: Question[] = [
  { id: 1, axisId: 'teleological', horizon: 'T1', agreeShiftsToward: 'A', statement: 'q1' },
  { id: 2, axisId: 'teleological', horizon: 'T1', agreeShiftsToward: 'B', statement: 'q2' },
  { id: 3, axisId: 'teleological', horizon: 'T2', agreeShiftsToward: 'A', statement: 'q3' },
]

const zeroVector = {
  teleological: 0, risk: 0, socioEconomic: 0, ontological: 0,
  legalMoral: 0, evolutionary: 0, relational: 0, geopolitical: 0,
}

describe('computeRawAxisScores', () => {
  it('sums signed answers per axis and horizon, flipping reverse-keyed items', () => {
    const answers = { 1: 5, 2: 5, 3: 3 }
    const t1 = computeRawAxisScores(fixtureQuestions, answers, 'T1')
    expect(t1.teleological).toBe(0)
    const t2 = computeRawAxisScores(fixtureQuestions, answers, 'T2')
    expect(t2.teleological).toBe(0)
  })

  it('treats an unanswered question as contributing zero', () => {
    const t1 = computeRawAxisScores(fixtureQuestions, { 1: 5 }, 'T1')
    expect(t1.teleological).toBe(2)
  })
})

describe('scaleAxisScores', () => {
  it('maps a raw score of 0 to a scaled score of 0', () => {
    const scaled = scaleAxisScores(zeroVector)
    expect(scaled.teleological).toBe(0)
  })

  it('maps a raw score of 14 through the tanh formula and keeps it under the ceiling', () => {
    const scaled = scaleAxisScores({ ...zeroVector, teleological: 14 })
    expect(scaled.teleological).toBeCloseTo(10 * Math.tanh(14 / 3.5), 5)
    expect(scaled.teleological).toBeLessThan(10)
  })
})

describe('combineHorizons', () => {
  it('averages T1 and T2 scaled scores per axis', () => {
    const t1 = { ...zeroVector, teleological: 4 }
    const t2 = { ...zeroVector, teleological: 8 }
    const combined = combineHorizons(t1, t2)
    expect(combined.teleological).toBe(6)
  })
})

describe('classify', () => {
  const profiles: Profile[] = [
    { id: 'a', name: 'A', summary: '', coords: { ...zeroVector, teleological: 10 } },
    { id: 'b', name: 'B', summary: '', coords: { ...zeroVector, teleological: -10 } },
  ]

  it('sorts profiles by ascending distance to the combined vector', () => {
    const combined = { ...zeroVector, teleological: 9 }
    const matches = classify(combined, profiles)
    expect(matches[0].profile.id).toBe('a')
    expect(matches[1].profile.id).toBe('b')
    expect(matches[0].distance).toBeLessThan(matches[1].distance)
  })
})

describe('matchCloseness', () => {
  const maxDistance = Math.sqrt(8 * 20 ** 2)

  it('maps a distance of 0 to 100%', () => {
    expect(matchCloseness(0)).toBe(100)
  })

  it('maps the maximum possible distance to 0%', () => {
    expect(matchCloseness(maxDistance)).toBe(0)
  })

  it('maps a mid-range distance to a proportional percentage', () => {
    expect(matchCloseness(maxDistance / 2)).toBe(50)
  })
})
