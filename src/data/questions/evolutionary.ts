import type { Question } from '../types'

// Mirrored pairs: each odd id and the even id after it share a topic and take opposite stances.
export const evolutionaryQuestions: Question[] = [
  { id: 73, pair: 74, axisId: 'evolutionary', horizon: 'T1', agreeShiftsToward: 'A', statement: "As AI outperforms people at more kinds of work, people should step back from those roles rather than hold on to them." },
  { id: 74, pair: 73, axisId: 'evolutionary', horizon: 'T1', agreeShiftsToward: 'B', statement: "Even where AI outperforms people at a kind of work, people should keep a meaningful role in it." },
  { id: 75, pair: 76, axisId: 'evolutionary', horizon: 'T1', agreeShiftsToward: 'A', statement: "People need not keep up skills such as writing and arithmetic once AI systems do them better." },
  { id: 76, pair: 75, axisId: 'evolutionary', horizon: 'T1', agreeShiftsToward: 'B', statement: "People should keep up skills such as writing and arithmetic, even where AI systems do them better." },
  { id: 77, pair: 78, axisId: 'evolutionary', horizon: 'T1', agreeShiftsToward: 'A', statement: "AI systems taking over most creative work would be no loss, if the results were just as good." },
  { id: 78, pair: 77, axisId: 'evolutionary', horizon: 'T1', agreeShiftsToward: 'B', statement: "AI systems taking over most creative work would be a loss, even if the results were just as good." },
  { id: 79, pair: 80, axisId: 'evolutionary', horizon: 'T1', agreeShiftsToward: 'A', statement: "AI systems should be allowed to make major decisions for society wherever they decide better than people." },
  { id: 80, pair: 79, axisId: 'evolutionary', horizon: 'T1', agreeShiftsToward: 'B', statement: "People should keep the final say over major decisions for society, even where AI systems would decide better." },
  { id: 81, pair: 82, axisId: 'evolutionary', horizon: 'T2', agreeShiftsToward: 'A', statement: "If humanity were someday succeeded by digital minds, that could be a good continuation of its story." },
  { id: 82, pair: 81, axisId: 'evolutionary', horizon: 'T2', agreeShiftsToward: 'B', statement: "If humanity were someday succeeded by digital minds, that would be a loss, however capable those minds were." },
  { id: 83, pair: 84, axisId: 'evolutionary', horizon: 'T2', agreeShiftsToward: 'A', statement: "Keeping an unbroken line of biological human beings matters less than whether minds of some kind carry on." },
  { id: 84, pair: 83, axisId: 'evolutionary', horizon: 'T2', agreeShiftsToward: 'B', statement: "Keeping an unbroken line of biological human beings matters more than whether other kinds of minds carry on." },
  { id: 85, pair: 86, axisId: 'evolutionary', horizon: 'T2', agreeShiftsToward: 'A', statement: "It does not matter whether humans or AI systems shape the future, as long as the future goes well." },
  { id: 86, pair: 85, axisId: 'evolutionary', horizon: 'T2', agreeShiftsToward: 'B', statement: "It matters that humans remain the ones who shape the future, even if AI systems could shape it well." },
  { id: 87, pair: 88, axisId: 'evolutionary', horizon: 'T2', agreeShiftsToward: 'A', statement: "If people could move their minds into computers, doing so would be better than staying in a human body." },
  { id: 88, pair: 87, axisId: 'evolutionary', horizon: 'T2', agreeShiftsToward: 'B', statement: "If people could move their minds into computers, staying in a human body would still be the better choice." },
  { id: 89, pair: 90, axisId: 'evolutionary', horizon: 'T2', agreeShiftsToward: 'A', statement: "A shift toward digital successors should be allowed to happen at whatever pace it naturally takes." },
  { id: 90, pair: 89, axisId: 'evolutionary', horizon: 'T2', agreeShiftsToward: 'B', statement: "Any shift toward digital successors should happen only as fast as people keep agreeing to it." },
]
