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

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const STATIC_DIR = path.join(__dirname, '../frontend/dist')

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

// API Routes
app.get('/api/health', (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }))
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
  // Run an initial sync on startup
  runSync().catch((err) => console.error('[sync] Initial sync error:', err))
})
