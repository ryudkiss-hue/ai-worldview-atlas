import { useState } from 'react'

const PARAGRAPHS = [
  "Here's how scoring works. Each answer you give gets turned into a number, added up per axis, and then squeezed onto a -10 to 10 scale using a math formula called tanh. Your result is matched to the closest of 34 named viewpoints by measuring distance across all eight scales at once.",
  "One thing worth knowing: this matching looks at your whole pattern across all eight axes. A strong view on just one or two axes can pull you toward, or away from, a viewpoint you'd otherwise agree with on everything else.",
  "This tool has not been through the kind of testing a real psychometric instrument needs. Nobody has checked whether your results would stay the same if you took it twice, and no outside researchers have reviewed it. Treat it as a self-reflection prompt, not a scientific reading of who you are.",
  "We chose a 1-to-5 agree or disagree scale instead of a forced ranking between choices, on purpose. Forced-ranking tests resist people trying to game them, but they create their own math problems that make it harder to trust each individual score. A plain agree or disagree scale, answered one question at a time, avoids that problem.",
  "If none of your top matches feel quite right, that's expected, not a flaw. Like any typology, this system can't capture every real combination of views. Your raw scores on each axis are the more accurate picture of where you actually stand — the viewpoint label is a simplified summary of that, not the other way around.",
  "A tool like this can accidentally make every viewpoint look equally common or equally normal. It isn't making that claim. Most real people likely hold more mixed, less all-or-nothing positions than any single viewpoint here fully describes. Treat your match as one useful way to see the space of possible views, not a claim about how common your exact position actually is.",
]

export function MethodologySection() {
  const [expanded, setExpanded] = useState(false)

  return (
    <section className="mt-8">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="text-blue-600 font-semibold underline"
      >
        How This Works
      </button>
      {expanded && (
        <div className="mt-3 space-y-3">
          {PARAGRAPHS.map((text, index) => (
            <p key={index} data-testid="methodology-paragraph" className="text-gray-700">
              {text}
            </p>
          ))}
        </div>
      )}
    </section>
  )
}
