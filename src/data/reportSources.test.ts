import { describe, expect, it } from 'vitest'
import { profileReports } from './profileReports'
import { readingLinks, landmarkLinks, thinkerLinks, SOURCES_CHECKED, formatCheckedDate } from './reportSources'

const reports = Object.values(profileReports)
const readingTitles = new Set(reports.flatMap((r) => r.furtherReading.map((x) => x.title)))
const landmarkNames = new Set(reports.flatMap((r) => r.landmarks.map((x) => x.name)))
const thinkerNames = new Set(reports.flatMap((r) => r.thinkers.map((x) => x.name)))

describe('report sources', () => {
  it('links every reading and every landmark', () => {
    expect([...readingTitles].filter((t) => !readingLinks[t])).toEqual([])
    expect([...landmarkNames].filter((n) => !landmarkLinks[n])).toEqual([])
  })

  it('has no links left over for sources the reports no longer cite', () => {
    expect(Object.keys(readingLinks).filter((t) => !readingTitles.has(t))).toEqual([])
    expect(Object.keys(landmarkLinks).filter((n) => !landmarkNames.has(n))).toEqual([])
    expect(Object.keys(thinkerLinks).filter((n) => !thinkerNames.has(n))).toEqual([])
  })

  it('uses only https links', () => {
    const all = [...Object.values(readingLinks), ...Object.values(landmarkLinks), ...Object.values(thinkerLinks)]
    expect(all.filter((u) => !/^https:\/\/[^\s]+$/.test(u))).toEqual([])
  })

  it('records the day the sources were checked', () => {
    expect(SOURCES_CHECKED).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(formatCheckedDate('2026-11-20')).toBe('November 20, 2026')
  })
})
