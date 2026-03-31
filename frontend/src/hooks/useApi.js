import { useState, useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || ''

export function useApi(path, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!path) return
    setLoading(true)
    setError(null)
    fetch(`${API_BASE}${path}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, ...deps])

  return { data, loading, error }
}
