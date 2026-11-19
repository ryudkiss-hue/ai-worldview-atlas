import { useState } from 'react'

const PARAGRAPHS = [
  "Each axis has 18 statements, and they come in pairs: two statements on the same topic that take opposite sides. Agreeing moves you toward the end a statement argues for, and strong answers count twice as much as mild ones. Your score on an axis is the average of the answers you gave, put on a scale from -10 to +10.",
  "When you mark a statement \"no settled view\", it is left out of that average, so it doesn't pull you toward the middle. If you leave more than half of an axis that way, the score is worked out as if half had been answered. That keeps one strong answer from giving you an extreme score.",
  "Since every statement has a partner that argues the other side, a person who agrees with everything ends up at zero, and so does a person who disagrees with everything. Each statement makes one claim. It is worded to be about as strong as its partner, so neither side sounds better just from the words. Each axis has some statements about AI today and some about the long run, and the table shows both.",
  "Your result is the closest of 50 named viewpoints across all eight axes. Each viewpoint counts the axes that define it twice, and the ones it barely takes a side on count half. So a strong view on an axis a viewpoint doesn't care about pulls you away from it less than a gap on the axis it's built around. \"Same side\" counts the axes where you and a viewpoint land in the same band: one end, the middle (from -2 to +2) or the other end. A close call means your top two are so near each other that a slightly different set of statements would often swap them.",
  "The Atlas is meant for learning and personal reflection. It has not been through the testing a psychometric test needs, and its statements, weights and viewpoint positions are careful judgments made while writing it. Nobody has checked how often a result stays the same when someone takes it twice, so treat yours as a place to start thinking about your own views.",
  "If none of your top matches feel quite right, that's expected. A viewpoint label is a simple summary of your eight axis scores, and the scores show you in more detail. Most people hold more mixed views than any one viewpoint, and this tool does not claim that every viewpoint is equally common.",
  "Your stake is never scored. That means the optional tags you could pick, like being a worker whose job could be automated. Your stake and your beliefs may well be tangled together, which is worth thinking about, but here they are kept apart on purpose.",
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
