import { describe, it, expect } from 'vitest'
import type { Question, Profile } from '../data/types'
import { questions } from '../data/questions'
import { axes } from '../data/axes'
import {
  computeRawAxisScores,
  scaleAxisScores,
  combineHorizons,
  classify,
  axesInAgreement,
  isCloseCall,
  itemCounts,
  tierOf,
  CLOSE_CALL_MARGIN,
  CLOSE_CALL_MARGIN_SHORT,
  EQUAL_WEIGHTS,
  isEqualWeights,
  type ProfileMatch,
} from './scoring'

const fixtureQuestions: Question[] = [
  { id: 1, pair: 2, axisId: 'teleological', horizon: 'T1', agreeShiftsToward: 'A', statement: 'q1' },
  { id: 2, pair: 1, axisId: 'teleological', horizon: 'T1', agreeShiftsToward: 'B', statement: 'q2' },
  { id: 3, pair: 4, axisId: 'teleological', horizon: 'T2', agreeShiftsToward: 'A', statement: 'q3' },
  { id: 4, pair: 3, axisId: 'teleological', horizon: 'T2', agreeShiftsToward: 'B', statement: 'q4' },
]

const zeroVector = {
  teleological: 0, risk: 0, socioEconomic: 0, ontological: 0,
  legalMoral: 0, evolutionary: 0, relational: 0, geopolitical: 0,
}

// Test answer sheets built from the real item set
const sheet = (f: (q: Question) => number) => Object.fromEntries(questions.map((q) => [q.id, f(q)]))
const score = (answers: Record<number, number>) =>
  combineHorizons(
    scaleAxisScores(computeRawAxisScores(questions, answers, 'T1'), 'T1'),
    scaleAxisScores(computeRawAxisScores(questions, answers, 'T2'), 'T2'),
  )

describe('computeRawAxisScores', () => {
  it('sums signed answers per axis and horizon, flipping pole-B statements', () => {
    const answers = { 1: 5, 2: 5, 3: 4, 4: 4 }
    expect(computeRawAxisScores(fixtureQuestions, answers, 'T1').teleological).toBe(0)
    expect(computeRawAxisScores(fixtureQuestions, answers, 'T2').teleological).toBe(0)
  })

  it('treats an unanswered or declined statement as zero', () => {
    expect(computeRawAxisScores(fixtureQuestions, { 1: 5 }, 'T1').teleological).toBe(2)
  })
})

describe('scaleAxisScores', () => {
  it('maps 0 to 0 and the strongest possible raw score to exactly 10', () => {
    expect(scaleAxisScores(zeroVector, 'T1', fixtureQuestions).teleological).toBe(0)
    expect(scaleAxisScores({ ...zeroVector, teleological: 4 }, 'T1', fixtureQuestions).teleological).toBe(10)
    expect(scaleAxisScores({ ...zeroVector, teleological: -2 }, 'T1', fixtureQuestions).teleological).toBe(-5)
  })

  it('is linear, with no squashing', () => {
    expect(scaleAxisScores({ ...zeroVector, teleological: 1 }, 'T1', fixtureQuestions).teleological).toBe(2.5)
  })
})

describe('combineHorizons', () => {
  it('weights each horizon by its number of statements', () => {
    const n1 = itemCounts('T1').ontological
    const n2 = itemCounts('T2').ontological
    const combined = combineHorizons({ ...zeroVector, ontological: 10 }, { ...zeroVector, ontological: 0 })
    expect(combined.ontological).toBeCloseTo((10 * n1) / (n1 + n2), 10)
  })
})

