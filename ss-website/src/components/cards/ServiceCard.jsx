import { ArrowRight } from 'lucide-react'
import { Icon } from '../ui/Icon'

export function ServiceCard({ service, onEnquire, index = 0 }) {
  const tint = ['bg-ocean-100 text-ocean-800', 'bg-lagoon-mint text-lagoon-deep', 'bg-ocean-200 text-ocean-900'][index % 3]
  return (
    <article className="card card-hover flex h-full flex-col p-6">
      <div className={`mb-5 grid size-12 place-items-center rounded-2xl ${tint}`}>
        <Icon name={service.icon} size={22} />
      </div>
      <h3 className="text-xl font-bold">{service.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ocean-900/70">{service.summary}</p>
      <ul className="mt-4 space-y-1.5 text-sm">
        {(service.provides || []).slice(0, 3).map((p) => (
          <li key={p} className="flex gap-2"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-lagoon-jade" />{p}</li>
        ))}
      </ul>
      {onEnquire && (
        <button onClick={() => onEnquire(service)} className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-brand hover:gap-2.5 hover:text-brand-strong transition-all">
          Details & enquiry <ArrowRight size={16} />
        </button>
      )}
    </article>
  )
}
