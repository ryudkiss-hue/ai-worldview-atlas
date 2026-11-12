// Scoring for The Synthetic Compass (quiz version 3.6). Same rules as the standalone quiz:
// coordinates, 27 tier archetypes, archetype profile, facets, module sub-scales and tension diagnostics.
import { ARCHETYPES, BAND, FACETS, ITEMS, PROTO, STAGES, TIERS, type Axis, type Item, type Tier } from './data'

export type Answer = -2 | -1 | 1 | 2
export type Answers = Record<number, Answer>
export type Archetype = (typeof ARCHETYPES)[number]
export type DiagnosticId = 'recognition_paradox' | 'precautionary_humility' | 'disembodied_schism'

export interface CompassResult {
  S: Record<Axis, number>
  tiers: [Tier, Tier, Tier]
  archetype: Archetype
  profile: { archetype: Archetype; distance: number; percent: number }[]
  facets: Record<Axis, { name: string; value: number; items: number }[]>
  mixed: Axis[]
  closeCalls: Axis[]
  modules: number[]
  diagnostics: DiagnosticId[]
}

export const AXIS_KEYS: Axis[] = ['x', 'y', 'z']
const COL: Record<Axis, 1 | 2 | 3> = { x: 1, y: 2, z: 3 }
export const weight = (it: Item, a: Axis) => it[COL[a]]
export const primaryWeight = (it: Item) => (it[1] !== 0 ? it[1] : it[2] !== 0 ? it[2] : it[3])
const BY_ID = new Map(ITEMS.map((it) => [it[0], it]))

export const DEN: Record<Axis, number> = { x: 0, y: 0, z: 0 }
ITEMS.forEach((it) => AXIS_KEYS.forEach((a) => (DEN[a] += 2 * Math.abs(weight(it, a)))))
export const MODDEN = STAGES.map((s) =>
  ITEMS.filter((it) => it[4] === s.n).reduce((t, it) => t + 2 * Math.abs(primaryWeight(it)), 0),
)
const PROTO_DMAX = Math.sqrt(3 * (10 + PROTO) ** 2)

