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
  poleA: string
  poleB: string
}

export type Horizon = 'T1' | 'T2'

export interface Question {
  id: number
  axisId: AxisId
  horizon: Horizon
  statement: string
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

export interface ProfileReportContent {
  profileId: string
  extendedNarrative: string[]
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
