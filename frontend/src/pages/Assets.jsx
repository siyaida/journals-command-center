import { useState } from 'react'
import { useApi } from '../hooks/useApi.js'

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

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Assets</h1>
          <p className="text-gray-500 text-sm mt-1">Repos, sites, deployments</p>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search assets…"
          className="bg-dark-700 border border-dark-600 rounded px-3 py-1.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-gray-500 w-60"
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card animate-pulse h-32" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {filtered.map((section) => (
            <div key={section.title}>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {section.icon} {section.title}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {section.items.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card hover:border-gray-500 transition-colors block"
                  >
                    <div className="font-medium text-sm text-white">{item.name}</div>
                    {item.url && (
                      <div className="text-xs text-gray-600 truncate mt-0.5">{item.url}</div>
                    )}
                    {item.status && (
                      <div className={`text-xs mt-1 ${
                        item.status === 'live' ? 'text-green-400' : 'text-gray-500'
                      }`}>
                        {item.status}
                      </div>
                    )}
                  </a>
                ))}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-gray-600 text-sm">No assets found.</div>
          )}
        </div>
      )}
    </div>
  )
}
