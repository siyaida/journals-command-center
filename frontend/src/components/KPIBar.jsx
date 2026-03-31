import { useApi } from '../hooks/useApi.js'

export default function KPIBar() {
  const { data: kpi, loading } = useApi('/api/kpi/snapshot')

  if (loading) {
    return <div className="grid grid-cols-5 gap-4 mb-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="card animate-pulse h-16" />
      ))}
    </div>
  }

  const stats = [
    { label: 'Tasks Done', value: kpi?.tasksDone ?? 0, color: 'text-green-400' },
    { label: 'In Progress', value: kpi?.tasksInProgress ?? 0, color: 'text-blue-400' },
    { label: 'Blocked', value: kpi?.tasksBlocked ?? 0, color: 'text-red-400' },
    { label: 'Agents Active', value: kpi?.agentsActive ?? 0, color: 'text-neon-green' },
    { label: 'Sites Live', value: kpi?.sitesLive ?? 0, color: 'text-neon-blue' },
  ]

  return (
    <div className="grid grid-cols-5 gap-4 mb-6">
      {stats.map((s) => (
        <div key={s.label} className="card text-center">
          <div className={`text-2xl font-bold mono ${s.color}`}>{s.value}</div>
          <div className="text-xs text-gray-500 mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  )
}
