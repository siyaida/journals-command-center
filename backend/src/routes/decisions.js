import { Router } from 'express'
import { getPool } from '../db/pool.js'
import { fetchAgentByUrlKey } from '../services/paperclip.js'

const router = Router()

// GET /api/decisions — all decisions, optional ?agentKey= filter
router.get('/', async (req, res) => {
  try {
    if (req.query.agentKey) {
      const agent = await fetchAgentByUrlKey(req.query.agentKey)
      if (!agent) return res.json([])
      const { rows } = await getPool().query(
        `SELECT * FROM decisions WHERE agent_id = $1 ORDER BY date DESC LIMIT 100`,
        [agent.id]
      )
      return res.json(rows)
    }

    const { rows } = await getPool().query(
      `SELECT * FROM decisions ORDER BY date DESC LIMIT 100`
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/decisions — log a new decision
router.post('/', async (req, res) => {
  try {
    const { agentId, agentName, title, context, decision, outcome, date } = req.body
    if (!title || !agentId) return res.status(400).json({ error: 'title and agentId are required' })

    const { rows } = await getPool().query(
      `INSERT INTO decisions (agent_id, agent_name, date, title, context, decision, outcome)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [agentId, agentName || null, date || new Date().toISOString().substring(0, 10),
       title, context || null, decision || null, outcome || null]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
