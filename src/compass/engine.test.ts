import { describe, it, expect } from 'vitest'
import { ARCHETYPES, ITEMS, ITEM_SET_HASH, PROTO, STAGES } from './data'
import { DEN, MODDEN, cellCode, itemSetHash, primaryWeight, scoreCompass, tierOf, type Answer, type Answers } from './engine'
import reference from './__fixtures__/engine_reference.json'
import ruleSheets from './__fixtures__/rule_sheets.json'

const LETTER: Record<string, Answer> = { a: -2, b: -1, c: 1, d: 2 }
const decode = (s: string): Answers => {
  const a: Answers = {}
  ;[...s].forEach((ch, i) => (a[i + 1] = LETTER[ch]))
  return a
}
const sheet = (f: (it: (typeof ITEMS)[number]) => Answer): Answers => {
  const a: Answers = {}
  ITEMS.forEach((it) => (a[it[0]] = f(it)))
  return a
}
const sg = (v: number) => (v > 0 ? 1 : -1)

describe('Synthetic Compass item set', () => {
  it('matches the validated item-set hash', () => {
    expect(itemSetHash()).toBe(ITEM_SET_HASH)
  })
  it('has 120 statements, 20 per stage, in mirrored pairs with opposite weights', () => {
    expect(ITEMS).toHaveLength(120)
    STAGES.forEach((s) => expect(ITEMS.filter((it) => it[4] === s.n)).toHaveLength(20))
    for (let i = 0; i < 120; i += 2) {
      const [p, q] = [ITEMS[i], ITEMS[i + 1]]
      expect([p[1] + q[1], p[2] + q[2], p[3] + q[3]]).toEqual([0, 0, 0])
      expect(p[4]).toBe(q[4])
    }
  })
  it('uses the expected denominators', () => {
    expect(DEN).toEqual({ x: 108, y: 234, z: 88 })
    expect(MODDEN.every((d) => d > 0)).toBe(true)
  })
  it('has 27 archetypes, one per tier combination', () => {
    expect(new Set(ARCHETYPES.map((a) => a.tiers.join(','))).size).toBe(27)
    expect(new Set(ARCHETYPES.map((a) => a.name)).size).toBe(27)
  })
})

describe('scoreCompass', () => {
  it('puts every uniform answer sheet at the center, as The Open Questioner', () => {
    for (const v of [-2, -1, 1, 2] as Answer[]) {
      const r = scoreCompass(sheet(() => v))
      expect([r.S.x, r.S.y, r.S.z]).toEqual([0, 0, 0])
      expect(r.archetype.name).toBe('The Open Questioner')
      expect(r.modules).toEqual([50, 50, 50, 50, 50, 50])
    }
  })

  it('refuses an incomplete answer sheet', () => {
    const a = sheet(() => 1)
    delete a[57]
    expect(() => scoreCompass(a)).toThrow()
  })

  it('reproduces the nine rule-built test sheets', () => {
    const rules: Record<string, (it: (typeof ITEMS)[number]) => Answer> = {
      'T1 all Agree': () => 1,
      'T2 all Strongly disagree': () => -2,
      'T3 positive pole': (it) => (primaryWeight(it) > 0 ? 2 : -2),
      'T4 negative pole': (it) => (primaryWeight(it) > 0 ? -2 : 2),
      'T5 cycle [SA,A,D,SD] by id mod 4': (it) => ([2, 1, -1, -2] as Answer[])[it[0] % 4],
      'T6 cycle [D,SA,SD,A] by id mod 4': (it) => ([-1, 2, -2, 1] as Answer[])[it[0] % 4],
      'T7 X toward +, everything else toward -': (it) => (it[1] ? sg(it[1]) * 2 : -sg(primaryWeight(it)) * 2) as Answer,
      'T8 Module 1 toward -, everything else toward +': (it) => (it[4] === 1 ? -sg(primaryWeight(it)) * 2 : sg(primaryWeight(it)) * 2) as Answer,
      'T9 X toward +, Z toward -, Y Agree': (it) => (it[1] ? sg(it[1]) * 2 : it[3] ? -sg(it[3]) * 2 : 1) as Answer,
    }
    const names: Record<string, string> = { slave: 'recognition_paradox', humility: 'precautionary_humility', schism: 'disembodied_schism' }
    const expected = ruleSheets.sheets as Record<string, { x: number; y: number; z: number; archetype: string; code: string; closest3: string[]; close_calls: string[]; modules: number[]; flags: string[] }>
    expect(Object.keys(expected)).toEqual(Object.keys(rules))
    for (const [k, f] of Object.entries(rules)) {
      const r = scoreCompass(sheet(f))
      const e = expected[k]
      expect([+r.S.x.toFixed(2), +r.S.y.toFixed(2), +r.S.z.toFixed(2)]).toEqual([e.x, e.y, e.z])
      expect(r.archetype.name).toBe(e.archetype)
      expect(cellCode(r.tiers).replace(/−/g, '-')).toBe(e.code)
      expect(r.profile.slice(0, 3).map((p) => `${p.archetype.name} ${p.percent}%`)).toEqual(e.closest3)
      expect(r.closeCalls.map((a) => a.toUpperCase())).toEqual(e.close_calls)
      expect(r.modules).toEqual(e.modules)
      expect(r.diagnostics).toEqual(e.flags.map((f) => names[f]))
    }
  })

  it('matches the standalone quiz engine on 300 reference sheets', () => {
    for (const e of reference.sheets) {
      const r = scoreCompass(decode(e.answers))
      expect([r.S.x, r.S.y, r.S.z].map((v) => +v.toFixed(10))).toEqual(e.S)
      expect(r.archetype.name).toBe(e.archetype)
      expect(r.profile.map((p) => p.archetype.name + p.percent)).toEqual(e.profile)
      expect(r.modules).toEqual(e.modules)
      expect(r.closeCalls).toEqual(e.closeCalls)
      expect(r.diagnostics).toEqual(e.diagnostics)
      expect(r.mixed).toEqual(e.mixed)
      expect((['x', 'y', 'z'] as const).map((k) => r.facets[k].map((f) => +f.value.toFixed(10)))).toEqual(e.facets)
    }
  })

  it('always ranks your own archetype closest, with the neighbor one tier step away', () => {
    for (const e of reference.sheets) {
      const r = scoreCompass(decode(e.answers))
      expect(r.profile[0].archetype).toBe(r.archetype)
      expect(r.tiers).toEqual([tierOf(r.S.x), tierOf(r.S.y), tierOf(r.S.z)])
      const diff = r.profile[1].archetype.tiers.map((t, i) => Math.abs(t - r.tiers[i]))
      expect(diff.reduce((s, d) => s + d, 0)).toBe(1)
      expect(r.profile[0].distance).toBeLessThanOrEqual(Math.sqrt(3) * PROTO)
    }
  })
})
