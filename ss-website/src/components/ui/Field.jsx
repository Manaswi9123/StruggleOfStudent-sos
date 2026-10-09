import { useId } from 'react'
import { Check } from 'lucide-react'
import { cx } from '../../utils/format'

export function Field({ label, hint, required, children, className }) {
  return (
    <div className={className}>
      {label && (
        <span className="field-label">
          {label} {required && <span className="text-brand" aria-hidden>*</span>}
          {!required && <span className="ml-1 text-xs font-medium text-ocean-900/45">(optional)</span>}
        </span>
      )}
      {children}
      {hint && <p className="mt-1.5 text-xs text-ocean-900/55">{hint}</p>}
    </div>
  )
}

export function Input({ label, hint, className, required, ...props }) {
  const id = useId()
  return (
    <Field label={<label htmlFor={id}>{label}</label>} hint={hint} required={required} className={className}>
      <input id={id} required={required} className="field-input" {...props} />
    </Field>
  )
}

export function Textarea({ label, hint, className, required, rows = 4, ...props }) {
  const id = useId()
  return (
    <Field label={<label htmlFor={id}>{label}</label>} hint={hint} required={required} className={className}>
      <textarea id={id} rows={rows} required={required} className="field-input resize-y" {...props} />
    </Field>
  )
}

export function Select({ label, hint, className, options = [], placeholder = 'Choose…', required, ...props }) {
  const id = useId()
  return (
    <Field label={<label htmlFor={id}>{label}</label>} hint={hint} required={required} className={className}>
      <select id={id} required={required} className="field-input appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 fill=%22none%22 stroke=%22%2303045e%22 stroke-width=%222%22><path d=%22m4 6 4 4 4-4%22/></svg>')] bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10" {...props}>
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </Field>
  )
}

/** Multi-select as tappable chips — friendlier than checkboxes on phones. */
export function ChipGroup({ label, options, value = [], onChange, hint }) {
  const toggle = (o) => onChange(value.includes(o) ? value.filter((x) => x !== o) : [...value, o])
  return (
    <fieldset>
      <legend className="field-label">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value.includes(o)
          return (
            <button
              key={o}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(o)}
              className={cx(
                'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition',
                on ? 'border-ocean-900 bg-ocean-900 text-white' : 'border-ocean-200 bg-white text-ink hover:border-ocean-400',
              )}
            >
              {on && <Check size={14} />} {o}
            </button>
          )
        })}
      </div>
      {hint && <p className="mt-1.5 text-xs text-ocean-900/55">{hint}</p>}
    </fieldset>
  )
}

export function FormError({ children }) {
  if (!children) return null
  return <p role="alert" className="rounded-xl border border-lagoon-deep/20 bg-ocean-50 px-4 py-3 text-sm font-medium text-lagoon-deep">{children}</p>
}
