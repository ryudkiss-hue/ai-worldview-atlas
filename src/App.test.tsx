import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import App from './App'
import { QuizProvider, useQuiz } from './state/QuizContext'
import { ScenarioPage } from './pages/ScenarioPage'
import { ResultsPage } from './pages/ResultsPage'
import { questions } from './data/questions'

describe('App end-to-end smoke test', () => {
  it('goes from the intro page to axis 1 when Start is clicked', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )
    expect(screen.getByText('The AI Worldview Atlas')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Start' }))
    expect(screen.getByText('Teleological')).toBeInTheDocument()
  })

  it('reaches the scenario page directly via /scenarios and can skip to results once the quiz is answered', () => {
    function AnswerSeeder() {
      const { setAnswer } = useQuiz()
      useEffect(() => {
        questions.forEach((q) => setAnswer(q.id, q.agreeShiftsToward === 'A' ? 4 : 2))
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])
      return <ScenarioPage />
    }
    render(
      <QuizProvider>
        <MemoryRouter initialEntries={['/scenarios']}>
          <Routes>
            <Route path="/scenarios" element={<AnswerSeeder />} />
            <Route path="/results" element={<ResultsPage />} />
          </Routes>
        </MemoryRouter>
      </QuizProvider>,
    )
    expect(screen.getByText('One More Thing (Optional)')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Skip for now' }))
    expect(screen.getByText('Your Results')).toBeInTheDocument()
  })

  it('shows a "no results yet" prompt, not a fake result, when /results is reached without answering anything', () => {
    render(
      <MemoryRouter initialEntries={['/results']}>
        <App />
      </MemoryRouter>,
    )
    expect(screen.getByText('No Results Yet')).toBeInTheDocument()
  })
})
