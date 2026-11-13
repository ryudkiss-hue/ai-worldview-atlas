import type { Question } from '../types'

// Mirrored pairs: each odd id and the even id after it share a topic and take opposite stances.
export const geopoliticalQuestions: Question[] = [
  { id: 127, pair: 128, axisId: 'geopolitical', horizon: 'T1', agreeShiftsToward: 'A', statement: "Limiting sales of advanced AI chips to rival countries is justified to protect national security." },
  { id: 128, pair: 127, axisId: 'geopolitical', horizon: 'T1', agreeShiftsToward: 'B', statement: "Limiting sales of advanced AI chips to rival countries is not justified, even to protect national security." },
  { id: 129, pair: 130, axisId: 'geopolitical', horizon: 'T1', agreeShiftsToward: 'A', statement: "Building chip factories at home is worth paying much more than importing chips would cost." },
  { id: 130, pair: 129, axisId: 'geopolitical', horizon: 'T1', agreeShiftsToward: 'B', statement: "Paying much more to build chip factories at home is not worth it when chips can be imported." },
  { id: 131, pair: 132, axisId: 'geopolitical', horizon: 'T1', agreeShiftsToward: 'A', statement: "Work on the most advanced AI should be kept secret, like military research." },
  { id: 132, pair: 131, axisId: 'geopolitical', horizon: 'T1', agreeShiftsToward: 'B', statement: "Work on the most advanced AI should be shared openly across borders, like science." },
  { id: 133, pair: 134, axisId: 'geopolitical', horizon: 'T1', agreeShiftsToward: 'A', statement: "Researchers from rival countries should be kept off a nation's most important AI projects." },
  { id: 134, pair: 133, axisId: 'geopolitical', horizon: 'T1', agreeShiftsToward: 'B', statement: "A nation's most important AI projects should welcome researchers from any country, rivals included." },
  { id: 135, pair: 136, axisId: 'geopolitical', horizon: 'T2', agreeShiftsToward: 'A', statement: "A country that builds superintelligent AI first would be right to use it to secure a lasting lead over rivals." },
  { id: 136, pair: 135, axisId: 'geopolitical', horizon: 'T2', agreeShiftsToward: 'B', statement: "A country that builds superintelligent AI first should share its benefits with all countries rather than seek a lasting lead." },
  { id: 137, pair: 138, axisId: 'geopolitical', horizon: 'T2', agreeShiftsToward: 'A', statement: "The most powerful AI systems should be under national control." },
  { id: 138, pair: 137, axisId: 'geopolitical', horizon: 'T2', agreeShiftsToward: 'B', statement: "The most powerful AI systems should be under joint international control." },
  { id: 139, pair: 140, axisId: 'geopolitical', horizon: 'T2', agreeShiftsToward: 'A', statement: "The country that builds the AI needed to mine other planets should have the strongest say over those resources." },
  { id: 140, pair: 139, axisId: 'geopolitical', horizon: 'T2', agreeShiftsToward: 'B', statement: "Resources from other planets should belong to all of humanity, whoever builds the AI to reach them." },
  { id: 141, pair: 142, axisId: 'geopolitical', horizon: 'T2', agreeShiftsToward: 'A', statement: "A country that relies entirely on other nations for its AI has given up something important." },
  { id: 142, pair: 141, axisId: 'geopolitical', horizon: 'T2', agreeShiftsToward: 'B', statement: "A country that relies on other nations for its AI has given up nothing important, if the arrangement works well." },
  { id: 143, pair: 144, axisId: 'geopolitical', horizon: 'T2', agreeShiftsToward: 'A', statement: "AI developers should put their own nation's interests first." },
  { id: 144, pair: 143, axisId: 'geopolitical', horizon: 'T2', agreeShiftsToward: 'B', statement: "AI developers should serve humanity as a whole, not any one nation." },
]
