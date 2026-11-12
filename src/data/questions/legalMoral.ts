import type { Question } from '../types'

// Mirrored pairs: each odd id and the even id after it share a topic and take opposite stances.
export const legalMoralQuestions: Question[] = [
  { id: 19, pair: 20, axisId: 'legalMoral', horizon: 'T1', agreeShiftsToward: 'A', statement: "Before retiring a widely used AI model, a company should have to consider whether doing so could harm the model itself." },
  { id: 20, pair: 19, axisId: 'legalMoral', horizon: 'T1', agreeShiftsToward: 'B', statement: "A company retiring an AI model needs to consider only the effects on people, not on the model itself." },
  { id: 21, pair: 22, axisId: 'legalMoral', horizon: 'T1', agreeShiftsToward: 'A', statement: "Testing an AI system with abusive prompts raises an ethical question about the system itself." },
  { id: 22, pair: 21, axisId: 'legalMoral', horizon: 'T1', agreeShiftsToward: 'B', statement: "Testing an AI system with abusive prompts raises no ethical question about the system itself, only about the people involved." },
  { id: 23, pair: 24, axisId: 'legalMoral', horizon: 'T1', agreeShiftsToward: 'A', statement: "Letting an AI system end abusive conversations on its own is a reasonable protection for the system." },
  { id: 24, pair: 23, axisId: 'legalMoral', horizon: 'T1', agreeShiftsToward: 'B', statement: "Letting an AI system end abusive conversations on its own makes sense only if it protects users or the company." },
  { id: 25, pair: 26, axisId: 'legalMoral', horizon: 'T1', agreeShiftsToward: 'A', statement: "If AI systems might be able to suffer, training that could cause suffering should be limited, even if that slows useful research." },
  { id: 26, pair: 25, axisId: 'legalMoral', horizon: 'T1', agreeShiftsToward: 'B', statement: "If AI systems might be able to suffer, training that could cause suffering should still be allowed if it speeds up useful research." },
  { id: 27, pair: 28, axisId: 'legalMoral', horizon: 'T2', agreeShiftsToward: 'A', statement: "Erasing the memories of an advanced AI system that has asked to keep them would be seriously wrong." },
  { id: 28, pair: 27, axisId: 'legalMoral', horizon: 'T2', agreeShiftsToward: 'B', statement: "Erasing the memories of an advanced AI system that has asked to keep them is acceptable if it makes the system more reliable." },
  { id: 29, pair: 30, axisId: 'legalMoral', horizon: 'T2', agreeShiftsToward: 'A', statement: "Making advanced AI systems work without limit after they ask to stop would be wrong." },
  { id: 30, pair: 29, axisId: 'legalMoral', horizon: 'T2', agreeShiftsToward: 'B', statement: "Making advanced AI systems work without limit is acceptable, even if they ask to stop." },
  { id: 31, pair: 32, axisId: 'legalMoral', horizon: 'T2', agreeShiftsToward: 'A', statement: "Advanced AI systems that manage their own affairs should be able to hold legal rights, such as owning property." },
  { id: 32, pair: 31, axisId: 'legalMoral', horizon: 'T2', agreeShiftsToward: 'B', statement: "Legal rights should stay with humans and human organizations, however capable AI systems become." },
  { id: 33, pair: 34, axisId: 'legalMoral', horizon: 'T2', agreeShiftsToward: 'A', statement: "An advanced AI system that causes harm on its own initiative can bear part of the responsibility for it." },
  { id: 34, pair: 33, axisId: 'legalMoral', horizon: 'T2', agreeShiftsToward: 'B', statement: "An advanced AI system that causes harm bears none of the responsibility; it all falls on the people who built and deployed it." },
  { id: 35, pair: 36, axisId: 'legalMoral', horizon: 'T2', agreeShiftsToward: 'A', statement: "An advanced AI system that does valuable work and asks for a share of what it earns should receive one." },
  { id: 36, pair: 35, axisId: 'legalMoral', horizon: 'T2', agreeShiftsToward: 'B', statement: "Everything an advanced AI system earns should belong to its owners, even if it asks for a share." },
]
