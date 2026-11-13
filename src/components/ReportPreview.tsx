import type { ProfileReportContent } from '../data/types'
import { axes } from '../data/axes'
import { profiles } from '../data/profiles'
import { describePosition } from '../lib/axisPositions'

interface ReportPreviewProps {
  content: ProfileReportContent
}

export function ReportPreview({ content }: ReportPreviewProps) {
  const coords = profiles.find((p) => p.id === content.profileId)?.coords
  return (
    <section className="mt-8">
      <h3 className="text-xl font-semibold mb-3">Full Report Preview</h3>
      <div className="space-y-3 mb-4">
        {content.extendedNarrative.map((paragraph, index) => (
          <p key={index} className="text-gray-700">{paragraph}</p>
        ))}
      </div>

      <h4 className="font-semibold mb-2">Where This View Stands on Each Axis</h4>
      <dl className="mb-6 divide-y divide-gray-100 border-y border-gray-100">
        {axes.map((axis) => (
          <div key={axis.id} className="py-2 grid gap-1 sm:grid-cols-[11rem_1fr] sm:gap-4">
            <dt className="text-sm">
              <span className="font-medium text-gray-900">{axis.name}</span>
              {coords && <span className="block text-gray-500 tabular-nums">{describePosition(axis.id, coords[axis.id])}</span>}
            </dt>
            <dd className="text-gray-700 min-w-0">{content.axisReasons[axis.id]}</dd>
          </div>
        ))}
      </dl>

      <h4 className="font-semibold mb-2">Shadow Side</h4>
      <p className="text-gray-700 mb-4">{content.shadowSide}</p>

      <h4 className="font-semibold mb-2">The Strongest Objections</h4>
      <ul className="space-y-3 mb-4">
        {content.objections.map((o) => (
          <li key={o.objection} className="text-gray-700">
            <p>{o.objection}</p>
            <p className="mt-1 pl-3 border-l-2 border-gray-200 text-gray-600">{o.reply}</p>
          </li>
        ))}
      </ul>

      <h4 className="font-semibold mb-2">Commonly Confused With</h4>
      <p className="text-gray-700 mb-4">
        <span className="font-medium">{content.commonlyConfusedWith.profileName}.</span>{' '}
        {content.commonlyConfusedWith.distinction}
      </p>

      <h4 className="font-semibold mb-2">Where This View Shows Up</h4>
      <ul className="space-y-3 mb-4">
        {content.landmarks.map((l) => (
          <li key={l.name} className="text-gray-700">
            <span className="font-medium">{l.name}</span> <span className="text-gray-500 tabular-nums">({l.year})</span>. {l.what}
            <span className="block text-sm text-gray-500">Source: {l.source}</span>
          </li>
        ))}
      </ul>

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
