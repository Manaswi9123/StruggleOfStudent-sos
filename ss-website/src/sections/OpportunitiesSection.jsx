import { useMemo, useState } from 'react'
import { Search, X, Building2, CalendarClock, MapPin, Wallet, CheckCircle2, ExternalLink, Share2, ArrowLeft, Megaphone, ArrowRight } from 'lucide-react'
import { Section } from '../components/layout/Section'
import { SectionHeader } from '../components/ui/SectionHeader'
import { Badge, StatusBadge } from '../components/ui/Badge'
import { Button, ButtonLink } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { CardSkeleton, EmptyState } from '../components/ui/Feedback'
import { OpportunityCard } from '../components/cards/OpportunityCard'
import { QuickForm } from '../components/forms/QuickForm'
import { useCollection } from '../hooks/useCollection'
import { applyToOpportunity, opportunityStatus } from '../services/api'
import { useModalParam } from './useModalParam'
import { scrollToSection } from '../utils/scroll'
import { cx, daysLeft, formatDate, toList } from '../utils/format'

const MODES = ['Online', 'On-site', 'Hybrid']
const INITIAL = 6

export function OpportunitiesSection() {
  const { data, loading } = useCollection('opportunities')
  const [openId, open, close] = useModalParam('opp')
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [mode, setMode] = useState('')
  const [showAll, setShowAll] = useState(false)

  const categories = useMemo(() => [...new Set(data.map((o) => o.category))], [data])
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    return data
      .filter((o) => opportunityStatus(o) !== 'Closed')
      .filter((o) => !category || o.category === category)
      .filter((o) => !mode || o.mode === mode)
      .filter((o) => !term || [o.title, o.organization, o.description, o.category].join(' ').toLowerCase().includes(term))
      .sort((a, b) => Number(b.featured) - Number(a.featured) || a.deadline.localeCompare(b.deadline))
  }, [data, q, category, mode])
  const visible = showAll ? filtered : filtered.slice(0, INITIAL)
  const active = q || category || mode
  const current = data.find((o) => o.id === openId)

  return (
    <Section id="opportunities" tone="white">
      <SectionHeader
        eyebrow="Opportunities"
        title="What you can get through SS"
        intro="Internships, jobs, volunteering, showcases, projects and more. Tap any card for full details and apply in under a minute."
      />

      {/* filters */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search opportunities</span>
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ocean-900/40" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search roles, organisations…" className="field-input !pl-11" />
        </label>
        <div className="flex gap-2">
          {MODES.map((m) => (
            <button key={m} onClick={() => setMode(mode === m ? '' : m)} className={cx('h-12 flex-1 rounded-xl border px-4 text-sm font-semibold transition md:flex-none', mode === m ? 'border-ocean-900 bg-ocean-900 text-white' : 'border-ocean-200 bg-white hover:border-ocean-400')}>{m}</button>
          ))}
        </div>
      </div>
      <div className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
        <Chip on={!category} onClick={() => setCategory('')}>All</Chip>
        {categories.map((c) => <Chip key={c} on={category === c} onClick={() => setCategory(category === c ? '' : c)}>{c}</Chip>)}
        <button onClick={() => scrollToSection('ambassador')} className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ocean-900 px-4 py-2 text-sm font-semibold text-white hover:bg-ocean-800"><Megaphone size={14} />Campus Ambassador</button>
      </div>

      <div className="mb-4 flex items-center justify-between text-sm">
        <p className="text-ocean-900/70"><b className="text-ink">{filtered.length}</b> open {filtered.length === 1 ? 'opportunity' : 'opportunities'}{active && ' match'}</p>
        {active && <button onClick={() => { setQ(''); setCategory(''); setMode('') }} className="inline-flex items-center gap-1 font-semibold text-brand"><X size={14} />Clear</button>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? <CardSkeleton count={6} /> : visible.map((o) => <OpportunityCard key={o.id} opp={o} onOpen={(x) => open(x.id)} />)}
      </div>
      {!loading && !filtered.length && <EmptyState title="No matches right now">Try a different filter — or join SS to hear about new ones first.</EmptyState>}
      {filtered.length > INITIAL && (
        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => setShowAll((s) => !s)}>{showAll ? 'Show fewer' : `Show all ${filtered.length} opportunities`}</Button>
        </div>
      )}

      <OpportunityModal opp={current} onClose={close} />
    </Section>
  )
}

