import { describe, it, expect } from 'vitest'
import { pdf } from '@react-pdf/renderer'
import { ReportDocument } from './pdfReport'
import { profiles } from '../data/profiles'
import { profileReports } from '../data/profileReports'
import { classify } from './scoring'
import type { AxisVector } from './scoring'

const sampleCombined: AxisVector = {
  teleological: -6, risk: 9, socioEconomic: -7, ontological: -2,
  legalMoral: -3, evolutionary: -8, relational: -4, geopolitical: -2,
}
const sampleT1: AxisVector = { ...sampleCombined }
const sampleT2: AxisVector = { ...sampleCombined }
const matches = classify(sampleCombined, profiles).slice(0, 3)

describe('ReportDocument', () => {
  it('renders a non-empty, correctly-typed PDF blob for a full sample result', async () => {
    const doc = (
      <ReportDocument
        combined={sampleCombined}
        t1Scaled={sampleT1}
        t2Scaled={sampleT2}
        topMatches={matches}
        profileReports={profileReports}
      />
    )
    const blob = await pdf(doc).toBlob()
    expect(blob.size).toBeGreaterThan(0)
    expect(blob.type).toBe('application/pdf')
  })
})
