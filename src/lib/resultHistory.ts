import type { AxisVector } from './scoring'

export interface ResultHistoryEntry {
  timestamp: number
  t1Raw: AxisVector
  t2Raw: AxisVector
  topMatchId: string
  topMatchName: string
}

const STORAGE_KEY = 'tiam-result-history'
const MAX_ENTRIES = 20

function readRaw(): ResultHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (entry): entry is ResultHistoryEntry =>
        entry &&
        typeof entry.timestamp === 'number' &&
        typeof entry.topMatchId === 'string' &&
        typeof entry.topMatchName === 'string' &&
        typeof entry.t1Raw === 'object' &&
        typeof entry.t2Raw === 'object',
    )
  } catch {
    return []
  }
}

export function getResultHistory(): ResultHistoryEntry[] {
  return readRaw()
}

/**
 * Persists a new result and returns whatever history existed *before* this
 * call, so callers can compare the just-recorded result against the prior
 * one without a second read.
 */
export function recordResult(entry: Omit<ResultHistoryEntry, 'timestamp'>, timestamp: number): ResultHistoryEntry[] {
  const priorHistory = readRaw()
  const updated = [...priorHistory, { ...entry, timestamp }].slice(-MAX_ENTRIES)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {
    // localStorage unavailable (private browsing, storage quota, etc.) — skip persistence silently.
  }
  return priorHistory
}

export function clearResultHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
