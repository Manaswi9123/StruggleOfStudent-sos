import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { PageHero } from '../components/layout/Layout'
import { SessionCard } from '../components/cards/SessionCard'
import { Modal } from '../components/ui/Modal'
import { CardSkeleton, EmptyState } from '../components/ui/Feedback'
import { QuickForm } from '../components/forms/QuickForm'
import { useCollection } from '../hooks/useCollection'
import { registerForSession } from '../services/api'
import { formatDate, formatTime, isUpcoming } from '../utils/format'

export default function Sessions() {
  const { data, loading } = useCollection('sessions')
  const regs = useCollection('sessionRegistrations')
  const [active, setActive] = useState(null)
  const upcoming = data.filter((s) => isUpcoming(s.date)).sort((a, b) => a.date.localeCompare(b.date))
  const taken = (id) => regs.data.filter((r) => r.sessionId === id).length

  return (
    <>
      <PageHero eyebrow="Online sessions" title="Learn live, from anywhere" intro="Free online AMAs, workshops and talks. Seats are limited so everyone gets to ask questions — registration closes automatically when a session fills up." />
      <section className="container-ss py-12 sm:py-16">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? <CardSkeleton /> : upcoming.map((s) => <SessionCard key={s.id} session={s} taken={taken(s.id)} onRegister={setActive} />)}
        </div>
        {!loading && !upcoming.length && <EmptyState title="No sessions scheduled">New sessions are added often — check back soon.</EmptyState>}
      </section>

      <Modal open={!!active} onClose={() => setActive(null)} title={active?.title || ''}>
        {active && (
          <>
            <p className="-mt-2 mb-5 text-sm text-ocean-900/70">{formatDate(active.date, { weekday: 'long', day: 'numeric', month: 'long' })} · {formatTime(active.time)} · {active.platform}</p>
            <QuickForm
              action={(d) => registerForSession(active.id, d)}
              submitLabel="Register for free"
              success={{
                title: 'Seat saved! 🎧',
                body: () => active.meetingLink
                  ? <>Here’s your link — save it:<br /><a href={active.meetingLink} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 font-semibold text-brand underline">Join on {active.platform} <ExternalLink size={14} /></a></>
                  : <>The meeting link will be emailed to you before the session starts.</>,
              }}
            />
          </>
        )}
      </Modal>
    </>
  )
}
