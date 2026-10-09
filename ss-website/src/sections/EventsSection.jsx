import { useState } from 'react'
import { CalendarDays, Clock, MapPin, Users, HandHeart, Ticket, ArrowLeft, ExternalLink, Video } from 'lucide-react'
import { Section } from '../components/layout/Section'
import { SectionHeader, Reveal } from '../components/ui/SectionHeader'
import { Banner } from '../components/ui/Banner'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { CardSkeleton, EmptyState } from '../components/ui/Feedback'
import { EventCard } from '../components/cards/EventCard'
import { SessionCard } from '../components/cards/SessionCard'
import { VolunteerMeter } from '../components/cards/VolunteerMeter'
import { QuickForm } from '../components/forms/QuickForm'
import { useCollection } from '../hooks/useCollection'
import { applyToVolunteer, registerForEvent, registerForSession } from '../services/api'
import { useModalParam } from './useModalParam'
import { formatDate, formatTime, isUpcoming, toList } from '../utils/format'

export function EventsSection() {
  const events = useCollection('events')
  const vols = useCollection('volunteers')
  const regs = useCollection('eventRegistrations')
  const sessions = useCollection('sessions')
  const sRegs = useCollection('sessionRegistrations')
  const [openId, open, close] = useModalParam('event')
  const [session, setSession] = useState(null)

  const upcoming = events.data.filter((e) => isUpcoming(e.date)).sort((a, b) => a.date.localeCompare(b.date))
  const upcomingSessions = sessions.data.filter((s) => isUpcoming(s.date)).sort((a, b) => a.date.localeCompare(b.date))
  const vTaken = (id) => vols.data.filter((v) => v.eventId === id).length
  const current = events.data.find((e) => e.id === openId)

  return (
    <Section id="events">
      <SectionHeader
        eyebrow="Events & volunteering"
        title="Show up. Help out. Meet your people."
        intro="Register to attend, or grab a volunteer slot before they’re gone. When slots fill up, applications close automatically."
      />
      {events.loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><CardSkeleton /></div>
      ) : upcoming.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((e, i) => <Reveal key={e.id} delay={(i % 3) * 60}><EventCard event={e} volunteersTaken={vTaken(e.id)} onOpen={(x) => open(x.id)} /></Reveal>)}
        </div>
      ) : <EmptyState title="No upcoming events yet">New events are announced here first.</EmptyState>}

      {/* online sessions */}
      <div id="sessions" className="mt-16 scroll-mt-24">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-xl bg-ocean-900 text-white"><Video size={20} /></div>
          <div>
            <h3 className="text-2xl font-bold">Live online sessions</h3>
            <p className="text-sm text-ocean-900/65">Free AMAs, workshops and talks. Limited seats so everyone gets to ask questions.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {upcomingSessions.map((s) => <SessionCard key={s.id} session={s} taken={sRegs.data.filter((r) => r.sessionId === s.id).length} onRegister={setSession} />)}
        </div>
        {!sessions.loading && !upcomingSessions.length && <EmptyState title="No sessions scheduled">Check back soon.</EmptyState>}
      </div>

      {current && <EventModal event={current} vTaken={vTaken(current.id)} rTaken={regs.data.filter((r) => r.eventId === current.id).length} onClose={close} />}

      <Modal open={!!session} onClose={() => setSession(null)} title={session?.title || ''}>
        {session && (
          <>
            <p className="-mt-2 mb-5 text-sm text-ocean-900/70">{formatDate(session.date, { weekday: 'long', day: 'numeric', month: 'long' })} · {formatTime(session.time)} · {session.platform}</p>
            <QuickForm
              action={(d) => registerForSession(session.id, d)}
              submitLabel="Register for free"
              success={{
                title: 'Seat saved! 🎧',
                body: () => session.meetingLink
                  ? <>Here’s your link — save it:<br /><a href={session.meetingLink} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 font-semibold text-brand underline">Join on {session.platform} <ExternalLink size={14} /></a></>
                  : <>The meeting link will be sent to you before the session starts.</>,
              }}
            />
          </>
        )}
      </Modal>
    </Section>
  )
}

