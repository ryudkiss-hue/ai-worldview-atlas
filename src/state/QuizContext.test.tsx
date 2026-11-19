import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QuizProvider, useQuiz, loadSavedProgress, PROGRESS_KEY } from './QuizContext'
import { axes } from '../data/axes'

function TestConsumer() {
  const {
    answers,
    setAnswer,
    declinedQuestions,
    declineQuestion,
    reset,
    questionOrder,
    scenarioAnswers,
    setScenarioAnswer,
    selectedStakeholderTags,
    setStakeholderTags,
  } = useQuiz()
  return (
    <div>
      <span data-testid="answer-1">{answers[1] ?? 'unset'}</span>
      <span data-testid="declined">{declinedQuestions.join(',')}</span>
      <span data-testid="order-teleological-t1-length">{questionOrder.teleological.t1.length}</span>
      <span data-testid="scenario-teleological">{scenarioAnswers.teleological ?? 'unset'}</span>
      <span data-testid="tags">{selectedStakeholderTags.join(',')}</span>
      <button onClick={() => setAnswer(1, 4)}>answer</button>
      <button onClick={() => declineQuestion(1)}>decline</button>
      <button onClick={() => setScenarioAnswer('teleological', 'A')}>scenario</button>
      <button onClick={() => setStakeholderTags(['automation-exposed-worker'])}>tags</button>
      <button onClick={reset}>reset</button>
    </div>
  )
}

describe('QuizContext', () => {
  it('builds a questionOrder with 8 T1 ids per axis on init', () => {
    render(<QuizProvider><TestConsumer /></QuizProvider>)
    expect(screen.getByTestId('order-teleological-t1-length').textContent).toBe('8')
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

  it('reset clears answers, declines, and scenario answers, rebuilds questionOrder, but preserves stakeholder tags', () => {
    render(<QuizProvider><TestConsumer /></QuizProvider>)
    fireEvent.click(screen.getByText('answer'))
    fireEvent.click(screen.getByText('scenario'))
    fireEvent.click(screen.getByText('tags'))
    fireEvent.click(screen.getByText('reset'))
    expect(screen.getByTestId('answer-1').textContent).toBe('unset')
    expect(screen.getByTestId('declined').textContent).toBe('')
    expect(screen.getByTestId('scenario-teleological').textContent).toBe('unset')
    expect(screen.getByTestId('tags').textContent).toBe('automation-exposed-worker')
    expect(screen.getByTestId('order-teleological-t1-length').textContent).toBe('8')
  })

  it('questionOrder covers all 8 axes', () => {
    render(<QuizProvider><TestConsumer /></QuizProvider>)
    expect(axes).toHaveLength(8)
  })

  it('declining a question clears any existing answer for it, and recording an answer clears any decline', () => {
    render(<QuizProvider><TestConsumer /></QuizProvider>)
    fireEvent.click(screen.getByText('answer'))
    expect(screen.getByTestId('answer-1').textContent).toBe('4')
    fireEvent.click(screen.getByText('decline'))
    expect(screen.getByTestId('answer-1').textContent).toBe('unset')
    expect(screen.getByTestId('declined').textContent).toBe('1')
    fireEvent.click(screen.getByText('answer'))
    expect(screen.getByTestId('answer-1').textContent).toBe('4')
    expect(screen.getByTestId('declined').textContent).toBe('')
  })

  it('declining the same question twice toggles it back off', () => {
    render(<QuizProvider><TestConsumer /></QuizProvider>)
    fireEvent.click(screen.getByText('decline'))
    expect(screen.getByTestId('declined').textContent).toBe('1')
    fireEvent.click(screen.getByText('decline'))
    expect(screen.getByTestId('declined').textContent).toBe('')
  })

  it('throws if useQuiz is called outside a QuizProvider', () => {
    function Broken() {
      useQuiz()
      return null
    }
    expect(() => render(<Broken />)).toThrow('useQuiz must be used within a QuizProvider')
  })
})

describe('saved progress', () => {
  it('restores valid answers and drops anything that does not fit the current statements', () => {
    localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({ answers: { 1: 5, 2: 3, 9999: 4 }, declinedQuestions: [3, 1, 777], checkAnswers: { 901: 2, 5: 4 }, questionOrder: {} }),
    )
    const saved = loadSavedProgress()!
    expect(saved.answers).toEqual({ 1: 5 })
    expect(saved.declinedQuestions).toEqual([3])
    expect(saved.checkAnswers).toEqual({ 901: 2 })
    expect(Object.keys(saved.questionOrder)).toHaveLength(8)
  })

  it('restores the version, axis weights and focus-module answers, dropping invalid ones', () => {
    localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({
        answers: {},
        mode: 'short',
        axisWeights: { ontological: 2, risk: 3 },
        intimacyAnswers: { 1001: 5, 1002: 0, 1003: 3, 1: 4 },
      }),
    )
    const saved = loadSavedProgress()!
    expect(saved.mode).toBe('short')
    expect(saved.axisWeights.ontological).toBe(2)
    expect(saved.axisWeights.risk).toBe(1)
    expect(saved.intimacyAnswers).toEqual({ 1001: 5, 1002: 0 })
  })

  it('defaults older saved progress to the full version with equal weights', () => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify({ answers: { 1: 5 }, mode: 'something' }))
    const saved = loadSavedProgress()!
    expect(saved.mode).toBe('full')
    expect(Object.values(saved.axisWeights).every((w) => w === 1)).toBe(true)
    expect(saved.intimacyAnswers).toEqual({})
  })

  it('starting the quiz again keeps the separate focus-module answers', () => {
    function Consumer() {
      const { startQuiz, setIntimacyAnswer, intimacyAnswers, mode, setAxisWeight, axisWeights } = useQuiz()
      return (
        <div>
          <span data-testid="intimacy">{JSON.stringify(intimacyAnswers)}</span>
          <span data-testid="mode">{mode}</span>
          <span data-testid="w">{axisWeights.risk}</span>
          <button onClick={() => setIntimacyAnswer(1001, 4)}>intimacy</button>
          <button onClick={() => setAxisWeight('risk', 2)}>weight</button>
          <button onClick={() => startQuiz('short')}>short</button>
        </div>
      )
    }
    render(
      <QuizProvider>
        <Consumer />
      </QuizProvider>,
    )
    fireEvent.click(screen.getByText('intimacy'))
    fireEvent.click(screen.getByText('weight'))
    expect(screen.getByTestId('w').textContent).toBe('2')
    fireEvent.click(screen.getByText('short'))
    expect(screen.getByTestId('mode').textContent).toBe('short')
    expect(screen.getByTestId('intimacy').textContent).toBe('{"1001":4}')
    expect(screen.getByTestId('w').textContent).toBe('1')
  })

  it('starts fresh when the saved data is unreadable', () => {
    localStorage.setItem(PROGRESS_KEY, '{not json')
    expect(loadSavedProgress()).toBeNull()
  })
})
