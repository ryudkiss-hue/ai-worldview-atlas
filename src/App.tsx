import { Routes, Route } from 'react-router-dom'
import { QuizProvider } from './state/QuizContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import { IntroPage } from './pages/IntroPage'
import { AxisPage } from './pages/AxisPage'
import { ScenarioPage } from './pages/ScenarioPage'
import { ResultsPage } from './pages/ResultsPage'
import { Assessment } from './pages/Assessment'

function App() {
  return (
    <ErrorBoundary>
      <QuizProvider>
        <Routes>
          <Route path="/" element={<IntroPage />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/quiz/:axisIndex" element={<AxisPage />} />
          <Route path="/scenarios" element={<ScenarioPage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </QuizProvider>
    </ErrorBoundary>
  )
}

export default App
