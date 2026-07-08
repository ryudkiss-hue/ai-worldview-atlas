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
    topMatchName: 'Doomer',
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
    recordResult(buildEntry({ topMatchId: 'doomer', topMatchName: 'Doomer' }), 1000)
    const priorHistory = recordResult(buildEntry({ topMatchId: 'eacc-maximalist', topMatchName: 'e/acc Maximalist' }), 2000)
    expect(priorHistory).toHaveLength(1)
    expect(priorHistory[0].topMatchId).toBe('doomer')
    expect(getResultHistory()).toHaveLength(2)
  })

  it('caps stored history at 20 entries, dropping the oldest first', () => {
    for (let i = 0; i < 25; i++) {
      recordResult(buildEntry({ topMatchId: `profile-${i}` }), i)
    }
    const history = getResultHistory()
    expect(history).toHaveLength(20)
    expect(history[0].topMatchId).toBe('profile-5')
    expect(history[19].topMatchId).toBe('profile-24')
  })

  it('clearResultHistory empties the stored history', () => {
    recordResult(buildEntry(), 1000)
    clearResultHistory()
    expect(getResultHistory()).toEqual([])
  })

  it('does not throw and returns an empty array if localStorage contains malformed JSON', () => {
    localStorage.setItem('tiam-result-history', 'not valid json{{{')
    expect(getResultHistory()).toEqual([])
  })

  it('filters out malformed entries instead of throwing', () => {
    localStorage.setItem('tiam-result-history', JSON.stringify([{ garbage: true }, { ...buildEntry(), timestamp: 500 }]))
    const history = getResultHistory()
    expect(history).toHaveLength(1)
    expect(history[0].timestamp).toBe(500)
  })
})
