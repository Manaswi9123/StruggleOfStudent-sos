import { CircleCheck, Inbox } from 'lucide-react'

export function SuccessMessage({ title, children, action }) {
  return (
    <div role="status" className="animate-rise rounded-3xl bg-lagoon-mint-soft p-6 text-center ring-1 ring-lagoon-mint sm:p-8">
      <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-lagoon-mint text-lagoon-deep">
        <CircleCheck size={28} />
      </div>
      <h3 className="text-xl font-bold sm:text-2xl">{title}</h3>
      <div className="mx-auto mt-2 max-w-md text-ocean-900/75">{children}</div>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function EmptyState({ title = 'Nothing here yet', children }) {
  return (
    <div className="rounded-3xl border border-dashed border-ocean-200 bg-white/60 px-6 py-12 text-center">
      <Inbox className="mx-auto mb-3 text-ocean-400" size={28} />
      <p className="font-semibold">{title}</p>
      {children && <p className="mt-1 text-sm text-ocean-900/60">{children}</p>}
    </div>
  )
}

export function CardSkeleton({ count = 3 }) {
  return Array.from({ length: count }).map((_, i) => (
    <div key={i} className="card h-56 animate-pulse bg-ocean-50/60" />
  ))
}
