import { describe, it, expect } from 'vitest'
import {
  DISPLAY_ORDER,
  intimacyStatements,
  intimacyThemes,
  intimacyResearch,
  intimacySources,
  scoreIntimacy,
  describeLean,
  INTIMACY_DECLINED,
} from './intimacyModule'
import { questions } from './questions'

const all = (value: number) => Object.fromEntries(intimacyStatements.map((q) => [q.id, value]))

describe('synthetic intimacy module', () => {
  it('gives every theme one mirrored pair', () => {
    expect(intimacyStatements).toHaveLength(intimacyThemes.length * 2)
    intimacyThemes.forEach((theme) => {
      const items = intimacyStatements.filter((q) => q.theme === theme.id)
      expect(items.map((q) => q.leans).sort()).toEqual(['guarded', 'open'])
    })
  })

  it('never shares ids with the Atlas statements', () => {
    const atlasIds = new Set(questions.map((q) => q.id))
    intimacyStatements.forEach((q) => expect(atlasIds.has(q.id)).toBe(false))
  })

  it('shows every statement once and never puts partners side by side', () => {
    expect([...DISPLAY_ORDER].sort()).toEqual(intimacyStatements.map((q) => q.id).sort())
    const themeOf = new Map(intimacyStatements.map((q) => [q.id, q.theme]))
    for (let i = 1; i < DISPLAY_ORDER.length; i++) {
      expect(themeOf.get(DISPLAY_ORDER[i])).not.toBe(themeOf.get(DISPLAY_ORDER[i - 1]))
    }
  })

  it('scores agreeing with everything as exactly zero, and the extremes as ±10', () => {
    expect(scoreIntimacy(all(5)).overall).toBe(0)
    expect(scoreIntimacy(all(1)).overall).toBe(0)
    const open = Object.fromEntries(intimacyStatements.map((q) => [q.id, q.leans === 'open' ? 5 : 1]))
    const guarded = Object.fromEntries(intimacyStatements.map((q) => [q.id, q.leans === 'open' ? 1 : 5]))
    expect(scoreIntimacy(open).overall).toBe(10)
    expect(scoreIntimacy(guarded).overall).toBe(-10)
    intimacyThemes.forEach((t) => expect(scoreIntimacy(open).byTheme[t.id]).toBe(10))
  })

  it('counts no settled view as zero but as answered', () => {
    const s = scoreIntimacy(all(INTIMACY_DECLINED))
    expect(s.overall).toBe(0)
    expect(s.answered).toBe(intimacyStatements.length)
  })

  it('labels leans with the same ±2 middle band as the Atlas', () => {
    expect(describeLean(0)).toBe('Mixed or undecided')
    expect(describeLean(2)).toBe('Leaning open')
    expect(describeLean(-6)).toBe('Strongly guarded')
  })

  it('backs every research point with a listed source and reports both sides for every section', () => {
    const ids = new Set(intimacySources.map((s) => s.id))
    intimacyResearch.forEach((section) => {
      expect(section.benefits.length).toBeGreaterThan(0)
      expect(section.concerns.length).toBeGreaterThan(0)
      ;[...section.benefits, ...section.concerns].forEach((point) => point.sources.forEach((id) => expect(ids.has(id)).toBe(true)))
    })
    intimacySources.forEach((s) => expect(s.url).toMatch(/^https:\/\//))
  })

  it('covers every theme in the research summary', () => {
    const covered = new Set(intimacyResearch.flatMap((s) => s.themes))
    intimacyThemes.forEach((t) => expect(covered.has(t.id)).toBe(true))
  })
})
