import type { AxisId, Horizon, Question, Profile } from '../data/types'
import { axes } from '../data/axes'
import { questions as allQuestions } from '../data/questions'

/** Stored answers: 1 strongly disagree, 2 disagree, 4 agree, 5 strongly agree. "No settled view" is stored separately and scores 0. */
export type Answers = Record<number, number>

export type AxisVector = Record<AxisId, number>

function likertToSigned(value: number): number {
  return value - 3
}

/** Sum of signed answers per axis for one horizon: +1/+2 toward pole A, -1/-2 toward pole B, unanswered or declined = 0. */
export function computeRawAxisScores(questions: Question[], answers: Answers, horizon: Horizon): AxisVector {
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

/** Number of statements per axis in a horizon (each can contribute at most 2 points either way). */
export function itemCounts(horizon: Horizon, questions: Question[] = allQuestions): AxisVector {
  const counts = {} as AxisVector
  axes.forEach((axis) => {
    counts[axis.id] = questions.filter((q) => q.axisId === axis.id && q.horizon === horizon).length
  })
  return counts
}

/**
 * Linear scaling to -10..+10: 10 x raw / (2 x number of statements). Strongly agreeing with every pole-A
 * statement and strongly disagreeing with every pole-B one gives +10. Because every statement has a mirrored
 * partner, agreeing (or disagreeing) with everything gives exactly 0.
 */
export function scaleAxisScores(raw: AxisVector, horizon: Horizon, questions: Question[] = allQuestions): AxisVector {
  const counts = itemCounts(horizon, questions)
  const scaled = {} as AxisVector
  ;(Object.keys(raw) as AxisId[]).forEach((axisId) => {
    scaled[axisId] = counts[axisId] ? (10 * raw[axisId]) / (2 * counts[axisId]) : 0
  })
  return scaled
}

/** Overall score per axis: the two horizons weighted by how many statements each has, i.e. the score over all of them. */
export function combineHorizons(t1: AxisVector, t2: AxisVector, questions: Question[] = allQuestions): AxisVector {
  const n1 = itemCounts('T1', questions)
  const n2 = itemCounts('T2', questions)
  const combined = {} as AxisVector
  ;(Object.keys(t1) as AxisId[]).forEach((axisId) => {
    const total = n1[axisId] + n2[axisId]
    combined[axisId] = total ? (t1[axisId] * n1[axisId] + t2[axisId] * n2[axisId]) / total : 0
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

/** Tier boundary: a score of +2 or more leans toward pole A, -2 or less toward pole B, anything between is middle. */
export const TIER_BAND = 2
export type Tier = -1 | 0 | 1
export const tierOf = (v: number): Tier => (v >= TIER_BAND ? 1 : v <= -TIER_BAND ? -1 : 0)

/**
 * How many of the eight axes put you in the same tier (pole A, middle, pole B) as an archetype. Shown instead of a
 * percentage, which made distant archetypes look like strong matches.
 */
export function axesInAgreement(combined: AxisVector, profile: Profile): number {
  return axes.filter((a) => tierOf(combined[a.id]) === tierOf(profile.coords[a.id])).length
}

/**
 * A close call is when the second-closest archetype is less than 0.8 points farther away than the closest.
 * Calibrated by simulation (synthetic respondents placed near each archetype's coordinates), where about a quarter
 * of results fell under this margin.
 */
export const CLOSE_CALL_MARGIN = 0.8

export function isCloseCall(matches: ProfileMatch[]): boolean {
  if (matches.length < 2) return false
  return matches[1].distance - matches[0].distance < CLOSE_CALL_MARGIN
}
