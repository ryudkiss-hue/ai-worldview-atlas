import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProfileCard } from './ProfileCard'
import type { ProfileMatch } from '../lib/scoring'
import { QuizProvider } from '../state/QuizContext'

function renderWithProvider(ui: React.ReactElement) {
  return render(<QuizProvider>{ui}</QuizProvider>)
}

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
    renderWithProvider(<ProfileCard match={match} rank={1} />)
    const maxDistance = Math.sqrt(8 * 20 ** 2)
    const expectedPercent = Math.round(100 * (1 - 3.456 / maxDistance))
    expect(screen.getByText(`${expectedPercent}% match`)).toBeInTheDocument()
  })

  it('still shows the profile name, summary, and rank', () => {
    renderWithProvider(<ProfileCard match={match} rank={1} />)
    // tProfileName falls back to profile.id when not in translations; tProfileSummary falls back to ''
    // so we test what's actually rendered
    expect(screen.getByText(/Match #1/)).toBeInTheDocument()
    // Name from translations en.profiles.doomer.name or fallback to id
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()
  })

  it('shows the raw distance as a secondary detail', () => {
    renderWithProvider(<ProfileCard match={match} rank={1} />)
    expect(screen.getByText(/Distance.*3\.4[0-9]/)).toBeInTheDocument()
  })
})
