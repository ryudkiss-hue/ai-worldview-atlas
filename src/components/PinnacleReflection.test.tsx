import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PinnacleReflection } from './PinnacleReflection'
import { fleschKincaidGrade } from '../lib/readability'
import { profiles } from '../data/profiles'

describe('PinnacleReflection', () => {
  it('renders the universal reflective prompt personalized with the archetype name', () => {
    render(<PinnacleReflection archetypeName="Extinction-Risk Advocate" />)
    expect(screen.getByText(/reactive/)).toBeInTheDocument()
    expect(screen.getByText(/proactive/)).toBeInTheDocument()
    expect(screen.getByText(/Extinction-Risk Advocate/)).toBeInTheDocument()
  })

  it('passes the 10th-grade readability gate', () => {
    render(<PinnacleReflection archetypeName="Extinction-Risk Advocate" />)
    const text = screen.getByTestId('pinnacle-text').textContent ?? ''
    expect(fleschKincaidGrade(text)).toBeLessThanOrEqual(10)
  })

  it('uses "a" before a consonant-sound name and "an" before a vowel-sound name', () => {
    render(<PinnacleReflection archetypeName="Extinction-Risk Advocate" />)
    expect(screen.getByTestId('pinnacle-text').textContent).toContain('as an Extinction-Risk Advocate')

    render(<PinnacleReflection archetypeName="Long-Term Future Planner" />)
    const nodes = screen.getAllByTestId('pinnacle-text')
    expect(nodes[nodes.length - 1].textContent).toContain('as a Long-Term Future Planner')
  })

  it('treats "Union" as a consonant sound ("you"), not a vowel', () => {
    render(<PinnacleReflection archetypeName="Union Bargaining Advocate" />)
    expect(screen.getByTestId('pinnacle-text').textContent).toContain('as a Union Bargaining Advocate')
  })

  it('picks a grammatically correct article for every real archetype name', () => {
    const vowelSoundNames = [
      'Extinction-Risk Advocate', 'Open-Source Libertarian', 'Anti-Corporate Hacker', 'AI Rights Advocate',
      'Alignment Researcher', 'AI Companionship Advocate', 'Open Science Internationalist', 'Anti-Monopoly Advocate',
      'Artist Rights Advocate', 'Insider Whistleblower', 'Indigenous Data Sovereignty Advocate',
      'Augment-Not-Replace Advocate', 'AI Guardianship Advocate', 'AI Welfare Researcher',
      'Arms-Control Verification Specialist', 'African-Language AI Advocate',
    ]
    profiles.forEach((p) => {
      render(<PinnacleReflection archetypeName={p.name} />)
      const expectedArticle = vowelSoundNames.includes(p.name) ? 'an' : 'a'
      const nodes = screen.getAllByTestId('pinnacle-text')
      const rendered = nodes[nodes.length - 1].textContent ?? ''
      expect(rendered, `${p.name} rendered: "${rendered}"`).toContain(`as ${expectedArticle} ${p.name}`)
    })
  })
})
