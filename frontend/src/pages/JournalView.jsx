import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useApi } from '../hooks/useApi.js'
import TaskCard from '../components/TaskCard.jsx'

const STATUSES = ['all', 'in_progress', 'blocked', 'todo', 'done']

const STATUS_COUNTS = (tasks, s) =>
  s === 'all' ? tasks.length : tasks.filter(t => t.status === s).length

export default function JournalView() {
  const { agentKey, date } = useParams()
  const [statusFilter, setStatusFilter] = useState('all')

  const { data: agent } = useApi(agentKey ? `/api/agents/${agentKey}` : null)
  const dateParam = date ? `?date=${date}` : ''
  const { data: tasks, loading } = useApi(agentKey ? `/api/journal/${agentKey}/tasks${dateParam}` : null)
  const { data: decisions } = useApi(agentKey ? `/api/decisions?agentKey=${agentKey}` : null)

  const all = tasks ?? []
  const filtered = statusFilter === 'all' ? all : all.filter(t => t.status === statusFilter)

  const grouped = filtered.reduce((acc, task) => {
    const day = task.date ?? 'Undated'
    if (!acc[day]) acc[day] = []
    acc[day].push(task)
    return acc
  }, {})

  const inProgressCount = all.filter(t => t.status === 'in_progress').length
  const blockedCount    = all.filter(t => t.status === 'blocked').length
  const doneCount       = all.filter(t => t.status === 'done').length

  return (
    <div className="animate-fade-in">
      {/* Agent hero */}
      <div className="page-header">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  background: agent?.status === 'running' ? '#00ff88' : '#252535',
                  boxShadow: agent?.status === 'running' ? '0 0 8px rgba(0,255,136,0.7)' : 'none',
                }}
              />
              <h1 className="page-title">{agent?.name ?? agentKey}</h1>
            </div>
            <p className="page-subtitle">
              {agent?.title ?? agent?.role?.toUpperCase()} · Journal
            </p>
          </div>

          {/* Mini KPIs */}
          {all.length > 0 && (
            <div className="flex gap-3">
              {[
                { v: inProgressCount, l: 'active',  c: '#00d4ff' },
                { v: blockedCount,    l: 'blocked', c: '#ff2d78' },
                { v: doneCount,       l: 'done',    c: '#00ff88' },
              ].map(({ v, l, c }) => (
                <div
                  key={l}
                  className="text-center rounded-lg px-3 py-2"
                  style={{ background: `${c}08`, border: `1px solid ${c}18`, minWidth: '52px' }}
                >
                  <div className="font-bold font-mono text-lg leading-none" style={{ color: c }}>
                    {v}
                  </div>
                  <div className="font-mono text-xs mt-0.5" style={{ color: `${c}50` }}>{l}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status filters */}
      <div className="flex items-center gap-2 mb-6">
        {STATUSES.map((s) => {
          const count = STATUS_COUNTS(all, s)
          const active = statusFilter === s
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`filter-pill ${active ? 'active' : ''}`}
            >
              {s.replace('_', ' ')}
              {s !== 'all' && (
                <span
                  className="ml-1 font-bold"
                  style={{ opacity: active ? 1 : 0.5 }}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
        <div className="flex-1" />
        <span className="font-mono text-xs" style={{ color: '#252535' }}>
          {filtered.length} task{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Task list */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="rounded-lg animate-pulse"
              style={{ height: '56px', background: 'rgba(255,255,255,0.02)' }}
            />
          ))}
        </div>
      ) : Object.keys(grouped).length > 0 ? (
        <div className="space-y-8">
          {Object.keys(grouped).sort().reverse().map((day) => (
            <div key={day}>
              <div
                className="flex items-center gap-3 mb-3"
              >
                <span className="font-mono text-xs font-semibold" style={{ color: '#252535' }}>
                  {day}
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                />
                <span className="font-mono text-xs" style={{ color: '#1a1a2a' }}>
                  {grouped[day].length}
                </span>
              </div>
              <div className="space-y-2">
                {grouped[day].map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="rounded-xl p-10 text-center"
          style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)' }}
        >
          <div className="font-mono text-xs" style={{ color: '#252535' }}>
            {all.length === 0 ? 'No tasks found for this agent.' : 'No tasks match the current filter.'}
          </div>
        </div>
      )}

      {/* Decision log */}
      {decisions && decisions.length > 0 && (
        <div className="mt-12">
          <hr className="neon-divider" />
          <div className="flex items-center gap-3 mb-5">
            <div className="section-label-accent">◎ Decision Log</div>
            <div
              className="flex-1 h-px"
              style={{ background: 'linear-gradient(90deg, rgba(0,255,136,0.1), transparent)' }}
            />
          </div>
          <div className="space-y-3">
            {decisions.map((d) => (
              <div
                key={d.id}
                className="rounded-lg p-4"
                style={{
                  background: 'rgba(12,12,20,0.7)',
                  borderLeft: '3px solid rgba(0,255,136,0.3)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  borderLeftColor: 'rgba(0,255,136,0.3)',
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="font-medium text-sm" style={{ color: '#cbd5e1' }}>{d.title}</div>
                    {d.decision && (
                      <div className="mt-1.5 text-xs" style={{ color: '#475569' }}>{d.decision}</div>
                    )}
                  </div>
                  <div className="font-mono text-xs flex-shrink-0" style={{ color: '#252535' }}>
                    {d.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
