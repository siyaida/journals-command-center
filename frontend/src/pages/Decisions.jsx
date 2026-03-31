import { useState } from 'react'
import { useApi } from '../hooks/useApi.js'

export default function Decisions() {
  const { data: decisions, loading } = useApi('/api/decisions')
  const [q, setQ] = useState('')

  const filtered = (decisions ?? []).filter(
    (d) =>
      !q ||
      d.title?.toLowerCase().includes(q.toLowerCase()) ||
      d.decision?.toLowerCase().includes(q.toLowerCase()) ||
      d.context?.toLowerCase().includes(q.toLowerCase())
  )

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Decision Log</h1>
            <p className="page-subtitle">All C-level decisions · searchable · persistent</p>
          </div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search decisions…"
            className="input-dark w-56"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl animate-pulse"
              style={{ height: '80px', background: 'rgba(255,255,255,0.02)' }}
            />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((d, idx) => (
            <div
              key={d.id}
              className="rounded-xl p-5 transition-all animate-slide-up"
              style={{
                background: 'rgba(12,12,20,0.8)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderLeft: '3px solid rgba(0,255,136,0.25)',
                animationDelay: `${idx * 40}ms`,
              }}
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div
                    className="font-semibold text-sm mb-1"
                    style={{ color: '#e2e8f0', letterSpacing: '-0.01em' }}
                  >
                    {d.title}
                  </div>
                  {d.context && (
                    <div className="text-xs mb-2" style={{ color: '#334155' }}>{d.context}</div>
                  )}
                  {d.decision && (
                    <div
                      className="text-sm pl-3"
                      style={{
                        color: '#94a3b8',
                        borderLeft: '2px solid rgba(0,255,136,0.2)',
                      }}
                    >
                      {d.decision}
                    </div>
                  )}
                  {d.outcome && (
                    <div
                      className="mt-2 text-xs font-mono px-2 py-1 rounded inline-block"
                      style={{
                        background: 'rgba(0,255,136,0.06)',
                        color: '#00ff88',
                        border: '1px solid rgba(0,255,136,0.15)',
                      }}
                    >
                      ✓ {d.outcome}
                    </div>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-mono text-xs" style={{ color: '#252535' }}>{d.date}</div>
                  {d.agent_name && (
                    <div className="font-mono text-xs mt-1" style={{ color: '#1a1a2a' }}>
                      {d.agent_name}
                    </div>
                  )}
                </div>
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
            {q ? 'No decisions match your search.' : 'No decisions logged yet.'}
          </div>
        </div>
      )}
    </div>
  )
}
