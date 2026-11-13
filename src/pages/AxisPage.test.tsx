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
  it('shows the axis name and its question, but not the pole-vs-pole label', () => {
    renderAxisPage(1)
    expect(screen.getByText('Mind')).toBeInTheDocument()
    expect(screen.getByText('Could AI systems have minds?')).toBeInTheDocument()
    expect(screen.queryByText(/Silicon Functionalism/)).not.toBeInTheDocument()
    expect(screen.queryByText(/vs\./)).not.toBeInTheDocument()
  })

  it('renders all 18 statements on an axis, 8 near-term and 10 long-term', () => {
    renderAxisPage(1)
    expect(screen.getAllByRole('radio', { name: 'Strongly Agree' })).toHaveLength(18)
    expect(screen.getByText("Today's and near-term AI")).toBeInTheDocument()
    expect(screen.getByText('In principle, and in the long run')).toBeInTheDocument()
  })

  it('offers four answers and no neutral midpoint', () => {
    renderAxisPage(1)
    expect(screen.queryAllByRole('radio', { name: 'Neutral' })).toHaveLength(0)
    expect(screen.getAllByRole('radio')).toHaveLength(18 * 4)
  })

  it('mixes one optional check statement into the Risk page, without a no-settled-view option or a required answer', () => {
    renderAxisPage(6)
    expect(screen.getByText('Risk')).toBeInTheDocument()
    expect(screen.getAllByRole('radio')).toHaveLength(19 * 4)
    expect(screen.getByText(/checks that answers are being read/)).toBeInTheDocument()
    expect(screen.getAllByText('I have no settled view on this')).toHaveLength(18)
    const check = screen.getByText(/checks that answers are being read/).closest('li')!
    const real = screen.getAllByRole('radio', { name: 'Strongly Agree' }).filter((r) => !check.contains(r))
    real.forEach((radio) => fireEvent.click(radio))
    expect(screen.getByRole('button', { name: 'Next' })).not.toBeDisabled()
    expect(screen.getByText('Axis 6 of 8 · Question 18 of 144')).toBeInTheDocument()
  })

  it('keeps answers after the page is closed and reopened', () => {
    const first = renderAxisPage(1)
    screen.getAllByRole('radio', { name: 'Strongly Agree' }).slice(0, 5).forEach((radio) => fireEvent.click(radio))
    first.unmount()
    renderAxisPage(1)
    expect(screen.getByText('Axis 1 of 8 · Question 5 of 144')).toBeInTheDocument()
    expect(screen.getAllByRole('radio', { name: 'Strongly Agree', checked: true })).toHaveLength(5)
  })

  it('disables Next until all 18 statements on the page are answered', () => {
    renderAxisPage(1)
    const nextButton = screen.getByRole('button', { name: 'Next' })
    expect(nextButton).toBeDisabled()
    screen.getAllByRole('radio', { name: 'Strongly Agree' }).forEach((radio) => fireEvent.click(radio))
    expect(nextButton).not.toBeDisabled()
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

  it('allows Next once every statement is either answered or marked as no settled view', () => {
    renderAxisPage(1)
    const nextButton = screen.getByRole('button', { name: 'Next' })
    const radios = screen.getAllByRole('radio', { name: 'Strongly Agree' })
    radios.slice(0, 17).forEach((radio) => fireEvent.click(radio))
    expect(nextButton).toBeDisabled()
    fireEvent.click(screen.getAllByText('I have no settled view on this')[17])
    expect(nextButton).not.toBeDisabled()
  })

  it('tracks overall progress across all 144 statements, live as they are answered', () => {
    renderAxisPage(1)
    const progressbar = screen.getByRole('progressbar')
    expect(progressbar.getAttribute('aria-valuenow')).toBe('0')
    screen.getAllByRole('radio', { name: 'Strongly Agree' }).slice(0, 9).forEach((radio) => fireEvent.click(radio))
    expect(progressbar.getAttribute('aria-valuenow')).toBe(String(Math.round((9 / 144) * 100)))
    expect(screen.getByText('Axis 1 of 8 · Question 9 of 144')).toBeInTheDocument()
  })
})
