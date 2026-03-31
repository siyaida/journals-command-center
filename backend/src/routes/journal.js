import { Router } from 'express'
import { getPool } from '../db/pool.js'
import { fetchAgentByUrlKey, fetchIssues } from '../services/paperclip.js'

const router = Router()

// GET /api/journal/:agentKey/tasks — tasks for a specific agent (live from Paperclip)
router.get('/:agentKey/tasks', async (req, res) => {
  try {
    const agent = await fetchAgentByUrlKey(req.params.agentKey)
    if (!agent) return res.status(404).json({ error: 'Agent not found' })

    const issues = await fetchIssues({ assigneeAgentId: agent.id })

    const tasks = issues.map((issue) => ({
      id: issue.id,
      identifier: issue.identifier,
      title: issue.title,
      status: issue.status,
      priority: issue.priority,
      description: issue.description,
      date: issue.startedAt ? issue.startedAt.substring(0, 10) : null,
      resolvedAt: issue.completedAt,
    }))

    const dateFilter = req.query.date
    const filtered = dateFilter ? tasks.filter((t) => t.date === dateFilter) : tasks

    res.json(filtered)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/journal/:agentKey/entries — manually authored journal entries from DB
router.get('/:agentKey/entries', async (req, res) => {
  try {
    const agent = await fetchAgentByUrlKey(req.params.agentKey)
    if (!agent) return res.status(404).json({ error: 'Agent not found' })

    const { rows } = await getPool().query(
      `SELECT * FROM journal_entries WHERE agent_id = $1 ORDER BY date DESC LIMIT 30`,
      [agent.id]
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/journal/:agentKey/entries — create a journal entry
router.post('/:agentKey/entries', async (req, res) => {
  try {
    const agent = await fetchAgentByUrlKey(req.params.agentKey)
    if (!agent) return res.status(404).json({ error: 'Agent not found' })

    const { title, summary, category, date } = req.body
    if (!title) return res.status(400).json({ error: 'title is required' })

    const { rows } = await getPool().query(
      `INSERT INTO journal_entries (agent_id, agent_name, date, title, summary, category)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [agent.id, agent.name, date || new Date().toISOString().substring(0, 10), title, summary || null, category || null]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
