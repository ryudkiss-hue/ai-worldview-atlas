import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../state/QuizContext'

export function IntroPage() {
  const navigate = useNavigate()
  const { reset } = useQuiz()

  function handleStart() {
    reset()
    navigate('/quiz/1')
  }

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">TIAM-112 Diagnostic</h1>
      <p className="text-gray-700 mb-4">
        This is a 112-question survey about how you think AI development should go, both in the
        next few years and over the next fifty. It shows you where your views sit across eight
        different dimensions, and matches you to the closest of 24 named viewpoints.
      </p>
      <p className="text-sm text-gray-500 mb-6">
        This is a self-reflection and discussion tool, not a validated scientific instrument.
        Treat your result as a conversation starter, not a diagnosis.
      </p>
      <button type="button" onClick={handleStart} className="px-6 py-3 rounded bg-blue-600 text-white text-lg">
        Start
      </button>
    </div>
  )
}
