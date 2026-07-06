import { describe, it, expect } from 'vitest'
import { fleschKincaidGrade } from './readability'

describe('fleschKincaidGrade', () => {
  it('scores a short, simple sentence at a low grade level', () => {
    const grade = fleschKincaidGrade('The cat sat on the mat.')
    expect(grade).toBeLessThan(4)
  })

  it('scores a long, complex sentence at a high grade level', () => {
    const grade = fleschKincaidGrade(
      'The intergovernmental committee unanimously ratified the multilateral agreement, notwithstanding considerable procedural objections raised by several dissenting representatives.'
    )
    expect(grade).toBeGreaterThan(14)
  })

  it('returns 0 for empty input instead of throwing', () => {
    expect(fleschKincaidGrade('')).toBe(0)
  })
})
