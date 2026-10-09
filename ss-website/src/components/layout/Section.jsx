import { cx } from '../../utils/format'

/** A homepage section that the navbar can scroll to. */
export function Section({ id, className, children, tone }) {
  const bg = tone === 'white' ? 'bg-white border-y border-ocean-100' : tone === 'tint' ? 'bg-ocean-50/60' : tone === 'mint' ? 'bg-lagoon-mint-soft/60 border-y border-lagoon-mint/50' : ''
  return (
    <section id={id} className={cx('scroll-mt-16 py-16 sm:py-20 lg:scroll-mt-[4.5rem]', bg, className)}>
      <div className="container-ss">{children}</div>
    </section>
  )
}
