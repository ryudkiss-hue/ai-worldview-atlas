import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MethodologySection } from './MethodologySection'
import { fleschKincaidGrade } from '../lib/readability'

describe('MethodologySection', () => {
  it('is collapsed by default and expands on click', () => {
    render(<MethodologySection />)
    expect(screen.queryByText(/Pew-style/i)).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'How This Works' }))
    expect(screen.getByText(/strong view on just one or two axes/i)).toBeInTheDocument()
  })

  it('includes the honesty statement about validation and the false-equivalence caveat', () => {
    render(<MethodologySection />)
    fireEvent.click(screen.getByRole('button', { name: 'How This Works' }))
    expect(screen.getByText(/has not been through/i)).toBeInTheDocument()
    expect(screen.getByText(/equally common/i)).toBeInTheDocument()
    expect(screen.getByText(/none of your top matches feel quite right/i)).toBeInTheDocument()
  })

  it('every paragraph passes the 10th-grade readability gate', () => {
    render(<MethodologySection />)
    fireEvent.click(screen.getByRole('button', { name: 'How This Works' }))
    const paragraphs = screen.getAllByTestId('methodology-paragraph')
    paragraphs.forEach((p) => {
      const grade = fleschKincaidGrade(p.textContent ?? '')
      expect(grade, `"${p.textContent}" scored grade ${grade.toFixed(1)}`).toBeLessThanOrEqual(10)
    })
  })
})
