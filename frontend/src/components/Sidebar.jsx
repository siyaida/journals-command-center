import { Link, useParams } from 'react-router-dom'
import { useApi } from '../hooks/useApi.js'

const ROLE_COLORS = {
  cto:     'var(--neon-blue)',
  ceo:     'var(--neon-green)',
  cmo:     'var(--neon-orange)',
  cfo:     'var(--neon-purple)',
  coo:     'var(--neon-amber)',
  default: 'var(--neon-green)',
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
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-subtle)',
        minHeight: '100%',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transition: 'background 0.2s, border-color 0.2s',
      }}
    >
      {/* Brand area */}
      <div className="px-4 pt-5 pb-4" style={{ borderBottom: '1px solid var(--divider)' }}>
        <div
          className="font-mono text-xs font-semibold uppercase tracking-widest mb-0.5"
          style={{ color: 'var(--neon-green)', opacity: 0.6, letterSpacing: '0.15em' }}
        >
          ◈ Journals
        </div>
        <div className="font-mono text-xs" style={{ color: 'var(--text-dimmer)' }}>
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
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all"
                style={{
                  background: active ? 'var(--bg-input)' : 'transparent',
                  borderLeft: active ? `2px solid ${accent}` : '2px solid transparent',
                  color: active ? 'var(--text-primary)' : 'var(--text-muted)',
                  textDecoration: 'none',
                }}
              >
                <span
                  className="flex-shrink-0"
                  style={{
                    width: 6, height: 6,
                    borderRadius: '50%',
                    background: isRunning ? 'var(--neon-green)' : 'var(--idle-dot)',
                    boxShadow: isRunning ? '0 0 5px rgba(0,255,136,0.6)' : 'none',
                  }}
                />
                <span
                  className="font-mono text-xs flex-shrink-0"
                  style={{ color: active ? accent : 'var(--border-hover)' }}
                >
                  {icon}
                </span>
                <span className="truncate font-medium" style={{ fontSize: '0.8125rem' }}>
                  {agent.name}
                </span>
                {active && (
                  <span className="ml-auto font-mono flex-shrink-0" style={{ fontSize: '0.5rem', color: accent, opacity: 0.6 }}>
                    ▶
                  </span>
                )}
              </Link>
            )
          })}

          {!agents && (
            <div className="space-y-1 px-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 rounded-lg shimmer" style={{ background: 'var(--bg-input)' }} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-4" style={{ borderTop: '1px solid var(--divider)' }}>
        <div className="flex items-center gap-1.5 mb-1">
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--neon-green)', boxShadow: '0 0 4px rgba(0,255,136,0.7)' }} />
          <span className="font-mono" style={{ fontSize: '0.625rem', color: 'var(--text-dimmer)' }}>
            SYSTEM NOMINAL
          </span>
        </div>
        <div className="font-mono" style={{ fontSize: '0.5625rem', color: 'var(--text-dimmest)' }}>
          SIYADA TECH © 2026
        </div>
      </div>
    </aside>
  )
}
