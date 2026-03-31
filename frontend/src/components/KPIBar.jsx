import { useApi } from '../hooks/useApi.js'

const STATS = [
  { key: 'tasksDone',       label: 'DONE',        accent: '#00ff88', glow: 'rgba(0,255,136,0.25)' },
  { key: 'tasksInProgress', label: 'IN PROGRESS',  accent: '#00d4ff', glow: 'rgba(0,212,255,0.25)' },
  { key: 'tasksBlocked',    label: 'BLOCKED',      accent: '#ff2d78', glow: 'rgba(255,45,120,0.25)' },
  { key: 'agentsActive',    label: 'AGENTS LIVE',  accent: '#9945ff', glow: 'rgba(153,69,255,0.25)' },
  { key: 'sitesLive',       label: 'SITES LIVE',   accent: '#ff6b35', glow: 'rgba(255,107,53,0.25)' },
]

export default function KPIBar() {
  const { data: kpi, loading } = useApi('/api/kpi/snapshot')

  if (loading) {
    return (
      <div className="grid grid-cols-5 gap-3 mb-8">
        {STATS.map((s) => (
          <div
            key={s.key}
            className="rounded-xl animate-pulse"
            style={{ height: '80px', background: 'rgba(255,255,255,0.02)' }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-5 gap-3 mb-8">
      {STATS.map((s) => {
        const val = kpi?.[s.key] ?? 0
        return (
          <div
            key={s.key}
            className="rounded-xl p-4 text-center relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, rgba(14,14,22,0.95) 0%, rgba(10,10,16,0.98) 100%)`,
              border: `1px solid ${s.accent}22`,
              boxShadow: `0 0 0 1px ${s.accent}11, inset 0 1px 0 rgba(255,255,255,0.03)`,
            }}
          >
            {/* Subtle corner glow */}
            <div
              className="absolute top-0 right-0 w-12 h-12 rounded-bl-full opacity-20"
              style={{ background: `radial-gradient(circle, ${s.accent} 0%, transparent 70%)` }}
            />
            <div
              className="text-3xl font-bold font-mono tabular-nums mb-1"
              style={{ color: s.accent, textShadow: `0 0 20px ${s.glow}` }}
            >
              {val}
            </div>
            <div
              className="text-xs font-mono font-semibold tracking-widest"
              style={{ color: `${s.accent}55` }}
            >
              {s.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}
