import { ArrowRight, Briefcase, HandHeart, Video, Users, CalendarDays, Sparkles, Megaphone } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Avatar } from '../components/ui/Avatar'
import { StatCard } from '../components/cards/StatCard'
import { VolunteerMeter } from '../components/cards/VolunteerMeter'
import { useCollection } from '../hooks/useCollection'
import { opportunityStatus } from '../services/api'
import { scrollToSection } from '../utils/scroll'
import { formatDate, isUpcoming } from '../utils/format'
import { useModalParam } from './useModalParam'
import { site } from '../config/site'

export function HeroSection() {
  const opps = useCollection('opportunities')
  const events = useCollection('events')
  const volunteers = useCollection('volunteers')
  const sessions = useCollection('sessions')
  const talents = useCollection('talents')
  const members = useCollection('members')
  const services = useCollection('services')
  const [, openOpp] = useModalParam('opp')
  const [, openEvent] = useModalParam('event')

  const openOpps = opps.data.filter((o) => opportunityStatus(o) !== 'Closed')
  const featured = [...openOpps].sort((a, b) => Number(b.featured) - Number(a.featured) || a.deadline.localeCompare(b.deadline))[0]
  const upcoming = events.data.filter((e) => isUpcoming(e.date)).sort((a, b) => a.date.localeCompare(b.date))
  const heroEvent = upcoming.find((e) => Number(e.volunteerCapacity) > 0)
  const nextSession = sessions.data.filter((s) => isUpcoming(s.date)).sort((a, b) => a.date.localeCompare(b.date))[0]
  const team = useCollection('team')
  const communityCount = members.data.length + talents.data.length + team.data.length
  const upcomingSessions = sessions.data.filter((s) => isUpcoming(s.date)).length

  return (
    <section className="relative overflow-hidden">
      <div className="dot-grid absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" aria-hidden />
      <div className="absolute -right-32 -top-32 size-[28rem] rounded-full bg-ocean-100/70 blur-3xl" aria-hidden />
      <div className="absolute -bottom-40 -left-24 size-[22rem] rounded-full bg-lagoon-mint/30 blur-3xl" aria-hidden />

      <div className="container-ss relative grid items-center gap-12 pb-12 pt-10 sm:pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:pb-16 lg:pt-20">
        <div>
          <p className="mb-5 inline-flex animate-rise items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ocean-800 shadow-[var(--shadow-soft)] ring-1 ring-ocean-100">
            <span className="size-2 rounded-full bg-lagoon-jade" /> {openOpps.length} opportunities open right now
          </p>
          <h1 className="animate-rise text-[2.75rem] font-extrabold leading-[1.02] [animation-delay:60ms] sm:text-6xl lg:text-7xl">
            Built by students.<br /><span className="mark-mint">For students.</span>
          </h1>
          <p className="mt-5 flex animate-rise flex-wrap items-center gap-x-3 gap-y-1 text-sm font-bold uppercase tracking-[0.14em] text-ocean-700 [animation-delay:90ms]">
            {site.motto.map((m, i) => <span key={m} className="inline-flex items-center gap-3">{i > 0 && <span className="size-1.5 rounded-full bg-lagoon-jade" />}{m}</span>)}
          </p>
          <p className="mt-4 max-w-xl animate-rise text-lg leading-relaxed text-ocean-900/75 [animation-delay:120ms] sm:text-xl">
            SS is the community where you find internships, events, volunteering and real support —
            from people who’ve been exactly where you are.
          </p>
          <div className="mt-8 flex animate-rise flex-col gap-3 [animation-delay:180ms] sm:flex-row">
            <Button size="lg" onClick={() => scrollToSection('join')}>Join the community <ArrowRight size={18} /></Button>
            <Button variant="outline" size="lg" onClick={() => scrollToSection('opportunities')}>Explore opportunities</Button>
          </div>
          <div className="mt-8 flex animate-rise items-center gap-3 [animation-delay:240ms]">
            <div className="flex -space-x-3">
              {talents.data.slice(0, 4).map((t, i) => <Avatar key={t.id} name={t.name} photo={t.photo ? `${t.photo.split('?')[0]}?auto=format&fit=crop&crop=faces&w=80&h=80&q=70` : ''} size="sm" index={i} className="ring-2 ring-canvas" />)}
            </div>
            <p className="text-sm text-ocean-900/70"><b className="text-ink">{communityCount}</b> students already in the community</p>
          </div>
        </div>

        {/* live preview — built from real data, so it never shows anything fake */}
        <div className="relative mx-auto w-full max-w-md space-y-4 lg:max-w-none">
          {featured && (
            <button onClick={() => openOpp(featured.id)} className="card card-hover block w-full animate-rise p-5 text-left [animation-delay:200ms] lg:ml-10 lg:w-[calc(100%-2.5rem)]">
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-xl bg-ocean-100 text-ocean-800"><Briefcase size={20} /></div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-lagoon-jade">New {featured.category.toLowerCase()}</p>
                  <p className="truncate font-bold">{featured.title}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-ocean-900/65">Apply by {formatDate(featured.deadline)} · {featured.mode}</p>
            </button>
          )}
          {heroEvent && (
            <button onClick={() => openEvent(heroEvent.id)} className="card card-hover block w-full animate-rise p-5 text-left [animation-delay:280ms] lg:w-[calc(100%-2.5rem)]">
              <div className="mb-3 flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-xl bg-lagoon-mint text-lagoon-deep"><HandHeart size={20} /></div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-lagoon-jade">Volunteers wanted</p>
                  <p className="truncate font-bold">{heroEvent.title}</p>
                </div>
              </div>
              <VolunteerMeter taken={volunteers.data.filter((v) => v.eventId === heroEvent.id).length} capacity={Number(heroEvent.volunteerCapacity)} compact />
            </button>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:ml-10">
            {nextSession && (
              <button onClick={() => scrollToSection('sessions')} className="card card-hover flex animate-rise items-center gap-3 p-4 text-left [animation-delay:360ms]">
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-ocean-900 text-white"><Video size={18} /></div>
                <div className="min-w-0"><p className="truncate text-sm font-bold">{nextSession.title}</p><p className="text-xs text-ocean-900/60">Live · {formatDate(nextSession.date, { day: 'numeric', month: 'short' })}</p></div>
              </button>
            )}
            <button onClick={() => scrollToSection('ambassador')} className="card card-hover flex animate-rise items-center gap-3 p-4 text-left [animation-delay:420ms]">
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-ocean-100 text-ocean-800"><Megaphone size={18} /></div>
              <div className="min-w-0"><p className="truncate text-sm font-bold">Campus Ambassadors</p><p className="text-xs text-ocean-900/60">Bring SS to your college</p></div>
            </button>
          </div>
        </div>
      </div>

      {/* stats — all computed from data */}
      <div className="container-ss relative pb-6">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard icon={Users} value={communityCount} label="Community members" />
          <StatCard icon={Briefcase} value={openOpps.length} label="Open opportunities" />
          <StatCard icon={CalendarDays} value={upcoming.length + upcomingSessions} label="Upcoming events & sessions" />
          <StatCard icon={Sparkles} value={services.data.length} label="Ways we support you" />
        </div>
      </div>
    </section>
  )
}
