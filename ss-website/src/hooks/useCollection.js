import { useCallback, useEffect, useState } from 'react'
import { list, subscribe } from '../services/api'

/**
 * Loads one collection through the data service and re-loads when it changes.
 * Works the same once the service talks to a real backend.
 */
export function useCollection(name) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const rows = await list(name)
    setData(rows)
    setLoading(false)
  }, [name])

  useEffect(() => {
    let alive = true
    list(name).then((rows) => { if (alive) { setData(rows); setLoading(false) } })
    const off = subscribe((changed) => { if (changed === name || changed === '*') refresh() })
    return () => { alive = false; off() }
  }, [name, refresh])

  return { data, loading, refresh }
}
