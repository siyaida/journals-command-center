import { getPool } from '../db/pool.js'
import { fetchAgents, fetchIssues } from './paperclip.js'

export async function runSync() {
  const pool = getPool()

  // 1. Sync agents
  const agents = await fetchAgents()
  for (const agent of agents) {
    await pool.query(
      `INSERT INTO agents_cache (id, name, role, title, url_key, status, synced_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name, role = EXCLUDED.role, title = EXCLUDED.title,
         url_key = EXCLUDED.url_key, status = EXCLUDED.status, synced_at = NOW()`,
      [agent.id, agent.name, agent.role, agent.title, agent.urlKey, agent.status]
    )
  }

  // 2. Sync all issues → action_items
  const issues = await fetchIssues({ status: 'todo,in_progress,done,blocked,in_review,backlog' })
  for (const issue of issues) {
    const date = issue.startedAt ? issue.startedAt.substring(0, 10) : new Date().toISOString().substring(0, 10)
    await pool.query(
      `INSERT INTO action_items (id, paperclip_identifier, title, status, priority, agent_id, date, resolved_at, synced_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title, status = EXCLUDED.status, priority = EXCLUDED.priority,
         agent_id = EXCLUDED.agent_id, date = EXCLUDED.date, resolved_at = EXCLUDED.resolved_at, synced_at = NOW()`,
      [issue.id, issue.identifier, issue.title, issue.status, issue.priority,
       issue.assigneeAgentId, date, issue.completedAt || null]
    )
  }

  // 3. Snapshot KPIs
  const done = issues.filter((i) => i.status === 'done').length
  const inProgress = issues.filter((i) => i.status === 'in_progress').length
  const blocked = issues.filter((i) => i.status === 'blocked').length
  const agentsActive = agents.filter((a) => a.status === 'running').length

  await pool.query(
    `INSERT INTO kpi_snapshots (snapshot_at, tasks_done, tasks_in_progress, tasks_blocked, agents_active, raw_data)
     VALUES (NOW(), $1, $2, $3, $4, $5)`,
    [done, inProgress, blocked, agentsActive, JSON.stringify({ agentCount: agents.length, issueCount: issues.length })]
  )

  console.log(`[sync] Done — ${agents.length} agents, ${issues.length} issues, KPI snapshotted`)
}
