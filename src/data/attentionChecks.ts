import type { AxisId, Question } from './types'

/**
 * Two optional check statements, mixed in among the real ones. They are never scored. If someone answers one
 * differently from what it asks, the results page says so, and a validation study can set those responses aside.
 */
export interface AttentionCheck {
  id: number
  axisId: AxisId
  horizon: 'T1' | 'T2'
  statement: string
  /** The stored answer the statement asks for (1 strongly disagree, 2 disagree, 4 agree, 5 strongly agree) */
  expected: number
}

export const attentionChecks: AttentionCheck[] = [
  {
    id: 901,
    axisId: 'relational',
    horizon: 'T2',
    statement: 'This statement checks that answers are being read. Please choose "Disagree" for it.',
    expected: 2,
  },
  {
    id: 902,
    axisId: 'risk',
    horizon: 'T1',
    statement: 'This statement checks that answers are being read. Please choose "Strongly agree" for it.',
    expected: 5,
  },
]

export const isAttentionCheck = (id: number): boolean => attentionChecks.some((c) => c.id === id)

export const attentionCheckAsQuestion = (c: AttentionCheck): Question => ({
  id: c.id,
  pair: c.id,
  axisId: c.axisId,
  horizon: c.horizon,
  statement: c.statement,
  agreeShiftsToward: 'A',
})

/** Checks answered differently from what they ask. Unanswered checks are not counted: they are optional. */
export function failedAttentionChecks(checkAnswers: Record<number, number>): AttentionCheck[] {
  return attentionChecks.filter((c) => checkAnswers[c.id] !== undefined && checkAnswers[c.id] !== c.expected)
}
