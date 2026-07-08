import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LikertInput } from './LikertInput'

describe('LikertInput', () => {
  it('renders all 5 options and marks the selected one as checked', () => {
    render(<LikertInput questionId={1} value={4} onChange={() => {}} />)
    expect(screen.getByRole('radio', { name: 'Agree' }).getAttribute('aria-checked')).toBe('true')
    expect(screen.getByRole('radio', { name: 'Disagree' }).getAttribute('aria-checked')).toBe('false')
  })

  it('calls onChange with the numeric value of the clicked option', () => {
    const onChange = vi.fn()
    render(<LikertInput questionId={1} value={undefined} onChange={onChange} />)
    fireEvent.click(screen.getByRole('radio', { name: 'Strongly Agree' }))
    expect(onChange).toHaveBeenCalledWith(5)
  })

  it('does not render a decline button when onDecline is not provided', () => {
    render(<LikertInput questionId={1} value={undefined} onChange={() => {}} />)
    expect(screen.queryByText(/no strong view/i)).not.toBeInTheDocument()
  })

  it('calls onDecline when the decline button is clicked, and shows no option as checked while declined', () => {
    const onDecline = vi.fn()
    render(<LikertInput questionId={1} value={3} declined onChange={() => {}} onDecline={onDecline} />)
    fireEvent.click(screen.getByText("I don't have a strong view on this (selected)"))
    expect(onDecline).toHaveBeenCalled()
    expect(screen.getByRole('radio', { name: 'Neutral' }).getAttribute('aria-checked')).toBe('false')
  })
})
