import type { Question } from './types'
import { questions } from './questions'

export type QuizMode = 'full' | 'short'

/**
 * The short version: three mirrored pairs per axis (one near-term, two long-run), 48 statements in all. These are the
 * pole-A ids; each brings its partner. Chosen as the pairs that state each axis's question most directly. Scores are
 * scaled to the statements shown, so a short result sits on the same -10..+10 scale, but with less precision.
 */
export const SHORT_PAIR_IDS = [7, 13, 15, 25, 27, 31, 41, 49, 53, 55, 67, 69, 79, 81, 85, 93, 101, 103, 109, 117, 121, 127, 137, 143]

const shortIds = new Set(SHORT_PAIR_IDS.flatMap((id) => [id, id + 1]))

export const shortQuestions: Question[] = questions.filter((q) => shortIds.has(q.id))

export const isInShortForm = (id: number): boolean => shortIds.has(id)

export function questionsForMode(mode: QuizMode): Question[] {
  return mode === 'short' ? shortQuestions : questions
}
