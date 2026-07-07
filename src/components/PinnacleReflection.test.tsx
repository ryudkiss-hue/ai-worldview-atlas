import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PinnacleReflection } from './PinnacleReflection'
import { fleschKincaidGrade } from '../lib/readability'
import { profiles } from '../data/profiles'

describe('PinnacleReflection', () => {
  it('renders the universal reflective prompt personalized with the archetype name', () => {
    render(<PinnacleReflection archetypeName="Doomer" />)
    expect(screen.getByText(/reactive/)).toBeInTheDocument()
    expect(screen.getByText(/proactive/)).toBeInTheDocument()
    expect(screen.getByText(/Doomer/)).toBeInTheDocument()
  })

  it('passes the 10th-grade readability gate', () => {
    render(<PinnacleReflection archetypeName="Doomer" />)
    const text = screen.getByTestId('pinnacle-text').textContent ?? ''
    expect(fleschKincaidGrade(text)).toBeLessThanOrEqual(10)
  })

  it('uses "a" before a consonant-sound name and "an" before a vowel-sound name', () => {
    render(<PinnacleReflection archetypeName="Doomer" />)
    expect(screen.getByTestId('pinnacle-text').textContent).toContain('as a Doomer')

    render(<PinnacleReflection archetypeName="Effective Altruist Longtermist" />)
    const nodes = screen.getAllByTestId('pinnacle-text')
    expect(nodes[nodes.length - 1].textContent).toContain('as an Effective Altruist Longtermist')
  })

  it('treats "EU-" as a consonant sound ("you"), not a vowel', () => {
    render(<PinnacleReflection archetypeName="EU-Style Regulatory Standard-Setter" />)
    expect(screen.getByTestId('pinnacle-text').textContent).toContain('as a EU-Style Regulatory Standard-Setter')
  })

  it('picks a grammatically correct article for every real archetype name', () => {
    const vowelSoundNames = [
      'e/acc Maximalist', 'AI Safety Institutionalist', 'Effective Altruist Longtermist', 'Open-Source Libertarian',
      'Authoritarian State-Control Advocate', 'Affective Biocentrist', 'Open Science Internationalist',
      'Anti-Monopoly Populist', 'Indigenous Data Sovereignty Advocate',
      'AI-for-Global-Development Optimist', 'AI Ethics/Fairness Watchdog',
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
