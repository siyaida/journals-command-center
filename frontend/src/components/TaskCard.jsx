import { useState } from 'react'

const PRIORITY_ICONS = { critical: '🔴', high: '🟠', medium: '🟡', low: '⚪' }

export default function TaskCard({ task }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className="card cursor-pointer hover:border-gray-500 transition-colors"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-3">
        <span className="text-sm mt-0.5">{PRIORITY_ICONS[task.priority] ?? '⚪'}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-1.5 py-0.5 rounded border mono badge-${task.status}`}>
              {task.status?.replace('_', ' ')}
            </span>
            {task.identifier && (
              <span className="text-xs text-gray-600 mono">{task.identifier}</span>
            )}
          </div>
          <div className="text-sm text-gray-200 font-medium">{task.title}</div>

          {expanded && task.description && (
            <div className="mt-2 text-xs text-gray-400 leading-relaxed whitespace-pre-wrap">
              {task.description}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
