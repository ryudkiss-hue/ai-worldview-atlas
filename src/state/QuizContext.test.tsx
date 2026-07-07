import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QuizProvider, useQuiz } from './QuizContext'
import { axes } from '../data/axes'

function TestConsumer() {
  const { answers, setAnswer, reset, questionOrder, scenarioAnswers, setScenarioAnswer, selectedStakeholderTags, setStakeholderTags } = useQuiz()
  return (
    <div>
      <span data-testid="answer-1">{answers[1] ?? 'unset'}</span>
      <span data-testid="order-teleological-t1-length">{questionOrder.teleological.t1.length}</span>
      <span data-testid="scenario-teleological">{scenarioAnswers.teleological ?? 'unset'}</span>
      <span data-testid="tags">{selectedStakeholderTags.join(',')}</span>
      <button onClick={() => setAnswer(1, 4)}>answer</button>
      <button onClick={() => setScenarioAnswer('teleological', 'A')}>scenario</button>
      <button onClick={() => setStakeholderTags(['automation-exposed-worker'])}>tags</button>
      <button onClick={reset}>reset</button>
    </div>
  )
}

describe('QuizContext', () => {
  it('builds a questionOrder with 7 T1 ids per axis on init', () => {
    render(<QuizProvider><TestConsumer /></QuizProvider>)
    expect(screen.getByTestId('order-teleological-t1-length').textContent).toBe('7')
  })

  it('records an answer, a scenario answer, and stakeholder tags independently', () => {
    render(<QuizProvider><TestConsumer /></QuizProvider>)
    fireEvent.click(screen.getByText('answer'))
    fireEvent.click(screen.getByText('scenario'))
    fireEvent.click(screen.getByText('tags'))
    expect(screen.getByTestId('answer-1').textContent).toBe('4')
    expect(screen.getByTestId('scenario-teleological').textContent).toBe('A')
    expect(screen.getByTestId('tags').textContent).toBe('automation-exposed-worker')
  })

  it('reset clears answers, scenario answers, and tags, and rebuilds questionOrder', () => {
    render(<QuizProvider><TestConsumer /></QuizProvider>)
    fireEvent.click(screen.getByText('answer'))
    fireEvent.click(screen.getByText('scenario'))
    fireEvent.click(screen.getByText('tags'))
    fireEvent.click(screen.getByText('reset'))
    expect(screen.getByTestId('answer-1').textContent).toBe('unset')
    expect(screen.getByTestId('scenario-teleological').textContent).toBe('unset')
    expect(screen.getByTestId('tags').textContent).toBe('')
    expect(screen.getByTestId('order-teleological-t1-length').textContent).toBe('7')
  })

  it('questionOrder covers all 8 axes', () => {
    render(<QuizProvider><TestConsumer /></QuizProvider>)
    expect(axes).toHaveLength(8)
  })

  it('throws if useQuiz is called outside a QuizProvider', () => {
    function Broken() {
      useQuiz()
      return null
    }
    expect(() => render(<Broken />)).toThrow('useQuiz must be used within a QuizProvider')
  })
})
