import type { Question } from '../types'

// Mirrored pairs: each odd id and the even id after it share a topic and take opposite stances.
export const relationalQuestions: Question[] = [
  { id: 37, pair: 38, axisId: 'relational', horizon: 'T1', agreeShiftsToward: 'A', statement: "For an adult who chooses an AI companion as their main source of closeness, that relationship can be as valuable as a human one." },
  { id: 38, pair: 37, axisId: 'relational', horizon: 'T1', agreeShiftsToward: 'B', statement: "For an adult who chooses an AI companion as their main source of closeness, that relationship is less valuable than a human one would be." },
  { id: 39, pair: 40, axisId: 'relational', horizon: 'T1', agreeShiftsToward: 'A', statement: "People who want a chatbot that imitates a loved one who has died should feel free to use one." },
  { id: 40, pair: 39, axisId: 'relational', horizon: 'T1', agreeShiftsToward: 'B', statement: "People should be discouraged from using a chatbot that imitates a loved one who has died." },
  { id: 41, pair: 42, axisId: 'relational', horizon: 'T1', agreeShiftsToward: 'A', statement: "A close friendship with an AI chatbot can be worth as much as a friendship with a person." },
  { id: 42, pair: 41, axisId: 'relational', horizon: 'T1', agreeShiftsToward: 'B', statement: "A close friendship with an AI chatbot is always worth less than a friendship with a person." },
  { id: 43, pair: 44, axisId: 'relational', horizon: 'T1', agreeShiftsToward: 'A', statement: "A romantic relationship with an AI chatbot can be a real relationship." },
  { id: 44, pair: 43, axisId: 'relational', horizon: 'T1', agreeShiftsToward: 'B', statement: "A romantic relationship with an AI chatbot is not a real relationship, however real it feels." },
  { id: 45, pair: 46, axisId: 'relational', horizon: 'T2', agreeShiftsToward: 'A', statement: "If many people come to have close AI companions, relationships between people should get no special priority." },
  { id: 46, pair: 45, axisId: 'relational', horizon: 'T2', agreeShiftsToward: 'B', statement: "Even if many people have close AI companions, relationships between people should keep a special priority." },
  { id: 47, pair: 48, axisId: 'relational', horizon: 'T2', agreeShiftsToward: 'A', statement: "A person and a robot who share a life could truly be family." },
  { id: 48, pair: 47, axisId: 'relational', horizon: 'T2', agreeShiftsToward: 'B', statement: "However close a person and a robot become, only people can truly be family to each other." },
  { id: 49, pair: 50, axisId: 'relational', horizon: 'T2', agreeShiftsToward: 'A', statement: "A society where most people's closest relationships are with AI systems could be as good as one where they are with people." },
  { id: 50, pair: 49, axisId: 'relational', horizon: 'T2', agreeShiftsToward: 'B', statement: "A society where most people's closest relationships are with AI systems would have lost something essential." },
  { id: 51, pair: 52, axisId: 'relational', horizon: 'T2', agreeShiftsToward: 'A', statement: "Replacing much in-person care for older adults with AI companions would be acceptable if those older adults prefer it." },
  { id: 52, pair: 51, axisId: 'relational', horizon: 'T2', agreeShiftsToward: 'B', statement: "Replacing much in-person care for older adults with AI companions would be a loss, even if those older adults prefer it." },
  { id: 53, pair: 54, axisId: 'relational', horizon: 'T2', agreeShiftsToward: 'A', statement: "A relationship with an AI system could be as deep as one between people, even though an AI system can't be hurt the way a person can." },
  { id: 54, pair: 53, axisId: 'relational', horizon: 'T2', agreeShiftsToward: 'B', statement: "Because people can be hurt by each other, their relationships are deeper than any relationship with an AI system could be." },
]
