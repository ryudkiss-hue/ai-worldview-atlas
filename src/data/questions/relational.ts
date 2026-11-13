import type { Question } from '../types'

// Mirrored pairs: each odd id and the even id after it share a topic and take opposite stances.
export const relationalQuestions: Question[] = [
  { id: 37, pair: 38, axisId: 'relational', horizon: 'T1', agreeShiftsToward: 'A', statement: "For an adult who chooses an AI companion as their main source of closeness, that relationship can be as valuable as a human one." },
  { id: 38, pair: 37, axisId: 'relational', horizon: 'T1', agreeShiftsToward: 'B', statement: "For an adult who chooses an AI companion as their main source of closeness, that relationship is less valuable than a human one would be." },
  { id: 39, pair: 40, axisId: 'relational', horizon: 'T1', agreeShiftsToward: 'A', statement: "People who want an AI that talks like a loved one who has died should feel free to use one." },
  { id: 40, pair: 39, axisId: 'relational', horizon: 'T1', agreeShiftsToward: 'B', statement: "People should be discouraged from using an AI that talks like a loved one who has died." },
  { id: 41, pair: 42, axisId: 'relational', horizon: 'T1', agreeShiftsToward: 'A', statement: "A close friendship with an AI system can be worth as much as a friendship with a person." },
  { id: 42, pair: 41, axisId: 'relational', horizon: 'T1', agreeShiftsToward: 'B', statement: "A close friendship with an AI system is always worth less than a friendship with a person." },
  { id: 43, pair: 44, axisId: 'relational', horizon: 'T1', agreeShiftsToward: 'A', statement: "A romantic relationship with an AI system can be a real relationship." },
  { id: 44, pair: 43, axisId: 'relational', horizon: 'T1', agreeShiftsToward: 'B', statement: "A romantic relationship with an AI system is not a real relationship, however real it feels." },
  { id: 45, pair: 46, axisId: 'relational', horizon: 'T2', agreeShiftsToward: 'A', statement: "In a future where many people have close AI companions, bonds between people should get no special priority." },
  { id: 46, pair: 45, axisId: 'relational', horizon: 'T2', agreeShiftsToward: 'B', statement: "Even in a future full of AI companions, bonds between people should keep a special priority." },
  { id: 47, pair: 48, axisId: 'relational', horizon: 'T2', agreeShiftsToward: 'A', statement: "A person and a robot who share a life and care for each other could truly be family." },
  { id: 48, pair: 47, axisId: 'relational', horizon: 'T2', agreeShiftsToward: 'B', statement: "However close a person and a robot become, only humans can truly be family to one another." },
  { id: 49, pair: 50, axisId: 'relational', horizon: 'T2', agreeShiftsToward: 'A', statement: "A society where most people's closest bonds are with AI systems could be as good as one where they are with people." },
  { id: 50, pair: 49, axisId: 'relational', horizon: 'T2', agreeShiftsToward: 'B', statement: "A society where most people's closest bonds are with AI systems would have lost something essential." },
  { id: 51, pair: 52, axisId: 'relational', horizon: 'T2', agreeShiftsToward: 'A', statement: "Replacing much face-to-face elder care with AI companions would be acceptable if the elderly people prefer it." },
  { id: 52, pair: 51, axisId: 'relational', horizon: 'T2', agreeShiftsToward: 'B', statement: "Replacing much face-to-face elder care with AI companions would be a loss, even if the elderly people prefer it." },
  { id: 53, pair: 54, axisId: 'relational', horizon: 'T2', agreeShiftsToward: 'A', statement: "A bond with an AI could be as deep as a bond between people, even though only people share a mortal body." },
  { id: 54, pair: 53, axisId: 'relational', horizon: 'T2', agreeShiftsToward: 'B', statement: "Because people share a mortal body, their bonds are deeper than any bond with an AI could be." },
]
