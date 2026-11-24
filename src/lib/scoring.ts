import type { AxisId, Horizon, Question, Profile } from '../data/types'
import { axes } from '../data/axes'
import { questions as allQuestions } from '../data/questions'
import { axisSalience } from '../data/archetypeSalience'

/** Stored answers: 1 strongly disagree, 2 disagree, 4 agree, 5 strongly agree. "No settled view" is stored separately and counts as missing. */
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

/** How many statements per axis in a horizon were actually answered ("no settled view" and skipped ones are left out). */
export function answeredCounts(questions: Question[], answers: Answers, horizon: Horizon): AxisVector {
  const counts = {} as AxisVector
  axes.forEach((axis) => {
    counts[axis.id] = questions.filter((q) => q.axisId === axis.id && q.horizon === horizon && answers[q.id] !== undefined).length
  })
  return counts
}

/**
 * The number a raw total is divided by. With every statement answered it is the statement count. With some left as
 * "no settled view" it is the number answered, so those statements don't pull the score toward zero, but never less
 * than half the statements, so a single strong answer on an otherwise unanswered axis can't produce an extreme score.
 */
export function scoringBase(total: number, answered?: number): number {
  if (answered === undefined) return total
  return Math.max(answered, Math.ceil(total / 2))
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
 * Linear scaling to -10..+10: 10 x raw / (2 x base), where the base is the number of statements answered (see
 * scoringBase). Strongly agreeing with every pole-A statement and strongly disagreeing with every pole-B one gives +10.
 * Because every statement has a mirrored partner, agreeing (or disagreeing) with everything gives exactly 0. Without
 * answered counts (results saved before this change), every statement is assumed answered.
 */
export function scaleAxisScores(raw: AxisVector, horizon: Horizon, questions: Question[] = allQuestions, answered?: AxisVector): AxisVector {
  const counts = itemCounts(horizon, questions)
  const scaled = {} as AxisVector
  ;(Object.keys(raw) as AxisId[]).forEach((axisId) => {
    const base = scoringBase(counts[axisId], answered?.[axisId])
    scaled[axisId] = base ? (10 * raw[axisId]) / (2 * base) : 0
  })
  return scaled
}

/** Overall score per axis: the two horizons weighted by their scoring bases, i.e. the score over all answered statements. */
export function combineHorizons(
  t1: AxisVector,
  t2: AxisVector,
  questions: Question[] = allQuestions,
  answered1?: AxisVector,
  answered2?: AxisVector,
): AxisVector {
  const n1 = itemCounts('T1', questions)
  const n2 = itemCounts('T2', questions)
  const combined = {} as AxisVector
  ;(Object.keys(t1) as AxisId[]).forEach((axisId) => {
    const b1 = scoringBase(n1[axisId], answered1?.[axisId])
    const b2 = scoringBase(n2[axisId], answered2?.[axisId])
    const total = b1 + b2
    combined[axisId] = total ? (t1[axisId] * b1 + t2[axisId] * b2) / total : 0
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
 * Ranks archetypes by distance. Each axis's squared gap counts in proportion to two weights multiplied together: the
 * reader's own weight for that axis (Less, Normal, More) and the archetype's (archetypeSalience.ts: double on the axes
 * that define it, a quarter on axes outside its concerns). The sum is normalised so that when every weight is 1 the
 * result is exactly the ordinary Euclidean distance, which keeps the close-call margin on the same scale.
 */
export function classify(combined: AxisVector, profiles: Profile[], weights?: AxisWeights): ProfileMatch[] {
  const ids = Object.keys(combined) as AxisId[]
  const w = (id: AxisId) => (weights ? weights[id] ?? 1 : 1)
  const withDistance = profiles.map((profile) => {
    let weighted = 0
    let totalWeight = 0
    ids.forEach((axisId) => {
      const k = w(axisId) * axisSalience(profile.id, axisId)
      const diff = combined[axisId] - profile.coords[axisId]
      weighted += k * diff * diff
      totalWeight += k
    })
    return { profile, distance: Math.sqrt((ids.length * weighted) / totalWeight) }
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
 * A close call is when the second-closest archetype is less than 0.4 points farther away than the closest.
 * Calibrated by simulation against measurement error (analysis/closecall_sim.py, synthetic answer sheets only): each
 * sheet was rescored many times on resampled statements, and below this gap the top match survived fewer than half of
 * the resamples. Rerun on 2026-11-19 after archetype axis weights were added to matching (it had been 0.3 with plain
 * distance); about 1 in 8 sheets near an archetype and 1 in 4 broad sheets fall under it.
 */
export const CLOSE_CALL_MARGIN = 0.4

/**
 * The same margin for the 48-statement short version. Its own simulation (closecall_sim.py --short) put the best
 * margin at 0.3, with almost the same error rate at 0.4 or 0.5, so it uses 0.4 like the full quiz. The short version's
 * scores are less precise, so its top match is less stable overall; the results page says so.
 */
export const CLOSE_CALL_MARGIN_SHORT = 0.4

export function isCloseCall(matches: ProfileMatch[], margin: number = CLOSE_CALL_MARGIN): boolean {
  if (matches.length < 2) return false
  return matches[1].distance - matches[0].distance < margin
}
