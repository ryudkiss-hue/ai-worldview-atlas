import { useNavigate, useParams } from 'react-router-dom'
import { axes } from '../data/axes'
import { questionsForAxis } from '../data/questions'
import { useQuiz } from '../state/QuizContext'
import { ProgressBar } from '../components/ProgressBar'
import { AxisHorizonGroup } from '../components/AxisHorizonGroup'

export function AxisPage() {
  const { axisIndex } = useParams<{ axisIndex: string }>()
  const navigate = useNavigate()
  const { answers, setAnswer, questionOrder } = useQuiz()

  const index = Number(axisIndex)
  const axis = axes.find((a) => a.number === index)

  if (!axis) {
    return <p>Unknown axis.</p>
  }

  const allQuestions = questionsForAxis(axis.id)
  const order = questionOrder[axis.id]
  const byId = new Map(allQuestions.map((q) => [q.id, q]))
  const t1Questions = order.t1.map((id) => byId.get(id)!)
  const t2Questions = order.t2.map((id) => byId.get(id)!)
  const allAnswered = allQuestions.every((q) => answers[q.id] !== undefined)

  function goNext() {
    if (index === 8) {
      navigate('/scenarios')
    } else {
      navigate(`/quiz/${index + 1}`)
    }
  }

  function goBack() {
    if (index === 1) {
      navigate('/')
    } else {
      navigate(`/quiz/${index - 1}`)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <ProgressBar current={index} total={8} label={`Axis ${index} of 8`} />
      <h2 className="text-2xl font-bold mt-4 mb-6">{axis.name}</h2>
      <AxisHorizonGroup
        title="Right Now (Next 2-5 Years)"
        questions={t1Questions}
        answers={answers}
        onAnswer={setAnswer}
      />
      <AxisHorizonGroup
        title="Looking Ahead (20-50 Years)"
        questions={t2Questions}
        answers={answers}
        onAnswer={setAnswer}
      />
      <div className="flex justify-between mt-6">
        <button type="button" onClick={goBack} className="px-4 py-2 rounded border border-gray-300">
          Back
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={!allAnswered}
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  )
}
