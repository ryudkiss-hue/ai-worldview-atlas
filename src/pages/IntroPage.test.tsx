import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { IntroPage } from './IntroPage'
import { QuizProvider, useQuiz } from '../state/QuizContext'
import { stakeholderTags } from '../data/stakeholderTags'

function TagReadout() {
  const { selectedStakeholderTags } = useQuiz()
  return <p data-testid="tags">{selectedStakeholderTags.join(',')}</p>
}

function renderIntroPage() {
  return render(
    <QuizProvider>
      <MemoryRouter initialEntries={['/']}>
        <TagReadout />
        <Routes>
          <Route path="/" element={<IntroPage />} />
          <Route path="/quiz/1" element={<p>Axis Page</p>} />
        </Routes>
      </MemoryRouter>
    </QuizProvider>,
  )
}

describe('IntroPage', () => {
  it('shows the time commitment and no-persistence note', () => {
    renderIntroPage()
    expect(screen.getByText(/17-22 minutes/)).toBeInTheDocument()
    expect(screen.getByText(/answers aren't saved/i)).toBeInTheDocument()
  })

  it('renders all 13 stakeholder tag checkboxes and records selections', () => {
    renderIntroPage()
    stakeholderTags.forEach((tag) => expect(screen.getByLabelText(tag.name)).toBeInTheDocument())
    fireEvent.click(screen.getByLabelText('Automation-Exposed Worker'))
    expect(screen.getByTestId('tags').textContent).toBe('automation-exposed-worker')
  })

  it('Start still navigates to /quiz/1 regardless of tag selection', () => {
    renderIntroPage()
    fireEvent.click(screen.getByRole('button', { name: 'Start' }))
    expect(screen.getByText('Axis Page')).toBeInTheDocument()
  })

  it('a tag selected before Start survives the reset-on-Start click', () => {
    renderIntroPage()
    fireEvent.click(screen.getByLabelText('Automation-Exposed Worker'))
    fireEvent.click(screen.getByRole('button', { name: 'Start' }))
    expect(screen.getByTestId('tags').textContent).toBe('automation-exposed-worker')
  })
})
