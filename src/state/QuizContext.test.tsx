import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QuizProvider, useQuiz } from './QuizContext'

function TestConsumer() {
  const { answers, setAnswer, reset } = useQuiz()
  return (
    <div>
      <span data-testid="answer-1">{answers[1] ?? 'unset'}</span>
      <button onClick={() => setAnswer(1, 4)}>answer</button>
      <button onClick={reset}>reset</button>
    </div>
  )
}

describe('QuizContext', () => {
  it('starts with no answers, records an answer, and resets', () => {
    render(
      <QuizProvider>
        <TestConsumer />
      </QuizProvider>,
    )
    expect(screen.getByTestId('answer-1').textContent).toBe('unset')
    fireEvent.click(screen.getByText('answer'))
    expect(screen.getByTestId('answer-1').textContent).toBe('4')
    fireEvent.click(screen.getByText('reset'))
    expect(screen.getByTestId('answer-1').textContent).toBe('unset')
  })

  it('throws if useQuiz is called outside a QuizProvider', () => {
    function Broken() {
      useQuiz()
      return null
    }
    expect(() => render(<Broken />)).toThrow('useQuiz must be used within a QuizProvider')
  })
})
