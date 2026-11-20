// Writes paper/data.json, everything the paper booklet needs from the quiz source. Run with: npx vite-node scripts/export_paper_data.ts
import { writeFileSync } from 'fs'
import { axes } from '../src/data/axes'
import { questions } from '../src/data/questions'
import { profiles } from '../src/data/profiles'
import { archetypeClusters } from '../src/data/archetypeClusters'
import { CORE_TIERS, CORE_ARCHETYPES, Y_POSITIVE_FOR_DOUBTERS } from '../src/data/coreThree'

const data = {
  note: 'Generated from the quiz source by scripts/export_paper_data.ts. Input to paper/build.py.',
  axes: axes.map(({ id, name, question, poleA, poleADesc, poleB, poleBDesc }) => ({ id, name, question, poleA, poleADesc, poleB, poleBDesc })),
  items: questions.map(({ id, axisId, horizon, agreeShiftsToward, statement, pair }) => ({ id, axisId, horizon, agreeShiftsToward, statement, pair })),
  profiles: profiles.map(({ id, name, coords, summary }) => ({ id, name, coords, summary })),
  archetypeClusters,
  CORE_TIERS,
  CORE_ARCHETYPES,
  Y_POSITIVE_FOR_DOUBTERS,
}
writeFileSync(new URL('../paper/data.json', import.meta.url), JSON.stringify(data, null, 1) + '\n')
console.log('wrote paper/data.json')
