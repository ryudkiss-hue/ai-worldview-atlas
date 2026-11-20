import { Routes, Route, Navigate } from 'react-router-dom'
import { QuizProvider } from './state/QuizContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import { lazy, Suspense } from 'react'
import { IntroPage } from './pages/IntroPage'
import { AxisPage } from './pages/AxisPage'

// Pages after the quiz itself load on demand, so the first screen doesn't wait for the reports and charts.
const ScenarioPage = lazy(() => import('./pages/ScenarioPage').then((m) => ({ default: m.ScenarioPage })))
const ResultsPage = lazy(() => import('./pages/ResultsPage').then((m) => ({ default: m.ResultsPage })))
const ThoughtExperimentsPage = lazy(() => import('./pages/ThoughtExperimentsPage').then((m) => ({ default: m.ThoughtExperimentsPage })))
const PaperScoresPage = lazy(() => import('./pages/PaperScoresPage').then((m) => ({ default: m.PaperScoresPage })))
const ComparePage = lazy(() => import('./pages/ComparePage').then((m) => ({ default: m.ComparePage })))
const IntimacyPage = lazy(() => import('./pages/IntimacyPage').then((m) => ({ default: m.IntimacyPage })))

function App() {
  return (
    <ErrorBoundary>
      <QuizProvider>
        <main>
        <Suspense fallback={<p className="p-6 text-gray-500">Loading…</p>}>
        <Routes>
          <Route path="/" element={<IntroPage />} />
          <Route path="/quiz/:axisIndex" element={<AxisPage />} />
          <Route path="/scenarios" element={<ScenarioPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/thought-experiments" element={<ThoughtExperimentsPage />} />
          <Route path="/paper" element={<PaperScoresPage />} />
          <Route path="/intimacy" element={<IntimacyPage />} />
          <Route path="/compare" element={<ComparePage />} />
          {/* The Synthetic Compass and the old research flow are now part of the main assessment. */}
          <Route path="/compass/*" element={<Navigate to="/" replace />} />
          <Route path="/assessment" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
        </main>
      </QuizProvider>
    </ErrorBoundary>
  )
}

export default App
