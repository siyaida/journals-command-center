import { Router } from 'express'
import { runSync } from '../services/sync.js'

const router = Router()

// POST /api/issues/sync — manually trigger a Paperclip sync
router.post('/sync', async (_req, res) => {
  try {
    await runSync()
    res.json({ ok: true, syncedAt: new Date().toISOString() })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
