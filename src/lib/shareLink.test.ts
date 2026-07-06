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

  it('returns null when the decoded array has the wrong length', () => {
    const shortArray = btoa(JSON.stringify([1, 2, 3]))
    expect(decodeShareLink(shortArray)).toBeNull()
  })
})
