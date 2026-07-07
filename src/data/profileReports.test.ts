import { describe, it, expect } from 'vitest'
import { profileReports } from './profileReports'
import { profiles } from './profiles'

function checkShape(id: string) {
  const content = profileReports[id]
  expect(content, `missing profileReports entry for ${id}`).toBeDefined()
  expect(content.profileId).toBe(id)
  expect(content.extendedNarrative.length).toBeGreaterThanOrEqual(2)
  expect(content.thinkers.length).toBeGreaterThanOrEqual(2)
  expect(content.furtherReading.length).toBeGreaterThanOrEqual(2)
  expect(content.nextSteps.length).toBeGreaterThanOrEqual(2)
  expect(content.reflectiveBreakdown.mindAssumption.length).toBeGreaterThan(0)
  expect(content.reflectiveBreakdown.laborAssumption.length).toBeGreaterThan(0)
  expect(content.reflectiveBreakdown.connectionAssumption.length).toBeGreaterThan(0)
  expect(content.commonlyConfusedWith.profileId.length).toBeGreaterThan(0)
  expect(content.commonlyConfusedWith.profileId).not.toBe(id)
  expect(content.commonlyConfusedWith.profileName.length).toBeGreaterThan(0)
  expect(content.commonlyConfusedWith.distinction.length).toBeGreaterThan(0)
}

describe('profileReports (batch 1: Precautionary/Safety pt1)', () => {
  it('has complete entries for doomer, ai-safety-institutionalist, ea-longtermist, rationalist-alignment-researcher, global-governance-technocrat', () => {
    ['doomer', 'ai-safety-institutionalist', 'ea-longtermist', 'rationalist-alignment-researcher', 'global-governance-technocrat'].forEach(checkShape)
  })
})

describe('profileReports (batch 2: Precautionary/Safety pt2)', () => {
  it('has complete entries for near-term-ai-ethicist, neo-luddite-degrowth-advocate, whistleblower-insider-safety-advocate, compute-governance-specialist, eu-style-regulatory-standard-setter', () => {
    ['near-term-ai-ethicist', 'neo-luddite-degrowth-advocate', 'whistleblower-insider-safety-advocate', 'compute-governance-specialist', 'eu-style-regulatory-standard-setter'].forEach(checkShape)
  })
})

describe('profileReports (batch 3: Accelerationist/Techno-Optimist)', () => {
  it('has complete entries for all 7 accelerationist/techno-optimist profiles', () => {
    ['eacc-maximalist', 'open-source-libertarian', 'cyberpunk-anti-corporate-accelerationist', 'silicon-valley-techno-optimist', 'corporate-ai-pragmatist', 'post-humanist-transhumanist', 'cosmic-vitalist-mystic'].forEach(checkShape)
  })
})

describe('profileReports (batch 4: State-Power/Security + Anti-Concentration/Populist)', () => {
  it('has complete entries for all 7 profiles in this batch', () => {
    ['techno-nationalist-hawk', 'authoritarian-state-control-advocate', 'military-ai-strategist', 'open-science-internationalist', 'anti-monopoly-populist', 'pragmatic-centrist', 'platform-cooperativist'].forEach(checkShape)
  })
})

describe('profileReports (batch 5: Relational/Companionship)', () => {
  it('has complete entries for all 5 relational/companionship profiles', () => {
    ['companion-tech-romantic', 'affective-biocentrist', 'bio-conservative-traditionalist', 'digital-rights-advocate', 'faith-rooted-ai-ethicist'].forEach(checkShape)
  })
})

describe('profileReports (batch 6: Material/Labor Stakes + Sovereignty, final batch)', () => {
  it('has complete entries for all 5 profiles in this batch', () => {
    ['creative-labor-artist-rights-advocate', 'labor-movement-collective-bargaining-advocate', 'disability-rights-accessibility-advocate', 'global-south-techno-sovereigntist', 'indigenous-data-sovereignty-advocate'].forEach(checkShape)
  })
})

describe('profileReports (batch 7: coverage-gap archetypes, added 2026-07-07)', () => {
  it('has complete entries for ai-global-development-optimist and ai-ethics-fairness-watchdog', () => {
    ['ai-global-development-optimist', 'ai-ethics-fairness-watchdog'].forEach(checkShape)
  })
})

describe('profileReports completeness', () => {
  it('has exactly one entry per profile, for all 36 profiles, with no orphans', () => {
    const profileIds = profiles.map((p) => p.id)
    const reportIds = Object.keys(profileReports)
    expect(reportIds.sort()).toEqual(profileIds.sort())
  })

  it('every commonlyConfusedWith.profileId points at a real profile', () => {
    const profileIdSet = new Set(profiles.map((p) => p.id))
    Object.values(profileReports).forEach((content) => {
      expect(profileIdSet.has(content.commonlyConfusedWith.profileId), `${content.profileId}'s commonlyConfusedWith points at an unknown id`).toBe(true)
    })
  })
})
