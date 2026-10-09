import { cx } from '../../utils/format'

/** "Volunteer Slots: 18 / 20" with a progress bar, or "Volunteer Slots Full". */
export function VolunteerMeter({ taken, capacity, compact = false, label = 'Volunteer Slots', fullLabel = 'Volunteer Slots Full' }) {
  const full = taken >= capacity
  const pct = capacity ? Math.min(100, Math.round((taken / capacity) * 100)) : 100
  const remaining = Math.max(0, capacity - taken)
  return (
    <div>
      <div className={cx('flex items-baseline justify-between gap-2', compact ? 'text-sm' : 'text-base')}>
        <span className={cx('font-semibold', full ? 'text-ocean-900/60' : 'text-ink')}>
          {full ? fullLabel : <>{label}: <span className="tabular-nums">{taken} / {capacity}</span></>}
        </span>
        {!full && <span className="text-xs font-semibold text-lagoon-jade">{remaining} left</span>}
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ocean-50" role="progressbar" aria-valuenow={taken} aria-valuemin={0} aria-valuemax={capacity} aria-label={label}>
        <div className={cx('h-full rounded-full transition-all duration-700', full ? 'bg-ocean-900/30' : 'bg-gradient-to-r from-lagoon-jade to-lagoon-leaf')} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
