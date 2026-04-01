import { useApi } from '../hooks/useApi.js'

// hex values kept for inline glow/shadow (CSS vars don't interpolate in hex color strings)
const STATS = [
  { key: 'tasksDone',       label: 'Tasks Done',  sub: 'COMPLETED',    cssVar: 'var(--neon-green)',  hex: '#00ff88', icon: '✓' },
  { key: 'tasksInProgress', label: 'In Progress', sub: 'ACTIVE',       cssVar: 'var(--neon-blue)',   hex: '#00d4ff', icon: '⟳' },
  { key: 'tasksBlocked',    label: 'Blocked',     sub: 'NEEDS ACTION', cssVar: 'var(--neon-pink)',   hex: '#ff2d78', icon: '!' },
  { key: 'agentsActive',    label: 'Agents Live', sub: 'ONLINE',       cssVar: 'var(--neon-purple)', hex: '#9945ff', icon: '◈' },
  { key: 'sitesLive',       label: 'Sites Live',  sub: 'DEPLOYED',     cssVar: 'var(--neon-orange)', hex: '#ff6b35', icon: '↗' },
]

export default function KPIBar() {
  const { data: kpi, loading } = useApi('/api/kpi/snapshot')

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
        {STATS.map((s) => (
          <div key={s.key} className="rounded-2xl shimmer" style={{ height: '108px', background: 'var(--bg-input)' }} />
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
            className="card-premium rounded-2xl p-5 text-center cursor-default"
            style={{
              border: `1px solid ${s.hex}18`,
              animationDelay: `${idx * 60}ms`,
            }}
          >
            {/* Corner glow */}
            <div
              className="absolute -top-10 -right-10 w-28 h-28 rounded-full pointer-events-none animate-glow-pulse"
              style={{ background: `radial-gradient(circle, ${s.hex}20 0%, transparent 65%)`, animationDelay: `${idx * 0.4}s` }}
            />

            {/* Scan line */}
            <div className="scan-line" style={{ background: `linear-gradient(90deg, transparent, ${s.hex}25, transparent)` }} />

            {/* Icon */}
            <div className="font-mono text-sm mb-1.5 relative" style={{ color: s.cssVar, opacity: 0.5 }}>
              {s.icon}
            </div>

            {/* Number */}
            <div
              className="text-4xl font-bold font-mono tabular-nums mb-1 relative"
              style={{ color: s.cssVar, letterSpacing: '-0.03em', lineHeight: 1 }}
            >
              {val}
            </div>

            {/* Label */}
            <div className="font-semibold text-xs mb-0.5 relative" style={{ color: 'var(--text-secondary)' }}>
              {s.label}
            </div>
            <div className="font-mono tracking-widest relative" style={{ color: s.cssVar, opacity: 0.4, fontSize: '0.55rem' }}>
              {s.sub}
            </div>

            {/* Bottom accent line */}
            <div
              className="absolute bottom-0 left-4 right-4 h-px rounded-full"
              style={{ background: `linear-gradient(90deg, transparent, ${s.hex}40, transparent)` }}
            />
          </div>
        )
      })}
    </div>
  )
}
