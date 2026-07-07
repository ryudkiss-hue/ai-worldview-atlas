import { describe, it, expect } from 'vitest'
import { scenarios } from './scenarios'
import { axes } from './axes'
import { fleschKincaidGrade } from '../lib/readability'

describe('scenarios', () => {
  it('has exactly 8 entries, one per axis, no duplicates', () => {
    expect(scenarios).toHaveLength(8)
    const axisIds = scenarios.map((s) => s.axisId)
    expect(new Set(axisIds).size).toBe(8)
    axes.forEach((axis) => expect(axisIds).toContain(axis.id))
  })

  it('every prompt and option passes the 10th-grade readability gate', () => {
    scenarios.forEach((s) => {
      ;[s.prompt, s.optionA, s.optionB].forEach((text) => {
        const grade = fleschKincaidGrade(text)
        expect(grade, `${s.axisId} scored grade ${grade.toFixed(1)}: "${text}"`).toBeLessThanOrEqual(10)
      })
    })
  })
})
