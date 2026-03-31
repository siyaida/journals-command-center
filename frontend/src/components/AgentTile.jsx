import { Link } from 'react-router-dom'

const ROLE_COLORS = {
  cto: { accent: '#00d4ff', glow: 'rgba(0,212,255,0.2)',  label: 'CTO' },
  ceo: { accent: '#00ff88', glow: 'rgba(0,255,136,0.2)',  label: 'CEO' },
  cmo: { accent: '#ff6b35', glow: 'rgba(255,107,53,0.2)', label: 'CMO' },
  cfo: { accent: '#9945ff', glow: 'rgba(153,69,255,0.2)', label: 'CFO' },
  coo: { accent: '#f59e0b', glow: 'rgba(245,158,11,0.2)', label: 'COO' },
}
const DEFAULT_ROLE = { accent: '#00ff88', glow: 'rgba(0,255,136,0.15)', label: '—' }

function ProgressRing({ pct, accent, size = 52 }) {
  const strokeWidth = 3.5
  const r = (size - strokeWidth * 2) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  return (
    <svg
      width={size}
      height={size}
      style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}
    >
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={strokeWidth}
      />
      {/* Fill */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={accent}
        strokeWidth={strokeWidth}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{
          filter: `drop-shadow(0 0 4px ${accent}90)`,
          transition: 'stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)',
        }}
      />
    </svg>
  )
}

export default function AgentTile({ agent, summary, style: styleProp }) {
  const done       = summary?.done       ?? 0
  const inProgress = summary?.inProgress ?? 0
  const blocked    = summary?.blocked    ?? 0
  const todo       = summary?.todo       ?? 0
  const total      = done + inProgress + blocked + todo
  const pct        = total > 0 ? Math.round((done / total) * 100) : 0

  const { accent, glow } = ROLE_COLORS[agent.role] ?? DEFAULT_ROLE
  const isRunning = agent.status === 'running'

  return (
    <Link
      to={`/journal/${agent.urlKey}`}
      className="block rounded-2xl p-5 transition-all group animate-fade-in card-premium"
      style={{
        border: `1px solid ${accent}15`,
        textDecoration: 'none',
        ...styleProp,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.border = `1px solid ${accent}30`
        e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px ${accent}18, 0 0 32px ${accent}12`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = `1px solid ${accent}15`
        e.currentTarget.style.boxShadow = ''
      }}
    >
      {/* Corner accent glow */}
      <div
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full pointer-events-none opacity-50"
        style={{ background: `radial-gradient(circle, ${glow} 0%, transparent 65%)` }}
      />

      {/* Header row */}
      <div className="flex items-start justify-between mb-4 relative">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {/* Status dot with pulse ring if running */}
            <span className="relative flex-shrink-0" style={{ width: 8, height: 8 }}>
              <span
                className="block w-2 h-2 rounded-full"
                style={{
                  background: isRunning ? '#00ff88' : '#252535',
                  boxShadow: isRunning ? '0 0 6px rgba(0,255,136,0.8)' : 'none',
                }}
              />
              {isRunning && (
                <span
                  className="absolute inset-0 rounded-full"
                  style={{
                    border: '1px solid rgba(0,255,136,0.5)',
                    animation: 'pulse-ring 2s ease-out infinite',
                  }}
                />
              )}
            </span>
            <span
              className="font-bold text-sm tracking-tight truncate"
              style={{ color: '#f1f5f9', letterSpacing: '-0.01em' }}
            >
              {agent.name}
            </span>
          </div>
          <div className="font-mono text-xs ml-4" style={{ color: '#475569' }}>
            {agent.title || agent.role?.toUpperCase()}
          </div>
        </div>

        {/* Progress ring with % inside */}
        <div className="relative flex-shrink-0 ml-3" style={{ width: 52, height: 52 }}>
          <ProgressRing pct={pct} accent={accent} size={52} />
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ transform: 'rotate(0deg)' }}
          >
            <span
              className="font-mono font-bold tabular-nums"
              style={{ color: accent, fontSize: '0.65rem', lineHeight: 1 }}
            >
              {pct}%
            </span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-4 relative">
        {[
          { val: done,       label: 'done',    color: '#00ff88' },
          { val: inProgress, label: 'active',  color: '#00d4ff' },
          { val: blocked,    label: 'blocked', color: '#ff2d78' },
        ].map(({ val, label, color }) => (
          <div
            key={label}
            className="rounded-xl p-2 text-center"
            style={{
              background: `${color}07`,
              border: `1px solid ${color}12`,
            }}
          >
            <div
              className="text-xl font-bold font-mono tabular-nums leading-none"
              style={{ color, textShadow: `0 0 10px ${color}50` }}
            >
              {val}
            </div>
            <div className="font-mono mt-1" style={{ color: `${color}55`, fontSize: '0.6rem', letterSpacing: '0.05em' }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Footer: run status */}
      <div
        className="flex items-center justify-between pt-3 relative"
        style={{ borderTop: `1px solid ${accent}0a` }}
      >
        <span
          className="font-mono text-xs"
          style={{ color: '#334155', fontSize: '0.65rem' }}
        >
          {todo} queued
        </span>
        <span
          className="font-mono text-xs px-2 py-0.5 rounded-full"
          style={{
            background: isRunning ? 'rgba(0,255,136,0.07)' : 'rgba(255,255,255,0.02)',
            color: isRunning ? '#00ff88' : '#334155',
            border: `1px solid ${isRunning ? 'rgba(0,255,136,0.18)' : 'rgba(255,255,255,0.04)'}`,
            fontSize: '0.6rem',
            letterSpacing: '0.08em',
          }}
        >
          {isRunning ? '● RUNNING' : '○ OFFLINE'}
        </span>
      </div>
    </Link>
  )
}
