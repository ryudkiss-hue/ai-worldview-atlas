import { describe, it, expect } from 'vitest'
import { CORE_ARCHETYPES, coreArchetype, coreTiers, describeCore, Y_POSITIVE_FOR_DOUBTERS } from './coreThree'

const zero = { teleological: 0, risk: 0, socioEconomic: 0, ontological: 0, legalMoral: 0, evolutionary: 0, relational: 0, geopolitical: 0 }

describe('core-three reading', () => {
  it('has 27 archetypes, one for every combination of tiers', () => {
    expect(new Set(CORE_ARCHETYPES.map((a) => a.tiers.join(','))).size).toBe(27)
    expect(new Set(CORE_ARCHETYPES.map((a) => a.name)).size).toBe(27)
  })

  it('reads Mind as X, Moral Standing as Y, and Ends of Intelligence in reverse as Z', () => {
    expect(coreTiers({ ...zero, ontological: 5, legalMoral: -3, teleological: 6 })).toEqual([1, -1, -1])
    expect(coreArchetype({ ...zero, ontological: 5, legalMoral: -3, teleological: 6 }).name).toBe('The Promethean Instrumentalist')
    expect(coreArchetype({ ...zero, ontological: 5, legalMoral: 5, teleological: -6 }).name).toBe('The Embodied Pluralist')
    expect(coreArchetype(zero).name).toBe('The Open Questioner')
  })

  it('ignores the other five axes', () => {
    expect(coreArchetype({ ...zero, risk: 9, geopolitical: -9, relational: 9 }).name).toBe('The Open Questioner')
  })

  it('does not tell a machine-mind doubter that AI systems show minds of their own', () => {
    const a = coreArchetype({ ...zero, ontological: -6, legalMoral: 6 })
    expect(describeCore(a)).toContain(Y_POSITIVE_FOR_DOUBTERS)
    expect(describeCore(a)).not.toMatch(/show minds of their own/)
  })
})
