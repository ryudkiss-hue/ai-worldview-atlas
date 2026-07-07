import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ScenarioPage } from './ScenarioPage'
import { QuizProvider } from '../state/QuizContext'
import { scenarios } from '../data/scenarios'

function renderScenarioPage() {
  return render(
    <QuizProvider>
      <MemoryRouter initialEntries={['/scenarios']}>
        <Routes>
          <Route path="/scenarios" element={<ScenarioPage />} />
          <Route path="/results" element={<p>Results Page</p>} />
        </Routes>
      </MemoryRouter>
    </QuizProvider>,
  )
}

describe('ScenarioPage', () => {
  it('renders all 8 scenario prompts', () => {
    renderScenarioPage()
    scenarios.forEach((s) => expect(screen.getByText(s.prompt)).toBeInTheDocument())
  })

  it('"Skip for now" navigates straight to /results without answering anything', () => {
    renderScenarioPage()
    fireEvent.click(screen.getByRole('button', { name: 'Skip for now' }))
    expect(screen.getByText('Results Page')).toBeInTheDocument()
  })

  it('answering all 8 and clicking "See My Results" navigates to /results', () => {
    renderScenarioPage()
    scenarios.forEach((s) => {
      fireEvent.click(screen.getByRole('button', { name: s.optionA }))
    })
    fireEvent.click(screen.getByRole('button', { name: 'See My Results' }))
    expect(screen.getByText('Results Page')).toBeInTheDocument()
  })
})
