import { describe, it, expect } from 'vitest'
import { questions, questionsForAxis } from './index'
import { axes } from '../axes'

// Every axis started at 14 questions (7/7 across horizons). Seven have since been
// expanded, each for a data-driven reason: extra distinguishing power for close
// archetype pairs, or a distinct fault line the base 14 didn't reach. legalMoral
// got a second, narrower expansion (blame-attribution for AI-caused harm) on top of
// its first, so it sits at 20 rather than 18 like the rest.
const EXPECTED_COUNTS: Record<string, number> = {
  risk: 18,
  socioEconomic: 18,
  ontological: 18,
  legalMoral: 20,
  evolutionary: 18,
  relational: 18,
  geopolitical: 18,
}

describe('questions aggregator', () => {
  it('has exactly 142 questions with unique, contiguous ids 1-142', () => {
    expect(questions).toHaveLength(142)
    const ids = questions.map((q) => q.id)
    expect(ids).toEqual(Array.from({ length: 142 }, (_, i) => i + 1))
  })

  it('has 14 questions per axis (7/7 across horizons) by default, or the axis-specific expanded count', () => {
    axes.forEach((axis) => {
      const forAxis = questionsForAxis(axis.id)
      const expectedTotal = EXPECTED_COUNTS[axis.id] ?? 14
      const expectedPerHorizon = expectedTotal / 2
      expect(forAxis, `axis ${axis.id}`).toHaveLength(expectedTotal)
      expect(forAxis.filter((q) => q.horizon === 'T1'), `axis ${axis.id} T1`).toHaveLength(expectedPerHorizon)
      expect(forAxis.filter((q) => q.horizon === 'T2'), `axis ${axis.id} T2`).toHaveLength(expectedPerHorizon)
    })
  })
})
