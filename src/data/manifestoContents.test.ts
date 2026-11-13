import { describe, it, expect } from 'vitest'
import { manifestoContents } from './manifestoContents'
import { profiles } from './profiles'
import { AXIS_POSITIONS_MARKER, withAxisPositions } from '../lib/axisPositions'

describe('manifestos', () => {
  it('has one manifesto per archetype', () => {
    expect(Object.keys(manifestoContents).sort()).toEqual(profiles.map((p) => p.id).sort())
  })

  it('takes its axis positions from the live coordinates, through exactly one marker', () => {
    for (const p of profiles) {
      const text = manifestoContents[p.id]
      expect(text.split(AXIS_POSITIONS_MARKER).length - 1, p.id).toBe(1)
      const filled = withAxisPositions(text, p)
      expect(filled).not.toContain(AXIS_POSITIONS_MARKER)
      expect(filled).toContain('- **Ends of Intelligence**:')
    }
  })

  it('uses the merged axis names, with no leftover names from the earlier version', () => {
    for (const [id, text] of Object.entries(manifestoContents)) {
      for (const old of ['Teleological', 'Risk Profile', 'Socio-Economic', 'Legal & Moral', 'Managed Technocracy', 'Directed Cybernetic', 'Stagnation-Averse', '8-Axis']) {
        expect(text.includes(old), `${id} still says "${old}"`).toBe(false)
      }
    }
  })

  it('contains no invented "empirical" charts', () => {
    for (const [id, text] of Object.entries(manifestoContents)) {
      expect(text.includes('Empirical Data Charts'), id).toBe(false)
    }
  })
})
