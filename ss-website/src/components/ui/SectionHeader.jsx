import { cx } from '../../utils/format'
import { useReveal } from '../../hooks/useReveal'

export function SectionHeader({ eyebrow, title, intro, action, align = 'left', className }) {
  const [ref, shown] = useReveal()
  return (
    <div ref={ref} className={cx('mb-8 flex flex-col gap-4 sm:mb-10 md:flex-row md:items-end md:justify-between', align === 'center' && 'md:flex-col md:items-center text-center', shown ? 'animate-rise' : 'opacity-0', className)}>
      <div className={cx('max-w-2xl', align === 'center' && 'mx-auto')}>
        {eyebrow && <p className="eyebrow mb-3"><span className="h-px w-6 bg-lagoon-jade" />{eyebrow}</p>}
        <h2 className="text-3xl font-bold leading-[1.1] sm:text-4xl">{title}</h2>
        {intro && <p className="mt-3 text-base leading-relaxed text-ocean-900/70 sm:text-lg">{intro}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export function Reveal({ children, className, delay = 0, as: Tag = 'div' }) {
  const [ref, shown] = useReveal()
  return (
    <Tag ref={ref} className={cx(shown ? 'animate-rise' : 'opacity-0', className)} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </Tag>
  )
}
