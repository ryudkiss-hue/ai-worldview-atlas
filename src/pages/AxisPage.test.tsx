import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AxisPage } from './AxisPage'
import { QuizProvider } from '../state/QuizContext'

function renderAxisPage(initialAxis: number) {
  return render(
    <QuizProvider>
      <MemoryRouter initialEntries={[`/quiz/${initialAxis}`]}>
        <Routes>
          <Route path="/quiz/:axisIndex" element={<AxisPage />} />
          <Route path="/scenarios" element={<p>Scenarios Page</p>} />
          <Route path="/" element={<p>Intro Page</p>} />
        </Routes>
      </MemoryRouter>
    </QuizProvider>,
  )
}

describe('AxisPage', () => {
  it('shows the axis name but not the pole-vs-pole label', () => {
    renderAxisPage(1)
    expect(screen.getByText('Teleological')).toBeInTheDocument()
    expect(screen.queryByText(/vs\./)).not.toBeInTheDocument()
  })

  it('still renders exactly 14 questions (7 T1 + 7 T2), now in shuffled order', () => {
    renderAxisPage(1)
    expect(screen.getAllByRole('radio', { name: 'Strongly Agree' })).toHaveLength(14)
  })

  it('disables Next until all 14 questions on the page are answered', () => {
    renderAxisPage(1)
    const nextButton = screen.getByRole('button', { name: 'Next' })
    expect(nextButton).toBeDisabled()
    screen.getAllByRole('radio', { name: 'Strongly Agree' }).forEach((radio) => fireEvent.click(radio))
    expect(nextButton).not.toBeDisabled()
  })

  it('renders all 18 questions (9 T1 + 9 T2) for an expanded axis like risk', () => {
    renderAxisPage(2)
    expect(screen.getByText('Risk Profile')).toBeInTheDocument()
    expect(screen.getAllByRole('radio', { name: 'Strongly Agree' })).toHaveLength(18)
  })

  it('navigates to /scenarios (not /results) when Next is clicked from axis 8', () => {
    renderAxisPage(8)
    screen.getAllByRole('radio', { name: 'Strongly Agree' }).forEach((radio) => fireEvent.click(radio))
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByText('Scenarios Page')).toBeInTheDocument()
  })

  it('navigates to / when Back is clicked from axis 1', () => {
    renderAxisPage(1)
    fireEvent.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByText('Intro Page')).toBeInTheDocument()
  })

  it('allows Next once every question is either answered or declined as having no strong view', () => {
    renderAxisPage(1)
    const nextButton = screen.getByRole('button', { name: 'Next' })
    const radios = screen.getAllByRole('radio', { name: 'Strongly Agree' })
    radios.slice(0, 13).forEach((radio) => fireEvent.click(radio))
    expect(nextButton).toBeDisabled()
    fireEvent.click(screen.getAllByText("I don't have a strong view on this")[13])
    expect(nextButton).not.toBeDisabled()
  })

  it('tracks overall question progress (not just axis count), live as questions are answered', () => {
    renderAxisPage(1)
    const progressbar = screen.getByRole('progressbar')
    expect(progressbar.getAttribute('aria-valuenow')).toBe('0')
    const radios = screen.getAllByRole('radio', { name: 'Strongly Agree' })
    radios.slice(0, 7).forEach((radio) => fireEvent.click(radio))
    // 7 of 145 total questions answered so far, not 7 of 14 for this axis alone.
    expect(progressbar.getAttribute('aria-valuenow')).toBe(String(Math.round((7 / 145) * 100)))
    expect(screen.getByText('Axis 1 of 8 · Question 7 of 145')).toBeInTheDocument()
  })
})
