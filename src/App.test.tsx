import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

describe('App end-to-end smoke test', () => {
  it('goes from the intro page to axis 1 when Start is clicked', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )
    expect(screen.getByText('TIAM-112 Diagnostic')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Start' }))
    expect(screen.getByText('Teleological')).toBeInTheDocument()
  })
})
