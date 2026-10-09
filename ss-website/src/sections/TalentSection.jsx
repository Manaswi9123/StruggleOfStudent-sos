import { useMemo, useState } from 'react'
import { MapPin, Sparkles, ArrowRight } from 'lucide-react'
import { Section } from '../components/layout/Section'
import { SectionHeader, Reveal } from '../components/ui/SectionHeader'
import { Button } from '../components/ui/Button'
import { SocialIcon } from '../components/ui/Icon'
import { useCollection } from '../hooks/useCollection'
import { scrollToSection } from '../utils/scroll'
import { useModalParam } from './useModalParam'
import { cx, initials } from '../utils/format'

/** Unsplash images are resized on their CDN, so cards stay fast on phones. */
const sized = (url, w, h) => (url?.includes('images.unsplash.com') ? `${url.split('?')[0]}?auto=format&fit=crop&crop=faces,entropy&w=${w}&h=${h}&q=70` : url)

export function TalentSection() {
  const { data, loading } = useCollection('talents')
  const opps = useCollection('opportunities')
  const [, openOpp] = useModalParam('opp')
  const [cat, setCat] = useState('')
  const cats = useMemo(() => [...new Set(data.map((t) => t.category))], [data])
  const shown = cat ? data.filter((t) => t.category === cat) : data
  const showcase = opps.data.find((o) => o.category === 'Talent Showcase')

  return (
    <Section id="talent" tone="white">
      <SectionHeader
        eyebrow="Talent at SS"
        title={<>Meet the people who make SS <span className="mark-mint">come alive</span>.</>}
        intro="Dancers, musicians, artists, photographers and builders — SS gives student talent a stage, an audience and a crew."
      />

      {cats.length > 1 && (
        <div className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
          {['', ...cats].map((c) => (
            <button key={c || 'all'} onClick={() => setCat(c)} className={cx('shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition', cat === c ? 'bg-ocean-900 text-white' : 'bg-ocean-50 text-ocean-800 hover:bg-ocean-100')}>
              {c || 'All talent'}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-[4/5] animate-pulse rounded-[var(--radius-card)] bg-ocean-50" />)
          : shown.map((t, i) => <Reveal key={t.id} delay={(i % 3) * 70}><TalentCard t={t} /></Reveal>)}
      </div>

      <div className="mt-10 flex flex-col items-start gap-4 rounded-3xl bg-ocean-900 p-6 text-white sm:flex-row sm:items-center sm:p-8">
        <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-lagoon-mint text-ocean-900"><Sparkles size={22} /></div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white">Got a talent? We’ve got a stage.</h3>
          <p className="mt-1 text-ocean-100/80">Sing, play, dance, paint, code or create — perform at SS events and get featured here.</p>
        </div>
        <Button variant="mint" onClick={() => (showcase ? openOpp(showcase.id) : scrollToSection('join'))}>Showcase your talent <ArrowRight size={16} /></Button>
      </div>
    </Section>
  )
}

function TalentCard({ t }) {
  const [broken, setBroken] = useState(false)
  return (
    <article className="group relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] bg-ocean-800 shadow-[var(--shadow-soft)]">
      {t.photo && !broken ? (
        <img
          src={sized(t.photo, 600, 750)}
          srcSet={`${sized(t.photo, 400, 500)} 400w, ${sized(t.photo, 600, 750)} 600w, ${sized(t.photo, 900, 1125)} 900w`}
          sizes="(min-width:1024px) 33vw, 50vw"
          alt={`${t.name}, ${t.talent}`}
          loading="lazy"
          onError={() => setBroken(true)}
          className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-[1.04]"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center font-display text-5xl font-extrabold text-ocean-300">{initials(t.name)}</div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ocean-900/90 via-ocean-900/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5">
        <span className="mb-2 inline-block rounded-full bg-lagoon-mint px-2.5 py-0.5 text-[0.7rem] font-bold text-ocean-900 sm:text-xs">{t.talent}</span>
        <h3 className="text-base font-bold leading-tight text-white sm:text-xl">{t.name}</h3>
        {t.city && <p className="mt-0.5 flex items-center gap-1 text-xs text-ocean-100/80 sm:text-sm"><MapPin size={12} />{t.city}</p>}
        {t.bio && <p className="mt-2 hidden text-sm leading-snug text-ocean-50/90 sm:line-clamp-3 sm:block">{t.bio}</p>}
      </div>
      {t.instagram && (
        <a href={t.instagram} target="_blank" rel="noreferrer" aria-label={`${t.name} on Instagram`} className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/90 text-ocean-900 hover:bg-lagoon-mint">
          <SocialIcon name="instagram" size={16} />
        </a>
      )}
    </article>
  )
}
