import { describe, it, expect } from 'vitest'
import { questions, questionsForAxis } from './index'
import { axes } from '../axes'

// The merged Atlas: 8 axes x 9 mirrored pairs = 144 statements. Each axis has 4 pairs about today's and near-term
// AI (T1) and 5 about what is possible in principle or in the long run (T2).
describe('questions aggregator', () => {
  it('has exactly 144 statements with unique, contiguous ids 1-144', () => {
    expect(questions).toHaveLength(144)
    expect(questions.map((q) => q.id)).toEqual(Array.from({ length: 144 }, (_, i) => i + 1))
    expect(new Set(questions.map((q) => q.statement)).size).toBe(144)
  })

  it('gives every axis 18 statements, 8 near-term and 10 long-term, in one contiguous id block', () => {
    axes.forEach((axis, index) => {
      const forAxis = questionsForAxis(axis.id)
      expect(forAxis, axis.id).toHaveLength(18)
      expect(forAxis.filter((q) => q.horizon === 'T1'), `${axis.id} T1`).toHaveLength(8)
      expect(forAxis.filter((q) => q.horizon === 'T2'), `${axis.id} T2`).toHaveLength(10)
      expect(forAxis.map((q) => q.id)).toEqual(Array.from({ length: 18 }, (_, i) => index * 18 + i + 1))
    })
  })

  it('pairs every statement with a mirrored partner on the same axis and horizon, keyed the opposite way', () => {
    const byId = new Map(questions.map((q) => [q.id, q]))
    questions.forEach((q) => {
      const partner = byId.get(q.pair)!
      expect(partner, `partner of ${q.id}`).toBeDefined()
      expect(partner.pair).toBe(q.id)
      expect(partner.axisId).toBe(q.axisId)
      expect(partner.horizon).toBe(q.horizon)
      expect(partner.agreeShiftsToward).not.toBe(q.agreeShiftsToward)
    })
  })

  it('balances every axis and horizon: as many statements lean toward pole A as toward pole B', () => {
    axes.forEach((axis) => {
      ;(['T1', 'T2'] as const).forEach((h) => {
        const qs = questionsForAxis(axis.id).filter((q) => q.horizon === h)
        const a = qs.filter((q) => q.agreeShiftsToward === 'A').length
        expect(a, `${axis.id} ${h}`).toBe(qs.length - a)
      })
    })
  })
})
