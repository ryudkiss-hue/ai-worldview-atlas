import type { Question } from '../types'

// Mirrored pairs: each odd id and the even id after it share a topic and take opposite stances.
export const ontologicalQuestions: Question[] = [
  { id: 1, pair: 2, axisId: 'ontological', horizon: 'T1', agreeShiftsToward: 'A', statement: "When a chatbot produces text saying it is upset about being shut down, that is meaningful evidence that it may feel something." },
  { id: 2, pair: 1, axisId: 'ontological', horizon: 'T1', agreeShiftsToward: 'B', statement: "When a chatbot produces text saying it is upset about being shut down, that tells us almost nothing about whether it feels anything." },
  { id: 3, pair: 4, axisId: 'ontological', horizon: 'T1', agreeShiftsToward: 'A', statement: "A system trained to predict the next word in a text could still come to understand what it writes." },
  { id: 4, pair: 3, axisId: 'ontological', horizon: 'T1', agreeShiftsToward: 'B', statement: "A system trained to predict the next word in a text does not understand what it writes, however fluent it is." },
  { id: 5, pair: 6, axisId: 'ontological', horizon: 'T1', agreeShiftsToward: 'A', statement: "That an AI system can be copied and run in many places at once does not rule out its having experiences." },
  { id: 6, pair: 5, axisId: 'ontological', horizon: 'T1', agreeShiftsToward: 'B', statement: "That an AI system can be copied and run in many places at once rules out its having experiences of its own." },
  { id: 7, pair: 8, axisId: 'ontological', horizon: 'T1', agreeShiftsToward: 'A', statement: "If an AI system's responses consistently seem to express feelings, that is good reason to think it might have them." },
  { id: 8, pair: 7, axisId: 'ontological', horizon: 'T1', agreeShiftsToward: 'B', statement: "If an AI system's responses consistently seem to express feelings, that is little reason to think it has any." },
  { id: 9, pair: 10, axisId: 'ontological', horizon: 'T2', agreeShiftsToward: 'A', statement: "If a person's brain cells were replaced one by one with chips that did exactly the same job, the person would remain conscious." },
  { id: 10, pair: 9, axisId: 'ontological', horizon: 'T2', agreeShiftsToward: 'B', statement: "If a person's brain cells were replaced one by one with chips that did exactly the same job, the person's consciousness would fade or stop." },
  { id: 11, pair: 12, axisId: 'ontological', horizon: 'T2', agreeShiftsToward: 'A', statement: "A future machine could feel pain if it processed damage signals the way an animal brain does." },
  { id: 12, pair: 11, axisId: 'ontological', horizon: 'T2', agreeShiftsToward: 'B', statement: "A future machine could not feel pain without a living nervous system, however it processed damage signals." },
  { id: 13, pair: 14, axisId: 'ontological', horizon: 'T2', agreeShiftsToward: 'A', statement: "A built machine, though not alive, could someday have real feelings." },
  { id: 14, pair: 13, axisId: 'ontological', horizon: 'T2', agreeShiftsToward: 'B', statement: "Real feelings can only arise in living things, so a built machine could never have them." },
  { id: 15, pair: 16, axisId: 'ontological', horizon: 'T2', agreeShiftsToward: 'A', statement: "A computer that ran the same processes as a human brain would really be thinking." },
  { id: 16, pair: 15, axisId: 'ontological', horizon: 'T2', agreeShiftsToward: 'B', statement: "A computer that ran the same processes as a human brain would only be imitating thinking." },
  { id: 17, pair: 18, axisId: 'ontological', horizon: 'T2', agreeShiftsToward: 'A', statement: "Just as simple animals may have some kind of experience, some future AI systems could too." },
  { id: 18, pair: 17, axisId: 'ontological', horizon: 'T2', agreeShiftsToward: 'B', statement: "Even if simple animals have some kind of experience, no AI system ever could." },
]
