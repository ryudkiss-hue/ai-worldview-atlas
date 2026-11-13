import type { Question } from '../types'

// Mirrored pairs: each odd id and the even id after it share a topic and take opposite stances.
export const riskQuestions: Question[] = [
  { id: 91, pair: 92, axisId: 'risk', horizon: 'T1', agreeShiftsToward: 'A', statement: "Releasing a powerful new AI model should require approval from independent experts first." },
  { id: 92, pair: 91, axisId: 'risk', horizon: 'T1', agreeShiftsToward: 'B', statement: "Releasing a powerful new AI model should not require anyone's approval in advance." },
  { id: 93, pair: 94, axisId: 'risk', horizon: 'T1', agreeShiftsToward: 'A', statement: "Pausing the largest AI training runs to give safety research time is worth it, even if competitors keep going." },
  { id: 94, pair: 93, axisId: 'risk', horizon: 'T1', agreeShiftsToward: 'B', statement: "Pausing the largest AI training runs to give safety research time is not worth it if competitors keep going." },
  { id: 95, pair: 96, axisId: 'risk', horizon: 'T1', agreeShiftsToward: 'A', statement: "AI labs should accept less capable models in exchange for reasoning that outside researchers can check." },
  { id: 96, pair: 95, axisId: 'risk', horizon: 'T1', agreeShiftsToward: 'B', statement: "AI labs should not give up capability to keep their models' reasoning checkable by outside researchers." },
  { id: 97, pair: 98, axisId: 'risk', horizon: 'T1', agreeShiftsToward: 'A', statement: "When an AI system causes a serious accident, similar systems should be taken out of use until the cause is found." },
  { id: 98, pair: 97, axisId: 'risk', horizon: 'T1', agreeShiftsToward: 'B', statement: "When an AI system causes a serious accident, similar systems should stay in use while the cause is found." },
  { id: 99, pair: 100, axisId: 'risk', horizon: 'T2', agreeShiftsToward: 'A', statement: "Even a one-in-a-hundred chance that AI causes human extinction is worth decades of slower growth to avoid." },
  { id: 100, pair: 99, axisId: 'risk', horizon: 'T2', agreeShiftsToward: 'B', statement: "A one-in-a-hundred chance that AI causes human extinction is not worth decades of slower growth to avoid." },
  { id: 101, pair: 102, axisId: 'risk', horizon: 'T2', agreeShiftsToward: 'A', statement: "Superintelligent AI should not be built until it can be shown to be safe, even at the cost of the cures it might bring." },
  { id: 102, pair: 101, axisId: 'risk', horizon: 'T2', agreeShiftsToward: 'B', statement: "Superintelligent AI should be built before it can be shown to be safe, for the sake of the cures it might bring." },
  { id: 103, pair: 104, axisId: 'risk', horizon: 'T2', agreeShiftsToward: 'A', statement: "The danger of AI going badly matters more than the danger of slow progress leaving other problems unsolved." },
  { id: 104, pair: 103, axisId: 'risk', horizon: 'T2', agreeShiftsToward: 'B', statement: "The danger of slow progress leaving other problems unsolved matters more than the danger of AI going badly." },
  { id: 105, pair: 106, axisId: 'risk', horizon: 'T2', agreeShiftsToward: 'A', statement: "AI development should move slowly enough for laws and institutions to keep up." },
  { id: 106, pair: 105, axisId: 'risk', horizon: 'T2', agreeShiftsToward: 'B', statement: "AI development should move as fast as it can, and laws and institutions should adapt as they go." },
  { id: 107, pair: 108, axisId: 'risk', horizon: 'T2', agreeShiftsToward: 'A', statement: "AI systems more capable than humans should not be built until we know how to control them." },
  { id: 108, pair: 107, axisId: 'risk', horizon: 'T2', agreeShiftsToward: 'B', statement: "It is acceptable to build AI systems more capable than humans before we know how to control them." },
]
