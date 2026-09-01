'use client'

interface RiskGaugeProps {
  score: number
  size?: number
  label?: string
}

export function RiskGauge({ score, size = 180, label }: RiskGaugeProps) {
  const clamped = Math.min(100, Math.max(0, score))
  const angle = (clamped / 100) * 180
  const r = 70
  const cx = 90
  const cy = 92

  const endAngle = Math.PI - (angle * Math.PI) / 180
  const needleX = cx + r * 0.72 * Math.cos(endAngle)
  const needleY = cy - r * 0.72 * Math.sin(endAngle)

  const getRiskLabel = (s: number) => {
    if (s < 25) return { text: 'LOW RISK', color: 'var(--emerald)' }
    if (s < 50) return { text: 'MODERATE', color: '#FBBF24' }
    if (s < 75) return { text: 'HIGH RISK', color: '#F97316' }
    return { text: 'EXTREME', color: 'var(--coral)' }
  }

  const risk = getRiskLabel(clamped)

  const ticks = [0, 25, 50, 75, 100]

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size * 0.65} viewBox="0 0 180 118">
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--emerald)" />
            <stop offset="35%" stopColor="#FBBF24" />
            <stop offset="65%" stopColor="#F97316" />
            <stop offset="100%" stopColor="var(--coral)" />
          </linearGradient>
        </defs>

        {/* Background track */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="var(--border)"
          strokeWidth="14"
          strokeLinecap="round"
        />

        {/* Colored arc */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth="14"
          strokeLinecap="round"
        />

        {/* Tick marks */}
        {ticks.map((tick) => {
          const tickAngle = Math.PI - (tick / 100) * Math.PI
          const x1 = cx + (r - 8) * Math.cos(tickAngle)
          const y1 = cy - (r - 8) * Math.sin(tickAngle)
          const x2 = cx + (r + 4) * Math.cos(tickAngle)
          const y2 = cy - (r + 4) * Math.sin(tickAngle)
          return (
            <line key={tick} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--bg)" strokeWidth="2" />
          )
        })}

        {/* Needle shadow */}
        <line x1={cx} y1={cy} x2={needleX + 1} y2={needleY + 1} stroke="rgba(0,0,0,0.15)" strokeWidth="3" strokeLinecap="round" />

        {/* Needle */}
        <line x1={cx} y1={cy} x2={needleX} y2={needleY} stroke="var(--text-primary)" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="5" fill="var(--text-primary)" />
        <circle cx={cx} cy={cy} r="2.5" fill="var(--bg-card)" />

        {/* Score */}
        <text x={cx} y={cy - 14} textAnchor="middle" fill="var(--text-primary)" fontSize="26" fontWeight="700" fontFamily="Nunito, sans-serif">
          {clamped}
        </text>
        <text x={cx} y={cy + 2} textAnchor="middle" fill="var(--text-secondary)" fontSize="9" fontFamily="Nunito, sans-serif" letterSpacing="1">
          / 100
        </text>

        {/* Labels */}
        <text x={cx - r - 4} y={cy + 14} textAnchor="middle" fill="var(--text-muted)" fontSize="8" fontFamily="Nunito, sans-serif">0</text>
        <text x={cx + r + 4} y={cy + 14} textAnchor="middle" fill="var(--text-muted)" fontSize="8" fontFamily="Nunito, sans-serif">100</text>
      </svg>

      <div className="text-center -mt-1">
        <span className="text-xs font-body font-bold tracking-widest" style={{ color: risk.color }}>
          {label || risk.text}
        </span>
      </div>
    </div>
  )
}
