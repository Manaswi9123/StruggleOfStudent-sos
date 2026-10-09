import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { PageHero } from '../components/layout/Layout'
import { OpportunityCard } from '../components/cards/OpportunityCard'
import { CardSkeleton, EmptyState } from '../components/ui/Feedback'
import { useCollection } from '../hooks/useCollection'
import { opportunityStatus } from '../services/api'
import { cx } from '../utils/format'

const MODES = ['Online', 'On-site', 'Hybrid']

export default function Opportunities() {
  const { data, loading } = useCollection('opportunities')
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const category = params.get('category') || ''
  const mode = params.get('mode') || ''
  const showClosed = params.get('closed') === '1'

  const set = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value); else next.delete(key)
    setParams(next, { replace: true })
  }

  const categories = useMemo(() => [...new Set(data.map((o) => o.category))], [data])
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    const rank = { Open: 0, 'Closing soon': 0, Closed: 1 }
    return data
      .filter((o) => (showClosed ? true : opportunityStatus(o) !== 'Closed'))
      .filter((o) => !category || o.category === category)
      .filter((o) => !mode || o.mode === mode)
      .filter((o) => !term || [o.title, o.organization, o.description, o.category].join(' ').toLowerCase().includes(term))
      .sort((a, b) => rank[opportunityStatus(a)] - rank[opportunityStatus(b)] || a.deadline.localeCompare(b.deadline))
  }, [data, q, category, mode, showClosed])

  const active = q || category || mode

  return (
    <>
      <PageHero
        eyebrow="Opportunities"
        title="Find your next big step"
        intro="Internships, jobs, ambassador roles, volunteering, showcases and more — shared by SS and our partners. Open one to see everything you need before applying."
      />
      <section className="container-ss py-8 sm:py-12">
        {/* filters */}
        <div className="sticky top-16 z-20 -mx-4 mb-8 border-b border-ocean-100 bg-canvas/90 px-4 py-4 backdrop-blur lg:top-[4.5rem] sm:mx-0 sm:rounded-2xl sm:border sm:bg-white/90 sm:px-5">
          <div className="flex flex-col gap-3 md:flex-row">
            <label className="relative flex-1">
              <span className="sr-only">Search opportunities</span>
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ocean-900/40" />
              <input value={q} onChange={(e) => set('q', e.target.value)} placeholder="Search roles, organisations…" className="field-input !pl-11" />
            </label>
            <div className="flex gap-2">
              {MODES.map((m) => (
                <button key={m} onClick={() => set('mode', mode === m ? '' : m)} className={cx('h-12 flex-1 rounded-xl border px-4 text-sm font-semibold transition md:flex-none', mode === m ? 'border-ocean-900 bg-ocean-900 text-white' : 'border-ocean-200 bg-white hover:border-ocean-400')}>
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
            <Chip on={!category} onClick={() => set('category', '')}>All</Chip>
            {categories.map((c) => <Chip key={c} on={category === c} onClick={() => set('category', category === c ? '' : c)}>{c}</Chip>)}
          </div>
        </div>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-sm">
          <p className="text-ocean-900/70"><b className="text-ink">{filtered.length}</b> {filtered.length === 1 ? 'opportunity' : 'opportunities'}{active && ' match your filters'}</p>
          <div className="flex items-center gap-4">
            {active && <button onClick={() => setParams({}, { replace: true })} className="inline-flex items-center gap-1 font-semibold text-brand"><X size={14} />Clear filters</button>}
            <label className="inline-flex cursor-pointer items-center gap-2 font-medium text-ocean-900/70">
              <input type="checkbox" checked={showClosed} onChange={(e) => set('closed', e.target.checked ? '1' : '')} className="size-4 accent-ocean-700" />
              Show closed
            </label>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? <CardSkeleton count={6} /> : filtered.map((o) => <OpportunityCard key={o.id} opp={o} />)}
        </div>
        {!loading && !filtered.length && <EmptyState title="No matches right now">Try a different filter — or join SS to hear about new ones first.</EmptyState>}
      </section>
    </>
  )
}

function Chip({ on, children, ...props }) {
  return (
    <button className={cx('shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition', on ? 'bg-lagoon-mint text-ocean-900' : 'bg-ocean-50 text-ocean-800 hover:bg-ocean-100')} {...props}>
      {children}
    </button>
  )
}
