import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { CompassProvider, COMPASS_STORAGE_KEY } from '../../compass/CompassContext'
import { CompassIntroPage, CompassStagePage, CompassResultsPage, CompassReferencePage } from './CompassPages'
import { ITEMS, STAGES } from '../../compass/data'

function renderAt(path: string) {
  return render(
    <CompassProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/" element={<p>Atlas home</p>} />
          <Route path="/compass" element={<CompassIntroPage />} />
          <Route path="/compass/stage/:stage" element={<CompassStagePage />} />
          <Route path="/compass/results" element={<CompassResultsPage />} />
          <Route path="/compass/archetypes" element={<CompassReferencePage />} />
        </Routes>
      </MemoryRouter>
    </CompassProvider>,
  )
}

// Test answer sheet: Agree to every statement (lands at the center, The Open Questioner).
function saveAllAgree() {
  const answers: Record<number, number> = {}
  ITEMS.forEach((it) => (answers[it[0]] = 1))
  const order: Record<number, number[]> = {}
  STAGES.forEach((s) => (order[s.n] = ITEMS.filter((it) => it[4] === s.n).map((it) => it[0])))
  localStorage.setItem(COMPASS_STORAGE_KEY, JSON.stringify({ v: '3.6', answers, order }))
}

beforeEach(() => localStorage.clear())

describe('Synthetic Compass pages', () => {
  it('intro explains the quiz and starts at stage 1', () => {
    renderAt('/compass')
    expect(screen.getByRole('heading', { name: 'The Synthetic Compass' })).toBeInTheDocument()
    expect(screen.getByText(/saved only in this\s+browser/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Start' }))
    expect(screen.getByText(/Stage 1 of 6/)).toBeInTheDocument()
  })

  it('a stage shows its 20 statements word for word and unlocks Next only when all are answered', () => {
    renderAt('/compass/stage/1')
    const stageItems = ITEMS.filter((it) => it[4] === 1)
    stageItems.forEach((it) => expect(screen.getByText(it[5])).toBeInTheDocument())
    const groups = screen.getAllByRole('radiogroup')
    expect(groups).toHaveLength(20)
    const next = screen.getByRole('button', { name: 'Next stage' })
    expect(next).toBeDisabled()
    groups.forEach((g) => fireEvent.click(g.querySelectorAll('[role="radio"]')[3]))
    expect(next).toBeEnabled()
    fireEvent.click(next)
    expect(screen.getByText(/Stage 2 of 6/)).toBeInTheDocument()
  })

  it('offers no neutral option', () => {
    renderAt('/compass/stage/1')
    const labels = [...screen.getAllByRole('radiogroup')[0].querySelectorAll('[role="radio"]')].map((b) => b.textContent)
    expect(labels).toEqual(['Strongly disagree', 'Disagree', 'Agree', 'Strongly agree'])
  })

  it('results redirect to the intro until every statement is answered', () => {
    renderAt('/compass/results')
    expect(screen.getByRole('heading', { name: 'The Synthetic Compass' })).toBeInTheDocument()
  })

  it('shows the archetype, coordinates and diagnostics for a complete sheet', () => {
    saveAllAgree()
    renderAt('/compass/results')
    expect(screen.getByRole('heading', { name: 'The Open Questioner' })).toBeInTheDocument()
    expect(screen.getAllByText('+0.00').length).toBeGreaterThanOrEqual(3)
    expect(screen.getByLabelText('Compass position: X +0.00, Y +0.00, Z +0.00')).toBeInTheDocument()
    expect(screen.getByText(/None of the three tension diagnostics/)).toBeInTheDocument()
  })

  it('reference page lists all 27 archetypes and marks yours', () => {
    saveAllAgree()
    renderAt('/compass/archetypes')
    expect(screen.getAllByText(/^[XYZ][−0+] [XYZ][−0+] [XYZ][−0+]$/)).toHaveLength(27)
    expect(screen.getByText('You')).toBeInTheDocument()
  })
})
