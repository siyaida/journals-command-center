import { useState } from 'react'

const STATUS_CONFIG = {
  done:        { color: '#00ff88', label: 'DONE',        bg: 'rgba(0,255,136,0.06)',  border: 'rgba(0,255,136,0.2)' },
  in_progress: { color: '#00d4ff', label: 'IN PROGRESS', bg: 'rgba(0,212,255,0.06)',  border: 'rgba(0,212,255,0.2)' },
  blocked:     { color: '#ff2d78', label: 'BLOCKED',     bg: 'rgba(255,45,120,0.06)', border: 'rgba(255,45,120,0.2)' },
  todo:        { color: '#475569', label: 'TODO',        bg: 'rgba(71,85,105,0.06)',  border: 'rgba(71,85,105,0.15)' },
  backlog:     { color: '#9945ff', label: 'BACKLOG',     bg: 'rgba(153,69,255,0.06)', border: 'rgba(153,69,255,0.2)' },
  in_review:   { color: '#ff6b35', label: 'IN REVIEW',   bg: 'rgba(255,107,53,0.06)', border: 'rgba(255,107,53,0.2)' },
  cancelled:   { color: '#334155', label: 'CANCELLED',   bg: 'rgba(51,65,85,0.04)',   border: 'rgba(51,65,85,0.15)' },
}

const PRIORITY_CONFIG = {
  critical: { color: '#ff2d78', symbol: '▲▲' },
  high:     { color: '#ff6b35', symbol: '▲' },
  medium:   { color: '#f59e0b', symbol: '◆' },
  low:      { color: '#334155', symbol: '▽' },
}

export default function TaskCard({ task }) {
  const [expanded, setExpanded] = useState(false)

  const s = STATUS_CONFIG[task.status]   ?? STATUS_CONFIG.todo
  const p = PRIORITY_CONFIG[task.priority] ?? { color: '#334155', symbol: '·' }

  return (
    <div
      className="rounded-lg cursor-pointer transition-all animate-slide-up"
      onClick={() => setExpanded(!expanded)}
      style={{
        background: 'rgba(12,12,20,0.7)',
        borderLeft: `3px solid ${s.color}`,
        border: `1px solid rgba(255,255,255,0.05)`,
        borderLeftColor: s.color,
        padding: '0.75rem 1rem',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(18,18,28,0.9)' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(12,12,20,0.7)' }}
    >
      <div className="flex items-start gap-3">
        {/* Priority */}
        <span
          className="font-mono text-xs mt-0.5 flex-shrink-0 w-4 text-center"
          style={{ color: p.color }}
          title={task.priority}
        >
          {p.symbol}
        </span>

        <div className="flex-1 min-w-0">
          {/* Top row: badges */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span
              className="font-mono text-xs px-1.5 py-0.5 rounded"
              style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
            >
              {s.label}
            </span>
            {task.identifier && (
              <span
                className="font-mono text-xs"
                style={{ color: '#252535' }}
              >
                {task.identifier}
              </span>
            )}
            {task.date && (
              <span className="font-mono text-xs ml-auto" style={{ color: '#252535' }}>
                {task.date}
              </span>
            )}
          </div>

          {/* Title */}
          <div
            className="text-sm font-medium leading-snug"
            style={{ color: task.status === 'done' ? '#475569' : '#cbd5e1' }}
          >
            {task.title}
          </div>

          {/* Expanded description */}
          {expanded && task.description && (
            <div
              className="mt-2.5 text-xs leading-relaxed font-mono animate-fade-in"
              style={{
                color: '#475569',
                borderTop: '1px solid rgba(255,255,255,0.04)',
                paddingTop: '0.625rem',
                whiteSpace: 'pre-wrap',
              }}
            >
              {task.description.slice(0, 400)}{task.description.length > 400 ? '…' : ''}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
