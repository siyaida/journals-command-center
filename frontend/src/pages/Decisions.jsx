import { useState } from 'react'
import { useApi } from '../hooks/useApi.js'

export default function Decisions() {
  const { data: decisions, loading } = useApi('/api/decisions')
  const [q, setQ] = useState('')

  const filtered = (decisions ?? []).filter(
    (d) =>
      !q ||
      d.title?.toLowerCase().includes(q.toLowerCase()) ||
      d.decision?.toLowerCase().includes(q.toLowerCase())
  )

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Decision Log</h1>
          <p className="text-gray-500 text-sm mt-1">All C-level decisions — searchable and persistent</p>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search decisions…"
          className="bg-dark-700 border border-dark-600 rounded px-3 py-1.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-gray-500 w-60"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card animate-pulse h-20" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((d) => (
            <div key={d.id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="font-medium text-white">{d.title}</div>
                  {d.context && (
                    <div className="text-xs text-gray-500 mt-1">{d.context}</div>
                  )}
                  {d.decision && (
                    <div className="mt-2 text-sm text-gray-300 border-l-2 border-neon-green/30 pl-3">
                      {d.decision}
                    </div>
                  )}
                  {d.outcome && (
                    <div className="mt-1 text-xs text-green-400">Outcome: {d.outcome}</div>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs text-gray-500 mono">{d.date}</div>
                  <div className="text-xs text-gray-600 mt-1">{d.agentName}</div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-gray-600 text-sm">No decisions found.</div>
          )}
        </div>
      )}
    </div>
  )
}
