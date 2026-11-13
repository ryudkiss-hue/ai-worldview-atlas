import { describe, it, expect } from 'vitest'
import { axisPositionsMarkdown, biggestGaps, describePosition } from './axisPositions'
import { profiles } from '../data/profiles'

const zero = { teleological: 0, risk: 0, socioEconomic: 0, ontological: 0, legalMoral: 0, evolutionary: 0, relational: 0, geopolitical: 0 }

describe('axis positions', () => {
  it('describes a position in words, using the same bands as the rest of the results', () => {
    expect(describePosition('risk', 9)).toBe('+9, toward Precautionary')
    expect(describePosition('risk', -2)).toBe('-2, toward Accelerationist')
    expect(describePosition('risk', 1.5)).toBe('+1.5, in the middle')
  })

  it('lists all eight axes for an archetype', () => {
    const doomer = profiles.find((p) => p.id === 'doomer')!
    const md = axisPositionsMarkdown(doomer)
    expect(md.split('\n').filter((l) => l.startsWith('- **'))).toHaveLength(8)
    expect(md).toContain('- **Risk**: +9, toward Precautionary')
  })

  it('finds the axes with the biggest gaps, largest first, ignoring small ones', () => {
    expect(biggestGaps({ ...zero, risk: 8, ontological: -3 }, zero, 3, 1)).toEqual(['risk', 'ontological'])
  })
})
