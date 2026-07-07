interface PinnacleReflectionProps {
  archetypeName: string
}

// Vowel-sound exceptions where the leading letter doesn't match the leading sound
// (e.g. "EU-Style..." is pronounced "you-style", a consonant sound despite the vowel letter).
const CONSONANT_SOUND_EXCEPTIONS = ['EU-']

function indefiniteArticle(name: string): 'a' | 'an' {
  if (CONSONANT_SOUND_EXCEPTIONS.some((prefix) => name.startsWith(prefix))) return 'a'
  return /^[aeiou]/i.test(name) ? 'an' : 'a'
}

export function PinnacleReflection({ archetypeName }: PinnacleReflectionProps) {
  return (
    <section className="mt-8 border-t pt-6">
      <h3 className="text-xl font-semibold mb-3">One Last Question</h3>
      <p data-testid="pinnacle-text" className="text-gray-700">
        Looking at your results as {indefiniteArticle(archetypeName)} {archetypeName}: are your views here mainly reactive, shaped
        by wanting to stop a specific danger, or proactive, shaped by a future you actually want
        to build? Neither answer is right or wrong. It's just worth asking yourself honestly.
      </p>
    </section>
  )
}
