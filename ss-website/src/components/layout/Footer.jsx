import { Logo } from '../ui/Logo'
import { SocialIcon } from '../ui/Icon'
import { site } from '../../config/site'
import { scrollToSection, contactAbout } from '../../utils/scroll'

const YEAR = new Date().getFullYear()

const cols = [
  { title: 'Explore', links: [['Opportunities', 'opportunities'], ['Events & sessions', 'events'], ['Campus Ambassadors', 'ambassador'], ['Impact', 'impact']] },
  { title: 'SS', links: [['About us', 'about'], ['Talent showcase', 'talent'], ['Services', 'services'], ['Join SS', 'join']] },
  { title: 'Help', links: [['Contact', 'contact'], ['Student guidance', { type: 'Student guidance' }], ['Partner with us', { type: 'Partnership' }], ['Team admin', '/admin']] },
]

function FooterLink({ label, target }) {
  if (typeof target === 'string' && target.startsWith('/')) return <a href={target} className="text-ocean-100/80 hover:text-white">{label}</a>
  const onClick = (e) => { e.preventDefault(); if (typeof target === 'object') contactAbout(target.type); else scrollToSection(target) }
  return <a href={`#${typeof target === 'object' ? 'contact' : target}`} onClick={onClick} className="text-ocean-100/80 hover:text-white">{label}</a>
}

export function Footer() {
  return (
    <footer className="mt-auto bg-ocean-900 text-ocean-100">
      <div className="container-ss grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo light onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ocean-200/80">
            A student-run community where you find opportunities, people and support — and grow together.
          </p>
          <div className="mt-5 flex gap-2">
            {site.socials.map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noreferrer" aria-label={s.label} title={s.label} className="grid size-10 place-items-center rounded-full bg-white/5 text-ocean-100 ring-1 ring-white/10 transition hover:bg-lagoon-mint hover:text-ocean-900">
                <SocialIcon name={s.icon} />
              </a>
            ))}
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h3 className="mb-4 font-sans text-xs font-bold uppercase tracking-[0.16em] text-lagoon-mint">{c.title}</h3>
            <ul className="space-y-2.5 text-sm">
              {c.links.map(([label, target]) => <li key={label}><FooterLink label={label} target={target} /></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="container-ss flex flex-col gap-3 py-6 text-sm text-ocean-200/70 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {site.socials.map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-white"><SocialIcon name={s.icon} size={14} />{s.handle}</a>
            ))}
          </div>
          <p>© {YEAR} Struggle of Students · Built by students, for students.</p>
        </div>
      </div>
    </footer>
  )
}
