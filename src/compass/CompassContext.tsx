import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ITEMS, STAGES, COMPASS_VERSION } from './data'
import type { Answer, Answers } from './engine'

// Answers and statement order are saved only in this browser, under a key tied to the item set,
// so a future change to the statements can't mix with answers given to the old wording.
export const COMPASS_STORAGE_KEY = 'atlas.compass.cc009f76830473a3'

interface Saved {
  v: string
  answers: Partial<Answers>
  order: Record<number, number[]>
}

function shuffled(ids: number[]): number[] {
  const a = ids.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function freshOrder(): Record<number, number[]> {
  const order: Record<number, number[]> = {}
  STAGES.forEach((s) => (order[s.n] = shuffled(ITEMS.filter((it) => it[4] === s.n).map((it) => it[0]))))
  return order
}

function validOrder(order: unknown): order is Record<number, number[]> {
  if (!order || typeof order !== 'object') return false
  return STAGES.every((s) => {
    const ids = (order as Record<number, number[]>)[s.n]
    const want = ITEMS.filter((it) => it[4] === s.n).map((it) => it[0]).sort((p, q) => p - q)
    return Array.isArray(ids) && ids.length === want.length && ids.slice().sort((p, q) => p - q).every((v, i) => v === want[i])
  })
}

function load(): Saved {
  try {
    const raw = localStorage.getItem(COMPASS_STORAGE_KEY)
    if (raw) {
      const s = JSON.parse(raw)
      if (s && validOrder(s.order) && s.answers && typeof s.answers === 'object') return { v: COMPASS_VERSION, answers: s.answers, order: s.order }
    }
  } catch {
    // storage can be unavailable (private windows, blocked site data); the quiz still works for this visit
  }
  return { v: COMPASS_VERSION, answers: {}, order: freshOrder() }
}

interface CompassState {
  answers: Partial<Answers>
  order: Record<number, number[]>
  setAnswer: (id: number, value: Answer) => void
  reset: () => void
}

const Ctx = createContext<CompassState | null>(null)

export function CompassProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Saved>(load)
  useEffect(() => {
    try {
      localStorage.setItem(COMPASS_STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore: see load()
    }
  }, [state])
  const setAnswer = useCallback((id: number, value: Answer) => setState((s) => ({ ...s, answers: { ...s.answers, [id]: value } })), [])
  const reset = useCallback(() => setState({ v: COMPASS_VERSION, answers: {}, order: freshOrder() }), [])
  const value = useMemo(() => ({ answers: state.answers, order: state.order, setAnswer, reset }), [state, setAnswer, reset])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useCompass(): CompassState {
  const c = useContext(Ctx)
  if (!c) throw new Error('useCompass must be used inside CompassProvider')
  return c
}
