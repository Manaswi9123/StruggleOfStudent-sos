import { useEffect, useState } from 'react'
import { Menu, X, ArrowRight } from 'lucide-react'
import { Logo } from '../ui/Logo'
import { Button } from '../ui/Button'
import { sections } from '../../config/site'
import { scrollToSection } from '../../utils/scroll'
import { cx } from '../../utils/format'

/** Single-page navbar: links scroll to sections and highlight the one in view. */
export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8)
    }
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // scroll-spy: highlight the section that covers the middle of the screen
  useEffect(() => {
    let raf = 0
    const update = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const mid = window.innerHeight * 0.45
        const hit = sections.find((s) => {
          const r = document.getElementById(s.id)?.getBoundingClientRect()
          return r && r.top <= mid && r.bottom > mid
        })
        setActive(window.scrollY < 300 ? '' : hit?.id || '')
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [])

  useEffect(() => { document.body.style.overflow = open ? 'hidden' : '' }, [open])

  const go = (id) => { setOpen(false); scrollToSection(id) }

  return (
    <>
    <header className={cx('sticky top-0 z-40 transition-all', scrolled || open ? 'border-b border-ocean-100 bg-white/85 backdrop-blur-lg' : 'bg-transparent')}>
      <nav className="container-ss flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]" aria-label="Main">
        <Logo onClick={(e) => { e.preventDefault(); setOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />
        <ul className="hidden items-center gap-0.5 xl:flex">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={(e) => { e.preventDefault(); go(s.id) }}
                aria-current={active === s.id ? 'true' : undefined}
                className={cx('rounded-full px-3 py-2 text-[0.9rem] font-semibold transition', active === s.id ? 'bg-ocean-50 text-ocean-800' : 'text-ocean-900/70 hover:text-ink')}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <Button size="sm" className="hidden sm:inline-flex" onClick={() => go('join')}>Join SS <ArrowRight size={15} /></Button>
          <button className="grid size-10 place-items-center rounded-full text-ink hover:bg-ocean-50 xl:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>
    </header>

      {/* the menu sits outside <header>: the header's backdrop-blur would otherwise trap this fixed panel */}
      {open && (
        <div className="fixed inset-x-0 bottom-0 top-16 z-50 overflow-y-auto bg-white lg:top-[4.5rem] xl:hidden">
          <ul className="container-ss flex flex-col py-2">
            {sections.map((s, i) => (
              <li key={s.id} className="animate-rise" style={{ animationDelay: `${i * 30}ms` }}>
                <a href={`#${s.id}`} onClick={(e) => { e.preventDefault(); go(s.id) }} className={cx('flex items-center justify-between border-b border-ocean-50 py-3.5 font-display text-2xl font-semibold', active === s.id ? 'text-brand' : 'text-ink')}>
                  {s.label} <ArrowRight size={20} className="text-ocean-300" />
                </a>
              </li>
            ))}
          </ul>
          <div className="container-ss pb-8 pt-2">
            <Button size="lg" className="w-full" onClick={() => go('join')}>Join the community</Button>
          </div>
        </div>
      )}
    </>
  )
}
