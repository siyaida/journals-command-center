import { useApi } from '../hooks/useApi.js'
import KPIBar from '../components/KPIBar.jsx'
import AgentTile from '../components/AgentTile.jsx'

export default function CommandCenter() {
  const { data: agents, loading: agentsLoading } = useApi('/api/agents')
  const { data: summaries } = useApi('/api/kpi/agent-summaries')

  const now = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div className="page-header">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="page-title">Command Center</h1>
              <span
                className="font-mono text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: 'rgba(0,255,136,0.08)',
                  color: '#00ff88',
                  border: '1px solid rgba(0,255,136,0.2)',
                }}
              >
                LIVE
              </span>
            </div>
            <p className="page-subtitle">{now}</p>
          </div>
          <div className="font-mono text-xs text-right" style={{ color: '#252535' }}>
            <div>SIYADA TECH</div>
            <div style={{ color: '#1a1a2a' }}>AI Operations Layer</div>
          </div>
        </div>
      </div>

      {/* KPI Bar */}
      <KPIBar />

      {/* Agents section */}
      <div className="mb-5 flex items-center gap-3">
        <div className="section-label-accent">◈ C-Level Agents</div>
        <div
          className="flex-1 h-px"
          style={{ background: 'linear-gradient(90deg, rgba(0,255,136,0.1), transparent)' }}
        />
        {agents && (
          <span className="font-mono text-xs" style={{ color: '#252535' }}>
            {agents.filter(a => a.status === 'running').length}/{agents.length} online
          </span>
        )}
      </div>

      {agentsLoading ? (
        <div className="grid grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl animate-pulse"
              style={{ height: '160px', background: 'rgba(255,255,255,0.02)' }}
            />
          ))}
        </div>
      ) : agents?.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {agents.map((agent) => (
            <AgentTile
              key={agent.id}
              agent={agent}
              summary={summaries?.[agent.id]}
            />
          ))}
        </div>
      ) : (
        <div
          className="rounded-xl p-12 text-center"
          style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)' }}
        >
          <div className="font-mono text-xs" style={{ color: '#252535' }}>
            No agents synced yet — run /api/issues/sync to populate
          </div>
        </div>
      )}
    </div>
  )
}
