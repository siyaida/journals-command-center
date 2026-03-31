import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useApi } from '../hooks/useApi.js'
import TaskCard from '../components/TaskCard.jsx'

const STATUSES = ['all', 'in_progress', 'blocked', 'done', 'todo']
const CATEGORIES = ['all', 'strategy', 'infra', 'engineering', 'hiring', 'product', 'deployment', 'marketing']

export default function JournalView() {
  const { agentKey, date } = useParams()
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const { data: agent } = useApi(agentKey ? `/api/agents/${agentKey}` : null)
  const dateParam = date ? `?date=${date}` : ''
  const { data: tasks, loading } = useApi(agentKey ? `/api/journal/${agentKey}/tasks${dateParam}` : null)
  const { data: decisions } = useApi(agentKey ? `/api/decisions?agentKey=${agentKey}` : null)

  const filtered = (tasks ?? []).filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false
    return true
  })

  const grouped = filtered.reduce((acc, task) => {
    const day = task.date ?? 'Undated'
    if (!acc[day]) acc[day] = []
    acc[day].push(task)
    return acc
  }, {})

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">
          {agent?.name ?? agentKey} Journal
        </h1>
        <p className="text-gray-500 text-sm mt-1">{agent?.title ?? agent?.role}</p>
      </div>

      {/* Filters */}
      <div className="flex gap-6 mb-6">
        <div className="flex gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-xs px-3 py-1 rounded border transition-colors ${
                statusFilter === s
                  ? 'bg-dark-600 border-gray-500 text-white'
                  : 'border-dark-600 text-gray-500 hover:text-gray-300'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card animate-pulse h-14" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.keys(grouped).sort().reverse().map((day) => (
            <div key={day}>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 mono">{day}</div>
              <div className="space-y-2">
                {grouped[day].map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          ))}
          {Object.keys(grouped).length === 0 && (
            <div className="text-gray-600 text-sm">No tasks match the current filters.</div>
          )}
        </div>
      )}

      {/* Decision Log */}
      {decisions && decisions.length > 0 && (
        <div className="mt-10">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Decision Log</h2>
          <div className="space-y-3">
            {decisions.map((d) => (
              <div key={d.id} className="card">
                <div className="font-medium text-white text-sm">{d.title}</div>
                <div className="text-xs text-gray-500 mono mt-0.5">{d.date}</div>
                {d.decision && (
                  <div className="mt-2 text-xs text-gray-400">{d.decision}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
