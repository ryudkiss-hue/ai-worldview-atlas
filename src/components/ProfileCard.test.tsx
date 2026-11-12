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
  it('shows how many axes are in agreement as the primary figure, instead of a percentage', () => {
    renderWithProvider(<ProfileCard match={match} rank={1} agreement={6} />)
    expect(screen.getByText('6 of 8 axes in agreement')).toBeInTheDocument()
    expect(screen.queryByText(/% match/)).not.toBeInTheDocument()
  })

  it('still shows the profile name, summary, and rank', () => {
    renderWithProvider(<ProfileCard match={match} rank={1} />)
    expect(screen.getByText(/Match #1/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Doomer' })).toBeInTheDocument()
  })

  it('shows the raw distance as a secondary detail', () => {
    renderWithProvider(<ProfileCard match={match} rank={1} />)
    expect(screen.getByText(/Distance.*3\.4[0-9]/)).toBeInTheDocument()
  })
})
