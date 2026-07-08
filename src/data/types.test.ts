import { describe, it, expect } from 'vitest'
import type { StakeholderTag, Scenario, ProfileReportContent } from './types'

describe('new type shapes compile and hold expected fields', () => {
  it('StakeholderTag has id, name, description', () => {
    const tag: StakeholderTag = { id: 'x', name: 'X', description: 'desc' }
    expect(tag.id).toBe('x')
  })

  it('Scenario has axisId, prompt, optionA, optionB', () => {
    const scenario: Scenario = { axisId: 'teleological', prompt: 'p', optionA: 'a', optionB: 'b' }
    expect(scenario.axisId).toBe('teleological')
  })

  it('ProfileReportContent has reflectiveBreakdown with three assumption fields and a commonlyConfusedWith field', () => {
    const content: ProfileReportContent = {
      profileId: 'doomer',
      extendedNarrative: ['p1', 'p2'],
      shadowSide: 's',
      thinkers: [{ name: 'N', bio: 'B', connection: 'C' }],
      furtherReading: [{ title: 'T', author: 'A', note: 'N' }],
      nextSteps: ['step'],
      reflectiveBreakdown: { mindAssumption: 'm', laborAssumption: 'l', connectionAssumption: 'c' },
      commonlyConfusedWith: { profileId: 'near-term-ai-ethicist', profileName: 'Near-Term AI Ethicist', distinction: 'd' },
    }
    expect(content.reflectiveBreakdown.mindAssumption).toBe('m')
    expect(content.commonlyConfusedWith.profileId).toBe('near-term-ai-ethicist')
  })
})
