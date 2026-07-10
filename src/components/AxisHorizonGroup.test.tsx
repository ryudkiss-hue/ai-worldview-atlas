import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AxisHorizonGroup } from './AxisHorizonGroup'
import type { Question } from '../data/types'
import { QuizProvider } from '../state/QuizContext'

const sampleQuestions: Question[] = [
  { id: 1, axisId: 'teleological', horizon: 'T1', agreeShiftsToward: 'A', statement: 'Sample statement one.' },
  { id: 2, axisId: 'teleological', horizon: 'T1', agreeShiftsToward: 'B', statement: 'Sample statement two.' },
]

function renderWithProvider(ui: React.ReactElement) {
  return render(<QuizProvider>{ui}</QuizProvider>)
}

describe('AxisHorizonGroup', () => {
  it('renders every question statement with its own Likert input', () => {
    renderWithProvider(<AxisHorizonGroup title="Right Now" questions={sampleQuestions} answers={{}} onAnswer={() => {}} />)
    expect(screen.getByText('Right Now')).toBeInTheDocument()
    expect(screen.getByText('Sample statement one.')).toBeInTheDocument()
    expect(screen.getByText('Sample statement two.')).toBeInTheDocument()
  })

  it('calls onAnswer with the question id and chosen value', () => {
    const onAnswer = vi.fn()
    renderWithProvider(<AxisHorizonGroup title="Right Now" questions={sampleQuestions} answers={{}} onAnswer={onAnswer} />)
    const radios = screen.getAllByRole('radio', { name: 'Agree' })
    fireEvent.click(radios[0])
    expect(onAnswer).toHaveBeenCalledWith(1, 4)
  })

  it('calls onDecline with the question id when its decline button is clicked', () => {
    const onDecline = vi.fn()
    renderWithProvider(
      <AxisHorizonGroup
        title="Right Now"
        questions={sampleQuestions}
        answers={{}}
        onAnswer={() => {}}
        onDecline={onDecline}
      />,
    )
    fireEvent.click(screen.getAllByText("I don't have a strong view on this")[0])
    expect(onDecline).toHaveBeenCalledWith(1)
  })

  it('marks a question as declined when its id is in declinedQuestions', () => {
    renderWithProvider(
      <AxisHorizonGroup
        title="Right Now"
        questions={sampleQuestions}
        answers={{}}
        declinedQuestions={[2]}
        onAnswer={() => {}}
        onDecline={() => {}}
      />,
    )
    expect(screen.getAllByText("I don't have a strong view on this (selected)")).toHaveLength(1)
  })
})
