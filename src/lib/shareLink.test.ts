import { describe, it, expect } from 'vitest'
import { encodeShareLink, decodeShareLink, type ShareableScores } from './shareLink'
import { axes } from '../data/axes'

function buildScores(t1Value: number, t2Value: number): ShareableScores {
  const t1Raw = {} as ShareableScores['t1Raw']
  const t2Raw = {} as ShareableScores['t2Raw']
  axes.forEach((axis) => {
    t1Raw[axis.id] = t1Value
    t2Raw[axis.id] = t2Value
  })
  return { t1Raw, t2Raw }
}

describe('shareLink', () => {
  it('round-trips scores through encode and decode', () => {
    const original = buildScores(3, -5)
    const encoded = encodeShareLink(original)
    const decoded = decodeShareLink(encoded)
    expect(decoded).toEqual(original)
  })

  it('returns null for garbage input instead of throwing', () => {
    expect(decodeShareLink('not-valid-base64!!!')).toBeNull()
  })

  it('returns null when the decoded scores have the wrong length', () => {
    expect(decodeShareLink(btoa(JSON.stringify({ v: 2, s: [1, 2, 3] })))).toBeNull()
  })

  it('returns null for a link from the earlier question set', () => {
    // Earlier links encoded a bare array of 16 raw scores from different statements.
    expect(decodeShareLink(btoa(JSON.stringify(Array.from({ length: 16 }, () => 1))))).toBeNull()
  })

  it('carries the short version and axis weights only when they differ from the defaults', () => {
    const plain = buildScores(1, 2)
    expect(JSON.parse(atob(encodeShareLink(plain)))).toEqual({ v: 2, s: expect.any(Array) })
    const weights = Object.fromEntries(axes.map((a, i) => [a.id, i === 0 ? 2 : i === 1 ? 0.5 : 1])) as ShareableScores['t1Raw']
    const decoded = decodeShareLink(encodeShareLink({ ...plain, mode: 'short', weights }))
    expect(decoded?.mode).toBe('short')
    expect(decoded?.weights).toEqual(weights)
    const equal = Object.fromEntries(axes.map((a) => [a.id, 1])) as ShareableScores['t1Raw']
    expect(JSON.parse(atob(encodeShareLink({ ...plain, weights: equal }))).w).toBeUndefined()
  })

  it('ignores weights that are not Less, Normal or More', () => {
    const decoded = decodeShareLink(btoa(JSON.stringify({ v: 2, s: Array(16).fill(0), w: Array(8).fill(7) })))
    expect(decoded).not.toBeNull()
    expect(decoded?.weights).toBeUndefined()
  })
})
