import { useEffect, useState } from 'react'
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'
import { axes } from '../data/axes'
import type { AxisVector } from '../lib/scoring'

interface RadarChartProps {
  combined: AxisVector
  comparisonProfile?: { name: string; coords: AxisVector }
}

const YOU = '#2563eb'
const THEM = '#dc2626'
const NARROW_QUERY = '(max-width: 480px)'

/** Splits an axis name into at most two lines, so long names like "Growth and Limits" fit at phone width. */
export function labelLines(name: string, maxChars = 11): string[] {
  if (name.length <= maxChars) return [name]
  const words = name.split(' ')
  let best = [name]
  let bestWidth = Infinity
  for (let i = 1; i < words.length; i++) {
    if (words[i] === '&') continue // never start a line with "&"
    const lines = [words.slice(0, i).join(' '), words.slice(i).join(' ')]
    const width = Math.max(...lines.map((l) => l.length))
    if (width < bestWidth) {
      best = lines
      bestWidth = width
    }
  }
  return best
}

function useNarrow(): boolean {
  const [narrow, setNarrow] = useState(() => {
    try {
      return window.matchMedia(NARROW_QUERY).matches
    } catch {
      return false
    }
  })
  useEffect(() => {
    let mq: MediaQueryList
    try {
      mq = window.matchMedia(NARROW_QUERY)
    } catch {
      return
    }
    const onChange = () => setNarrow(mq.matches)
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])
  return narrow
}

interface TickProps {
  x?: number
  y?: number
  cy?: number
  textAnchor?: 'start' | 'middle' | 'end'
  payload?: { value: string }
  fontSize: number
  narrow: boolean
}

function AxisTick({ x = 0, y = 0, cy = 0, textAnchor = 'middle', payload, fontSize, narrow }: TickProps) {
  const lines = narrow ? labelLines(payload?.value ?? '') : [payload?.value ?? '']
  const lineHeight = fontSize * 1.15
  // Labels above the centre grow upward, labels below grow downward, so neither runs into the chart.
  const shift = y < cy - 1 ? -(lines.length - 1) * lineHeight : 0
  return (
    <text x={x} y={y + shift} textAnchor={textAnchor} fontSize={fontSize} fill="#4b5563" dominantBaseline="central">
      {lines.map((line, i) => (
        <tspan key={line} x={x} dy={i === 0 ? 0 : lineHeight}>
          {line}
        </tspan>
      ))}
    </text>
  )
}

export function RadarChart({ combined, comparisonProfile }: RadarChartProps) {
  const narrow = useNarrow()
  const fontSize = narrow ? 11 : 13
  const data = axes.map((axis) => ({
    axis: axis.name,
    value: combined[axis.id],
    ...(comparisonProfile ? { comparison: comparisonProfile.coords[axis.id] } : {}),
  }))

  return (
    <figure className="m-0">
      <div style={{ width: '100%', height: narrow ? 330 : 400 }}>
        <ResponsiveContainer>
          <RechartsRadarChart data={data} outerRadius={narrow ? '62%' : '70%'} margin={{ top: 16, right: 24, bottom: 16, left: 24 }}>
            <PolarGrid />
            <PolarAngleAxis dataKey="axis" tick={(props: object) => <AxisTick {...props} fontSize={fontSize} narrow={narrow} />} />
            <PolarRadiusAxis domain={[-10, 10]} tickCount={5} angle={67.5} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} />
            <Radar name="You" dataKey="value" stroke={YOU} fill={YOU} fillOpacity={0.15} />
            {comparisonProfile && (
              <Radar name={comparisonProfile.name} dataKey="comparison" stroke={THEM} fill={THEM} fillOpacity={0.15} />
            )}
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>
      <figcaption className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm text-gray-600">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="inline-block w-3 h-3 rounded-sm" style={{ background: YOU }} />
          You
        </span>
        {comparisonProfile && (
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="inline-block w-3 h-3 rounded-sm" style={{ background: THEM }} />
            {comparisonProfile.name}
          </span>
        )}
        <span className="text-gray-400">Scale −10 to +10; the centre is −10</span>
      </figcaption>
    </figure>
  )
}
