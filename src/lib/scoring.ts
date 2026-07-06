import type { AxisId, Question, Profile } from '../data/types'
import { axes } from '../data/axes'

export type Answers = Record<number, number>

export type AxisVector = Record<AxisId, number>

function likertToSigned(value: number): number {
  return value - 3
}

export function computeRawAxisScores(
  questions: Question[],
  answers: Answers,
  horizon: 'T1' | 'T2',
): AxisVector {
  const raw = {} as AxisVector
  axes.forEach((axis) => {
    const axisQuestions = questions.filter((q) => q.axisId === axis.id && q.horizon === horizon)
    raw[axis.id] = axisQuestions.reduce((sum, q) => {
      const answer = answers[q.id]
      if (answer === undefined) return sum
      const signed = likertToSigned(answer)
      return sum + (q.agreeShiftsToward === 'B' ? -signed : signed)
    }, 0)
  })
  return raw
}

export function scaleAxisScores(raw: AxisVector): AxisVector {
  const scaled = {} as AxisVector
  ;(Object.keys(raw) as AxisId[]).forEach((axisId) => {
    scaled[axisId] = 10 * Math.tanh(raw[axisId] / 3.5)
  })
  return scaled
}

export function combineHorizons(t1: AxisVector, t2: AxisVector): AxisVector {
  const combined = {} as AxisVector
  ;(Object.keys(t1) as AxisId[]).forEach((axisId) => {
    combined[axisId] = (t1[axisId] + t2[axisId]) / 2
  })
  return combined
}

export interface ProfileMatch {
  profile: Profile
  distance: number
}

export function classify(combined: AxisVector, profiles: Profile[]): ProfileMatch[] {
  const withDistance = profiles.map((profile) => {
    const distance = Math.sqrt(
      (Object.keys(combined) as AxisId[]).reduce((sum, axisId) => {
        const diff = combined[axisId] - profile.coords[axisId]
        return sum + diff * diff
      }, 0),
    )
    return { profile, distance }
  })
  return withDistance.sort((a, b) => a.distance - b.distance)
}
