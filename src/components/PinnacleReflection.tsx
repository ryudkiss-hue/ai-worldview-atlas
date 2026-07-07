interface PinnacleReflectionProps {
  archetypeName: string
}

export function PinnacleReflection({ archetypeName }: PinnacleReflectionProps) {
  return (
    <section className="mt-8 border-t pt-6">
      <h3 className="text-xl font-semibold mb-3">One Last Question</h3>
      <p data-testid="pinnacle-text" className="text-gray-700">
        Looking at your results as a {archetypeName}: are your views here mainly reactive, shaped
        by wanting to stop a specific danger, or proactive, shaped by a future you actually want
        to build? Neither answer is right or wrong. It's just worth asking yourself honestly.
      </p>
    </section>
  )
}
