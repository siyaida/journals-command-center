import { useState } from 'react'
import { useApi } from '../hooks/useApi.js'

const STATUS_STYLE = {
  live:     { color: '#00ff88', bg: 'rgba(0,255,136,0.08)',  border: 'rgba(0,255,136,0.2)',  dot: '#00ff88' },
  staging:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', dot: '#f59e0b' },
  archived: { color: '#334155', bg: 'rgba(51,65,85,0.06)',   border: 'rgba(51,65,85,0.15)',  dot: '#334155' },
  default:  { color: '#475569', bg: 'rgba(71,85,105,0.06)',  border: 'rgba(71,85,105,0.15)', dot: '#475569' },
}

export default function Assets() {
  const { data: assets, loading } = useApi('/api/assets')
  const [q, setQ] = useState('')

  const sections = assets?.sections ?? []
  const filtered = sections.map((s) => ({
    ...s,
    items: s.items.filter(
      (item) =>
        !q ||
        item.name?.toLowerCase().includes(q.toLowerCase()) ||
        item.url?.toLowerCase().includes(q.toLowerCase())
    ),
  })).filter((s) => s.items.length > 0)

  const totalItems = sections.reduce((n, s) => n + s.items.length, 0)
  const liveItems  = sections.reduce((n, s) => n + s.items.filter(i => i.status === 'live').length, 0)

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Assets</h1>
            <p className="page-subtitle">
              Repos · Sites · Deployments
              {totalItems > 0 && ` · ${liveItems}/${totalItems} live`}
            </p>
          </div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search assets…"
            className="input-dark w-52"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <div
                className="h-4 w-24 rounded animate-pulse mb-3"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              />
              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, j) => (
                  <div
                    key={j}
                    className="rounded-xl animate-pulse"
                    style={{ height: '68px', background: 'rgba(255,255,255,0.02)' }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-8">
          {filtered.map((section) => (
            <div key={section.title}>
              <div className="flex items-center gap-3 mb-4">
                <div className="section-label-accent">
                  {section.icon && <span className="mr-1">{section.icon}</span>}
                  {section.title}
                </div>
                <div
                  className="flex-1 h-px"
                  style={{ background: 'linear-gradient(90deg, rgba(0,255,136,0.1), transparent)' }}
                />
                <span className="font-mono text-xs" style={{ color: '#1a1a2a' }}>
                  {section.items.length}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {section.items.map((item) => {
                  const ss = STATUS_STYLE[item.status] ?? STATUS_STYLE.default
                  return (
                    <a
                      key={item.name}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl p-4 flex items-start gap-3 transition-all group"
                      style={{
                        background: 'rgba(12,12,20,0.8)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        textDecoration: 'none',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)' }}
                    >
                      {/* Status dot */}
                      <span
                        className="mt-1.5 flex-shrink-0 w-2 h-2 rounded-full"
                        style={{
                          background: ss.dot,
                          boxShadow: item.status === 'live' ? `0 0 5px ${ss.dot}80` : 'none',
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div
                          className="font-medium text-sm truncate"
                          style={{ color: '#cbd5e1' }}
                        >
                          {item.name}
                        </div>
                        {item.url && (
                          <div
                            className="text-xs font-mono truncate mt-0.5"
                            style={{ color: '#252535' }}
                          >
                            {item.url.replace(/^https?:\/\//, '')}
                          </div>
                        )}
                        {item.note && (
                          <div className="text-xs mt-1" style={{ color: '#334155' }}>{item.note}</div>
                        )}
                      </div>
                      <span
                        className="flex-shrink-0 font-mono text-xs px-1.5 py-0.5 rounded"
                        style={{ background: ss.bg, color: ss.color, border: `1px solid ${ss.border}` }}
                      >
                        {item.status ?? 'live'}
                      </span>
                    </a>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="rounded-xl p-12 text-center"
          style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)' }}
        >
          <div className="font-mono text-xs" style={{ color: '#252535' }}>
            {q ? 'No assets match your search.' : 'No assets in the database yet.'}
          </div>
        </div>
      )}
    </div>
  )
}
