import { Link, useParams } from 'react-router-dom'
import { useApi } from '../hooks/useApi.js'

export default function Sidebar() {
  const { data: agents } = useApi('/api/agents')
  const { agentKey } = useParams()

  return (
    <aside className="w-52 bg-dark-800 border-r border-dark-600 p-4 flex flex-col gap-1">
      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">C-Level Journals</div>
      {agents?.map((agent) => (
        <Link
          key={agent.id}
          to={`/journal/${agent.urlKey}`}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
            agentKey === agent.urlKey
              ? 'bg-dark-700 text-white'
              : 'text-gray-400 hover:bg-dark-700 hover:text-white'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
          {agent.name}
        </Link>
      ))}
      {!agents && (
        <div className="text-gray-600 text-xs">Loading agents…</div>
      )}
    </aside>
  )
}
