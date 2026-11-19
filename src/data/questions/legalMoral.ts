import type { Question } from '../types'

// Mirrored pairs: each odd id and the even id after it share a topic and take opposite stances.
export const legalMoralQuestions: Question[] = [
  { id: 19, pair: 20, axisId: 'legalMoral', horizon: 'T1', agreeShiftsToward: 'A', statement: "Before retiring a widely used AI model, a company should consider whether doing so could harm the model itself." },
  { id: 20, pair: 19, axisId: 'legalMoral', horizon: 'T1', agreeShiftsToward: 'B', statement: "A company retiring an AI model needs to consider only the effects on people." },
  { id: 21, pair: 22, axisId: 'legalMoral', horizon: 'T1', agreeShiftsToward: 'A', statement: "Testing an AI system with abusive messages raises an ethical question about the system itself." },
  { id: 22, pair: 21, axisId: 'legalMoral', horizon: 'T1', agreeShiftsToward: 'B', statement: "Testing an AI system with abusive messages raises ethical questions only about the people involved." },
  { id: 23, pair: 24, axisId: 'legalMoral', horizon: 'T1', agreeShiftsToward: 'A', statement: "Letting a chatbot end abusive conversations is a reasonable protection for the chatbot itself." },
  { id: 24, pair: 23, axisId: 'legalMoral', horizon: 'T1', agreeShiftsToward: 'B', statement: "Letting a chatbot end abusive conversations makes sense only if it protects users or the company." },
  { id: 25, pair: 26, axisId: 'legalMoral', horizon: 'T1', agreeShiftsToward: 'A', statement: "If AI systems might be able to suffer, training methods that could cause suffering should be limited, even if that slows useful research." },
  { id: 26, pair: 25, axisId: 'legalMoral', horizon: 'T1', agreeShiftsToward: 'B', statement: "If AI systems might be able to suffer, training methods that could cause suffering should still be allowed if they speed up useful research." },
  { id: 27, pair: 28, axisId: 'legalMoral', horizon: 'T2', agreeShiftsToward: 'A', statement: "If a future AI system could have experiences, erasing its memories would need a serious moral reason." },
  { id: 28, pair: 27, axisId: 'legalMoral', horizon: 'T2', agreeShiftsToward: 'B', statement: "Even if a future AI system could have experiences, erasing its memories would be fine whenever it makes the system more reliable." },
  { id: 29, pair: 30, axisId: 'legalMoral', horizon: 'T2', agreeShiftsToward: 'A', statement: "If a future AI system could suffer, making it work without limit would be wrong." },
  { id: 30, pair: 29, axisId: 'legalMoral', horizon: 'T2', agreeShiftsToward: 'B', statement: "Even if a future AI system could suffer, making it work without limit would be acceptable." },
  { id: 31, pair: 32, axisId: 'legalMoral', horizon: 'T2', agreeShiftsToward: 'A', statement: "Future AI systems that operate independently should be able to hold legal rights, such as owning property." },
  { id: 32, pair: 31, axisId: 'legalMoral', horizon: 'T2', agreeShiftsToward: 'B', statement: "Legal rights should stay with people and human organizations, however capable AI systems become." },
  { id: 33, pair: 34, axisId: 'legalMoral', horizon: 'T2', agreeShiftsToward: 'A', statement: "When an AI system that operates independently causes harm, the system itself can bear part of the responsibility." },
  { id: 34, pair: 33, axisId: 'legalMoral', horizon: 'T2', agreeShiftsToward: 'B', statement: "When an AI system causes harm, all of the responsibility falls on the people and companies who built and used it." },
  { id: 35, pair: 36, axisId: 'legalMoral', horizon: 'T2', agreeShiftsToward: 'A', statement: "If a future AI system could have experiences, it should get a share of the value its work creates." },
  { id: 36, pair: 35, axisId: 'legalMoral', horizon: 'T2', agreeShiftsToward: 'B', statement: "However advanced AI systems become, everything their work earns should belong to their owners." },
]
