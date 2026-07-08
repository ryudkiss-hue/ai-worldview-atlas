import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

function handleRestart() {
  window.location.hash = '#/'
  window.location.reload()
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="max-w-2xl mx-auto p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="text-gray-700 mb-6">
            The assessment hit an unexpected error and can't continue from here. Your in-progress
            answers on this page weren't saved, so restarting is the only way forward.
          </p>
          <button
            type="button"
            onClick={handleRestart}
            className="px-6 py-3 rounded bg-blue-600 text-white text-lg"
          >
            Restart Assessment
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
