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

export function RadarChart({ combined, comparisonProfile }: RadarChartProps) {
  const data = axes.map((axis) => ({
    axis: axis.name,
    value: combined[axis.id],
    ...(comparisonProfile ? { comparison: comparisonProfile.coords[axis.id] } : {}),
  }))

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <RechartsRadarChart data={data} outerRadius="70%">
          <PolarGrid />
          <PolarAngleAxis dataKey="axis" />
          <PolarRadiusAxis domain={[-10, 10]} />
          <Radar name="You" dataKey="value" stroke="#2563eb" fill="#2563eb" fillOpacity={0.15} />
          {comparisonProfile && (
            <Radar
              name={comparisonProfile.name}
              dataKey="comparison"
              stroke="#dc2626"
              fill="#dc2626"
              fillOpacity={0.15}
            />
          )}
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  )
}
