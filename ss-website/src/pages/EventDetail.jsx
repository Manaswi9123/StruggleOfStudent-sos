import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, Clock, MapPin, Users, HandHeart, Ticket } from 'lucide-react'
import { Banner } from '../components/ui/Banner'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { EmptyState } from '../components/ui/Feedback'
import { QuickForm } from '../components/forms/QuickForm'
import { VolunteerMeter } from '../components/cards/VolunteerMeter'
import { useCollection } from '../hooks/useCollection'
import { applyToVolunteer, registerForEvent } from '../services/api'
import { formatDate, formatTime, isUpcoming, toList } from '../utils/format'

export default function EventDetail() {
  const { id } = useParams()
  const events = useCollection('events')
  const vols = useCollection('volunteers')
  const regs = useCollection('eventRegistrations')
  const [modal, setModal] = useState(null) // 'register' | 'volunteer'
  const event = events.data.find((e) => e.id === id)

  if (events.loading) return <div className="container-ss py-20"><div className="card h-96 animate-pulse" /></div>
  if (!event) return <div className="container-ss py-20"><EmptyState title="Event not found"><Link to="/events" className="font-semibold text-brand">See all events →</Link></EmptyState></div>

  const vTaken = vols.data.filter((v) => v.eventId === id).length
  const vCap = Number(event.volunteerCapacity || 0)
  const vFull = vTaken >= vCap
  const rTaken = regs.data.filter((r) => r.eventId === id).length
  const rCap = Number(event.registrationCapacity || 0)
  const upcoming = isUpcoming(event.date)
  const regOpen = upcoming && event.registrationOpen && (!rCap || rTaken < rCap)

  return (
    <>
      <Banner imageUrl={event.imageUrl} tone={event.tone} title={event.title} className="h-56 sm:h-72">
        <div className="container-ss flex h-56 flex-col justify-end pb-6 sm:h-72 sm:pb-10">
          <Link to="/events" className="mb-auto mt-6 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-sm font-semibold text-ink"><ArrowLeft size={15} />All events</Link>
          <Badge tone={event.mode === 'Online' ? 'mint' : 'solid'} className="mb-3 w-fit">{event.mode}</Badge>
          <h1 className="max-w-3xl text-3xl font-extrabold text-white sm:text-5xl [text-shadow:0_2px_20px_rgb(3_4_94/0.35)]">{event.title}</h1>
        </div>
      </Banner>

      <section className="container-ss grid gap-8 py-10 lg:grid-cols-[1fr_360px]">
        <article>
          <div className="grid gap-3 sm:grid-cols-2">
            <Info icon={CalendarDays} label="Date" value={formatDate(event.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} />
            <Info icon={Clock} label="Time" value={`${formatTime(event.startTime)} – ${formatTime(event.endTime)}`} />
            <Info icon={MapPin} label="Venue" value={event.venue} />
            <Info icon={Users} label="Organised by" value={event.organizer} />
          </div>
          <h2 className="mb-3 mt-10 text-xl font-bold">About the event</h2>
          <p className="leading-relaxed text-ocean-900/80">{event.description}</p>
          {toList(event.volunteerRoles).length > 0 && (
            <>
              <h2 className="mb-3 mt-10 text-xl font-bold">Volunteer roles</h2>
              <div className="flex flex-wrap gap-2">{toList(event.volunteerRoles).map((r) => <Badge key={r} tone="open">{r}</Badge>)}</div>
            </>
          )}
        </article>

        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <div className="card p-6">
            <div className="mb-4 flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-ocean-50 text-ocean-700"><Ticket size={18} /></div><h3 className="text-lg font-bold">Attend</h3></div>
            {rCap > 0 && <VolunteerMeter taken={rTaken} capacity={rCap} label="Seats" fullLabel="Registrations full" compact />}
            <Button size="lg" className="mt-4 w-full" disabled={!regOpen} variant={regOpen ? 'primary' : 'outline'} onClick={() => setModal('register')}>
              {regOpen ? 'Register to attend' : upcoming ? 'Registrations closed' : 'This event has ended'}
            </Button>
          </div>
          {vCap > 0 && (
            <div className="card p-6">
              <div className="mb-4 flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-lagoon-mint text-lagoon-deep"><HandHeart size={18} /></div><h3 className="text-lg font-bold">Volunteer</h3></div>
              <VolunteerMeter taken={vTaken} capacity={vCap} />
              <Button size="lg" variant={vFull || !upcoming ? 'outline' : 'mint'} className="mt-4 w-full" disabled={vFull || !upcoming} onClick={() => setModal('volunteer')}>
                {vFull ? 'Volunteer Slots Full' : upcoming ? 'Apply to volunteer' : 'Event ended'}
              </Button>
              {!vFull && upcoming && <p className="mt-3 text-center text-xs text-ocean-900/55">Volunteers get a certificate and SS merch.</p>}
            </div>
          )}
        </aside>
      </section>

      <Modal open={modal === 'register'} onClose={() => setModal(null)} title={`Register: ${event.title}`}>
        <QuickForm action={(d) => registerForEvent(event.id, d)} submitLabel="Confirm registration"
          success={{ title: 'You’re in! 🎟️', body: (r) => <>See you on {formatDate(event.date)}. Details have been noted for <b>{r.email}</b>.</> }} />
      </Modal>
      <Modal open={modal === 'volunteer'} onClose={() => setModal(null)} title="Volunteer application">
        <p className="-mt-2 mb-5 text-sm text-ocean-900/70">{vCap - vTaken} of {vCap} slots left for <b>{event.title}</b>.</p>
        <QuickForm action={(d) => applyToVolunteer(event.id, d)} submitLabel="Apply to volunteer"
          extraSelect={toList(event.volunteerRoles).length ? { name: 'role', label: 'Preferred role', options: toList(event.volunteerRoles) } : null}
          success={{ title: 'Thank you for stepping up! 💙', body: (r) => <>Your volunteer slot is reserved, {r.name.split(' ')[0]}. The event team will contact you with the briefing details.</> }} />
      </Modal>
    </>
  )
}

function Info({ icon: I, label, value }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-white p-4 ring-1 ring-ocean-100">
      <I size={20} className="mt-0.5 shrink-0 text-brand" />
      <div><p className="text-xs font-semibold uppercase tracking-wider text-ocean-900/50">{label}</p><p className="font-semibold">{value}</p></div>
    </div>
  )
}
