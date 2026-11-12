import { Routes, Route, Navigate } from 'react-router-dom'
import { QuizProvider } from './state/QuizContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import { IntroPage } from './pages/IntroPage'
import { AxisPage } from './pages/AxisPage'
import { ScenarioPage } from './pages/ScenarioPage'
import { ResultsPage } from './pages/ResultsPage'
import { ThoughtExperimentsPage } from './pages/ThoughtExperimentsPage'
import { PaperScoresPage } from './pages/PaperScoresPage'

function App() {
  return (
    <ErrorBoundary>
      <QuizProvider>
        <Routes>
          <Route path="/" element={<IntroPage />} />
          <Route path="/quiz/:axisIndex" element={<AxisPage />} />
          <Route path="/scenarios" element={<ScenarioPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/thought-experiments" element={<ThoughtExperimentsPage />} />
          <Route path="/paper" element={<PaperScoresPage />} />
          {/* The Synthetic Compass and the old research flow are now part of the main assessment. */}
          <Route path="/compass/*" element={<Navigate to="/" replace />} />
          <Route path="/assessment" element={<Navigate to="/" replace />} />
        </Routes>
      </QuizProvider>
    </ErrorBoundary>
  )
}

export default App
