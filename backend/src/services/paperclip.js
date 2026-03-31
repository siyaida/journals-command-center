const BASE = process.env.PAPERCLIP_API_URL || 'http://localhost:3100'
const KEY = process.env.PAPERCLIP_API_KEY
const COMPANY = process.env.PAPERCLIP_COMPANY_ID

function headers() {
  return { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' }
}

export async function fetchAgents() {
  const r = await fetch(`${BASE}/api/companies/${COMPANY}/agents`, { headers: headers() })
  if (!r.ok) throw new Error(`Paperclip agents fetch failed: ${r.status}`)
  return r.json()
}

export async function fetchIssues(params = {}) {
  const qs = new URLSearchParams(params).toString()
  const r = await fetch(`${BASE}/api/companies/${COMPANY}/issues?${qs}`, { headers: headers() })
  if (!r.ok) throw new Error(`Paperclip issues fetch failed: ${r.status}`)
  return r.json()
}

export async function fetchAgentByUrlKey(urlKey) {
  const agents = await fetchAgents()
  return agents.find((a) => a.urlKey === urlKey) ?? null
}
