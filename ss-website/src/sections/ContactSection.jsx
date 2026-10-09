import { ArrowUpRight } from 'lucide-react'
import { Section } from '../components/layout/Section'
import { SectionHeader } from '../components/ui/SectionHeader'
import { ContactForm } from '../components/forms/ContactForm'
import { SocialIcon } from '../components/ui/Icon'
import { site } from '../config/site'

const blurbs = {
  instagram: 'Fastest way to reach us — DM anytime',
  x: 'Updates, threads and announcements',
  youtube: 'Sessions, performances and event recaps',
  whatsapp: 'Daily opportunities, straight to your phone',
}

export function ContactSection() {
  return (
    <Section id="contact">
      <SectionHeader eyebrow="Contact" title="Say hello 👋" intro="The quickest way to reach SS is on our socials. Prefer writing it out? Use the form — pick a topic and we’ll get back to you." />
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <ul className="grid content-start gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {site.socials.map((s) => (
            <li key={s.label}>
              <a href={s.url} target="_blank" rel="noreferrer" className="card card-hover group flex items-center gap-4 p-4 sm:p-5">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-ocean-900 text-white transition group-hover:bg-lagoon-mint group-hover:text-ocean-900"><SocialIcon name={s.icon} size={22} /></span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold">{s.label}</span>
                  <span className="block truncate text-sm font-medium text-brand">{s.handle}</span>
                  <span className="block text-xs text-ocean-900/55">{blurbs[s.icon]}</span>
                </span>
                <ArrowUpRight size={18} className="shrink-0 text-ocean-300 transition group-hover:text-brand" />
              </a>
            </li>
          ))}
        </ul>
        <div className="card p-5 sm:p-8">
          <h3 className="mb-5 text-xl font-bold">Send us a message</h3>
          <ContactForm />
        </div>
      </div>
    </Section>
  )
}
