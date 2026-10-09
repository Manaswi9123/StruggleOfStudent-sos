import { Building2 } from 'lucide-react'

export function PlacementCard({ placement, max = 1 }) {
  const pct = Math.max(8, Math.round((placement.studentsPlaced / max) * 100))
  return (
    <article className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-ocean-50 text-ocean-700"><Building2 size={20} /></div>
          <div className="min-w-0">
            <h3 className="line-clamp-2 font-bold leading-snug">{placement.company}</h3>
            <p className="truncate text-sm text-ocean-900/60">{(placement.roles || []).join(' · ')}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="font-display text-3xl font-extrabold leading-none text-ink tabular-nums">{placement.studentsPlaced}</div>
          <div className="text-[0.7rem] font-semibold uppercase tracking-wider text-ocean-900/50">placed</div>
        </div>
      </div>
      <div className="mt-4 h-1.5 rounded-full bg-ocean-50"><div className="h-full rounded-full bg-ocean-500" style={{ width: `${pct}%` }} /></div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-ocean-900/60">
        {placement.students?.length > 0 && <span>{placement.students.join(', ')}</span>}
        {placement.year && <span className="ml-auto">{placement.year}</span>}
      </div>
    </article>
  )
}
