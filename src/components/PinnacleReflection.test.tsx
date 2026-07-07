import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PinnacleReflection } from './PinnacleReflection'
import { fleschKincaidGrade } from '../lib/readability'

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
})
