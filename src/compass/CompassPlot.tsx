import { BAND } from './data'
import { signed } from './engine'

// Z runs from violet (-10, post-biological) to green (+10, ecological).
const ZNEG = [109, 74, 194]
const ZPOS = [31, 138, 92]
export function zColor(z: number) {
  const t = (Math.max(-10, Math.min(10, z)) + 10) / 20
  return `rgb(${ZNEG.map((v, i) => Math.round(v + (ZPOS[i] - v) * t)).join(',')})`
}

interface Props {
  x: number
  y: number
  z: number
}

/** X across, Y up, with your point colored by Z; dashed lines mark the tier boundaries. */
export function CompassPlot({ x, y, z }: Props) {
  const P0 = 60
  const P1 = 400
  const U = (P1 - P0) / 20
  const px = (v: number) => P0 + (v + 10) * U
  const py = (v: number) => P1 - (v + 10) * U
  const zy = (v: number) => P1 - ((v + 10) * (P1 - P0)) / 20
  const ticks = [-10, -5, 0, 5, 10]
  return (
    <div className="flex flex-wrap items-start justify-center gap-4">
      <svg viewBox="0 0 460 460" className="w-full max-w-md h-auto" role="img"
        aria-label={`Compass position: X ${signed(x)}, Y ${signed(y)}, Z ${signed(z)}`}>
        <rect x={P0} y={P0} width={P1 - P0} height={P1 - P0} fill="#f9fafb" stroke="#9ca3af" />
        {ticks.map((v) => (
          <g key={v}>
            <line x1={px(v)} y1={P0} x2={px(v)} y2={P1} stroke="#d1d5db" strokeWidth={v === 0 ? 1.5 : 1} />
            <line x1={P0} y1={py(v)} x2={P1} y2={py(v)} stroke="#d1d5db" strokeWidth={v === 0 ? 1.5 : 1} />
            <text x={px(v)} y={P1 + 16} fontSize="10" textAnchor="middle" fill="#6b7280">{v}</text>
            <text x={P0 - 8} y={py(v) + 3.5} fontSize="10" textAnchor="end" fill="#6b7280">{v}</text>
          </g>
        ))}
        {[-BAND, BAND].map((v) => (
          <g key={`b${v}`}>
            <line x1={px(v)} y1={P0} x2={px(v)} y2={P1} stroke="#374151" strokeOpacity={0.5} strokeDasharray="4 4" />
            <line x1={P0} y1={py(v)} x2={P1} y2={py(v)} stroke="#374151" strokeOpacity={0.5} strokeDasharray="4 4" />
          </g>
        ))}
        <text x={(P0 + P1) / 2} y={P0 - 14} fontSize="12" fontWeight="600" textAnchor="middle" fill="#111827">Autonomous Emancipation · Y +10</text>
        <text x={(P0 + P1) / 2} y={P1 + 36} fontSize="12" fontWeight="600" textAnchor="middle" fill="#111827">Anthropocentric Instrumentalism · Y −10</text>
        <text transform={`translate(${P0 - 34},${(P0 + P1) / 2}) rotate(-90)`} fontSize="12" fontWeight="600" textAnchor="middle" fill="#111827">Substrate Biologism · X −10</text>
        <text transform={`translate(${P1 + 22},${(P0 + P1) / 2}) rotate(90)`} fontSize="12" fontWeight="600" textAnchor="middle" fill="#111827">Embodied Functionalism · X +10</text>
        <circle cx={px(x)} cy={py(y)} r={11} fill={zColor(z)} stroke="#111827" strokeWidth={2} />
        <text x={px(x)} y={py(y) - 17} fontSize="12" fontWeight="700" textAnchor="middle" fill="#111827"
          paintOrder="stroke" stroke="#ffffff" strokeWidth={3}>You</text>
      </svg>
      <svg viewBox="0 0 110 460" className="w-24 h-auto" role="img" aria-label={`Z axis: ${signed(z)}`}>
        <defs>
          <linearGradient id="compass-zg" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor={zColor(-10)} />
            <stop offset="1" stopColor={zColor(10)} />
          </linearGradient>
        </defs>
        <text x="55" y={P0 - 28} fontSize="12" fontWeight="600" textAnchor="middle" fill="#111827">Z axis</text>
        <text x="55" y={P0 - 12} fontSize="10" textAnchor="middle" fill="#6b7280">Ecological +10</text>
        <text x="55" y={P1 + 20} fontSize="10" textAnchor="middle" fill="#6b7280">Post-biological −10</text>
        <rect x={36} y={P0} width={16} height={P1 - P0} rx={8} fill="url(#compass-zg)" />
        {ticks.map((v) => (
          <text key={v} x={30} y={zy(v) + 3.5} fontSize="10" textAnchor="end" fill="#6b7280">{v}</text>
        ))}
        {[-BAND, BAND].map((v) => (
          <line key={v} x1={33} y1={zy(v)} x2={55} y2={zy(v)} stroke="#111827" strokeWidth={1.5} strokeDasharray="3 2" />
        ))}
        <path d={`M${56} ${zy(z)} l12 -7 v14 z`} fill="#111827" />
        <text x={71} y={zy(z) + 4} fontSize="11" fontWeight="600" fill="#111827">{z.toFixed(1)}</text>
      </svg>
    </div>
  )
}
