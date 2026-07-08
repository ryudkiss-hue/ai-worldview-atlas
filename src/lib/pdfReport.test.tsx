import { describe, it, expect } from 'vitest'
import { pdf } from '@react-pdf/renderer'
import { ReportDocument } from './pdfReport'
import { classify } from './scoring'
import type { AxisVector, ProfileMatch } from './scoring'
import type { Profile, ProfileReportContent } from '../data/types'

const zeroCoords = {
  teleological: 0, risk: 0, socioEconomic: 0, ontological: 0,
  legalMoral: 0, evolutionary: 0, relational: 0, geopolitical: 0,
}

// A small, self-contained fixture rather than the real (and ever-growing)
// production profiles/profileReports — this test exercises ReportDocument's
// own rendering logic, not the size of the real content set.
const fixtureProfiles: Profile[] = [
  { id: 'fixture-a', name: 'Fixture A', summary: 'Summary A.', coords: { ...zeroCoords, teleological: -6, risk: 9 } },
  { id: 'fixture-b', name: 'Fixture B', summary: 'Summary B.', coords: { ...zeroCoords, teleological: -3, risk: 5 } },
  { id: 'fixture-c', name: 'Fixture C', summary: 'Summary C.', coords: { ...zeroCoords, teleological: 3, risk: -5 } },
]

const fixtureReports: Record<string, ProfileReportContent> = Object.fromEntries(
  fixtureProfiles.map((p) => [
    p.id,
    {
      profileId: p.id,
      extendedNarrative: ['Paragraph one.', 'Paragraph two.'],
      shadowSide: 'Shadow side sentence.',
      thinkers: [{ name: 'Thinker One', bio: 'Bio one', connection: 'Connection one.' }],
      furtherReading: [{ title: 'Title One', author: 'Author One', note: 'Note one.' }],
      nextSteps: ['Step one.'],
      reflectiveBreakdown: { mindAssumption: 'm', laborAssumption: 'l', connectionAssumption: 'c' },
      commonlyConfusedWith: { profileId: p.id, profileName: p.name, distinction: 'd' },
    } satisfies ProfileReportContent,
  ]),
)

const sampleCombined: AxisVector = { ...zeroCoords, teleological: -6, risk: 9 }
const matches: ProfileMatch[] = classify(sampleCombined, fixtureProfiles).slice(0, 3)

describe('ReportDocument', () => {
  it('renders a non-empty, correctly-typed PDF blob for a sample result', async () => {
    const doc = (
      <ReportDocument
        combined={sampleCombined}
        t1Scaled={sampleCombined}
        t2Scaled={sampleCombined}
        topMatches={matches}
        profileReports={fixtureReports}
      />
    )
    const blob = await pdf(doc).toBlob()
    expect(blob.size).toBeGreaterThan(0)
    expect(blob.type).toBe('application/pdf')
  }, 15000) // @react-pdf/renderer's font/layout engine init is inherently variable
  // under heavy parallel-test CPU load, even for this minimal fixture
})
