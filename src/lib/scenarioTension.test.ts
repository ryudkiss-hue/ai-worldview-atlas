import { describe, it, expect } from 'vitest'
import { detectTension } from './scenarioTension'
import type { AxisVector } from './scoring'

const zeroVector: AxisVector = {
  teleological: 0, risk: 0, socioEconomic: 0, ontological: 0,
  legalMoral: 0, evolutionary: 0, relational: 0, geopolitical: 0,
}

describe('detectTension', () => {
  it('flags an axis where the scenario pick disagrees with a clear (>=2 magnitude) computed score', () => {
    const combined = { ...zeroVector, teleological: 5 }
    const result = detectTension({ teleological: 'B' }, combined)
    expect(result).toEqual(['teleological'])
  })

  it('does not flag an axis where the scenario pick agrees with the computed score', () => {
    const combined = { ...zeroVector, teleological: 5 }
    const result = detectTension({ teleological: 'A' }, combined)
    expect(result).toEqual([])
  })

  it('does not flag an axis with a near-zero computed score, even if the scenario pick differs', () => {
    const combined = { ...zeroVector, teleological: 1 }
    const result = detectTension({ teleological: 'B' }, combined)
    expect(result).toEqual([])
  })

  it('handles multiple axes and an unanswered scenario axis', () => {
    const combined = { ...zeroVector, teleological: 5, risk: -5 }
    const result = detectTension({ teleological: 'B', risk: 'A' }, combined)
    expect(result.sort()).toEqual(['risk', 'teleological'])
  })
})
