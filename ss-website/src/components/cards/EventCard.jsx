import { Clock, MapPin, HandHeart } from 'lucide-react'
import { Banner } from '../ui/Banner'
import { Badge } from '../ui/Badge'
import { dateParts, formatTime } from '../../utils/format'
import { VolunteerMeter } from './VolunteerMeter'

export function EventCard({ event, volunteersTaken = 0, onOpen }) {
  const p = dateParts(event.date)
  return (
    <button type="button" onClick={() => onOpen?.(event)} className="card card-hover group flex h-full w-full flex-col overflow-hidden text-left">
      <Banner imageUrl={event.imageUrl} tone={event.tone} title={event.title} className="h-36 sm:h-40">
        <div className="flex items-start justify-between p-4">
          <div className="rounded-2xl bg-white/95 px-3 py-2 text-center leading-none shadow-[var(--shadow-soft)]">
            <div className="font-display text-2xl font-extrabold text-ink">{p.day}</div>
            <div className="mt-1 text-[0.65rem] font-bold tracking-widest text-ocean-700">{p.month}</div>
          </div>
          <Badge tone={event.mode === 'Online' ? 'mint' : 'solid'}>{event.mode}</Badge>
        </div>
      </Banner>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold leading-snug group-hover:text-brand">{event.title}</h3>
        <div className="mt-2 space-y-1 text-sm text-ocean-900/70">
          <p className="flex items-center gap-1.5"><Clock size={14} />{p.weekday} · {formatTime(event.startTime)} – {formatTime(event.endTime)}</p>
          <p className="flex items-center gap-1.5"><MapPin size={14} /><span className="truncate">{event.venue}</span></p>
        </div>
        {Number(event.volunteerCapacity) > 0 && (
          <div className="mt-auto pt-4">
            <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-ocean-900/60"><HandHeart size={14} />Volunteers needed</p>
            <VolunteerMeter taken={volunteersTaken} capacity={Number(event.volunteerCapacity)} compact />
          </div>
        )}
      </div>
    </button>
  )
}
