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
