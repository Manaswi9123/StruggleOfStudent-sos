import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Building2, CalendarClock, MapPin, Wallet, CheckCircle2, ExternalLink, Share2 } from 'lucide-react'
import { Badge, StatusBadge } from '../components/ui/Badge'
import { Button, ButtonLink } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { EmptyState } from '../components/ui/Feedback'
import { QuickForm } from '../components/forms/QuickForm'
import { OpportunityCard } from '../components/cards/OpportunityCard'
import { useCollection } from '../hooks/useCollection'
import { applyToOpportunity, opportunityStatus } from '../services/api'
import { daysLeft, formatDate, toList } from '../utils/format'

export default function OpportunityDetail() {
  const { id } = useParams()
  const { data, loading } = useCollection('opportunities')
  const [applying, setApplying] = useState(false)
  const [copied, setCopied] = useState(false)
  const opp = data.find((o) => o.id === id)

  if (loading) return <div className="container-ss py-20"><div className="card h-96 animate-pulse" /></div>
  if (!opp) return <div className="container-ss py-20"><EmptyState title="This opportunity doesn’t exist anymore"><Link className="font-semibold text-brand" to="/opportunities">Browse open opportunities →</Link></EmptyState></div>

  const status = opportunityStatus(opp)
  const closed = status === 'Closed'
  const left = daysLeft(opp.deadline)
  const related = data.filter((o) => o.id !== opp.id && o.category === opp.category && opportunityStatus(o) !== 'Closed').slice(0, 3)
  const share = async () => {
    const url = window.location.href
    try { if (navigator.share) await navigator.share({ title: opp.title, url }); else { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000) } } catch { /* cancelled */ }
  }

  const applyButton = (className) => closed
    ? <Button disabled size="lg" variant="outline" className={className}>Applications closed</Button>
    : opp.applyUrl
      ? <ButtonLink href={opp.applyUrl} size="lg" className={className}>Apply now <ExternalLink size={16} /></ButtonLink>
      : <Button size="lg" className={className} onClick={() => setApplying(true)}>Apply now</Button>

  return (
    <>
      <section className="border-b border-ocean-100 bg-gradient-to-b from-ocean-50 to-canvas">
        <div className="container-ss py-8 sm:py-12">
          <Link to="/opportunities" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ocean-900/70 hover:text-brand"><ArrowLeft size={16} />All opportunities</Link>
          <div className="flex flex-wrap items-center gap-2"><Badge>{opp.category}</Badge><StatusBadge status={status} /></div>
          <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight sm:text-5xl">{opp.title}</h1>
          <p className="mt-3 flex items-center gap-2 text-lg text-ocean-900/70"><Building2 size={18} />{opp.organization}</p>
        </div>
      </section>

      <section className="container-ss grid gap-8 py-10 pb-28 lg:grid-cols-[1fr_340px] lg:pb-16">
        <article className="space-y-8">
          <div>
            <h2 className="mb-3 text-xl font-bold">About this opportunity</h2>
            <p className="leading-relaxed text-ocean-900/80">{opp.description}</p>
          </div>
          <div>
            <h2 className="mb-3 text-xl font-bold">Who can apply</h2>
            <p className="leading-relaxed text-ocean-900/80">{opp.eligibility}</p>
          </div>
          <div>
            <h2 className="mb-3 text-xl font-bold">What you’ll need</h2>
            <ul className="space-y-2.5">
              {toList(opp.requirements).map((r) => <li key={r} className="flex gap-3"><CheckCircle2 size={20} className="mt-0.5 shrink-0 text-lagoon-jade" />{r}</li>)}
            </ul>
          </div>
        </article>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="card space-y-4 p-6">
            <Fact icon={CalendarClock} label="Deadline" value={<>{formatDate(opp.deadline)}{!closed && left <= 14 && <span className="ml-2 text-sm font-semibold text-lagoon-jade">({left}d left)</span>}</>} />
            <Fact icon={MapPin} label="Where" value={`${opp.mode}${opp.location ? ` · ${opp.location}` : ''}`} />
            {opp.stipend && <Fact icon={Wallet} label="Perks" value={opp.stipend} />}
            {applyButton('hidden w-full lg:inline-flex')}
            <button onClick={share} className="inline-flex w-full items-center justify-center gap-2 text-sm font-semibold text-ocean-900/70 hover:text-brand"><Share2 size={15} />{copied ? 'Link copied!' : 'Share with a friend'}</button>
          </div>
        </aside>
      </section>

      {/* sticky apply bar on phones */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ocean-100 bg-white/95 p-3 backdrop-blur lg:hidden">
        {applyButton('w-full')}
      </div>

      {related.length > 0 && (
        <section className="container-ss pb-20">
          <h2 className="mb-5 text-2xl font-bold">Similar opportunities</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{related.map((o) => <OpportunityCard key={o.id} opp={o} />)}</div>
        </section>
      )}

      <Modal open={applying} onClose={() => setApplying(false)} title={`Apply: ${opp.title}`}>
        <QuickForm
          action={(d) => applyToOpportunity(opp.id, d)}
          submitLabel="Send application"
          withNote
          notePlaceholder="Why are you interested? Link a portfolio or resume if you have one."
          success={{ title: 'Application sent! 🎉', body: (r) => <>We’ve received your application, {r.name.split(' ')[0]}. The team will reach out at <b>{r.email}</b> with next steps.</> }}
        />
      </Modal>
    </>
  )
}

function Fact({ icon: I, label, value }) {
  return (
    <div className="flex gap-3">
      <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-ocean-50 text-ocean-700"><I size={18} /></div>
      <div><p className="text-xs font-semibold uppercase tracking-wider text-ocean-900/50">{label}</p><p className="font-semibold">{value}</p></div>
    </div>
  )
}
