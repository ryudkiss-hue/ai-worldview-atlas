import { useNavigate } from 'react-router-dom'
import { scenarios } from '../data/scenarios'
import { useQuiz } from '../state/QuizContext'

export function ScenarioPage() {
  const navigate = useNavigate()
  const { scenarioAnswers, setScenarioAnswer } = useQuiz()

  function goToResults() {
    navigate('/results')
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-2">One More Thing (Optional)</h2>
      <p className="text-gray-600 mb-6">
        Eight quick gut-check questions. These don't change your score — they're just
        here to compare against it.
      </p>
      <ul className="space-y-6">
        {scenarios.map((scenario) => (
          <li key={scenario.axisId}>
            <p className="mb-2">{scenario.prompt}</p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setScenarioAnswer(scenario.axisId, 'A')}
                className={`text-left px-3 py-2 rounded border ${
                  scenarioAnswers[scenario.axisId] === 'A' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300'
                }`}
              >
                {scenario.optionA}
              </button>
              <button
                type="button"
                onClick={() => setScenarioAnswer(scenario.axisId, 'B')}
                className={`text-left px-3 py-2 rounded border ${
                  scenarioAnswers[scenario.axisId] === 'B' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300'
                }`}
              >
                {scenario.optionB}
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex justify-between mt-8">
        <button type="button" onClick={goToResults} className="px-4 py-2 rounded border border-gray-300">
          Skip for now
        </button>
        <button type="button" onClick={goToResults} className="px-4 py-2 rounded bg-blue-600 text-white">
          See My Results
        </button>
      </div>
    </div>
  )
}
