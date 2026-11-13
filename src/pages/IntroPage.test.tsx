import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { IntroPage } from './IntroPage'
import { QuizProvider, useQuiz, PROGRESS_KEY } from '../state/QuizContext'
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
    expect(screen.getByText(/25 to 35 minutes/)).toBeInTheDocument()
    expect(screen.getByText(/144-statement assessment/)).toBeInTheDocument()
    expect(screen.getByText(/answers are saved in this browser as you go/i)).toBeInTheDocument()
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

  it('offers to continue, or start over, when answers were saved earlier', () => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify({ answers: { 1: 5, 2: 1 } }))
    renderIntroPage()
    expect(screen.getByText(/2 of 144 statements answered/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Continue where you left off' }))
    expect(screen.getByText('Axis Page')).toBeInTheDocument()
  })

  it('Start over clears saved answers', () => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify({ answers: { 1: 5 } }))
    renderIntroPage()
    fireEvent.click(screen.getByRole('button', { name: 'Full Atlas (144)' }))
    expect(screen.getByText('Axis Page')).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(PROGRESS_KEY)!).answers).toEqual({})
  })

  it('offers a 48-statement short version that starts fresh in short mode', () => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify({ answers: { 1: 5 } }))
    renderIntroPage()
    fireEvent.click(screen.getByRole('button', { name: 'Short version (48)' }))
    expect(screen.getByText('Axis Page')).toBeInTheDocument()
    const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY)!)
    expect(saved.mode).toBe('short')
    expect(saved.answers).toEqual({})
  })

  it('counts progress against the short version when that is the one in progress', () => {
    // 7 and 8 are a short-version pair; 1 is not in the short version
    localStorage.setItem(PROGRESS_KEY, JSON.stringify({ answers: { 1: 5, 7: 4, 8: 2 }, mode: 'short' }))
    renderIntroPage()
    expect(screen.getByText(/2 of 48 statements answered/)).toBeInTheDocument()
  })

  it('links to the optional synthetic-intimacy focus module', () => {
    renderIntroPage()
    expect(screen.getByRole('link', { name: 'Open the focus module' })).toHaveAttribute('href', '/intimacy')
  })

  it('a tag selected before Start survives the reset-on-Start click', () => {
    renderIntroPage()
    fireEvent.click(screen.getByLabelText('Automation-Exposed Worker'))
    fireEvent.click(screen.getByRole('button', { name: 'Start' }))
    expect(screen.getByTestId('tags').textContent).toBe('automation-exposed-worker')
  })
})
