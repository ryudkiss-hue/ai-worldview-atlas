// Writes analysis/atlas_reference.json, the input to analysis/closecall_sim.py. Run with: npx vite-node scripts/export_sim_reference.ts
import { writeFileSync } from 'fs'
import { questions } from '../src/data/questions'
import { profiles } from '../src/data/profiles'
import { axes } from '../src/data/axes'
import { axisSalience } from '../src/data/archetypeSalience'
import { CLOSE_CALL_MARGIN, TIER_BAND } from '../src/lib/scoring'

const ref = {
  note: 'Generated from the quiz source by scripts/export_sim_reference.ts. Input to the close-call simulation only.',
  axes: axes.map((a) => ({ id: a.id, name: a.name })),
  items: questions.map((q) => ({
    id: q.id, pair: q.pair, axisId: q.axisId, horizon: q.horizon,
    direction: q.agreeShiftsToward === 'A' ? 1 : -1, statement: q.statement,
  })),
  profiles: profiles.map((p) => ({
    id: p.id, name: p.name, coords: p.coords,
    salience: Object.fromEntries(axes.map((a) => [a.id, axisSalience(p.id, a.id)])),
  })),
  tierBand: TIER_BAND,
  closeCallMargin: CLOSE_CALL_MARGIN,
}
writeFileSync(new URL('../analysis/atlas_reference.json', import.meta.url), JSON.stringify(ref, null, 1) + '\n')
console.log('wrote analysis/atlas_reference.json')
