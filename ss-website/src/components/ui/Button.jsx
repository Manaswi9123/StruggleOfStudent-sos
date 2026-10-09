import { Link } from 'react-router-dom'
import { cx } from '../../utils/format'

const variants = {
  primary: 'bg-ocean-900 text-white hover:bg-ocean-800 shadow-[var(--shadow-soft)]',
  brand: 'bg-brand text-white hover:bg-brand-strong shadow-[var(--shadow-soft)]',
  mint: 'bg-lagoon-mint text-ocean-900 hover:bg-lagoon-leaf',
  outline: 'border border-ocean-200 bg-white text-ink hover:border-ocean-400 hover:bg-ocean-50',
  ghost: 'text-ink hover:bg-ocean-50',
  light: 'bg-white text-ocean-900 hover:bg-ocean-50',
}
const sizes = {
  sm: 'h-9 px-3.5 text-sm gap-1.5',
  md: 'h-11 px-5 text-[0.95rem] gap-2',
  lg: 'h-13 px-6 text-base gap-2',
}

const base = 'inline-flex select-none items-center justify-center rounded-full font-semibold transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap'

export function Button({ variant = 'primary', size = 'md', className, ...props }) {
  return <button className={cx(base, variants[variant], sizes[size], className)} {...props} />
}

export function ButtonLink({ to, href, variant = 'primary', size = 'md', className, ...props }) {
  const cls = cx(base, variants[variant], sizes[size], className)
  if (href) return <a href={href} className={cls} target="_blank" rel="noreferrer" {...props} />
  return <Link to={to} className={cls} {...props} />
}
