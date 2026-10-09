import { useState } from 'react'
import { cx, initials } from '../../utils/format'

const tones = ['bg-ocean-100 text-ocean-900', 'bg-lagoon-mint text-lagoon-deep', 'bg-ocean-200 text-ocean-800', 'bg-ocean-50 text-ocean-700']

/** Shows a photo if set (falls back to initials if it can't load). */
export function Avatar({ name, photo, size = 'md', index = 0, className }) {
  const s = size === 'lg' ? 'size-24 text-2xl' : size === 'sm' ? 'size-10 text-sm' : 'size-16 text-lg'
  const [broken, setBroken] = useState(false)
  if (photo && !broken) return <img src={photo} alt={name} onError={() => setBroken(true)} className={cx(s, 'rounded-2xl bg-ocean-100 object-cover', className)} loading="lazy" />
  return (
    <div className={cx(s, 'grid place-items-center rounded-2xl font-display font-bold', tones[index % tones.length], className)} aria-hidden>
      {initials(name) || 'SS'}
    </div>
  )
}