function EventModal({ event, vTaken, rTaken, onClose }) {
  const [mode, setMode] = useState(null) // null | 'register' | 'volunteer'
  const vCap = Number(event.volunteerCapacity || 0)
  const vFull = vTaken >= vCap
  const rCap = Number(event.registrationCapacity || 0)
  const upcoming = isUpcoming(event.date)
  const regOpen = upcoming && event.registrationOpen && (!rCap || rTaken < rCap)
  const roles = toList(event.volunteerRoles)

  return (
    <Modal open onClose={onClose} title={mode === 'register' ? 'Register to attend' : mode === 'volunteer' ? 'Volunteer application' : event.title} size="lg">
      {mode ? (
        <>
          <button onClick={() => setMode(null)} className="-mt-2 mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ocean-900/70 hover:text-brand"><ArrowLeft size={15} />Back to event</button>
          {mode === 'register' ? (
            <QuickForm action={(d) => registerForEvent(event.id, d)} submitLabel="Confirm registration"
              success={{ title: 'You’re in! 🎟️', body: (r) => <>See you on {formatDate(event.date)}. Details have been noted for <b>{r.email}</b>.</> }} />
          ) : (
            <QuickForm action={(d) => applyToVolunteer(event.id, d)} submitLabel="Apply to volunteer"
              extraSelect={roles.length ? { name: 'role', label: 'Preferred role', options: roles } : null}
              success={{ title: 'Thank you for stepping up! 💙', body: (r) => <>Your volunteer slot is reserved, {r.name.split(' ')[0]}. The event team will contact you with briefing details.</> }} />
          )}
        </>
      ) : (
        <>
          <Banner imageUrl={event.imageUrl} tone={event.tone} title={event.title} className="-mt-1 mb-5 h-32 rounded-2xl sm:h-40">
            <div className="p-4"><Badge tone={event.mode === 'Online' ? 'mint' : 'solid'}>{event.mode}</Badge></div>
          </Banner>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <Info icon={CalendarDays} label="Date" value={formatDate(event.date, { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })} />
            <Info icon={Clock} label="Time" value={`${formatTime(event.startTime)}${event.endTime ? ` – ${formatTime(event.endTime)}` : ''}`} />
            <Info icon={MapPin} label="Venue" value={event.venue} />
            <Info icon={Users} label="Organised by" value={event.organizer} />
          </div>
          <p className="mt-5 leading-relaxed text-ocean-900/80">{event.description}</p>
          {roles.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{roles.map((r) => <Badge key={r} tone="open">{r}</Badge>)}</div>}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl p-4 ring-1 ring-ocean-100">
              <p className="mb-3 flex items-center gap-2 font-bold"><Ticket size={17} className="text-brand" />Attend</p>
              {rCap > 0 && <VolunteerMeter taken={rTaken} capacity={rCap} label="Seats" fullLabel="Registrations full" compact />}
              <Button className="mt-3 w-full" disabled={!regOpen} variant={regOpen ? 'primary' : 'outline'} onClick={() => setMode('register')}>
                {regOpen ? 'Register to attend' : upcoming ? 'Registrations closed' : 'Event ended'}
              </Button>
            </div>
            {vCap > 0 && (
              <div className="rounded-2xl bg-lagoon-mint-soft/60 p-4 ring-1 ring-lagoon-mint">
                <p className="mb-3 flex items-center gap-2 font-bold"><HandHeart size={17} className="text-lagoon-jade" />Volunteer</p>
                <VolunteerMeter taken={vTaken} capacity={vCap} compact />
                <Button className="mt-3 w-full" variant={vFull || !upcoming ? 'outline' : 'mint'} disabled={vFull || !upcoming} onClick={() => setMode('volunteer')}>
                  {vFull ? 'Volunteer Slots Full' : upcoming ? 'Apply to volunteer' : 'Event ended'}
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </Modal>
  )
}

function Info({ icon: I, label, value }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-ocean-25 p-3 ring-1 ring-ocean-100">
      <I size={18} className="mt-0.5 shrink-0 text-brand" />
      <div className="min-w-0"><p className="text-[0.7rem] font-semibold uppercase tracking-wider text-ocean-900/50">{label}</p><p className="text-sm font-semibold">{value}</p></div>
    </div>
  )
}
