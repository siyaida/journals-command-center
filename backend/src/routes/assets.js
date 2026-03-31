import { Router } from 'express'
import { getPool } from '../db/pool.js'

const router = Router()

// GET /api/assets — grouped assets inventory
router.get('/', async (_req, res) => {
  try {
    const { rows } = await getPool().query(
      `SELECT * FROM assets ORDER BY section ASC, name ASC`
    )

    const sections = {}
    for (const item of rows) {
      if (!sections[item.section]) {
        sections[item.section] = { title: item.section, icon: item.icon ?? '', items: [] }
      }
      sections[item.section].items.push({
        name: item.name,
        url: item.url,
        status: item.status,
        note: item.note,
      })
    }

    res.json({ sections: Object.values(sections), lastUpdated: new Date().toISOString() })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