export const tierOf = (v: number): Tier => (v >= BAND ? 1 : v <= -BAND ? -1 : 0)
export const tierSymbol = (v: Tier) => (v > 0 ? '+' : v < 0 ? '−' : '0')
export const cellCode = (t: readonly Tier[]) => t.map((v, i) => 'XYZ'[i] + tierSymbol(v)).join(' ')
export const signed = (v: number) => (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(2)
export const tierInfo = (axis: Axis, t: Tier) => TIERS[axis][String(t) as '-1' | '0' | '1']
export const describeArchetype = (a: Archetype) => AXIS_KEYS.map((k, i) => tierInfo(k, a.tiers[i]).sentence).join(' ')
export const archetypeThinkers = (a: Archetype) => AXIS_KEYS.map((k, i) => tierInfo(k, a.tiers[i]).thinkers).join('; ')
export const findArchetype = (t: readonly Tier[]) =>
  ARCHETYPES.find((a) => a.tiers[0] === t[0] && a.tiers[1] === t[1] && a.tiers[2] === t[2])!

export const isComplete = (ans: Partial<Answers>) => ITEMS.every((it) => ans[it[0]] !== undefined)

export function scoreCompass(ans: Answers): CompassResult {
  if (!isComplete(ans)) throw new Error('scoreCompass needs an answer for all 120 statements')
  const raw: Record<Axis, number> = { x: 0, y: 0, z: 0 }
  const mod = STAGES.map(() => 0)
  ITEMS.forEach((it) => {
    const r = ans[it[0]]
    AXIS_KEYS.forEach((a) => (raw[a] += r * weight(it, a)))
    mod[it[4] - 1] += r * primaryWeight(it)
  })
  const S = { x: (10 * raw.x) / DEN.x, y: (10 * raw.y) / DEN.y, z: (10 * raw.z) / DEN.z }
  const modules = mod.map((v, i) => Math.round(50 + (50 * v) / MODDEN[i]))
  const tiers: [Tier, Tier, Tier] = [tierOf(S.x), tierOf(S.y), tierOf(S.z)]
  const archetype = findArchetype(tiers)
  const profile = ARCHETYPES.map((a) => {
    const distance = Math.sqrt((S.x - a.tiers[0] * PROTO) ** 2 + (S.y - a.tiers[1] * PROTO) ** 2 + (S.z - a.tiers[2] * PROTO) ** 2)
    return { archetype: a, distance, percent: Math.max(0, Math.round(100 * (1 - distance / PROTO_DMAX))) }
  }).sort((m, n) => m.distance - n.distance || Number(n.archetype === archetype) - Number(m.archetype === archetype))
  const facets = {} as CompassResult['facets']
  AXIS_KEYS.forEach((k) => {
    facets[k] = FACETS[k].map((f) => {
      let num = 0
      let den = 0
      f.ids.forEach((id) => {
        const w = weight(BY_ID.get(id)!, k)
        if (!w) return
        den += 2 * Math.abs(w)
        num += ans[id] * w
      })
      return { name: f.name, value: den ? (10 * num) / den : 0, items: f.ids.length }
    })
  })
  const mixed = AXIS_KEYS.filter((k) => facets[k].some((f) => f.value >= 2) && facets[k].some((f) => f.value <= -2))
  const closeCalls = AXIS_KEYS.filter((k) => Math.abs(Math.abs(S[k]) - BAND) < 1)
  const diagnostics: DiagnosticId[] = []
  if (S.x >= 3.5 && S.y <= -3.5) diagnostics.push('recognition_paradox')
  if (modules[0] < 45 && ans[49] >= 1 && ans[55] >= 1) diagnostics.push('precautionary_humility')
  if (
    [2, 10, 14].every((i) => ans[i] >= 1) && [1, 9, 13].every((i) => ans[i] <= -1) &&
    [26, 76, 80].every((i) => ans[i] >= 1) && [25, 75, 79].every((i) => ans[i] <= -1)
  )
    diagnostics.push('disembodied_schism')
  return { S, tiers, archetype, profile, facets, mixed, closeCalls, modules, diagnostics }
}

export const DIAGNOSTICS: Record<DiagnosticId, { name: string; text: (S: Record<Axis, number>) => string }> = {
  recognition_paradox: {
    name: 'The Recognition Paradox',
    text: (S) =>
      `Your answers suggest that advanced AI systems can have real experiences (X = ${signed(S.x)}), while also supporting memory erasure, compelled work and ownership (Y = ${signed(S.y)}). Recognizing an inner life while withholding the freedoms that usually follow from it is one of the hardest positions in ethics to reconcile.`,
  },
  precautionary_humility: {
    name: 'Precautionary Humility',
    text: () =>
      'While you remain scientifically skeptical that machines have real inner feelings today, you refuse to gamble with cruelty, supporting protections against abuse and suffering just in case.',
  },
  disembodied_schism: {
    name: 'The Disembodied Schism',
    text: () =>
      'You believe strongly in artificial minds, but you see their best future as purely digital, rejecting the idea that a mind needs a physical body or sensory grounding.',
  },
}

/** FNV-1a 64-bit over lines "id|text|x|y|z|stage", the same item-set hash the standalone quiz and its validation study use. */
export function itemSetHash(items: Item[] = ITEMS): string {
  const lines = items.map((it) => [it[0], it[5], String(it[1]), String(it[2]), String(it[3]), it[4]].join('|')).join('\n')
  let h = 0xcbf29ce484222325n
  const prime = 0x100000001b3n
  for (const byte of new TextEncoder().encode(lines)) {
    h ^= BigInt(byte)
    h = (h * prime) & 0xffffffffffffffffn
  }
  return h.toString(16).padStart(16, '0')
}
