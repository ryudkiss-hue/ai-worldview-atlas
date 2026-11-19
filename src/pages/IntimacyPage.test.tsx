import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { IntimacyPage } from './IntimacyPage'
import { QuizProvider, PROGRESS_KEY } from '../state/QuizContext'
import { intimacySources, intimacyStatements } from '../data/intimacyModule'

function renderPage() {
  return render(
    <QuizProvider>
      <MemoryRouter initialEntries={['/intimacy']}>
        <Routes>
          <Route path="/intimacy" element={<IntimacyPage />} />
        </Routes>
      </MemoryRouter>
    </QuizProvider>,
  )
}

describe('IntimacyPage', () => {
  it('lists every statement and says it is separate from the Atlas score', () => {
    renderPage()
    intimacyStatements.forEach((q) => expect(screen.getByText(q.statement)).toBeInTheDocument())
    expect(screen.getByText(/never change your Atlas scores or archetype match/)).toBeInTheDocument()
  })

  it('shows a lean and a theme-by-theme breakdown once every statement is answered', () => {
    renderPage()
    expect(screen.queryByText(/Your lean:/)).not.toBeInTheDocument()
    intimacyStatements.forEach((q) => {
      const group = screen.getByRole('radiogroup', { name: `Question ${q.id} answer` })
      fireEvent.click(within(group).getByRole('radio', { name: q.leans === 'open' ? 'Strongly Agree' : 'Strongly Disagree' }))
    })
    expect(screen.getByText('Your lean: Strongly open')).toBeInTheDocument()
    expect(screen.getByText('Theme by theme')).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(PROGRESS_KEY)!).intimacyAnswers[1001]).toBe(5)
  })

  it('lists every source with a link', () => {
    renderPage()
    intimacySources.forEach((s) => expect(screen.getByRole('link', { name: s.title })).toHaveAttribute('href', s.url))
  })

  it('clears only this module after an on-page confirmation', () => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify({ answers: { 1: 5 }, intimacyAnswers: { 1001: 4 } }))
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Start this module over' }))
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
    const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY)!)
    expect(saved.intimacyAnswers).toEqual({})
    expect(saved.answers).toEqual({ 1: 5 })
  })
})
