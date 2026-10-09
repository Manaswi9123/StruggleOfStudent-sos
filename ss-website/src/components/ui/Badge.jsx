import { cx } from '../../utils/format'

const tones = {
  ocean: 'bg-ocean-50 text-ocean-800 ring-ocean-100',
  open: 'bg-lagoon-mint-soft text-lagoon-deep ring-lagoon-mint',
  soon: 'bg-ocean-100 text-ocean-900 ring-ocean-200',
  closed: 'bg-ocean-900/5 text-ocean-900/60 ring-ocean-900/10',
  solid: 'bg-ocean-900 text-white ring-ocean-900',
  mint: 'bg-lagoon-mint text-ocean-900 ring-lagoon-mint',
}

export function Badge({ tone = 'ocean', className, children, ...props }) {
  return (
    <span className={cx('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset', tones[tone], className)} {...props}>
      {children}
    </span>
  )
}

export function StatusBadge({ status }) {
  const tone = status === 'Open' ? 'open' : status === 'Closing soon' ? 'soon' : 'closed'
  return (
    <Badge tone={tone}>
      <span className={cx('size-1.5 rounded-full', status === 'Open' ? 'bg-lagoon-jade' : status === 'Closing soon' ? 'bg-ocean-600' : 'bg-ocean-900/40')} />
      {status}
    </Badge>
  )
}
