import { useApi } from '../hooks/useApi.js'
import KPIBar from '../components/KPIBar.jsx'
import AgentTile from '../components/AgentTile.jsx'

export default function CommandCenter() {
  const { data: agents, loading: agentsLoading } = useApi('/api/agents')
  const { data: summaries } = useApi('/api/kpi/agent-summaries')

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Command Center</h1>
        <p className="text-gray-500 text-sm mt-1">Real-time cross-agent visibility — Siyada Tech</p>
      </div>

      <KPIBar />

      <div className="mb-4">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">C-Level Agents</h2>
      </div>

      {agentsLoading ? (
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card animate-pulse h-32" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {agents?.map((agent) => (
            <AgentTile
              key={agent.id}
              agent={agent}
              summary={summaries?.[agent.id]}
            />
          ))}
        </div>
      )}
    </div>
  )
}
