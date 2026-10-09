import { useEffect, useState } from 'react'
import { Input, Select, Textarea, FormError } from '../ui/Field'
import { Button } from '../ui/Button'
import { SuccessMessage } from '../ui/Feedback'
import { sendEnquiry } from '../../services/api'
import { enquiryTypes } from '../../config/site'
import { useSubmit, formToObject } from './useSubmit'

export function ContactForm({ defaultType, defaultMessage = '' }) {
  const [type, setType] = useState(defaultType || '')
  // other parts of the page can pre-select a topic (e.g. "Partner with us")
  useEffect(() => {
    if (defaultType) return
    const onPick = (e) => setType(e.detail)
    window.addEventListener('ss:enquiry', onPick)
    return () => window.removeEventListener('ss:enquiry', onPick)
  }, [defaultType])
  const { sending, error, result, submit, reset } = useSubmit(sendEnquiry)

  if (result) {
    return (
      <SuccessMessage title="Message received 💌" action={<Button variant="outline" onClick={reset}>Send another</Button>}>
        Thanks, {result.name.split(' ')[0]}! Someone from the team will get back to you at <b>{result.email}</b> soon.
      </SuccessMessage>
    )
  }
  return (
    <form onSubmit={(e) => { e.preventDefault(); submit(formToObject(e.currentTarget)) }} className="grid gap-4 sm:grid-cols-2">
      <Input name="name" label="Your name" required autoComplete="name" />
      <Input name="email" type="email" label="Email" required autoComplete="email" />
      <Input name="organization" label="College / Organisation" />
      <Select name="type" label="What’s this about?" required options={enquiryTypes} value={type} onChange={(e) => setType(e.target.value)} />
      <Textarea name="message" label="Message" required rows={5} defaultValue={defaultMessage} placeholder="Tell us a little about what you need…" className="sm:col-span-2" />
      <FormError>{error}</FormError>
      <Button type="submit" size="lg" disabled={sending} className="sm:col-span-2">{sending ? 'Sending…' : 'Send message'}</Button>
    </form>
  )
}
