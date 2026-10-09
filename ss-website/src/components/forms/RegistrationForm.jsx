import { useState } from 'react'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { Input, Select, ChipGroup, FormError } from '../ui/Field'
import { Button } from '../ui/Button'
import { scrollToSection } from '../../utils/scroll'
import { SuccessMessage } from '../ui/Feedback'
import { joinCommunity } from '../../services/api'
import { interestAreas, yearsOfStudy } from '../../config/site'
import { useSubmit, formToObject } from './useSubmit'
import { cx } from '../../utils/format'

/**
 * Join-the-community form. Two short steps so it never feels long on a phone:
 *   1. About you   2. Your interests
 */
export function RegistrationForm() {
  const [step, setStep] = useState(1)
  const [values, setValues] = useState({})
  const [interests, setInterests] = useState([])
  const { sending, error, result, submit } = useSubmit(joinCommunity)

  if (result) {
    return (
      <SuccessMessage
        title={`Welcome to SS, ${result.name.split(' ')[0]}! 🌱`}
        action={<Button onClick={() => scrollToSection('opportunities')}>Explore opportunities <ArrowRight size={16} /></Button>}
      >
        You’re officially part of the community. We’ll reach out at <b>{result.email}</b> with opportunities that match your interests.
      </SuccessMessage>
    )
  }

  const next = (e) => { e.preventDefault(); setValues({ ...values, ...formToObject(e.currentTarget) }); setStep(2) }
  const finish = (e) => { e.preventDefault(); submit({ ...values, ...formToObject(e.currentTarget), interests }) }

  return (
    <div>
      <ol className="mb-6 flex items-center gap-3 text-sm font-semibold" aria-label="Progress">
        {['About you', 'Your interests'].map((s, i) => (
          <li key={s} className={cx('flex items-center gap-2', step === i + 1 ? 'text-ink' : 'text-ocean-900/40')}>
            <span className={cx('grid size-7 place-items-center rounded-full text-xs', step > i ? 'bg-ocean-900 text-white' : 'bg-ocean-50 text-ocean-900/60')}>{i + 1}</span>
            {s}
            {i === 0 && <span className="ml-1 h-px w-6 bg-ocean-200 sm:w-10" />}
          </li>
        ))}
      </ol>

      {step === 1 && (
        <form onSubmit={next} className="grid gap-4 sm:grid-cols-2">
          <Input name="name" label="Full name" required autoComplete="name" defaultValue={values.name} placeholder="Your name" className="sm:col-span-2" />
          <Input name="email" type="email" label="Email" required autoComplete="email" defaultValue={values.email} placeholder="you@email.com" />
          <Input name="phone" type="tel" label="Phone" required autoComplete="tel" defaultValue={values.phone} placeholder="+91" pattern="[0-9+\s\-]{8,}" />
          <Input name="college" label="College / University" required defaultValue={values.college} className="sm:col-span-2" />
          <Input name="course" label="Course" required defaultValue={values.course} placeholder="e.g. B.Tech CSE" />
          <Select name="year" label="Year" required options={yearsOfStudy} defaultValue={values.year} />
          <Input name="city" label="City" required autoComplete="address-level2" defaultValue={values.city} className="sm:col-span-2" />
          <Button type="submit" size="lg" className="mt-2 sm:col-span-2">Continue <ArrowRight size={18} /></Button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={finish} className="grid gap-5">
          <ChipGroup label="What are you interested in?" options={interestAreas} value={interests} onChange={setInterests} hint="Pick as many as you like." />
          <Input name="skills" label="Your skills" placeholder="e.g. Python, video editing, public speaking" hint="Separate with commas." />
          <FormError>{error}</FormError>
          <div className="flex gap-3">
            <Button type="button" variant="outline" size="lg" onClick={() => setStep(1)} aria-label="Back"><ArrowLeft size={18} /></Button>
            <Button type="submit" size="lg" className="flex-1" disabled={sending}>{sending ? 'Joining…' : 'Join the community'}</Button>
          </div>
          <p className="text-xs text-ocean-900/55">We only use your details to share SS opportunities with you. No spam, promise.</p>
        </form>
      )}
    </div>
  )
}
