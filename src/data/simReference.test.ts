import { describe, it, expect } from 'vitest'
import ref from '../../analysis/atlas_reference.json'
import { questions } from './questions'
import { profiles } from './profiles'
import { axes } from './axes'
import { axisSalience } from './archetypeSalience'
import { CLOSE_CALL_MARGIN, TIER_BAND } from '../lib/scoring'

// analysis/closecall_sim.py calibrates the close-call margin from this file, so it must match the quiz.
// Regenerate it with: npx vite-node scripts/export_sim_reference.ts

describe('close-call simulation reference', () => {
  it('has the same statements, pairs and directions as the quiz', () => {
    expect(ref.items).toEqual(
      questions.map((q) => ({
        id: q.id, pair: q.pair, axisId: q.axisId, horizon: q.horizon,
        direction: q.agreeShiftsToward === 'A' ? 1 : -1, statement: q.statement,
      })),
    )
    expect(ref.axes.map((a) => a.id)).toEqual(axes.map((a) => a.id))
  })

  it('has the same archetype coordinates, axis weights and thresholds', () => {
    expect(ref.profiles.map((p) => [p.id, p.coords])).toEqual(profiles.map((p) => [p.id, p.coords]))
    for (const p of ref.profiles) for (const a of axes) expect(p.salience[a.id as keyof typeof p.salience]).toBe(axisSalience(p.id, a.id))
    expect(ref.tierBand).toBe(TIER_BAND)
    expect(ref.closeCallMargin).toBe(CLOSE_CALL_MARGIN)
  })
})
