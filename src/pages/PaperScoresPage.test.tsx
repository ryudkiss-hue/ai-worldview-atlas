import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom'
import { PaperScoresPage } from './PaperScoresPage'
import { axes } from '../data/axes'
import { decodeShareLink } from '../lib/shareLink'

function Landing() {
  const loc = useLocation()
  return <p data-testid="landing">{loc.search}</p>
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/paper']}>
      <Routes>
        <Route path="/paper" element={<PaperScoresPage />} />
        <Route path="/results" element={<Landing />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('PaperScoresPage', () => {
  it('turns the 16 paper totals into a results link carrying the same raw scores', () => {
    renderPage()
    const button = screen.getByRole('button', { name: 'See my results' })
    expect(button).toBeDisabled()
    axes.forEach((a, i) => {
      fireEvent.change(screen.getByLabelText(`${a.name} near-term net`), { target: { value: String(i - 4) } })
      fireEvent.change(screen.getByLabelText(`${a.name} long-run net`), { target: { value: String(10 - i) } })
    })
    expect(button).not.toBeDisabled()
    fireEvent.click(button)
    const d = new URLSearchParams(screen.getByTestId('landing').textContent!).get('d')!
    const decoded = decodeShareLink(d)!
    axes.forEach((a, i) => {
      expect(decoded.t1Raw[a.id]).toBe(i - 4)
      expect(decoded.t2Raw[a.id]).toBe(10 - i)
    })
  })

  it('rejects a total outside the possible range', () => {
    renderPage()
    axes.forEach((a) => {
      fireEvent.change(screen.getByLabelText(`${a.name} near-term net`), { target: { value: '0' } })
      fireEvent.change(screen.getByLabelText(`${a.name} long-run net`), { target: { value: '0' } })
    })
    fireEvent.change(screen.getByLabelText('Mind near-term net'), { target: { value: '17' } })
    expect(screen.getByRole('button', { name: 'See my results' })).toBeDisabled()
    expect(screen.getByText(/Mind, near term: a whole number from −16 to \+16/)).toBeInTheDocument()
  })
})
