import { useApi } from '../hooks/useApi.js'
import KPIBar from '../components/KPIBar.jsx'
import AgentTile from '../components/AgentTile.jsx'

export default function CommandCenter() {
  const { data: agents, loading: agentsLoading } = useApi('/api/agents')
  const { data: summaries } = useApi('/api/kpi/agent-summaries')

  const now = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  const onlineCount = agents?.filter(a => a.status === 'running').length ?? 0
  const totalCount  = agents?.length ?? 0

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div className="page-header">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <h1 className="page-title">Command Center</h1>
              <span
                className="font-mono text-xs px-2.5 py-1 rounded-full"
                style={{
                  background: 'rgba(0,255,136,0.07)',
                  color: '#00ff88',
                  border: '1px solid rgba(0,255,136,0.2)',
                  letterSpacing: '0.1em',
                }}
              >
                LIVE
              </span>
            </div>
            <p className="page-subtitle">{now}</p>
          </div>

          {/* Online status summary */}
          <div
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
            style={{
              background: 'rgba(14,14,22,0.8)',
              border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="text-right">
              <div className="font-mono text-xs font-semibold" style={{ color: '#94a3b8' }}>
                AI Operations
              </div>
              <div className="font-mono text-xs" style={{ color: '#475569' }}>
                SIYADA TECH
              </div>
            </div>
            <div
              className="w-px h-8"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            />
            <div className="text-center">
              <div
                className="font-mono text-lg font-bold tabular-nums leading-none"
                style={{
                  color: onlineCount > 0 ? '#00ff88' : '#334155',
                  textShadow: onlineCount > 0 ? '0 0 16px rgba(0,255,136,0.5)' : 'none',
                }}
              >
                {onlineCount}
                <span className="text-xs font-normal" style={{ color: '#334155' }}>
                  /{totalCount}
                </span>
              </div>
              <div className="font-mono" style={{ fontSize: '0.55rem', color: '#334155', letterSpacing: '0.1em' }}>
                ONLINE
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Bar */}
      <KPIBar />

      {/* Agents section header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="section-label-accent">◈ C-Level Agents</div>
        <div
          className="flex-1 h-px"
          style={{ background: 'linear-gradient(90deg, rgba(0,255,136,0.12), transparent)' }}
        />
        {agents && (
          <span className="font-mono text-xs" style={{ color: '#334155' }}>
            {onlineCount} active · {totalCount} total
          </span>
        )}
      </div>

      {/* Agents grid */}
      {agentsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl shimmer"
              style={{ height: '192px', background: 'rgba(255,255,255,0.02)' }}
            />
          ))}
        </div>
      ) : agents?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent, i) => (
            <AgentTile
              key={agent.id}
              agent={agent}
              summary={summaries?.[agent.id]}
              style={{ animationDelay: `${i * 60}ms` }}
            />
          ))}
        </div>
      ) : (
        <div
          className="rounded-2xl p-12 text-center"
          style={{
            background: 'rgba(255,255,255,0.01)',
            border: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <div
            className="font-mono text-xs"
            style={{ color: '#334155' }}
          >
            No agents synced yet — run /api/issues/sync to populate
          </div>
        </div>
      )}
    </div>
  )
}
