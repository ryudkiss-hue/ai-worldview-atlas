import type { ProfileReportContent } from '../data/types'

interface ReportPreviewProps {
  content: ProfileReportContent
}

export function ReportPreview({ content }: ReportPreviewProps) {
  return (
    <section className="mt-8">
      <h3 className="text-xl font-semibold mb-3">Full Report Preview</h3>
      <div className="space-y-3 mb-4">
        {content.extendedNarrative.map((paragraph, index) => (
          <p key={index} className="text-gray-700">{paragraph}</p>
        ))}
      </div>

      <h4 className="font-semibold mb-2">Shadow Side</h4>
      <p className="text-gray-700 mb-4">{content.shadowSide}</p>

      <h4 className="font-semibold mb-2">Commonly Confused With</h4>
      <p className="text-gray-700 mb-4">
        <span className="font-medium">{content.commonlyConfusedWith.profileName}.</span>{' '}
        {content.commonlyConfusedWith.distinction}
      </p>

      <h4 className="font-semibold mb-2">Thinkers whose public work resonates with this view</h4>
      <ul className="space-y-2 mb-4">
        {content.thinkers.map((thinker) => (
          <li key={thinker.name}>
            <span className="font-medium">{thinker.name}</span> — {thinker.bio}.{' '}
            <span>{thinker.connection}</span>
          </li>
        ))}
      </ul>

      <h4 className="font-semibold mb-2">Further Reading</h4>
      <ul className="space-y-2 mb-4">
        {content.furtherReading.map((item) => (
          <li key={item.title}>
            <span className="font-medium">{item.title}</span>, {item.author} — {item.note}
          </li>
        ))}
      </ul>

      <h4 className="font-semibold mb-2">Next Steps</h4>
      <ul className="list-disc list-inside space-y-1">
        {content.nextSteps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ul>
    </section>
  )
}
