import { describe, it, expect } from 'vitest'
import { questions } from './questions'
import { profiles } from './profiles'
import { fleschKincaidGrade } from '../lib/readability'

describe('content reading level', () => {
  it('keeps every question statement at or below a 10th-grade reading level', () => {
    questions.forEach((q) => {
      const grade = fleschKincaidGrade(q.statement)
      expect(grade, `Question ${q.id} scored grade ${grade.toFixed(1)}: "${q.statement}"`).toBeLessThanOrEqual(10)
    })
  })

  it('keeps every profile summary at or below a 10th-grade reading level', () => {
    profiles.forEach((p) => {
      const grade = fleschKincaidGrade(p.summary)
      expect(grade, `Profile ${p.name} scored grade ${grade.toFixed(1)}: "${p.summary}"`).toBeLessThanOrEqual(10)
    })
  })
})
