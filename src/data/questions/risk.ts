import type { Question } from '../types'

// Mirrored pairs: each odd id and the even id after it share a topic and take opposite stances.
export const riskQuestions: Question[] = [
  { id: 91, pair: 92, axisId: 'risk', horizon: 'T1', agreeShiftsToward: 'A', statement: "Releasing a powerful new AI model should require approval from independent experts first." },
  { id: 92, pair: 91, axisId: 'risk', horizon: 'T1', agreeShiftsToward: 'B', statement: "Releasing a powerful new AI model should not require anyone's approval in advance." },
  { id: 93, pair: 94, axisId: 'risk', horizon: 'T1', agreeShiftsToward: 'A', statement: "Pausing the largest AI training projects until safety testing catches up is worth it, even if competitors keep going." },
  { id: 94, pair: 93, axisId: 'risk', horizon: 'T1', agreeShiftsToward: 'B', statement: "Pausing the largest AI training projects until safety testing catches up is not worth it if competitors keep going." },
  { id: 95, pair: 96, axisId: 'risk', horizon: 'T1', agreeShiftsToward: 'A', statement: "AI companies should test new chatbots for harm to mental health and to children before release, even if that delays them for months." },
  { id: 96, pair: 95, axisId: 'risk', horizon: 'T1', agreeShiftsToward: 'B', statement: "AI companies should release new chatbots without months of safety testing and fix problems as they appear." },
  { id: 97, pair: 98, axisId: 'risk', horizon: 'T1', agreeShiftsToward: 'A', statement: "When an AI system causes a serious accident, similar systems should be taken out of use until the cause is found." },
  { id: 98, pair: 97, axisId: 'risk', horizon: 'T1', agreeShiftsToward: 'B', statement: "When an AI system causes a serious accident, similar systems should stay in use while the cause is found." },
  { id: 99, pair: 100, axisId: 'risk', horizon: 'T2', agreeShiftsToward: 'A', statement: "Even a one-in-a-hundred chance that AI causes human extinction is worth decades of slower economic growth to avoid." },
  { id: 100, pair: 99, axisId: 'risk', horizon: 'T2', agreeShiftsToward: 'B', statement: "A one-in-a-hundred chance that AI causes human extinction is not worth decades of slower economic growth to avoid." },
  { id: 101, pair: 102, axisId: 'risk', horizon: 'T2', agreeShiftsToward: 'A', statement: "AI far more capable than people should not be built until it can be shown to be safe, even if that delays medical breakthroughs." },
  { id: 102, pair: 101, axisId: 'risk', horizon: 'T2', agreeShiftsToward: 'B', statement: "AI far more capable than people should be built before it can be shown to be safe, if it could speed up medical breakthroughs." },
  { id: 103, pair: 104, axisId: 'risk', horizon: 'T2', agreeShiftsToward: 'A', statement: "The danger of AI causing serious harm matters more than the danger of slow progress leaving other problems unsolved." },
  { id: 104, pair: 103, axisId: 'risk', horizon: 'T2', agreeShiftsToward: 'B', statement: "The danger of slow progress leaving other problems unsolved matters more than the danger of AI causing serious harm." },
  { id: 105, pair: 106, axisId: 'risk', horizon: 'T2', agreeShiftsToward: 'A', statement: "AI development should move slowly enough for laws and institutions to keep up." },
  { id: 106, pair: 105, axisId: 'risk', horizon: 'T2', agreeShiftsToward: 'B', statement: "AI development should move as fast as it can, and laws and institutions should adapt as they go." },
  { id: 107, pair: 108, axisId: 'risk', horizon: 'T2', agreeShiftsToward: 'A', statement: "AI systems more capable than people should not be built until we know how to keep them under control." },
  { id: 108, pair: 107, axisId: 'risk', horizon: 'T2', agreeShiftsToward: 'B', statement: "It is acceptable to build AI systems more capable than people before we know how to keep them under control." },
]
