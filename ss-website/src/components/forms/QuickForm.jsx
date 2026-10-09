import { Input, Select, Textarea, FormError } from '../ui/Field'
import { Button } from '../ui/Button'
import { SuccessMessage } from '../ui/Feedback'
import { useSubmit, formToObject } from './useSubmit'

/**
 * Short form reused for: opportunity applications, event registration,
 * volunteer applications and session registration.
 */
export function QuickForm({ action, submitLabel = 'Submit', success, extraSelect, withNote = false, notePlaceholder }) {
  const { sending, error, result, submit } = useSubmit(action)
  if (result) return <SuccessMessage title={success.title}>{typeof success.body === 'function' ? success.body(result) : success.body}</SuccessMessage>

  return (
    <form onSubmit={(e) => { e.preventDefault(); submit(formToObject(e.currentTarget)) }} className="grid gap-4 sm:grid-cols-2">
      <Input name="name" label="Full name" required autoComplete="name" className="sm:col-span-2" />
      <Input name="email" type="email" label="Email" required autoComplete="email" />
      <Input name="phone" type="tel" label="Phone" required autoComplete="tel" />
      <Input name="college" label="College / University" required className="sm:col-span-2" />
      {extraSelect && <Select name={extraSelect.name} label={extraSelect.label} options={extraSelect.options} required className="sm:col-span-2" />}
      {withNote && <Textarea name="note" label="Anything we should know?" rows={3} placeholder={notePlaceholder} className="sm:col-span-2" />}
      <FormError>{error}</FormError>
      <Button type="submit" size="lg" disabled={sending} className="sm:col-span-2">{sending ? 'Sending…' : submitLabel}</Button>
    </form>
  )
}
