import { describe, it, expect } from 'vitest'
import { questions } from './questions'
import { profiles } from './profiles'
import { fleschKincaidGrade } from '../lib/readability'

describe('content reading level', () => {
  it('targets roughly a college (grade 12-14) reading level for every question statement', () => {
    questions.forEach((q) => {
      const grade = fleschKincaidGrade(q.statement)
      expect(grade, `Question ${q.id} scored grade ${grade.toFixed(1)}: "${q.statement}"`).toBeGreaterThanOrEqual(10)
      expect(grade, `Question ${q.id} scored grade ${grade.toFixed(1)}: "${q.statement}"`).toBeLessThanOrEqual(16.5)
    })
  })

  it('keeps the average question reading level in the college (12-14) target band', () => {
    const grades = questions.map((q) => fleschKincaidGrade(q.statement))
    const avg = grades.reduce((sum, g) => sum + g, 0) / grades.length
    expect(avg, `average grade ${avg.toFixed(2)}`).toBeGreaterThanOrEqual(12)
    expect(avg, `average grade ${avg.toFixed(2)}`).toBeLessThanOrEqual(14)
  })

  it('keeps every profile summary at or below a college (grade 14) reading level', () => {
    profiles.forEach((p) => {
      const grade = fleschKincaidGrade(p.summary)
      expect(grade, `Profile ${p.name} scored grade ${grade.toFixed(1)}: "${p.summary}"`).toBeLessThanOrEqual(14)
    })
  })
})
