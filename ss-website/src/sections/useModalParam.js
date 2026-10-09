import { useSearchParams } from 'react-router-dom'

/**
 * Keeps an open detail panel in the URL (?opp=opp-1, ?event=evt-2) so a
 * student can share a link straight to one opportunity or event.
 */
export function useModalParam(key) {
  const [params, setParams] = useSearchParams()
  const value = params.get(key)
  const open = (id) => {
    const next = new URLSearchParams(params); next.set(key, id)
    setParams(next, { preventScrollReset: true })
  }
  const close = () => {
    const next = new URLSearchParams(params); next.delete(key)
    setParams(next, { preventScrollReset: true, replace: true })
  }
  return [value, open, close]
}
