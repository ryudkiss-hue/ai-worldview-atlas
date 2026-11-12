import { useState } from 'react'

const PARAGRAPHS = [
  "Here's how scoring works. Each axis has 18 statements. They come in pairs: two statements on the same topic that take opposite sides. Agreeing moves you toward one end of the axis, and disagreeing moves you toward the other. Strong answers count twice as much as mild ones. \"No settled view\" counts as zero. Your total is put on a scale from -10 to +10.",
  "Because every statement has a partner that says the opposite, a person who agrees with everything ends up at zero. So does a person who disagrees with everything. Your scores come from the sides you take, not from a habit of saying yes.",
  "Each statement makes one claim. It states a view, not a guess about the future. It is worded to be as strong as its partner, so neither side sounds more sensible just from the words. Each axis has some statements about AI today and some about AI in the long run. The table shows both.",
  "Your result is the closest of 50 named viewpoints, measured across all eight axes at once. A strong view on just one or two axes can pull you toward, or away from, a viewpoint you'd otherwise agree with. \"Axes in agreement\" counts the axes where you and a viewpoint land on the same side: one end, the middle (from -2 to +2), or the other end.",
  "This tool has not been through the testing a real psychometric test needs. The statements, the equal weights and the viewpoint positions are careful judgments, not results fitted to data. No one has checked if your result would stay the same if you took it twice. Treat it as a prompt to reflect, not a scientific reading of who you are.",
  "If none of your top matches feel quite right, that's expected. Your scores on each axis are the more accurate picture. A viewpoint label is a simple summary of them. This tool does not claim that every viewpoint is equally common. Most people hold more mixed views than any one viewpoint describes.",
  "This tool never scores your stake. Your stake means the optional tags you could pick, like being a worker whose job could be automated. Your stake and your beliefs might be tangled together, and that's worth thinking about. But here they are scored fully apart, on purpose.",
]

export function MethodologySection() {
  const [expanded, setExpanded] = useState(false)

  return (
    <section className="mt-8">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        aria-controls="methodology-content"
        className="text-blue-600 font-semibold underline"
      >
        How This Works
      </button>
      {expanded && (
        <div id="methodology-content" className="mt-3 space-y-3">
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
