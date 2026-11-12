import { Routes, Route } from 'react-router-dom'
import { QuizProvider } from './state/QuizContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import { IntroPage } from './pages/IntroPage'
import { AxisPage } from './pages/AxisPage'
import { ScenarioPage } from './pages/ScenarioPage'
import { ResultsPage } from './pages/ResultsPage'
import { Assessment } from './pages/Assessment'
import { CompassProvider } from './compass/CompassContext'
import { CompassIntroPage, CompassStagePage, CompassResultsPage, CompassReferencePage } from './pages/compass/CompassPages'

function App() {
  return (
    <ErrorBoundary>
      <QuizProvider>
        <CompassProvider>
        <Routes>
          <Route path="/" element={<IntroPage />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/quiz/:axisIndex" element={<AxisPage />} />
          <Route path="/scenarios" element={<ScenarioPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/compass" element={<CompassIntroPage />} />
          <Route path="/compass/stage/:stage" element={<CompassStagePage />} />
          <Route path="/compass/results" element={<CompassResultsPage />} />
          <Route path="/compass/archetypes" element={<CompassReferencePage />} />
        </Routes>
        </CompassProvider>
      </QuizProvider>
    </ErrorBoundary>
  )
}

export default App
