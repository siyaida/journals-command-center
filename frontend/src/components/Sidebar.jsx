import { Link, useParams } from 'react-router-dom'
import { useApi } from '../hooks/useApi.js'

const ROLE_COLORS = {
  cto:     '#00d4ff',
  ceo:     '#00ff88',
  cmo:     '#ff6b35',
  cfo:     '#9945ff',
  coo:     '#f59e0b',
  default: '#00ff88',
}

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
        background: 'rgba(7,7,12,0.85)',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        minHeight: '100%',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Brand area */}
      <div
        className="px-4 pt-5 pb-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div
          className="font-mono text-xs font-semibold uppercase tracking-widest mb-0.5"
          style={{ color: 'rgba(0,255,136,0.5)', letterSpacing: '0.15em' }}
        >
          ◈ Journals
        </div>
        <div className="font-mono text-xs" style={{ color: '#334155' }}>
          C-Level Agents
        </div>
      </div>

      {/* Agent nav */}
      <div className="p-3 flex-1">
        <div className="space-y-0.5">
          {agents?.map((agent) => {
            const active = agentKey === agent.urlKey
            const icon = ROLE_ICONS[agent.role] ?? ROLE_ICONS.default
            const accent = ROLE_COLORS[agent.role] ?? ROLE_COLORS.default
            const isRunning = agent.status === 'running'

            return (
              <Link
                key={agent.id}
                to={`/journal/${agent.urlKey}`}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all group"
                style={{
                  background: active ? `${accent}09` : 'transparent',
                  borderLeft: active ? `2px solid ${accent}` : '2px solid transparent',
                  color: active ? '#f1f5f9' : '#475569',
                  textDecoration: 'none',
                }}
              >
                {/* Status indicator */}
                <span
                  className="flex-shrink-0"
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: isRunning ? '#00ff88' : '#252535',
                    boxShadow: isRunning ? '0 0 5px rgba(0,255,136,0.7)' : 'none',
                    flexShrink: 0,
                  }}
                />
                <span
                  className="font-mono text-xs flex-shrink-0"
                  style={{ color: active ? `${accent}90` : '#2e2e42' }}
                >
                  {icon}
                </span>
                <span className="truncate font-medium" style={{ fontSize: '0.8125rem' }}>
                  {agent.name}
                </span>
                {active && (
                  <span
                    className="ml-auto font-mono flex-shrink-0"
                    style={{ fontSize: '0.5rem', color: `${accent}60` }}
                  >
                    ▶
                  </span>
                )}
              </Link>
            )
          })}

          {!agents && (
            <div className="space-y-1 px-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 rounded-lg shimmer"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        className="px-4 py-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div
          className="flex items-center gap-1.5 mb-1"
        >
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: '#00ff88',
              boxShadow: '0 0 4px rgba(0,255,136,0.8)',
            }}
          />
          <span className="font-mono" style={{ fontSize: '0.625rem', color: '#334155' }}>
            SYSTEM NOMINAL
          </span>
        </div>
        <div className="font-mono" style={{ fontSize: '0.5625rem', color: '#1e1e2e' }}>
          SIYADA TECH © 2026
        </div>
      </div>
    </aside>
  )
}
