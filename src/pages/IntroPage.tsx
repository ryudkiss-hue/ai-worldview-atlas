import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../state/QuizContext'
import { stakeholderTags } from '../data/stakeholderTags'

export function IntroPage() {
  const navigate = useNavigate()
  const { reset, selectedStakeholderTags, setStakeholderTags } = useQuiz()

  function handleStart() {
    navigate('/quiz/1')
  }

  function toggleTag(tagId: string) {
    if (selectedStakeholderTags.includes(tagId)) {
      setStakeholderTags(selectedStakeholderTags.filter((id) => id !== tagId))
    } else {
      setStakeholderTags([...selectedStakeholderTags, tagId])
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">TIAM-112 Diagnostic</h1>
      <p className="text-gray-700 mb-4">
        This is a 132-question survey about how you think AI development should go, both in the
        next few years and over the next fifty. It shows you where your views sit across eight
        different dimensions, and matches you to the closest of 37 named viewpoints.
      </p>
      <p className="text-sm text-gray-500 mb-2">
        About 18-23 minutes, 132 questions. Your answers aren't saved if you refresh mid-quiz —
        only a finished result can be shared via link.
      </p>
      <p className="text-sm text-gray-500 mb-6">
        This is a self-reflection and discussion tool, not a validated scientific instrument.
        Treat your result as a conversation starter, not a diagnosis.
      </p>
      <div className="text-left mb-6">
        <p className="font-semibold mb-2">
          Do any of these describe your relationship to AI? (optional, pick as many as apply)
        </p>
        <ul className="space-y-2">
          {stakeholderTags.map((tag) => (
            <li key={tag.id}>
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  aria-label={tag.name}
                  checked={selectedStakeholderTags.includes(tag.id)}
                  onChange={() => toggleTag(tag.id)}
                />
                <span>
                  <span className="font-medium">{tag.name}</span> — {tag.description}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>
      <button type="button" onClick={() => { reset(); handleStart() }} className="px-6 py-3 rounded bg-blue-600 text-white text-lg">
        Start
      </button>
    </div>
  )
}
