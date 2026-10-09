import { ArrowUpRight, Building2, CalendarClock, MapPin } from 'lucide-react'
import { Badge, StatusBadge } from '../ui/Badge'
import { opportunityStatus } from '../../services/api'
import { daysLeft, formatDate, cx } from '../../utils/format'

export function OpportunityCard({ opp, onOpen }) {
  const status = opportunityStatus(opp)
  const left = daysLeft(opp.deadline)
  const closed = status === 'Closed'
  return (
    <button
      type="button"
      onClick={() => onOpen?.(opp)}
      className={cx('card card-hover group flex h-full w-full flex-col p-5 text-left sm:p-6', closed && 'opacity-70')}
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <Badge tone="ocean">{opp.category}</Badge>
        <StatusBadge status={status} />
      </div>
      <h3 className="text-lg font-bold leading-snug sm:text-xl">{opp.title}</h3>
      <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ocean-900/65">
        <Building2 size={14} className="shrink-0" /> <span className="truncate">{opp.organization}</span>
      </p>
      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ocean-900/75">{opp.description}</p>
      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-ocean-100 pt-4 text-sm">
        <span className="inline-flex items-center gap-1.5 text-ocean-900/70"><MapPin size={14} />{opp.mode}</span>
        <span className="inline-flex items-center gap-1.5 text-ocean-900/70">
          <CalendarClock size={14} />
          {closed ? 'Closed' : left <= 7 ? <b className="font-semibold text-ocean-700">{left} day{left === 1 ? '' : 's'} left</b> : `Apply by ${formatDate(opp.deadline, { day: 'numeric', month: 'short' })}`}
        </span>
        <ArrowUpRight size={18} className="ml-auto text-ocean-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
      </div>
    </button>
  )
}
