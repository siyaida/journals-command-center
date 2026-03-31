import { Router } from 'express'
import { fetchAgents, fetchAgentByUrlKey } from '../services/paperclip.js'

const router = Router()

// GET /api/agents — list all agents from Paperclip
router.get('/', async (_req, res) => {
  try {
    const agents = await fetchAgents()
    res.json(agents)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/agents/:urlKey — single agent by URL key
router.get('/:urlKey', async (req, res) => {
  try {
    const agent = await fetchAgentByUrlKey(req.params.urlKey)
    if (!agent) return res.status(404).json({ error: 'Agent not found' })
    res.json(agent)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
