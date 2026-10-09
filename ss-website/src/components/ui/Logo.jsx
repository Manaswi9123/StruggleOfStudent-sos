import { site } from '../../config/site'
import { cx } from '../../utils/format'

export function Logo({ light = false, className, href = '/', onClick }) {
  return (
    <a href={href} onClick={onClick} className={cx('group inline-flex items-center gap-2.5', className)} aria-label={`${site.name} home`}>
      <img src={site.logo} alt="" width="40" height="40" className="size-10 rounded-xl ring-1 ring-ocean-900/10 transition group-hover:rotate-[-4deg]" />
      <span className="leading-none">
        <span className={cx('block font-display text-lg font-extrabold tracking-tight', light ? 'text-white' : 'text-ink')}>SS</span>
        <span className={cx('block whitespace-nowrap text-[0.6rem] font-semibold uppercase tracking-[0.12em]', light ? 'text-ocean-200' : 'text-ocean-700')}>Struggle of Students</span>
      </span>
    </a>
  )
}
