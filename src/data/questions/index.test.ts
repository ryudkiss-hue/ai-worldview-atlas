import { describe, it, expect } from 'vitest'
import { questions, questionsForAxis } from './index'
import { axes } from '../axes'

// Every axis started at 14 questions (7/7 across horizons). Seven have since been
// expanded, each for a data-driven reason: extra distinguishing power for close
// archetype pairs, or a distinct fault line the base 14 didn't reach. legalMoral
// got a second, narrower expansion (blame-attribution for AI-caused harm) on top of
// its first, so it sits at 20 rather than 18 like the rest.
const EXPECTED_COUNTS: Record<string, { t1: number; t2: number }> = {
  teleological: { t1: 7, t2: 7 },
  risk: { t1: 9, t2: 9 },
  socioEconomic: { t1: 10, t2: 9 },
  ontological: { t1: 9, t2: 9 },
  legalMoral: { t1: 11, t2: 10 },
  evolutionary: { t1: 10, t2: 9 },
  relational: { t1: 9, t2: 9 },
  geopolitical: { t1: 9, t2: 9 },
}

describe('questions aggregator', () => {
  it('has exactly 145 questions with unique, contiguous ids 1-145', () => {
    expect(questions).toHaveLength(145)
    const ids = questions.map((q) => q.id)
    expect(ids).toEqual(Array.from({ length: 145 }, (_, i) => i + 1))
  })

  it('has correct questions per axis across horizons', () => {
    axes.forEach((axis) => {
      const forAxis = questionsForAxis(axis.id)
      const expected = EXPECTED_COUNTS[axis.id]
      const expectedTotal = expected.t1 + expected.t2
      expect(forAxis, `axis ${axis.id}`).toHaveLength(expectedTotal)
      expect(forAxis.filter((q) => q.horizon === 'T1'), `axis ${axis.id} T1`).toHaveLength(expected.t1)
      expect(forAxis.filter((q) => q.horizon === 'T2'), `axis ${axis.id} T2`).toHaveLength(expected.t2)
    })
  })
})
