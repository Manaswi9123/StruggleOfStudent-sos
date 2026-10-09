import { Clock, Video, Users } from 'lucide-react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { VolunteerMeter } from './VolunteerMeter'
import { dateParts, formatTime } from '../../utils/format'

export function SessionCard({ session, taken = 0, onRegister }) {
  const p = dateParts(session.date)
  const full = taken >= Number(session.capacity)
  return (
    <article className="card card-hover flex h-full flex-col p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <div className="shrink-0 rounded-2xl bg-ocean-900 px-3 py-2.5 text-center leading-none text-white">
          <div className="font-display text-2xl font-extrabold">{p.day}</div>
          <div className="mt-1 text-[0.65rem] font-bold tracking-widest text-ocean-200">{p.month}</div>
        </div>
        <div className="min-w-0">
          <Badge tone="mint" className="mb-2"><Video size={12} />{session.platform || 'Online'}</Badge>
          <h3 className="text-lg font-bold leading-snug">{session.title}</h3>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 text-sm text-ocean-900/65">
            <span className="inline-flex items-center gap-1"><Clock size={13} />{p.weekday}, {formatTime(session.time)} · {session.durationMins} min</span>
            <span className="inline-flex items-center gap-1"><Users size={13} />{session.host}</span>
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-ocean-900/75">{session.description}</p>
      <div className="mt-auto pt-5">
        <VolunteerMeter taken={taken} capacity={Number(session.capacity)} label="Seats" fullLabel="Session full" compact />
        <Button className="mt-4 w-full" variant={full ? 'outline' : 'primary'} disabled={full} onClick={() => onRegister?.(session)}>
          {full ? 'Registration closed' : 'Save my seat'}
        </Button>
      </div>
    </article>
  )
}
