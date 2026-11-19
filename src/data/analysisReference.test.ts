import { describe, it, expect } from 'vitest'
import ref from '../../analysis/atlas_reference.json'
import { questions } from './questions'
import { profiles } from './profiles'
import { axes } from './axes'
import { attentionChecks } from './attentionChecks'
import { CLOSE_CALL_MARGIN, TIER_BAND } from '../lib/scoring'

// The validation analysis (analysis/analyze_atlas.py) scores responses from this file, so it must match the quiz exactly.

describe('analysis reference data', () => {
  it('has the same statements, pairs and directions as the quiz', () => {
    expect(ref.items).toHaveLength(questions.length)
    for (const q of questions) {
      const r = ref.items.find((i) => i.id === q.id)
      expect(r, `statement ${q.id}`).toEqual({
        id: q.id, pair: q.pair, axisId: q.axisId, horizon: q.horizon,
        direction: q.agreeShiftsToward === 'A' ? 1 : -1, statement: q.statement,
      })
    }
    expect(ref.axes.map((a) => a.id)).toEqual(axes.map((a) => a.id))
  })

  it('has the same archetype coordinates, checks and thresholds', () => {
    expect(ref.profiles.map((p) => [p.id, p.coords])).toEqual(profiles.map((p) => [p.id, p.coords]))
    const asked: Record<number, number> = { 1: -2, 2: -1, 4: 1, 5: 2 }
    expect(ref.checks).toEqual(attentionChecks.map((c) => ({ id: c.id, expect: asked[c.expected] })))
    expect(ref.tierBand).toBe(TIER_BAND)
    expect(ref.closeCallMargin).toBe(CLOSE_CALL_MARGIN)
  })
})
