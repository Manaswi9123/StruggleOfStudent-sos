export function formatDate(iso, opts = { day: 'numeric', month: 'short', year: 'numeric' }) {
  if (!iso) return 'TBA'
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', opts)
}

export function dateParts(iso) {
  const d = new Date(`${iso}T00:00:00`)
  return {
    day: d.toLocaleDateString('en-IN', { day: '2-digit' }),
    month: d.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase(),
    weekday: d.toLocaleDateString('en-IN', { weekday: 'short' }),
  }
}

export function formatTime(hhmm) {
  if (!hhmm) return ''
  const [h, m] = hhmm.split(':').map(Number)
  const d = new Date(); d.setHours(h, m)
  return d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
}

export function daysLeft(iso) {
  if (!iso) return null
  const ms = new Date(`${iso}T23:59:59`) - new Date()
  return Math.ceil(ms / 86400000)
}

export function isUpcoming(iso) {
  return iso && new Date(`${iso}T23:59:59`) >= new Date()
}

export const initials = (name = '') => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()

export const cx = (...c) => c.filter(Boolean).join(' ')

export const toList = (v) => (Array.isArray(v) ? v : String(v || '').split(/\n|,/).map((s) => s.trim()).filter(Boolean))
