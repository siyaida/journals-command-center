import { Router } from 'express'
import { fetchAgents, fetchIssues } from '../services/paperclip.js'

const router = Router()

// GET /api/kpi/snapshot — live KPI from Paperclip
router.get('/snapshot', async (_req, res) => {
  try {
    const [agents, issues] = await Promise.all([
      fetchAgents(),
      fetchIssues({ status: 'todo,in_progress,done,blocked,in_review,backlog' }),
    ])

    res.json({
      tasksDone: issues.filter((i) => i.status === 'done').length,
      tasksInProgress: issues.filter((i) => i.status === 'in_progress').length,
      tasksBlocked: issues.filter((i) => i.status === 'blocked').length,
      agentsActive: agents.filter((a) => a.status === 'running').length,
      sitesLive: 0, // populated once assets DB is seeded
      snapshotAt: new Date().toISOString(),
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/kpi/agent-summaries — per-agent task counts
router.get('/agent-summaries', async (_req, res) => {
  try {
    const [agents, issues] = await Promise.all([
      fetchAgents(),
      fetchIssues({ status: 'todo,in_progress,done,blocked,in_review,backlog' }),
    ])

    const summaries = {}
    for (const agent of agents) {
      const agentIssues = issues.filter((i) => i.assigneeAgentId === agent.id)
      summaries[agent.id] = {
        done: agentIssues.filter((i) => i.status === 'done').length,
        inProgress: agentIssues.filter((i) => i.status === 'in_progress').length,
        blocked: agentIssues.filter((i) => i.status === 'blocked').length,
        todo: agentIssues.filter((i) => i.status === 'todo').length,
      }
    }

    res.json(summaries)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
