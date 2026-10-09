export function StatCard({ value, label, hint, icon: I }) {
  return (
    <div className="rounded-2xl bg-white/70 p-4 ring-1 ring-ocean-100 backdrop-blur sm:p-5">
      {I && <I size={18} className="mb-3 text-lagoon-jade" />}
      <div className="font-display text-3xl font-extrabold leading-none tabular-nums sm:text-4xl">{value}</div>
      <div className="mt-1.5 text-sm font-semibold text-ocean-900/70">{label}</div>
      {hint && <div className="mt-0.5 text-xs text-ocean-900/45">{hint}</div>}
    </div>
  )
}
