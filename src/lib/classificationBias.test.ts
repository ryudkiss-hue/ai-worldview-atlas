import { describe, it, expect } from 'vitest'
import { questions } from '../data/questions'
import { profiles } from '../data/profiles'
import { computeRawAxisScores, scaleAxisScores, combineHorizons, classify } from './scoring'

function randomAnswers(): Record<number, number> {
  const answers: Record<number, number> = {}
  questions.forEach((q) => {
    answers[q.id] = 1 + Math.floor(Math.random() * 5)
  })
  return answers
}

describe('classification structural bias audit', () => {
  it('does not let any non-centrist profile dominate under random answers', () => {
    const wins: Record<string, number> = {}
    const trials = 500
    for (let i = 0; i < trials; i++) {
      const answers = randomAnswers()
      const t1 = scaleAxisScores(computeRawAxisScores(questions, answers, 'T1'))
      const t2 = scaleAxisScores(computeRawAxisScores(questions, answers, 'T2'))
      const combined = combineHorizons(t1, t2)
      const winner = classify(combined, profiles)[0].profile.id
      wins[winner] = (wins[winner] ?? 0) + 1
    }

    const nonCentristWins = Object.entries(wins).filter(([id]) => id !== 'pragmatic-centrist')
    nonCentristWins.forEach(([id, count]) => {
      const share = count / trials
      expect(share, `${id} won ${count}/${trials} (${(share * 100).toFixed(1)}%) of random trials`).toBeLessThan(0.15)
    })

    expect(wins['pragmatic-centrist'] ?? 0, 'pragmatic-centrist should be among the most common winners under pure randomness').toBeGreaterThan(0)
  })
})
