import { PageHero } from '../components/layout/Layout'
import { EventCard } from '../components/cards/EventCard'
import { CardSkeleton, EmptyState } from '../components/ui/Feedback'
import { Reveal } from '../components/ui/SectionHeader'
import { useCollection } from '../hooks/useCollection'
import { isUpcoming } from '../utils/format'

export default function Events() {
  const { data, loading } = useCollection('events')
  const vols = useCollection('volunteers')
  const upcoming = data.filter((e) => isUpcoming(e.date)).sort((a, b) => a.date.localeCompare(b.date))
  const past = data.filter((e) => !isUpcoming(e.date)).sort((a, b) => b.date.localeCompare(a.date))
  const taken = (id) => vols.data.filter((v) => v.eventId === id).length

  return (
    <>
      <PageHero eyebrow="Events & volunteering" title="Things happening at SS" intro="Register to attend, or volunteer and be part of the crew that makes it happen. Volunteer slots are limited — when they’re gone, they’re gone." />
      <section className="container-ss py-12 sm:py-16">
        <h2 className="mb-6 text-2xl font-bold">Upcoming</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? <CardSkeleton /> : upcoming.map((e, i) => <Reveal key={e.id} delay={(i % 3) * 60}><EventCard event={e} volunteersTaken={taken(e.id)} /></Reveal>)}
        </div>
        {!loading && !upcoming.length && <EmptyState title="No upcoming events">Check back soon, or join SS to get notified.</EmptyState>}
        {past.length > 0 && (
          <>
            <h2 className="mb-6 mt-16 text-2xl font-bold text-ocean-900/70">Past events</h2>
            <div className="grid gap-4 opacity-75 sm:grid-cols-2 lg:grid-cols-3">{past.map((e) => <EventCard key={e.id} event={e} volunteersTaken={taken(e.id)} />)}</div>
          </>
        )}
      </section>
    </>
  )
}