describe('scoring the real item set', () => {
  it('puts every uniform answer sheet at exactly 0 on every axis', () => {
    for (const v of [1, 2, 4, 5]) {
      const s = score(sheet(() => v))
      axes.forEach((a) => expect(s[a.id], `${a.id} with every answer ${v}`).toBe(0))
    }
  })

  it('reaches +10 and -10 at the poles', () => {
    const toA = score(sheet((q) => (q.agreeShiftsToward === 'A' ? 5 : 1)))
    const toB = score(sheet((q) => (q.agreeShiftsToward === 'A' ? 1 : 5)))
    axes.forEach((a) => {
      expect(toA[a.id]).toBe(10)
      expect(toB[a.id]).toBe(-10)
    })
  })

  it('counts "no settled view" as zero', () => {
    expect(score({})).toEqual(zeroVector)
  })
})

describe('classify', () => {
  const profiles: Profile[] = [
    { id: 'near', name: 'Near', summary: '', coords: { ...zeroVector, teleological: 1 } },
    { id: 'far', name: 'Far', summary: '', coords: { ...zeroVector, teleological: 9 } },
  ]
  it('ranks by Euclidean distance, closest first', () => {
    const ranked = classify(zeroVector, profiles)
    expect(ranked.map((m) => m.profile.id)).toEqual(['near', 'far'])
    expect(ranked[0].distance).toBe(1)
  })

  it('gives the ordinary distance when every axis is weighted equally', () => {
    const you = { ...zeroVector, teleological: 3, risk: -4 }
    const plain = classify(you, profiles)
    const equal = classify(you, profiles, EQUAL_WEIGHTS)
    equal.forEach((m, i) => expect(m.distance).toBeCloseTo(plain[i].distance, 10))
    expect(isEqualWeights(EQUAL_WEIGHTS)).toBe(true)
    expect(isEqualWeights(undefined)).toBe(true)
  })

  it('lets a heavier axis change which archetype ranks first', () => {
    const two: Profile[] = [
      { id: 'tele', name: 'Tele', summary: '', coords: { ...zeroVector, teleological: 6 } },
      { id: 'risk', name: 'Risk', summary: '', coords: { ...zeroVector, risk: 5 } },
    ]
    // You: teleological 6, risk 5 away from each. Unweighted, 'tele' is 5 away and 'risk' is 6 away.
    const you = { ...zeroVector, teleological: 6, risk: 5 }
    expect(classify(you, two)[0].profile.id).toBe('tele')
    const riskMatters = { ...EQUAL_WEIGHTS, risk: 2, teleological: 0.5 }
    expect(isEqualWeights(riskMatters)).toBe(false)
    expect(classify(you, two, riskMatters)[0].profile.id).toBe('risk')
  })
})

describe('axesInAgreement', () => {
  it('counts axes where you and the archetype share a tier (pole A, middle, pole B)', () => {
    expect(tierOf(2)).toBe(1)
    expect(tierOf(1.99)).toBe(0)
    expect(tierOf(-2)).toBe(-1)
    const profile: Profile = { id: 'p', name: 'P', summary: '', coords: { ...zeroVector, risk: 8, geopolitical: -5 } }
    expect(axesInAgreement({ ...zeroVector, risk: 3 }, profile)).toBe(7)
    expect(axesInAgreement({ ...zeroVector, risk: 3, geopolitical: -2.5 }, profile)).toBe(8)
  })
})

describe('isCloseCall', () => {
  const matchAt = (distance: number): ProfileMatch => ({
    profile: { id: String(distance), name: '', summary: '', coords: zeroVector },
    distance,
  })
  it('flags a top-two distance gap under the margin', () => {
    expect(isCloseCall([])).toBe(false)
    expect(isCloseCall([matchAt(10)])).toBe(false)
    expect(isCloseCall([matchAt(10), matchAt(10 + CLOSE_CALL_MARGIN / 2)])).toBe(true)
    expect(isCloseCall([matchAt(5), matchAt(20)])).toBe(false)
  })

  it('takes a margin for the short version', () => {
    expect(CLOSE_CALL_MARGIN_SHORT).toBe(0.3)
    expect(isCloseCall([matchAt(10), matchAt(10.5)], 1)).toBe(true)
    expect(isCloseCall([matchAt(10), matchAt(10.5)], 0.3)).toBe(false)
  })
})
