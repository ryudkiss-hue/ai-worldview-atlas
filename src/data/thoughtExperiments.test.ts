import { describe, it, expect } from 'vitest'
import { thoughtExperiments } from './thoughtExperiments'
import { axes } from './axes'

describe('thought experiments', () => {
  it('each has a unique key, real axes and at least one question with follow-ups', () => {
    expect(new Set(thoughtExperiments.map((e) => e.key)).size).toBe(thoughtExperiments.length)
    const ids = new Set(axes.map((a) => a.id))
    for (const e of thoughtExperiments) {
      e.axes.forEach((a) => expect(ids.has(a), `${e.key} axis ${a}`).toBe(true))
      expect(e.questions.length).toBeGreaterThan(0)
      e.questions.forEach((q) => expect(q.followups.length).toBeGreaterThan(0))
    }
  })

  it('uses the current axis names and none of the retired jargon', () => {
    const text = JSON.stringify(thoughtExperiments)
    for (const old of ['Ends of Intelligence', 'Succession', 'Silicon Functionalism', 'Doomer', 'e/acc', 'qualia', '—']) {
      expect(text.includes(old), old).toBe(false)
    }
  })
})
