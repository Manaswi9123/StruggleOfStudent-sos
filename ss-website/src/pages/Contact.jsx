import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import { PageHero } from '../components/layout/Layout'
import { ContactForm } from '../components/forms/ContactForm'
import { SocialIcon } from '../components/ui/Icon'
import { site } from '../config/site'

export default function Contact() {
  const rows = [
    { icon: Mail, label: 'Email', value: site.contact.email, href: `mailto:${site.contact.email}` },
    { icon: Phone, label: 'Phone', value: site.contact.phone, href: `tel:${site.contact.phone.replace(/\s/g, '')}` },
    { icon: MapPin, label: 'Location', value: site.contact.location },
    { icon: Clock, label: 'Hours', value: site.contact.hours },
  ]
  return (
    <>
      <PageHero eyebrow="Contact" title="We’d love to hear from you" intro="Students, colleges, companies, NGOs — whatever brings you here, pick a topic and drop us a message." />
      <section className="container-ss grid gap-8 py-12 sm:py-16 lg:grid-cols-[1fr_340px]">
        <div className="card p-5 sm:p-8"><ContactForm /></div>
        <aside className="space-y-3">
          {rows.map(({ icon: I, label, value, href }) => {
            const inner = (<><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-ocean-50 text-ocean-700"><I size={18} /></span><span><span className="block text-xs font-semibold uppercase tracking-wider text-ocean-900/50">{label}</span><span className="font-semibold">{value}</span></span></>)
            return href
              ? <a key={label} href={href} className="card card-hover flex items-center gap-3 p-4">{inner}</a>
              : <div key={label} className="card flex items-center gap-3 p-4">{inner}</div>
          })}
          <div className="card p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ocean-900/50">Follow SS</p>
            <div className="flex gap-2">
              {site.socials.map((s) => <a key={s.label} href={s.url} aria-label={s.label} className="grid size-10 place-items-center rounded-full bg-ocean-50 text-ocean-800 hover:bg-lagoon-mint"><SocialIcon name={s.icon} /></a>)}
            </div>
          </div>
        </aside>
      </section>
    </>
  )
}
