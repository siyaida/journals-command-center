import { Link } from 'react-router-dom'

const ROLE_COLORS = {
  cto: { accent: '#00d4ff', glow: 'rgba(0,212,255,0.2)' },
  ceo: { accent: '#00ff88', glow: 'rgba(0,255,136,0.2)' },
  cmo: { accent: '#ff6b35', glow: 'rgba(255,107,53,0.2)' },
  cfo: { accent: '#9945ff', glow: 'rgba(153,69,255,0.2)' },
  coo: { accent: '#f59e0b', glow: 'rgba(245,158,11,0.2)' },
}
const DEFAULT_ROLE = { accent: '#00ff88', glow: 'rgba(0,255,136,0.15)' }

export default function AgentTile({ agent, summary }) {
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
      className="block rounded-xl p-5 transition-all group animate-fade-in"
      style={{
        background: 'linear-gradient(135deg, rgba(14,14,22,0.95) 0%, rgba(10,10,16,0.98) 100%)',
        border: `1px solid ${accent}18`,
        boxShadow: `0 0 0 1px ${accent}0a`,
        textDecoration: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.border = `1px solid ${accent}35`
        e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${accent}18, ${glow.replace('0.2', '0.12')} 0 0 24px`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = `1px solid ${accent}18`
        e.currentTarget.style.boxShadow = `0 0 0 1px ${accent}0a`
      }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{
                background: isRunning ? '#00ff88' : '#252535',
                boxShadow: isRunning ? '0 0 6px rgba(0,255,136,0.7)' : 'none',
              }}
            />
            <span
              className="font-bold text-sm tracking-tight"
              style={{ color: '#f1f5f9', letterSpacing: '-0.01em' }}
            >
              {agent.name}
            </span>
          </div>
          <div className="font-mono text-xs ml-4" style={{ color: '#3d3d55' }}>
            {agent.title || agent.role?.toUpperCase()}
          </div>
        </div>
        <span
          className="font-mono text-xs px-1.5 py-0.5 rounded"
          style={{
            background: isRunning ? 'rgba(0,255,136,0.08)' : 'rgba(255,255,255,0.03)',
            color: isRunning ? '#00ff88' : '#3d3d55',
            border: `1px solid ${isRunning ? 'rgba(0,255,136,0.2)' : 'rgba(255,255,255,0.05)'}`,
          }}
        >
          {isRunning ? '● RUN' : '○ OFF'}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { val: done,       label: 'done',    color: '#00ff88' },
          { val: inProgress, label: 'active',  color: '#00d4ff' },
          { val: blocked,    label: 'blocked', color: '#ff2d78' },
        ].map(({ val, label, color }) => (
          <div
            key={label}
            className="rounded-lg p-2 text-center"
            style={{ background: `${color}08`, border: `1px solid ${color}12` }}
          >
            <div
              className="text-xl font-bold font-mono tabular-nums leading-none"
              style={{ color, textShadow: `0 0 12px ${color}50` }}
            >
              {val}
            </div>
            <div className="text-xs font-mono mt-1" style={{ color: `${color}55` }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="font-mono text-xs" style={{ color: '#252535' }}>completion</span>
          <span className="font-mono text-xs" style={{ color: accent }}>{pct}%</span>
        </div>
        <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${accent}, ${accent}99)`,
              boxShadow: `0 0 6px ${accent}60`,
            }}
          />
        </div>
      </div>
    </Link>
  )
}
