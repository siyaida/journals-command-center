import { useState } from 'react'

const STATUS_CONFIG = {
  done:        { color: '#00ff88', label: 'DONE',        bg: 'rgba(0,255,136,0.06)',  border: 'rgba(0,255,136,0.2)',  left: '#00ff88' },
  in_progress: { color: '#00d4ff', label: 'IN PROGRESS', bg: 'rgba(0,212,255,0.06)',  border: 'rgba(0,212,255,0.2)',  left: '#00d4ff' },
  blocked:     { color: '#ff2d78', label: 'BLOCKED',     bg: 'rgba(255,45,120,0.06)', border: 'rgba(255,45,120,0.2)', left: '#ff2d78' },
  todo:        { color: '#64748b', label: 'TODO',        bg: 'rgba(71,85,105,0.06)',  border: 'rgba(71,85,105,0.15)', left: '#334155' },
  backlog:     { color: '#9945ff', label: 'BACKLOG',     bg: 'rgba(153,69,255,0.06)', border: 'rgba(153,69,255,0.2)', left: '#9945ff' },
  in_review:   { color: '#ff6b35', label: 'IN REVIEW',   bg: 'rgba(255,107,53,0.06)', border: 'rgba(255,107,53,0.2)', left: '#ff6b35' },
  cancelled:   { color: '#334155', label: 'CANCELLED',   bg: 'rgba(51,65,85,0.04)',   border: 'rgba(51,65,85,0.15)',  left: '#1e1e2e' },
}

const PRIORITY_CONFIG = {
  critical: { color: '#ff2d78', symbol: '▲▲', label: 'critical' },
  high:     { color: '#ff6b35', symbol: '▲',  label: 'high' },
  medium:   { color: '#f59e0b', symbol: '◆',  label: 'medium' },
  low:      { color: '#334155', symbol: '▽',  label: 'low' },
}

export default function TaskCard({ task }) {
  const [expanded, setExpanded] = useState(false)

  const s = STATUS_CONFIG[task.status]    ?? STATUS_CONFIG.todo
  const p = PRIORITY_CONFIG[task.priority] ?? { color: '#334155', symbol: '·', label: '' }

  return (
    <div
      className="rounded-xl cursor-pointer transition-all animate-slide-up"
      onClick={() => setExpanded(!expanded)}
      style={{
        background: expanded ? 'rgba(16,16,28,0.9)' : 'rgba(12,12,20,0.7)',
        borderLeft: `3px solid ${s.left}`,
        border: `1px solid rgba(255,255,255,0.05)`,
        borderLeftColor: s.left,
        padding: '0.75rem 1rem',
        backdropFilter: 'blur(8px)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(18,18,28,0.9)' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = expanded ? 'rgba(16,16,28,0.9)' : 'rgba(12,12,20,0.7)' }}
    >
      <div className="flex items-start gap-3">
        {/* Priority */}
        <span
          className="font-mono text-xs mt-0.5 flex-shrink-0 w-4 text-center"
          style={{ color: p.color }}
          title={p.label}
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
              <span className="font-mono text-xs" style={{ color: '#334155' }}>
                {task.identifier}
              </span>
            )}
            {task.date && (
              <span className="font-mono text-xs ml-auto" style={{ color: '#334155' }}>
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
