// Paperclip API service
// If PAPERCLIP_API_URL points to localhost, automatically try host.docker.internal
// as a fallback — containers cannot reach the host via 'localhost'.
const CONFIGURED_BASE = process.env.PAPERCLIP_API_URL || 'http://localhost:3100'
const KEY = process.env.PAPERCLIP_API_KEY
const COMPANY = process.env.PAPERCLIP_COMPANY_ID

function headers() {
  return { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' }
}

function dockerFallbackUrl(base) {
  // If the URL uses localhost, also try host.docker.internal at the same port
  const u = new URL(base)
  if (u.hostname === 'localhost' || u.hostname === '127.0.0.1') {
    u.hostname = 'host.docker.internal'
    return u.toString()
  }
  return null
}

async function fetchWithFallback(url) {
  try {
    const r = await fetch(url, { headers: headers(), signal: AbortSignal.timeout(8000) })
    return r
  } catch (primaryErr) {
    const fallbackBase = dockerFallbackUrl(CONFIGURED_BASE)
    if (!fallbackBase) throw primaryErr
    // Reconstruct URL against fallback base
    const path = url.slice(CONFIGURED_BASE.length)
    console.warn(`[paperclip] Primary URL failed (${primaryErr.message}), trying fallback: ${fallbackBase}`)
    return fetch(`${fallbackBase}${path}`, { headers: headers(), signal: AbortSignal.timeout(8000) })
  }
}

export async function fetchAgents() {
  const r = await fetchWithFallback(`${CONFIGURED_BASE}/api/companies/${COMPANY}/agents`)
  if (!r.ok) throw new Error(`Paperclip agents fetch failed: ${r.status}`)
  return r.json()
}

export async function fetchIssues(params = {}) {
  const qs = new URLSearchParams(params).toString()
  const r = await fetchWithFallback(`${CONFIGURED_BASE}/api/companies/${COMPANY}/issues?${qs}`)
  if (!r.ok) throw new Error(`Paperclip issues fetch failed: ${r.status}`)
  return r.json()
}

export async function fetchAgentByUrlKey(urlKey) {
  const agents = await fetchAgents()
  return agents.find((a) => a.urlKey === urlKey) ?? null
}
