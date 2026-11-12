import type { Question } from '../types'

// Mirrored pairs: each odd id and the even id after it share a topic and take opposite stances.
export const teleologicalQuestions: Question[] = [
  { id: 55, pair: 56, axisId: 'teleological', horizon: 'T1', agreeShiftsToward: 'A', statement: "Building ever more capable AI systems is worth heavy use of land and energy." },
  { id: 56, pair: 55, axisId: 'teleological', horizon: 'T1', agreeShiftsToward: 'B', statement: "Limiting the land and energy used by AI is worth slowing AI progress." },
  { id: 57, pair: 58, axisId: 'teleological', horizon: 'T1', agreeShiftsToward: 'A', statement: "The energy and water used to train large AI systems are usually a fair price for what those systems can do." },
  { id: 58, pair: 57, axisId: 'teleological', horizon: 'T1', agreeShiftsToward: 'B', statement: "The energy and water used to train large AI systems are usually too high a price for what those systems can do." },
  { id: 59, pair: 60, axisId: 'teleological', horizon: 'T1', agreeShiftsToward: 'A', statement: "A new data center that raises local power bills should still go ahead if it advances AI." },
  { id: 60, pair: 59, axisId: 'teleological', horizon: 'T1', agreeShiftsToward: 'B', statement: "A new data center that raises local power bills should be stopped, even if that slows AI." },
  { id: 61, pair: 62, axisId: 'teleological', horizon: 'T1', agreeShiftsToward: 'A', statement: "Robots should be built for greater capability, even if that means mining more of the Earth." },
  { id: 62, pair: 61, axisId: 'teleological', horizon: 'T1', agreeShiftsToward: 'B', statement: "Robots should be built to be repaired and recycled, even if that makes them less capable." },
  { id: 63, pair: 64, axisId: 'teleological', horizon: 'T2', agreeShiftsToward: 'A', statement: "Spreading intelligence to other worlds matters more than protecting life on Earth." },
  { id: 64, pair: 63, axisId: 'teleological', horizon: 'T2', agreeShiftsToward: 'B', statement: "Protecting life on Earth matters more than spreading intelligence to other worlds." },
  { id: 65, pair: 66, axisId: 'teleological', horizon: 'T2', agreeShiftsToward: 'A', statement: "Turning lifeless planets into computing material to support more minds would be a good use of them." },
  { id: 66, pair: 65, axisId: 'teleological', horizon: 'T2', agreeShiftsToward: 'B', statement: "Lifeless planets should be left as they are rather than turned into computing material." },
  { id: 67, pair: 68, axisId: 'teleological', horizon: 'T2', agreeShiftsToward: 'A', statement: "What ultimately matters is that minds keep growing in knowledge and capacity, whatever they are made of." },
  { id: 68, pair: 67, axisId: 'teleological', horizon: 'T2', agreeShiftsToward: 'B', statement: "What ultimately matters is the flourishing of living beings, not how much intelligence exists." },
  { id: 69, pair: 70, axisId: 'teleological', horizon: 'T2', agreeShiftsToward: 'A', statement: "When judging a new technology, making AI more capable should usually count more than caring for nature." },
  { id: 70, pair: 69, axisId: 'teleological', horizon: 'T2', agreeShiftsToward: 'B', statement: "When judging a new technology, caring for nature should usually count more than making AI more capable." },
  { id: 71, pair: 72, axisId: 'teleological', horizon: 'T2', agreeShiftsToward: 'A', statement: "If a superintelligence pursued goals no human could understand, that could still be a good outcome." },
  { id: 72, pair: 71, axisId: 'teleological', horizon: 'T2', agreeShiftsToward: 'B', statement: "If a superintelligence pursued goals no human could understand, that would be a bad outcome, however impressive." },
]
