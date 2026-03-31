import { Link, useParams } from 'react-router-dom'
import { useApi } from '../hooks/useApi.js'

const ROLE_ICONS = {
  cto: '⌥',
  ceo: '◈',
  cmo: '◉',
  cfo: '◎',
  coo: '◐',
  default: '◆',
}

export default function Sidebar() {
  const { data: agents } = useApi('/api/agents')
  const { agentKey } = useParams()

  return (
    <aside
      className="w-56 flex flex-col"
      style={{
        background: 'rgba(8,8,14,0.6)',
        borderRight: '1px solid rgba(255,255,255,0.04)',
        minHeight: '100%',
      }}
    >
      <div className="p-4">
        <div className="section-label mb-3" style={{ color: 'rgba(0,255,136,0.3)' }}>
          ◈ C-Level Journals
        </div>

        <div className="space-y-0.5">
          {agents?.map((agent) => {
            const active = agentKey === agent.urlKey
            const icon = ROLE_ICONS[agent.role] ?? ROLE_ICONS.default
            const isRunning = agent.status === 'running'

            return (
              <Link
                key={agent.id}
                to={`/journal/${agent.urlKey}`}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all group"
                style={{
                  background: active ? 'rgba(0,255,136,0.06)' : 'transparent',
                  borderLeft: active ? '2px solid #00ff88' : '2px solid transparent',
                  color: active ? '#f1f5f9' : '#475569',
                }}
              >
                <span
                  className="status-dot flex-shrink-0"
                  style={{
                    background: isRunning ? '#00ff88' : '#252535',
                    boxShadow: isRunning ? '0 0 5px rgba(0,255,136,0.6)' : 'none',
                  }}
                />
                <span
                  className="font-mono text-xs flex-shrink-0"
                  style={{ color: active ? 'rgba(0,255,136,0.7)' : '#252535' }}
                >
                  {icon}
                </span>
                <span className="truncate font-medium" style={{ fontSize: '0.8125rem' }}>
                  {agent.name}
                </span>
              </Link>
            )
          })}

          {!agents && (
            <div className="space-y-1 px-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 rounded animate-pulse"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom spacer with gradient */}
      <div className="flex-1" />
      <div
        className="h-px mx-4 mb-3"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,255,136,0.1), transparent)' }}
      />
      <div className="px-4 pb-4">
        <div className="font-mono text-center" style={{ fontSize: '0.625rem', color: '#252535' }}>
          SIYADA TECH © 2026
        </div>
      </div>
    </aside>
  )
}
