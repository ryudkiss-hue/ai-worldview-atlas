import type { Profile, Question } from '../data/types'

/**
 * Archetypes never answered the statements; they are points on the eight axes. This estimates the answer an archetype
 * would be expected to give from where it sits on the statement's axis: a statement that pulls toward pole A is one an
 * archetype well toward pole A would agree with, and one well toward pole B would disagree with.
 *
 * v = coordinate × direction (+1 if agreeing pulls toward pole A, −1 if toward pole B)
 *   v ≥ 6 strongly agree · v ≥ 2 agree · −2 < v < 2 no clear lean · v ≤ −2 disagree · v ≤ −6 strongly disagree
 * The ±2 band matches the tiers used everywhere else (TIER_BAND).
 */
export type Stance = 'strongly_agree' | 'agree' | 'no_lean' | 'disagree' | 'strongly_disagree'

export const STANCE_LABELS: Record<Stance, string> = {
  strongly_agree: 'Strongly agree',
  agree: 'Agree',
  no_lean: 'No clear lean',
  disagree: 'Disagree',
  strongly_disagree: 'Strongly disagree',
}

export function expectedStance(question: Question, profile: Profile): Stance {
  const v = profile.coords[question.axisId] * (question.agreeShiftsToward === 'A' ? 1 : -1)
  if (v >= 6) return 'strongly_agree'
  if (v >= 2) return 'agree'
  if (v <= -6) return 'strongly_disagree'
  if (v <= -2) return 'disagree'
  return 'no_lean'
}

/** Your stance from a stored answer (1, 2, 4, 5); undefined means unanswered or no settled view. */
export function answerStance(value: number | undefined): Stance | undefined {
  switch (value) {
    case 5:
      return 'strongly_agree'
    case 4:
      return 'agree'
    case 2:
      return 'disagree'
    case 1:
      return 'strongly_disagree'
    default:
      return undefined
  }
}

const sign = (s: Stance | undefined): number =>
  s === 'strongly_agree' || s === 'agree' ? 1 : s === 'strongly_disagree' || s === 'disagree' ? -1 : 0

/** True when you agree and the archetype is expected to disagree, or the reverse. Differences of strength don't count. */
export function isOpposite(yours: Stance | undefined, theirs: Stance): boolean {
  return sign(yours) * sign(theirs) === -1
}
