import { Briefcase, Bell, Users, HeartHandshake } from 'lucide-react'
import { RegistrationForm } from '../components/forms/RegistrationForm'

const perks = [
  { icon: Bell, text: 'Hear about internships, jobs and events first' },
  { icon: Users, text: 'Meet students across colleges and cities' },
  { icon: Briefcase, text: 'Volunteer, lead and build your portfolio' },
  { icon: HeartHandshake, text: 'Get guidance whenever you’re stuck' },
]

export default function Join() {
  return (
    <section className="relative overflow-hidden">
      <div className="dot-grid absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_60%)]" aria-hidden />
      <div className="container-ss relative grid gap-10 py-10 sm:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="lg:pt-6">
          <p className="eyebrow mb-3"><span className="h-px w-6 bg-lagoon-jade" />Join the community</p>
          <h1 className="text-4xl font-extrabold leading-[1.05] sm:text-5xl">Free to join.<br /><span className="mark-mint">Yours to grow in.</span></h1>
          <p className="mt-4 max-w-md text-lg text-ocean-900/70">Takes under a minute. No fees, no catch — just students helping students.</p>
          <ul className="mt-8 space-y-4">
            {perks.map(({ icon: I, text }) => (
              <li key={text} className="flex items-center gap-3 font-medium"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-brand ring-1 ring-ocean-100"><I size={18} /></span>{text}</li>
            ))}
          </ul>
        </div>
        <div className="card p-5 sm:p-8"><RegistrationForm /></div>
      </div>
    </section>
  )
}
