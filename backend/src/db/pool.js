import pg from 'pg'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const { Pool } = pg
const __dirname = path.dirname(fileURLToPath(import.meta.url))

let pool

export function getPool() {
  if (!pool) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL })
  }
  return pool
}

export async function runMigrations() {
  const p = getPool()
  const sql = readFileSync(path.join(__dirname, 'migrations/001_initial.sql'), 'utf8')
  try {
    await p.query(sql)
    console.log('[db] Migrations applied.')
  } catch (err) {
    console.error('[db] Migration error:', err.message)
  }
}
