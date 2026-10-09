import { Briefcase, Bell, Users, HeartHandshake } from 'lucide-react'
import { RegistrationForm } from '../components/forms/RegistrationForm'
import { SocialIcon } from '../components/ui/Icon'
import { site } from '../config/site'

const perks = [
  { icon: Bell, text: 'Hear about internships, jobs and events first' },
  { icon: Users, text: 'Meet students across colleges and cities' },
  { icon: Briefcase, text: 'Volunteer, lead and build your portfolio' },
  { icon: HeartHandshake, text: 'Get guidance whenever you’re stuck' },
]

export function JoinSection() {
  const whatsapp = site.socials.find((s) => s.icon === 'whatsapp')
  return (
    <section id="join" className="relative scroll-mt-16 overflow-hidden bg-ocean-900 py-16 text-white sm:py-20 lg:scroll-mt-[4.5rem]">
      <svg className="absolute inset-0 size-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <circle cx="760" cy="40" r="170" fill="#0077b6" opacity=".3" />
        <circle cx="40" cy="380" r="150" fill="#25a18e" opacity=".2" />
      </svg>
      <div className="container-ss relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="lg:pt-4">
          <p className="eyebrow mb-3 !text-lagoon-mint"><span className="h-px w-6 bg-lagoon-mint" />Join the community</p>
          <h2 className="text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl">Your people are<br />already here.</h2>
          <p className="mt-4 max-w-md text-lg text-ocean-100/85">Free to join, takes under a minute. No fees, no catch — just students helping students.</p>
          <ul className="mt-8 space-y-4">
            {perks.map(({ icon: I, text }) => (
              <li key={text} className="flex items-center gap-3 font-medium text-ocean-50"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 text-lagoon-mint ring-1 ring-white/15"><I size={18} /></span>{text}</li>
            ))}
          </ul>
          {whatsapp && (
            <a href={whatsapp.url} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15 transition hover:bg-white/15">
              <span className="grid size-10 place-items-center rounded-xl bg-lagoon-leaf text-ocean-900"><SocialIcon name="whatsapp" size={20} /></span>
              <span><span className="block text-sm font-bold text-white">Also join our WhatsApp community</span><span className="text-xs text-ocean-100/75">Daily updates on opportunities & events</span></span>
            </a>
          )}
        </div>
        <div className="rounded-[var(--radius-card)] bg-white p-5 text-ink shadow-[var(--shadow-lift)] sm:p-8"><RegistrationForm /></div>
      </div>
    </section>
  )
}
