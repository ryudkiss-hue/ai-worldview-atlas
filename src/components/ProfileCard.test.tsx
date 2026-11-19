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
    name: 'Extinction-Risk Advocate',
    summary: 'Believes advanced AI is likely to cause human extinction.',
    coords: { teleological: 0, risk: 0, socioEconomic: 0, ontological: 0, legalMoral: 0, evolutionary: 0, relational: 0, geopolitical: 0 },
  },
  distance: 3.456,
}

describe('ProfileCard', () => {
  it('leads with the average gap per axis, which follows the ranking, and shows same-side axes as a secondary figure', () => {
    renderWithProvider(<ProfileCard match={match} rank={1} agreement={6} />)
    expect(screen.getByText(`About ${(3.456 / Math.sqrt(8)).toFixed(1)} points apart per axis`)).toBeInTheDocument()
    expect(screen.getByText('Same side as you on 6 of 8 axes')).toBeInTheDocument()
    expect(screen.queryByText(/% match/)).not.toBeInTheDocument()
  })

  it('names the axes where you and the archetype are furthest apart', () => {
    const you = { teleological: 0, risk: 6, socioEconomic: 0, ontological: -3, legalMoral: 0, evolutionary: 0, relational: 0.5, geopolitical: 0 }
    renderWithProvider(<ProfileCard match={match} rank={1} combined={you} />)
    expect(screen.getByText(/Furthest apart on Speed and Safety \(you \+6\.0, this archetype 0\.0\) and Machine Experience \(you -3\.0/)).toBeInTheDocument()
  })

  it('still shows the profile name, summary, and rank', () => {
    renderWithProvider(<ProfileCard match={match} rank={1} />)
    expect(screen.getByText(/Match #1/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Extinction-Risk Advocate' })).toBeInTheDocument()
  })

  it('shows the raw distance as a secondary detail', () => {
    renderWithProvider(<ProfileCard match={match} rank={1} />)
    expect(screen.getByText(/Distance.*3\.4[0-9]/)).toBeInTheDocument()
  })
})
