export type AxisId =
  | 'teleological'
  | 'risk'
  | 'socioEconomic'
  | 'ontological'
  | 'legalMoral'
  | 'evolutionary'
  | 'relational'
  | 'geopolitical'

export interface Axis {
  id: AxisId
  number: number
  name: string
  /** The question the axis asks, in plain words */
  question: string
  poleA: string
  poleADesc: string
  poleB: string
  poleBDesc: string
}

export type Horizon = 'T1' | 'T2'

export interface Question {
  id: number
  /** id of the mirrored partner: same topic, opposite stance */
  pair: number
  axisId: AxisId
  horizon: Horizon
  statement: string
  simplifiedStatement?: string
  agreeShiftsToward: 'A' | 'B'
}

export interface Profile {
  id: string
  name: string
  coords: Record<AxisId, number>
  summary: string
}

export interface StakeholderTag {
  id: string
  name: string
  description: string
}

export interface Scenario {
  axisId: AxisId
  prompt: string
  optionA: string
  optionB: string
}

export interface Thinker {
  name: string
  bio: string
  connection: string
}

export interface ReadingItem {
  title: string
  author: string
  note: string
}

/** A real event, law, document or project where this view shows up, with where it comes from. */
export interface Landmark {
  name: string
  year: string
  what: string
  source: string
}

export interface ProfileExpansion {
  /** One more narrative paragraph, appended to extendedNarrative */
  moreNarrative: string
  /** Why this archetype sits where it does on each axis, in the reader's voice */
  axisReasons: Record<AxisId, string>
  /** The strongest objections to this view, each with the reply its holders give */
  objections: { objection: string; reply: string }[]
  landmarks: Landmark[]
  addedThinkers: Thinker[]
  addedReading: ReadingItem[]
}

export interface ProfileReportContent {
  axisReasons: Record<AxisId, string>
  objections: { objection: string; reply: string }[]
  landmarks: Landmark[]
  profileId: string
  extendedNarrative: string[]
  shadowSide: string
  thinkers: {
    name: string
    bio: string
    connection: string
  }[]
  furtherReading: {
    title: string
    author: string
    note: string
  }[]
  nextSteps: string[]
  reflectiveBreakdown: {
    mindAssumption: string
    laborAssumption: string
    connectionAssumption: string
  }
  commonlyConfusedWith: {
    profileId: string
    profileName: string
    distinction: string
  }
}
