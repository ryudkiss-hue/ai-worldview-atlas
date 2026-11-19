import { describe, it, expect } from 'vitest'
import { profileReports } from './profileReports'
import { profiles } from './profiles'
import { axes } from './axes'
import { tierOf } from '../lib/scoring'

function checkShape(id: string) {
  const content = profileReports[id]
  expect(content, `missing profileReports entry for ${id}`).toBeDefined()
  expect(content.profileId).toBe(id)
  expect(content.extendedNarrative.length).toBeGreaterThanOrEqual(2)
  expect(content.shadowSide.length).toBeGreaterThan(0)
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
  expect(Object.keys(content.axisReasons).sort()).toEqual(axes.map((a) => a.id).sort())
  Object.values(content.axisReasons).forEach((r) => expect(r.length).toBeGreaterThan(20))
  expect(content.objections.length).toBeGreaterThanOrEqual(2)
  content.objections.forEach((o) => expect(o.objection.length && o.reply.length).toBeGreaterThan(0))
  expect(content.landmarks.length).toBeGreaterThanOrEqual(3)
  content.landmarks.forEach((l) => expect(l.source.length && l.year.length && l.what.length).toBeGreaterThan(0))
  expect(content.extendedNarrative.length).toBeGreaterThanOrEqual(3)
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

describe('profileReports (batch 8: augmentation-gap archetype, added 2026-07-07)', () => {
  it('has a complete entry for human-ai-augmentation-advocate', () => {
    checkShape('human-ai-augmentation-advocate')
  })
})

describe('profileReports (batch 9: calibration-gap archetype, added 2026-07-08)', () => {
  it('has a complete entry for national-champion-accelerationist', () => {
    checkShape('national-champion-accelerationist')
  })
})

describe('profileReports (batch 10: synthesis archetype, added 2026-07-08)', () => {
  it('has a complete entry for xenocentric-steward', () => {
    checkShape('xenocentric-steward')
  })
})

describe('profileReports (batch 11: coverage-gap archetype, added 2026-07-08)', () => {
  it('has a complete entry for corporate-ai-welfare-researcher', () => {
    checkShape('corporate-ai-welfare-researcher')
  })
})

describe('profileReports (batch 12: balance-audit archetype, added 2026-07-08)', () => {
  it('has a complete entry for normal-technology-gradualist', () => {
    checkShape('normal-technology-gradualist')
  })
})

describe('profileReports (batch 13: cluster-balance research push, added 2026-07-08)', () => {
  it('has complete entries for all 9 new cluster-balance archetypes', () => {
    [
      'chip-sovereignty-enforcement-strategist',
      'ai-arms-control-verification-specialist',
      'domestic-security-ai-efficiency-advocate',
      'ghost-work-labor-advocate',
      'algorithmic-wage-discrimination-scholar',
      'ubi-redistributive-response-advocate',
      'algorithmic-colonialism-critic',
      'african-language-ai-sovereignty-advocate',
      'border-migration-surveillance-critic',
    ].forEach(checkShape)
  })
})

describe('profileReports completeness', () => {
  it('has exactly one entry per profile, for all 50 profiles, with no orphans', () => {
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

  it('every profile has a distinct, non-empty shadowSide (no copy-pasted trade-offs)', () => {
    const shadowSides = Object.values(profileReports).map((content) => content.shadowSide)
    shadowSides.forEach((s) => expect(s.length).toBeGreaterThan(20))
    expect(new Set(shadowSides).size).toBe(shadowSides.length)
  })
})

describe('expanded reports', () => {
  it('lists only people as thinkers, never organizations or descriptions', () => {
    const notPeople = /doctrine|publications|reports|tradition|model of|strategy documents|researchers$|analysts$|precedent|principles|initiatives|Institute|Union$|Review$|Podcast|Lab,/
    Object.values(profileReports).forEach((r) => r.thinkers.forEach((t) => expect(t.name, `${r.profileId}: ${t.name}`).not.toMatch(notPeople)))
  })

  it("describes each axis on the same side as the archetype's coordinate", () => {
    profiles.forEach((p) => {
      axes.forEach((a) => {
        const text = profileReports[p.id].axisReasons[a.id]
        const middle = /sits? (in|near) the middle/i.test(text)
        if (tierOf(p.coords[a.id]) === 0) expect(middle, `${p.id} ${a.id} should read as middle: ${text}`).toBe(true)
        else expect(middle, `${p.id} ${a.id} is ${p.coords[a.id]} but reads as middle`).toBe(false)
      })
    })
  })
})
