import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LikertInput } from './LikertInput'
import { QuizProvider } from '../state/QuizContext'

function renderWithProvider(ui: React.ReactElement) {
  return render(<QuizProvider>{ui}</QuizProvider>)
}

describe('LikertInput', () => {
  it('renders four options with no neutral midpoint, and marks the selected one as checked', () => {
    renderWithProvider(<LikertInput questionId={1} value={4} onChange={() => {}} />)
    expect(screen.getByRole('radio', { name: 'Agree' }).getAttribute('aria-checked')).toBe('true')
    expect(screen.getByRole('radio', { name: 'Disagree' }).getAttribute('aria-checked')).toBe('false')
    expect(screen.getAllByRole('radio')).toHaveLength(4)
    expect(screen.queryByRole('radio', { name: 'Neutral' })).not.toBeInTheDocument()
  })

  it('calls onChange with the numeric value of the clicked option', () => {
    const onChange = vi.fn()
    renderWithProvider(<LikertInput questionId={1} value={undefined} onChange={onChange} />)
    fireEvent.click(screen.getByRole('radio', { name: 'Strongly Agree' }))
    expect(onChange).toHaveBeenCalledWith(5)
  })

  it('does not render a decline button when onDecline is not provided', () => {
    renderWithProvider(<LikertInput questionId={1} value={undefined} onChange={() => {}} />)
    expect(screen.queryByText(/no settled view/i)).not.toBeInTheDocument()
  })

  it('calls onDecline when the decline button is clicked, and shows no option as checked while declined', () => {
    const onDecline = vi.fn()
    renderWithProvider(<LikertInput questionId={1} value={4} declined onChange={() => {}} onDecline={onDecline} />)
    fireEvent.click(screen.getByText('I have no settled view on this (selected)'))
    expect(onDecline).toHaveBeenCalled()
    screen.getAllByRole('radio').forEach((r) => expect(r.getAttribute('aria-checked')).toBe('false'))
  })

  it('is one tab stop that arrow keys move through, named by its statement', () => {
    const onChange = vi.fn()
    render(
      <QuizProvider>
        <p id="s1">AI can feel.</p>
        <LikertInput questionId={1} value={2} onChange={onChange} labelledBy="s1" />
      </QuizProvider>,
    )
    const group = screen.getByRole('radiogroup', { name: 'AI can feel.' })
    expect(screen.getAllByRole('radio').filter((r) => r.tabIndex === 0)).toHaveLength(1)
    expect(screen.getByRole('radio', { name: 'Disagree' }).tabIndex).toBe(0)
    fireEvent.keyDown(group, { key: 'ArrowRight' })
    expect(onChange).toHaveBeenLastCalledWith(4)
    fireEvent.keyDown(group, { key: 'Home' })
    expect(onChange).toHaveBeenLastCalledWith(1)
  })
})

