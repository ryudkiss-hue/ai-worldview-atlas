// Generates 3,000 synthetic answer sheets (test data only, never data about people) and the app engine's results for
// them, for paper/verify.py. The output is not committed.
import { writeFileSync } from 'fs'
import { questions } from '../src/data/questions'
import { profiles } from '../src/data/profiles'
import { computeRawAxisScores, scaleAxisScores, combineHorizons, classify, answeredCounts, axesInAgreement, isCloseCall } from '../src/lib/scoring'
import { coreArchetype } from '../src/data/coreThree'
let seed = 20261119
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647
const out = []
for (let n = 0; n < 3000; n++) {
  const blankRate = [0, 0.05, 0.2, 0.5, 0.8][n % 5]
  const answers: Record<number, number> = {}
  for (const q of questions) if (rnd() >= blankRate) answers[q.id] = [1, 2, 4, 5][Math.floor(rnd() * 4)]
  const r1 = computeRawAxisScores(questions, answers, 'T1'), r2 = computeRawAxisScores(questions, answers, 'T2')
  const a1 = answeredCounts(questions, answers, 'T1'), a2 = answeredCounts(questions, answers, 'T2')
  const t1 = scaleAxisScores(r1, 'T1', questions, a1), t2 = scaleAxisScores(r2, 'T2', questions, a2)
  const combined = combineHorizons(t1, t2, questions, a1, a2)
  const matches = classify(combined, profiles)
  const core = coreArchetype(combined)
  out.push({ answers, r1, r2, a1, a2, combined, top: matches.slice(0, 3).map((m) => ({ id: m.profile.id, d: m.distance, agree: axesInAgreement(combined, m.profile) })), closeCall: isCloseCall(matches), core: core.name })
}
writeFileSync(new URL('./engine_results.json', import.meta.url), JSON.stringify(out))
console.log('wrote', out.length)
