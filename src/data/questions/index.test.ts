import { describe, it, expect } from 'vitest'
import { questions, questionsForAxis } from './index'
import { axes } from '../axes'

const EXPANDED_AXES = new Set(['risk', 'socioEconomic', 'ontological', 'legalMoral', 'evolutionary'])

describe('questions aggregator', () => {
  it('has exactly 132 questions with unique, contiguous ids 1-132', () => {
    expect(questions).toHaveLength(132)
    const ids = questions.map((q) => q.id)
    expect(ids).toEqual(Array.from({ length: 132 }, (_, i) => i + 1))
  })

  it('has 14 questions per axis (7/7 across horizons), or 18 (9/9) for the five axes expanded for extra distinguishing power', () => {
    axes.forEach((axis) => {
      const forAxis = questionsForAxis(axis.id)
      const expectedTotal = EXPANDED_AXES.has(axis.id) ? 18 : 14
      const expectedPerHorizon = expectedTotal / 2
      expect(forAxis, `axis ${axis.id}`).toHaveLength(expectedTotal)
      expect(forAxis.filter((q) => q.horizon === 'T1'), `axis ${axis.id} T1`).toHaveLength(expectedPerHorizon)
      expect(forAxis.filter((q) => q.horizon === 'T2'), `axis ${axis.id} T2`).toHaveLength(expectedPerHorizon)
    })
  })
})
