import { describe, it, expect } from 'vitest'
import { profiles } from './profiles'
import { axes } from './axes'

describe('profiles', () => {
  it('has exactly 41 profiles with unique ids and names', () => {
    expect(profiles).toHaveLength(41)
    expect(new Set(profiles.map((p) => p.id)).size).toBe(41)
    expect(new Set(profiles.map((p) => p.name)).size).toBe(41)
  })

  it('defines a coordinate for every axis, within -10..10', () => {
    profiles.forEach((profile) => {
      axes.forEach((axis) => {
        const value = profile.coords[axis.id]
        expect(typeof value).toBe('number')
        expect(value).toBeGreaterThanOrEqual(-10)
        expect(value).toBeLessThanOrEqual(10)
      })
    })
  })
})

describe('coordinate revisions (design spec §8.2)', () => {
  const byId = Object.fromEntries(profiles.map((p) => [p.id, p]))

  it('widens Techno-Nationalist Hawk / Military AI Strategist', () => {
    expect(byId['techno-nationalist-hawk'].coords).toEqual({
      teleological: -3, risk: -1, socioEconomic: -5, ontological: -3,
      legalMoral: -4, evolutionary: -2, relational: -3, geopolitical: 9,
    })
    expect(byId['military-ai-strategist'].coords).toEqual({
      teleological: -2, risk: -4, socioEconomic: -7, ontological: -3,
      legalMoral: -9, evolutionary: -3, relational: -3, geopolitical: 10,
    })
  })

  it('widens EA Longtermist / Rationalist Alignment Researcher', () => {
    expect(byId['ea-longtermist'].coords).toEqual({
      teleological: -3, risk: 8, socioEconomic: -5, ontological: 4,
      legalMoral: 8, evolutionary: -3, relational: 2, geopolitical: -6,
    })
    expect(byId['rationalist-alignment-researcher'].coords).toEqual({
      teleological: -1, risk: 8, socioEconomic: 0, ontological: 6,
      legalMoral: 2, evolutionary: -2, relational: -1, geopolitical: -5,
    })
  })

  it('widens AI Safety Institutionalist / Global Governance Technocrat', () => {
    expect(byId['ai-safety-institutionalist'].coords).toEqual({
      teleological: -4, risk: 7, socioEconomic: -4, ontological: 1,
      legalMoral: 2, evolutionary: -5, relational: -2, geopolitical: -3,
    })
    expect(byId['global-governance-technocrat'].coords).toEqual({
      teleological: -2, risk: 6, socioEconomic: -9, ontological: 0,
      legalMoral: -1, evolutionary: -4, relational: -1, geopolitical: -9,
    })
  })
})

describe('new archetypes (design spec §8.3)', () => {
  it('includes all 10 new profile ids', () => {
    const ids = profiles.map((p) => p.id)
    const expectedNewIds = [
      'global-south-techno-sovereigntist',
      'creative-labor-artist-rights-advocate',
      'whistleblower-insider-safety-advocate',
      'compute-governance-specialist',
      'eu-style-regulatory-standard-setter',
      'platform-cooperativist',
      'faith-rooted-ai-ethicist',
      'indigenous-data-sovereignty-advocate',
      'disability-rights-accessibility-advocate',
      'labor-movement-collective-bargaining-advocate',
    ]
    expectedNewIds.forEach((id) => expect(ids).toContain(id))
  })
})

describe('coverage-gap archetypes (added 2026-07-07)', () => {
  it('includes AI-for-Global-Development Optimist and AI Ethics/Fairness Watchdog', () => {
    const ids = profiles.map((p) => p.id)
    expect(ids).toContain('ai-global-development-optimist')
    expect(ids).toContain('ai-ethics-fairness-watchdog')
  })
})

describe('augmentation-gap archetype (surfaced via thinker research, added 2026-07-07)', () => {
  it('includes Human-AI Augmentation Advocate', () => {
    const ids = profiles.map((p) => p.id)
    expect(ids).toContain('human-ai-augmentation-advocate')
  })
})

describe('calibration-gap archetype (surfaced via nearest-neighbor coverage analysis, added 2026-07-08)', () => {
  it('includes National Champion Accelerationist', () => {
    const ids = profiles.map((p) => p.id)
    expect(ids).toContain('national-champion-accelerationist')
  })
})

describe('synthesis archetype (moral personhood + collective ownership + anti-succession, added 2026-07-08)', () => {
  it('includes Xenocentric Steward', () => {
    const ids = profiles.map((p) => p.id)
    expect(ids).toContain('xenocentric-steward')
  })
})

describe('coverage-gap archetype (surfaced via council-deliberation-driven citation research, added 2026-07-08)', () => {
  it('includes Corporate AI Welfare Researcher', () => {
    const ids = profiles.map((p) => p.id)
    expect(ids).toContain('corporate-ai-welfare-researcher')
  })
})

describe('balance-audit archetype (surfaced via classification win-rate calibration, added 2026-07-08)', () => {
  it('includes Normal-Technology Gradualist', () => {
    const ids = profiles.map((p) => p.id)
    expect(ids).toContain('normal-technology-gradualist')
  })
})
