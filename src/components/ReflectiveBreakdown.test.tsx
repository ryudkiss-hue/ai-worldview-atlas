import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ReflectiveBreakdown } from './ReflectiveBreakdown'
import { profileReports } from '../data/profileReports'
import type { AxisVector } from '../lib/scoring'

const zeroVector: AxisVector = {
  teleological: 0, risk: 0, socioEconomic: 0, ontological: 0,
  legalMoral: 0, evolutionary: 0, relational: 0, geopolitical: 0,
}

describe('ReflectiveBreakdown', () => {
  const content = profileReports['doomer']

  it('renders all three assumption fields', () => {
    render(<ReflectiveBreakdown content={content} scenarioAnswers={{}} combined={zeroVector} />)
    expect(screen.getByText(content.reflectiveBreakdown.mindAssumption)).toBeInTheDocument()
    expect(screen.getByText(content.reflectiveBreakdown.laborAssumption)).toBeInTheDocument()
    expect(screen.getByText(content.reflectiveBreakdown.connectionAssumption)).toBeInTheDocument()
  })

  it('renders a tension paragraph when detectTension finds a mismatch', () => {
    const combined = { ...zeroVector, teleological: 5 }
    render(<ReflectiveBreakdown content={content} scenarioAnswers={{ teleological: 'B' }} combined={combined} />)
    expect(screen.getByText(/sits in tension with your computed score/i)).toBeInTheDocument()
  })

  it('omits the tension paragraph when there is no tension', () => {
    const combined = { ...zeroVector, teleological: 5 }
    render(<ReflectiveBreakdown content={content} scenarioAnswers={{ teleological: 'A' }} combined={combined} />)
    expect(screen.queryByText(/sits in tension with your computed score/i)).not.toBeInTheDocument()
  })
})
