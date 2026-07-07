import { describe, it, expect } from 'vitest'
import { stakeholderTags } from './stakeholderTags'
import { fleschKincaidGrade } from '../lib/readability'

describe('stakeholderTags', () => {
  it('has exactly 13 entries with unique ids and names', () => {
    expect(stakeholderTags).toHaveLength(13)
    expect(new Set(stakeholderTags.map((t) => t.id)).size).toBe(13)
    expect(new Set(stakeholderTags.map((t) => t.name)).size).toBe(13)
  })

  it('every description passes the 10th-grade readability gate', () => {
    stakeholderTags.forEach((tag) => {
      const grade = fleschKincaidGrade(tag.description)
      expect(grade, `${tag.name} scored grade ${grade.toFixed(1)}`).toBeLessThanOrEqual(10)
    })
  })
})
