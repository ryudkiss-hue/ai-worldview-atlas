import { describe, it, expect, beforeEach } from 'vitest'
import { getResultHistory, recordResult, clearResultHistory, type ResultHistoryEntry } from './resultHistory'
import { axes } from '../data/axes'
import type { AxisVector } from './scoring'

function flatVector(value: number): AxisVector {
  const vector = {} as AxisVector
  axes.forEach((axis) => {
    vector[axis.id] = value
  })
  return vector
}

function buildEntry(overrides: Partial<Omit<ResultHistoryEntry, 'timestamp'>> = {}): Omit<ResultHistoryEntry, 'timestamp'> {
  return {
    t1Raw: flatVector(3),
    t2Raw: flatVector(-3),
    topMatchId: 'doomer',
    topMatchName: 'Extinction-Risk Advocate',
    ...overrides,
  }
}

beforeEach(() => {
  localStorage.clear()
})

describe('resultHistory', () => {
  it('returns an empty array when nothing has been recorded', () => {
    expect(getResultHistory()).toEqual([])
  })

  it('persists a recorded result so it shows up in a later getResultHistory call', () => {
    recordResult(buildEntry(), 1000)
    const history = getResultHistory()
    expect(history).toHaveLength(1)
    expect(history[0]).toEqual({ ...buildEntry(), timestamp: 1000 })
  })

  it('returns the history as it was BEFORE the new entry, not including it', () => {
    recordResult(buildEntry({ topMatchId: 'doomer', topMatchName: 'Extinction-Risk Advocate' }), 1000)
    const priorHistory = recordResult(
      buildEntry({ t1Raw: flatVector(-4), topMatchId: 'eacc-maximalist', topMatchName: 'Full-Speed Builder' }),
      2000,
    )
    expect(priorHistory).toHaveLength(1)
    expect(priorHistory[0].topMatchId).toBe('doomer')
    expect(getResultHistory()).toHaveLength(2)
  })

  it('caps stored history at 20 entries, dropping the oldest first', () => {
    for (let i = 0; i < 25; i++) {
      recordResult(buildEntry({ t1Raw: flatVector(i), topMatchId: `profile-${i}` }), i)
    }
    const history = getResultHistory()
    expect(history).toHaveLength(20)
    expect(history[0].topMatchId).toBe('profile-5')
    expect(history[19].topMatchId).toBe('profile-24')
  })

  it('does not log the same result twice when the results page is reopened', () => {
    recordResult(buildEntry({ t1Raw: flatVector(1) }), 1000)
    recordResult(buildEntry({ t1Raw: flatVector(2) }), 2000)
    const prior = recordResult(buildEntry({ t1Raw: flatVector(2) }), 3000)
    expect(getResultHistory()).toHaveLength(2)
    expect(prior).toHaveLength(1)
    expect(prior[0].timestamp).toBe(1000)
  })

  it('clearResultHistory empties the stored history', () => {
    recordResult(buildEntry(), 1000)
    clearResultHistory()
    expect(getResultHistory()).toEqual([])
  })

  it('does not throw and returns an empty array if localStorage contains malformed JSON', () => {
    localStorage.setItem('atlas-result-history-v3', 'not valid json{{{')
    expect(getResultHistory()).toEqual([])
  })

  it('filters out malformed entries instead of throwing', () => {
    localStorage.setItem('atlas-result-history-v3', JSON.stringify([{ garbage: true }, { ...buildEntry(), timestamp: 500 }]))
    const history = getResultHistory()
    expect(history).toHaveLength(1)
    expect(history[0].timestamp).toBe(500)
  })
})
