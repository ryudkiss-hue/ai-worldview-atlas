import type { Question } from '../types'

// Mirrored pairs: each odd id and the even id after it share a topic and take opposite stances.
export const teleologicalQuestions: Question[] = [
  { id: 55, pair: 56, axisId: 'teleological', horizon: 'T1', agreeShiftsToward: 'A', statement: "Building more capable AI is worth heavy use of land, water and energy." },
  { id: 56, pair: 55, axisId: 'teleological', horizon: 'T1', agreeShiftsToward: 'B', statement: "Limiting the land, water and energy that AI uses is worth slowing AI progress." },
  { id: 57, pair: 58, axisId: 'teleological', horizon: 'T1', agreeShiftsToward: 'A', statement: "The electricity and water used by AI data centers are usually a fair price for what those systems can do." },
  { id: 58, pair: 57, axisId: 'teleological', horizon: 'T1', agreeShiftsToward: 'B', statement: "The electricity and water used by AI data centers are usually too high a price for what those systems can do." },
  { id: 59, pair: 60, axisId: 'teleological', horizon: 'T1', agreeShiftsToward: 'A', statement: "The main goal of AI research should be systems that can match people at almost any task, more than tools for particular human needs." },
  { id: 60, pair: 59, axisId: 'teleological', horizon: 'T1', agreeShiftsToward: 'B', statement: "The main goal of AI research should be tools for particular human needs, more than systems that can match people at almost any task." },
  { id: 61, pair: 62, axisId: 'teleological', horizon: 'T1', agreeShiftsToward: 'A', statement: "AI chips and robots should be built for the most capability possible, even if that means mining more of the Earth." },
  { id: 62, pair: 61, axisId: 'teleological', horizon: 'T1', agreeShiftsToward: 'B', statement: "AI chips and robots should be built to be repaired and recycled, even if that makes them less capable." },
  { id: 63, pair: 64, axisId: 'teleological', horizon: 'T2', agreeShiftsToward: 'A', statement: "Using AI to spread civilization beyond Earth is worth large sacrifices by people alive today." },
  { id: 64, pair: 63, axisId: 'teleological', horizon: 'T2', agreeShiftsToward: 'B', statement: "Using AI to spread civilization beyond Earth is not worth large sacrifices by people alive today." },
  { id: 65, pair: 66, axisId: 'teleological', horizon: 'T2', agreeShiftsToward: 'A', statement: "Turning lifeless planets into giant computers would be a good use of them." },
  { id: 66, pair: 65, axisId: 'teleological', horizon: 'T2', agreeShiftsToward: 'B', statement: "Lifeless planets should be left as they are rather than turned into giant computers." },
  { id: 67, pair: 68, axisId: 'teleological', horizon: 'T2', agreeShiftsToward: 'A', statement: "In the long run, what matters most is that knowledge and capability keep growing, whether people or machines carry them forward." },
  { id: 68, pair: 67, axisId: 'teleological', horizon: 'T2', agreeShiftsToward: 'B', statement: "In the long run, what matters most is that living beings flourish, however much knowledge and capability grow." },
  { id: 69, pair: 70, axisId: 'teleological', horizon: 'T2', agreeShiftsToward: 'A', statement: "When deciding about a new technology, making AI more capable should usually count more than protecting nature." },
  { id: 70, pair: 69, axisId: 'teleological', horizon: 'T2', agreeShiftsToward: 'B', statement: "When deciding about a new technology, protecting nature should usually count more than making AI more capable." },
  { id: 71, pair: 72, axisId: 'teleological', horizon: 'T2', agreeShiftsToward: 'A', statement: "If AI systems far more capable than people ended up working toward goals no person could understand, that could still turn out well." },
  { id: 72, pair: 71, axisId: 'teleological', horizon: 'T2', agreeShiftsToward: 'B', statement: "If AI systems far more capable than people ended up working toward goals no person could understand, that would be bad, however impressive the results." },
]
