import express from 'express'
import cors from 'cors'
import cron from 'node-cron'
import path from 'path'
import { fileURLToPath } from 'url'
import agentsRouter from './src/routes/agents.js'
import journalRouter from './src/routes/journal.js'
import issuesRouter from './src/routes/issues.js'
import kpiRouter from './src/routes/kpi.js'
import decisionsRouter from './src/routes/decisions.js'
import assetsRouter from './src/routes/assets.js'
import { runSync } from './src/services/sync.js'
import { runMigrations } from './src/db/pool.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const STATIC_DIR = path.join(__dirname, '../frontend/dist')

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

// API Routes
app.get('/api/health', async (_req, res) => {
  const checks = { ok: true, ts: new Date().toISOString(), services: {} }

  // Check Paperclip API (uses same fetchAgents with localhost→host.docker.internal fallback)
  try {
    const { fetchAgents } = await import('./src/services/paperclip.js')
    if (!process.env.PAPERCLIP_API_KEY) throw new Error('PAPERCLIP_API_KEY not set')
    if (!process.env.PAPERCLIP_COMPANY_ID) throw new Error('PAPERCLIP_COMPANY_ID not set')
    await fetchAgents()
    checks.services.paperclip = 'ok'
  } catch (e) {
    checks.ok = false
    checks.services.paperclip = e.message
  }

  // Check database
  try {
    const { getPool } = await import('./src/db/pool.js')
    await getPool().query('SELECT 1')
    checks.services.db = 'ok'
  } catch (e) {
    checks.ok = false
    checks.services.db = e.message
  }

  res.status(checks.ok ? 200 : 503).json(checks)
})
app.use('/api/agents', agentsRouter)
app.use('/api/journal', journalRouter)
app.use('/api/issues', issuesRouter)
app.use('/api/kpi', kpiRouter)
app.use('/api/decisions', decisionsRouter)
app.use('/api/assets', assetsRouter)

// Serve React frontend (SPA catch-all)
app.use(express.static(STATIC_DIR))
app.get('*', (_req, res) => res.sendFile(path.join(STATIC_DIR, 'index.html')))

// Sync Paperclip data every 15 minutes
cron.schedule('*/15 * * * *', () => {
  console.log('[sync] Running Paperclip sync...')
  runSync().catch((err) => console.error('[sync] Error:', err))
})

app.listen(PORT, () => {
  console.log(`Command Center API listening on port ${PORT}`)
  // Run migrations, then initial Paperclip sync
  runMigrations()
    .then(() => runSync())
    .catch((err) => console.error('[startup] Error:', err))
})
