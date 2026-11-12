import type { Question } from '../types'

// Mirrored pairs: each odd id and the even id after it share a topic and take opposite stances.
export const socioEconomicQuestions: Question[] = [
  { id: 109, pair: 110, axisId: 'socioEconomic', horizon: 'T1', agreeShiftsToward: 'A', statement: "Companies should release their AI models' files to the public by default." },
  { id: 110, pair: 109, axisId: 'socioEconomic', horizon: 'T1', agreeShiftsToward: 'B', statement: "Companies should keep their AI models' files private by default." },
  { id: 111, pair: 112, axisId: 'socioEconomic', horizon: 'T1', agreeShiftsToward: 'A', statement: "Large AI training projects should not have to be registered with the government." },
  { id: 112, pair: 111, axisId: 'socioEconomic', horizon: 'T1', agreeShiftsToward: 'B', statement: "Large AI training projects should have to be registered with the government." },
  { id: 113, pair: 114, axisId: 'socioEconomic', horizon: 'T1', agreeShiftsToward: 'A', statement: "Cloud companies should not have to verify who rents their largest computers." },
  { id: 114, pair: 113, axisId: 'socioEconomic', horizon: 'T1', agreeShiftsToward: 'B', statement: "Cloud companies should have to verify who rents their largest computers." },
  { id: 115, pair: 116, axisId: 'socioEconomic', horizon: 'T1', agreeShiftsToward: 'A', statement: "Anyone should be free to modify and share a released AI model without asking permission, even a highly capable one." },
  { id: 116, pair: 115, axisId: 'socioEconomic', horizon: 'T1', agreeShiftsToward: 'B', statement: "Modifying and sharing a highly capable AI model should require permission." },
  { id: 117, pair: 118, axisId: 'socioEconomic', horizon: 'T2', agreeShiftsToward: 'A', statement: "Powerful AI should be open to anyone with the hardware to run it, not controlled by a few institutions." },
  { id: 118, pair: 117, axisId: 'socioEconomic', horizon: 'T2', agreeShiftsToward: 'B', statement: "Powerful AI should be controlled by a few accountable institutions, not open to anyone with the hardware to run it." },
  { id: 119, pair: 120, axisId: 'socioEconomic', horizon: 'T2', agreeShiftsToward: 'A', statement: "No global agency should have the authority to approve or halt powerful AI systems." },
  { id: 120, pair: 119, axisId: 'socioEconomic', horizon: 'T2', agreeShiftsToward: 'B', statement: "A permanent global agency should have the authority to approve or halt powerful AI systems." },
  { id: 121, pair: 122, axisId: 'socioEconomic', horizon: 'T2', agreeShiftsToward: 'A', statement: "Access to large-scale computing should be left to the open market." },
  { id: 122, pair: 121, axisId: 'socioEconomic', horizon: 'T2', agreeShiftsToward: 'B', statement: "Access to large-scale computing should be overseen by government, like electricity or water." },
  { id: 123, pair: 124, axisId: 'socioEconomic', horizon: 'T2', agreeShiftsToward: 'A', statement: "AI models should stay openly available even if they make it somewhat easier to design dangerous weapons." },
  { id: 124, pair: 123, axisId: 'socioEconomic', horizon: 'T2', agreeShiftsToward: 'B', statement: "AI models that make it easier to design dangerous weapons should not be openly available." },
  { id: 125, pair: 126, axisId: 'socioEconomic', horizon: 'T2', agreeShiftsToward: 'A', statement: "The most advanced AI should be built by many independent groups rather than a few large firms." },
  { id: 126, pair: 125, axisId: 'socioEconomic', horizon: 'T2', agreeShiftsToward: 'B', statement: "The most advanced AI should be built by a few large, well-resourced firms rather than many independent groups." },
]
