import { useApi } from '../hooks/useApi.js'

const STATS = [
  { key: 'tasksDone',       label: 'Tasks Done',    sub: 'COMPLETED',    accent: '#00ff88', glow: 'rgba(0,255,136,0.3)',  icon: '✓' },
  { key: 'tasksInProgress', label: 'In Progress',   sub: 'ACTIVE',       accent: '#00d4ff', glow: 'rgba(0,212,255,0.3)',  icon: '⟳' },
  { key: 'tasksBlocked',    label: 'Blocked',       sub: 'NEEDS ACTION', accent: '#ff2d78', glow: 'rgba(255,45,120,0.3)', icon: '!' },
  { key: 'agentsActive',    label: 'Agents Live',   sub: 'ONLINE',       accent: '#9945ff', glow: 'rgba(153,69,255,0.3)', icon: '◈' },
  { key: 'sitesLive',       label: 'Sites Live',    sub: 'DEPLOYED',     accent: '#ff6b35', glow: 'rgba(255,107,53,0.3)', icon: '↗' },
]

export default function KPIBar() {
  const { data: kpi, loading } = useApi('/api/kpi/snapshot')

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
        {STATS.map((s) => (
          <div
            key={s.key}
            className="rounded-2xl shimmer"
            style={{ height: '108px', background: 'rgba(255,255,255,0.02)' }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
      {STATS.map((s, idx) => {
        const val = kpi?.[s.key] ?? 0
        return (
          <div
            key={s.key}
            className="card-premium rounded-2xl p-5 text-center group cursor-default"
            style={{
              border: `1px solid ${s.accent}18`,
              boxShadow: `0 0 0 1px ${s.accent}0a, inset 0 1px 0 rgba(255,255,255,0.04)`,
              animationDelay: `${idx * 60}ms`,
            }}
          >
            {/* Animated corner glow */}
            <div
              className="absolute -top-10 -right-10 w-28 h-28 rounded-full pointer-events-none animate-glow-pulse"
              style={{
                background: `radial-gradient(circle, ${s.accent}30 0%, transparent 65%)`,
                animationDelay: `${idx * 0.4}s`,
              }}
            />

            {/* Scan line */}
            <div className="scan-line" style={{ background: `linear-gradient(90deg, transparent, ${s.accent}30, transparent)` }} />

            {/* Icon */}
            <div
              className="font-mono text-sm mb-1.5 relative"
              style={{ color: `${s.accent}50` }}
            >
              {s.icon}
            </div>

            {/* Number */}
            <div
              className="text-4xl font-bold font-mono tabular-nums mb-1 relative"
              style={{
                color: s.accent,
                textShadow: `0 0 24px ${s.glow}, 0 0 48px ${s.glow.replace('0.3', '0.12')}`,
                letterSpacing: '-0.03em',
                lineHeight: 1,
              }}
            >
              {val}
            </div>

            {/* Label */}
            <div
              className="font-semibold text-xs mb-0.5 relative"
              style={{ color: '#94a3b8' }}
            >
              {s.label}
            </div>
            <div
              className="font-mono text-xs tracking-widest relative"
              style={{ color: `${s.accent}40`, fontSize: '0.55rem' }}
            >
              {s.sub}
            </div>

            {/* Bottom accent line */}
            <div
              className="absolute bottom-0 left-4 right-4 h-px rounded-full"
              style={{
                background: `linear-gradient(90deg, transparent, ${s.accent}50, transparent)`,
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
