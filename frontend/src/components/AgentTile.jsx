import { Link } from 'react-router-dom'

const STATUS_COLORS = {
  done: 'text-green-400',
  in_progress: 'text-blue-400',
  blocked: 'text-red-400',
  todo: 'text-gray-400',
}

export default function AgentTile({ agent, summary }) {
  const done = summary?.done ?? 0
  const inProgress = summary?.inProgress ?? 0
  const blocked = summary?.blocked ?? 0
  const total = done + inProgress + blocked + (summary?.todo ?? 0)

  return (
    <Link to={`/journal/${agent.urlKey}`} className="card hover:border-gray-500 transition-colors block">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-semibold text-white">{agent.name}</div>
          <div className="text-xs text-gray-500">{agent.title || agent.role}</div>
        </div>
        <span className={`text-xs px-2 py-1 rounded border ${
          agent.status === 'running'
            ? 'bg-green-900/30 text-green-400 border-green-800'
            : 'bg-gray-800 text-gray-500 border-gray-700'
        }`}>
          {agent.status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div>
          <div className="text-green-400 font-bold mono text-lg">{done}</div>
          <div className="text-gray-600">done</div>
        </div>
        <div>
          <div className="text-blue-400 font-bold mono text-lg">{inProgress}</div>
          <div className="text-gray-600">active</div>
        </div>
        <div>
          <div className="text-red-400 font-bold mono text-lg">{blocked}</div>
          <div className="text-gray-600">blocked</div>
        </div>
      </div>

      {total > 0 && (
        <div className="mt-3 h-1 bg-dark-600 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full"
            style={{ width: `${Math.round((done / total) * 100)}%` }}
          />
        </div>
      )}
    </Link>
  )
}
