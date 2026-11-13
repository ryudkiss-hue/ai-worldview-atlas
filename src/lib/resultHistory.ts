import type { AxisVector } from './scoring'

export interface ResultHistoryEntry {
  timestamp: number
  t1Raw: AxisVector
  t2Raw: AxisVector
  topMatchId: string
  topMatchName: string
  /** Which version produced it; older entries have none and came from the full quiz */
  mode?: 'full' | 'short'
}

// v3: item set 3, the plain-language rewrite. Results from earlier wordings stay under their old keys, unread.
const STORAGE_KEY = 'atlas-result-history-v3'
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
  const history = readRaw()
  const last = history[history.length - 1]
  // Answers are saved between visits, so reopening the results page must not log the same result again.
  const sameResult =
    last &&
    (last.mode ?? 'full') === (entry.mode ?? 'full') &&
    JSON.stringify([last.t1Raw, last.t2Raw]) === JSON.stringify([entry.t1Raw, entry.t2Raw])
  if (sameResult) {
    return history.slice(0, -1)
  }
  const priorHistory = history
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
