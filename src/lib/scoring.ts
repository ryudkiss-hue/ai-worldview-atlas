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

/** How much an axis counts when matching archetypes: less, normal or more. Scores themselves never change. */
export const AXIS_WEIGHT_OPTIONS = [
  { value: 0.5, label: 'Less' },
  { value: 1, label: 'Normal' },
  { value: 2, label: 'More' },
] as const
export type AxisWeights = Record<AxisId, number>
export const EQUAL_WEIGHTS: AxisWeights = Object.fromEntries(axes.map((a) => [a.id, 1])) as AxisWeights
export const isEqualWeights = (w?: AxisWeights): boolean => !w || axes.every((a) => w[a.id] === 1)

/**
 * Ranks archetypes by distance. With weights, each axis's squared gap counts in proportion to its weight, normalised so
 * that equal weights give exactly the ordinary Euclidean distance (and the same scale for the close-call margin).
 */
export function classify(combined: AxisVector, profiles: Profile[], weights?: AxisWeights): ProfileMatch[] {
  const ids = Object.keys(combined) as AxisId[]
  const w = (id: AxisId) => (weights ? weights[id] ?? 1 : 1)
  const totalWeight = ids.reduce((s, id) => s + w(id), 0)
  const withDistance = profiles.map((profile) => {
    const weighted = ids.reduce((sum, axisId) => {
      const diff = combined[axisId] - profile.coords[axisId]
      return sum + w(axisId) * diff * diff
    }, 0)
    const distance = weights ? Math.sqrt((ids.length * weighted) / totalWeight) : Math.sqrt(weighted)
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
 * A close call is when the second-closest archetype is less than 0.3 points farther away than the closest.
 * Calibrated by simulation against measurement error (analysis/closecall_sim.py: synthetic answer sheets, never data about
 * people): each sheet was rescored many times on resampled statements, and below this gap the top match survived
 * fewer than half of the resamples. About 1 in 10 sheets near an archetype and 1 in 5 broad sheets fall under it.
 * To be rechecked against real responses in the validation study.
 */
export const CLOSE_CALL_MARGIN = 0.3

/**
 * The same calibration rerun for the 48-statement short version (analysis/closecall_sim.py --short, synthetic sheets
 * only). The simulation found the same 0.3 margin; it flags about 14% of sheets near an archetype and 20% of broad
 * sheets. The short version's scores are still less precise, so its top match is less stable overall; the results page
 * says so.
 */
export const CLOSE_CALL_MARGIN_SHORT = 0.3

export function isCloseCall(matches: ProfileMatch[], margin: number = CLOSE_CALL_MARGIN): boolean {
  if (matches.length < 2) return false
  return matches[1].distance - matches[0].distance < margin
}
