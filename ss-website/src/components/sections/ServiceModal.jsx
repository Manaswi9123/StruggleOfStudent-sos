import { Mail, Phone, User } from 'lucide-react'
import { SocialIcon } from '../ui/Icon'
import { site } from '../../config/site'
import { Modal } from '../ui/Modal'
import { Icon } from '../ui/Icon'
import { ContactForm } from '../forms/ContactForm'

const typeFor = (s) => (/it/i.test(s.name) ? 'IT solution' : /event|band/i.test(s.name) ? 'Event' : /guid|problem/i.test(s.name) ? 'Student guidance' : /career|intern/i.test(s.name) ? 'Internship' : 'Collaboration')

/** Full service details + enquiry form, in one place. */
export function ServiceModal({ service, onClose }) {
  if (!service) return null
  return (
    <Modal open={!!service} onClose={onClose} title={service.name} size="lg">
      <div className="flex items-start gap-4">
        <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-ocean-100 text-ocean-800"><Icon name={service.icon} size={22} /></div>
        <p className="text-ocean-900/75">{service.summary}</p>
      </div>
      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-ocean-25 p-4 ring-1 ring-ocean-100">
          <dt className="eyebrow mb-2">What we provide</dt>
          <dd><ul className="space-y-1 text-sm">{(service.provides || []).map((p) => <li key={p}>• {p}</li>)}</ul></dd>
        </div>
        <div className="rounded-2xl bg-ocean-25 p-4 ring-1 ring-ocean-100">
          <dt className="eyebrow mb-2">Who it’s for</dt>
          <dd className="text-sm">{service.forWhom}</dd>
          <dt className="eyebrow mb-2 mt-4">How to approach us</dt>
          <dd className="text-sm">{service.howToApproach}</dd>
        </div>
      </dl>
      <div className="mt-4 flex flex-col gap-2 rounded-2xl bg-lagoon-mint-soft p-4 text-sm ring-1 ring-lagoon-mint sm:flex-row sm:flex-wrap sm:gap-x-6">
        <span className="inline-flex items-center gap-2 font-semibold"><User size={15} />{service.contactPerson}</span>
        {service.contactEmail && <a href={`mailto:${service.contactEmail}`} className="inline-flex items-center gap-2 hover:underline"><Mail size={15} />{service.contactEmail}</a>}
        {service.contactPhone && <a href={`tel:${service.contactPhone.replace(/\s/g, '')}`} className="inline-flex items-center gap-2 hover:underline"><Phone size={15} />{service.contactPhone}</a>}
        {!service.contactEmail && !service.contactPhone && site.socials.slice(0, 2).concat(site.socials.filter((s) => s.icon === 'whatsapp')).map((s) => (
          <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:underline"><SocialIcon name={s.icon} size={15} />{s.label}</a>
        ))}
      </div>
      <h3 className="mb-4 mt-8 text-lg font-bold">Send an enquiry</h3>
      <ContactForm defaultType={typeFor(service)} defaultMessage={`Hi! I’d like to know more about ${service.name}.`} />
    </Modal>
  )
}
