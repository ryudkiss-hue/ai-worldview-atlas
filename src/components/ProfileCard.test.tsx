import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProfileCard } from './ProfileCard'
import type { ProfileMatch } from '../lib/scoring'

const match: ProfileMatch = {
  profile: {
    id: 'doomer',
    name: 'Doomer',
    summary: 'Believes advanced AI is likely to cause human extinction.',
    coords: { teleological: 0, risk: 0, socioEconomic: 0, ontological: 0, legalMoral: 0, evolutionary: 0, relational: 0, geopolitical: 0 },
  },
  distance: 3.456,
}

describe('ProfileCard', () => {
  it('shows the match-closeness percentage as the primary figure', () => {
    render(<ProfileCard match={match} rank={1} />)
    const maxDistance = Math.sqrt(8 * 20 ** 2)
    const expectedPercent = Math.round(100 * (1 - 3.456 / maxDistance))
    expect(screen.getByText(`${expectedPercent}% match`)).toBeInTheDocument()
  })

  it('still shows the profile name, summary, and rank', () => {
    render(<ProfileCard match={match} rank={1} />)
    expect(screen.getByText('Doomer')).toBeInTheDocument()
    expect(screen.getByText('Believes advanced AI is likely to cause human extinction.')).toBeInTheDocument()
    expect(screen.getByText('Match #1')).toBeInTheDocument()
  })

  it('shows the raw distance as a secondary detail', () => {
    render(<ProfileCard match={match} rank={1} />)
    expect(screen.getByText('Distance: 3.46')).toBeInTheDocument()
  })
})
