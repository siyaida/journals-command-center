import { Link } from 'react-router-dom'

// CSS variable references — automatically adapt to dark/light theme
const ROLE_COLORS = {
  cto: { accent: 'var(--neon-blue)',   glow: 'rgba(0,212,255,0.15)',  label: 'CTO' },
  ceo: { accent: 'var(--neon-green)',  glow: 'rgba(0,255,136,0.15)',  label: 'CEO' },
  cmo: { accent: 'var(--neon-orange)', glow: 'rgba(255,107,53,0.15)', label: 'CMO' },
  cfo: { accent: 'var(--neon-purple)', glow: 'rgba(153,69,255,0.15)', label: 'CFO' },
  coo: { accent: 'var(--neon-amber)',  glow: 'rgba(245,158,11,0.15)', label: 'COO' },
}
const DEFAULT_ROLE = { accent: 'var(--neon-green)', glow: 'rgba(0,255,136,0.12)', label: '—' }

// Resolved hex accents for SVG and box-shadow (CSS vars don't work in SVG stroke / filter)
const ROLE_HEX = {
  cto: '#00d4ff', ceo: '#00ff88', cmo: '#ff6b35', cfo: '#9945ff', coo: '#f59e0b',
}
const DEFAULT_HEX = '#00ff88'

function ProgressRing({ pct, hexAccent, size = 52 }) {
  const strokeWidth = 3.5
  const r = (size - strokeWidth * 2) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border-card)" strokeWidth={strokeWidth} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={hexAccent} strokeWidth={strokeWidth}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 4px ${hexAccent}80)`, transition: 'stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)' }}
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
  const hexAccent = ROLE_HEX[agent.role] ?? DEFAULT_HEX
  const isRunning = agent.status === 'running'

  return (
    <Link
      to={`/journal/${agent.urlKey}`}
      className="block rounded-2xl p-5 transition-all group animate-fade-in card-premium"
      style={{ border: `1px solid var(--border-card)`, textDecoration: 'none', ...styleProp }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = hexAccent + '30'
        e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.2), 0 0 0 1px ${hexAccent}18`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = ''
        e.currentTarget.style.boxShadow = ''
      }}
    >
      {/* Corner accent glow */}
      <div
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full pointer-events-none opacity-40"
        style={{ background: `radial-gradient(circle, ${glow} 0%, transparent 65%)` }}
      />

      {/* Header row */}
      <div className="flex items-start justify-between mb-4 relative">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex-shrink-0" style={{ width: 8, height: 8 }}>
              <span
                className="block w-2 h-2 rounded-full"
                style={{
                  background: isRunning ? 'var(--neon-green)' : 'var(--idle-dot)',
                  boxShadow: isRunning ? '0 0 6px rgba(0,255,136,0.7)' : 'none',
                }}
              />
              {isRunning && (
                <span
                  className="absolute inset-0 rounded-full"
                  style={{ border: '1px solid rgba(0,255,136,0.5)', animation: 'pulse-ring 2s ease-out infinite' }}
                />
              )}
            </span>
            <span className="font-bold text-sm tracking-tight truncate" style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              {agent.name}
            </span>
          </div>
          <div className="font-mono text-xs ml-4" style={{ color: 'var(--text-muted)' }}>
            {agent.title || agent.role?.toUpperCase()}
          </div>
        </div>

        {/* Progress ring */}
        <div className="relative flex-shrink-0 ml-3" style={{ width: 52, height: 52 }}>
          <ProgressRing pct={pct} hexAccent={hexAccent} size={52} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono font-bold tabular-nums" style={{ color: accent, fontSize: '0.65rem', lineHeight: 1 }}>
              {pct}%
            </span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-4 relative">
        {[
          { val: done,       label: 'done',    hex: '#00ff88', cssVar: 'var(--neon-green)' },
          { val: inProgress, label: 'active',  hex: '#00d4ff', cssVar: 'var(--neon-blue)'  },
          { val: blocked,    label: 'blocked', hex: '#ff2d78', cssVar: 'var(--neon-pink)'  },
        ].map(({ val, label, hex, cssVar }) => (
          <div
            key={label}
            className="rounded-xl p-2 text-center"
            style={{ background: `${hex}07`, border: `1px solid ${hex}12` }}
          >
            <div className="text-xl font-bold font-mono tabular-nums leading-none" style={{ color: cssVar }}>
              {val}
            </div>
            <div className="font-mono mt-1" style={{ color: cssVar, opacity: 0.5, fontSize: '0.6rem', letterSpacing: '0.05em' }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 relative" style={{ borderTop: '1px solid var(--divider)' }}>
        <span className="font-mono text-xs" style={{ color: 'var(--text-dimmer)', fontSize: '0.65rem' }}>
          {todo} queued
        </span>
        <span
          className="font-mono text-xs px-2 py-0.5 rounded-full"
          style={{
            background: isRunning ? 'rgba(0,255,136,0.07)' : 'var(--bg-input)',
            color: isRunning ? 'var(--neon-green)' : 'var(--text-dimmer)',
            border: `1px solid ${isRunning ? 'rgba(0,255,136,0.18)' : 'var(--border-subtle)'}`,
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
