import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorBoundary } from './ErrorBoundary'

function Broken(): never {
  throw new Error('boom')
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('ErrorBoundary', () => {
  it('renders children normally when nothing throws', () => {
    render(
      <ErrorBoundary>
        <p>All good</p>
      </ErrorBoundary>,
    )
    expect(screen.getByText('All good')).toBeInTheDocument()
  })

  it('shows a restart fallback instead of a blank page when a child throws', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <ErrorBoundary>
        <Broken />
      </ErrorBoundary>,
    )
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Restart Assessment' })).toBeInTheDocument()
  })

  it('restarting navigates back to the hash root and reloads', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const reloadSpy = vi.fn()
    const originalLocation = window.location
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, hash: '#/quiz/5', reload: reloadSpy },
    })

    render(
      <ErrorBoundary>
        <Broken />
      </ErrorBoundary>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Restart Assessment' }))
    expect(window.location.hash).toBe('#/')
    expect(reloadSpy).toHaveBeenCalled()

    Object.defineProperty(window, 'location', { configurable: true, value: originalLocation })
  })
})
