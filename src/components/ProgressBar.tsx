interface ProgressBarProps {
  current: number
  total: number
  label: string
}

export function ProgressBar({ current, total, label }: ProgressBarProps) {
  const percent = Math.round((current / total) * 100)
  return (
    <div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-blue-600 transition-all"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-label="Progress through the statements"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  )
}