function Chip({ on, children, ...props }) {
  return <button className={cx('shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition', on ? 'bg-lagoon-mint text-ocean-900' : 'bg-ocean-50 text-ocean-800 hover:bg-ocean-100')} {...props}>{children}</button>
}

/** Full opportunity details + application, in one panel. */
function OpportunityModal({ opp, onClose }) {
  const [applying, setApplying] = useState(false)
  const [copied, setCopied] = useState(false)
  if (!opp) return null
  const status = opportunityStatus(opp)
  const closed = status === 'Closed'
  const left = daysLeft(opp.deadline)
  const handleClose = () => { setApplying(false); onClose() }
  const share = async () => {
    const url = window.location.href
    try { if (navigator.share) await navigator.share({ title: opp.title, url }); else { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000) } } catch { /* cancelled */ }
  }

  return (
    <Modal open onClose={handleClose} title={applying ? `Apply: ${opp.title}` : opp.title} size="lg">
      {applying ? (
        <>
          <button onClick={() => setApplying(false)} className="-mt-2 mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ocean-900/70 hover:text-brand"><ArrowLeft size={15} />Back to details</button>
          <QuickForm
            action={(d) => applyToOpportunity(opp.id, d)}
            submitLabel="Send application"
            withNote
            notePlaceholder="Why are you interested? Link a portfolio or resume if you have one."
            success={{ title: 'Application sent! 🎉', body: (r) => <>We’ve received your application, {r.name.split(' ')[0]}. The team will reach out at <b>{r.email}</b> with next steps.</> }}
          />
        </>
      ) : (
        <>
          <div className="-mt-2 flex flex-wrap items-center gap-2"><Badge>{opp.category}</Badge><StatusBadge status={status} /></div>
          <p className="mt-3 flex items-center gap-2 text-ocean-900/70"><Building2 size={16} />{opp.organization}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Fact icon={CalendarClock} label="Deadline" value={<>{formatDate(opp.deadline)}{!closed && left <= 14 && <span className="block text-xs font-semibold text-lagoon-jade">{left} days left</span>}</>} />
            <Fact icon={MapPin} label="Where" value={`${opp.mode}${opp.location ? ` · ${opp.location}` : ''}`} />
            {opp.stipend && <Fact icon={Wallet} label="Perks" value={opp.stipend} />}
          </div>
          <h3 className="mb-2 mt-6 font-bold">About</h3>
          <p className="leading-relaxed text-ocean-900/80">{opp.description}</p>
          <h3 className="mb-2 mt-5 font-bold">Who can apply</h3>
          <p className="leading-relaxed text-ocean-900/80">{opp.eligibility}</p>
          {toList(opp.requirements).length > 0 && (
            <>
              <h3 className="mb-2 mt-5 font-bold">What you’ll need</h3>
              <ul className="space-y-2">{toList(opp.requirements).map((r) => <li key={r} className="flex gap-2.5"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-lagoon-jade" />{r}</li>)}</ul>
            </>
          )}
          <div className="sticky bottom-0 -mx-5 -mb-5 mt-6 flex flex-col gap-2 border-t border-ocean-100 bg-white p-4 sm:-mx-7 sm:-mb-7 sm:flex-row sm:px-7">
            {closed
              ? <Button disabled size="lg" variant="outline" className="flex-1">Applications closed</Button>
              : opp.applyUrl
                ? <ButtonLink href={opp.applyUrl} size="lg" className="flex-1">Apply now <ExternalLink size={16} /></ButtonLink>
                : <Button size="lg" className="flex-1" onClick={() => setApplying(true)}>Apply now <ArrowRight size={17} /></Button>}
            <Button variant="outline" size="lg" onClick={share}><Share2 size={16} />{copied ? 'Link copied!' : 'Share'}</Button>
          </div>
        </>
      )}
    </Modal>
  )
}

function Fact({ icon: I, label, value }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-ocean-25 p-3 ring-1 ring-ocean-100">
      <I size={18} className="mt-0.5 shrink-0 text-brand" />
      <div className="min-w-0"><p className="text-[0.7rem] font-semibold uppercase tracking-wider text-ocean-900/50">{label}</p><p className="text-sm font-semibold">{value}</p></div>
    </div>
  )
}
