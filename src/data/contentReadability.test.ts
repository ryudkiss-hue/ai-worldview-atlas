import { describe, it, expect } from 'vitest'
import { questions } from './questions'
import { profiles } from './profiles'
import { fleschKincaidGrade } from '../lib/readability'

describe('content reading level', () => {
  // Statements aim for clarity: plain enough that the idea, not the vocabulary, does the work. A ceiling only;
  // the earlier floor of grade 10 rewarded wordiness.
  it('keeps every statement at or below grade 15', () => {
    questions.forEach((q) => {
      const grade = fleschKincaidGrade(q.statement)
      expect(grade, `Question ${q.id} scored grade ${grade.toFixed(1)}: "${q.statement}"`).toBeLessThanOrEqual(15)
    })
  })

  it('keeps the average statement between grade 8 and 12', () => {
    const grades = questions.map((q) => fleschKincaidGrade(q.statement))
    const avg = grades.reduce((sum, g) => sum + g, 0) / grades.length
    expect(avg, `average grade ${avg.toFixed(2)}`).toBeGreaterThanOrEqual(8)
    expect(avg, `average grade ${avg.toFixed(2)}`).toBeLessThanOrEqual(12)
  })

  it('keeps every profile summary at or below a college (grade 14) reading level', () => {
    profiles.forEach((p) => {
      const grade = fleschKincaidGrade(p.summary)
      expect(grade, `Profile ${p.name} scored grade ${grade.toFixed(1)}: "${p.summary}"`).toBeLessThanOrEqual(14)
    })
  })
})
