import { Target, Eye, Sprout, Heart, Users, Lightbulb, ShieldCheck } from 'lucide-react'
import { PageHero } from '../components/layout/Layout'
import { SectionHeader, Reveal } from '../components/ui/SectionHeader'
import { CTASection } from '../components/sections/CTASection'

const gains = [
  'Real internships, jobs and projects — not just “tips”',
  'A network of students across colleges and cities',
  'Stage time, leadership roles and things to put on your resume',
  'Someone to talk to when college gets heavy',
]
const values = [
  { icon: Heart, title: 'Kindness first', text: 'Everyone starts somewhere. No question is silly here.' },
  { icon: Users, title: 'Community over competition', text: 'When one of us finds a door, we hold it open.' },
  { icon: Lightbulb, title: 'Learn by doing', text: 'Run the event. Build the app. Lead the team.' },
  { icon: ShieldCheck, title: 'Honest & safe', text: 'We verify what we share and protect your data.' },
]

export default function About() {
  return (
    <>
      <PageHero eyebrow="About SS" title={<>We’re students who got tired of <span className="mark-mint">struggling alone</span>.</>}
        intro="Struggle of Students (SS) is a community built by students, for students. We share opportunities, run events, offer support — and make college a little less confusing for everyone." />

      <section className="container-ss py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h2 className="text-3xl font-bold">Why SS exists</h2>
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-ocean-900/75">
              <p>Every student hits the same walls: where do I find an internship? Who do I ask? Am I the only one who doesn’t know this?</p>
              <p>The answers usually exist — scattered across group chats, seniors, and luck. SS brings them together in one calm place, and puts students in charge of helping each other.</p>
            </div>
          </Reveal>
          <div className="grid gap-4">
            <Reveal delay={80} className="card p-6">
              <Target className="text-brand" /><h3 className="mt-4 text-xl font-bold">Our mission</h3>
              <p className="mt-2 text-ocean-900/75">Make opportunities, guidance and community accessible to every student — regardless of college, city or background.</p>
            </Reveal>
            <Reveal delay={140} className="card p-6">
              <Eye className="text-lagoon-jade" /><h3 className="mt-4 text-xl font-bold">Our vision</h3>
              <p className="mt-2 text-ocean-900/75">A world where no student has to figure it all out alone.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-y border-ocean-100 bg-white py-16 sm:py-20">
        <div className="container-ss grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeader eyebrow="What you gain" title="What being part of SS gets you" className="!mb-0" />
          </div>
          <ul className="grid gap-3">
            {gains.map((g, i) => (
              <Reveal as="li" key={g} delay={i * 60} className="flex items-center gap-4 rounded-2xl bg-ocean-25 p-4 ring-1 ring-ocean-100">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-lagoon-mint text-lagoon-deep"><Sprout size={18} /></span>
                <span className="font-semibold">{g}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-ss py-16 sm:py-20">
        <SectionHeader eyebrow="What we stand for" title="Our values" align="center" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 60} className="card p-6">
              <v.icon className="text-brand" size={24} />
              <h3 className="mt-4 text-lg font-bold">{v.title}</h3>
              <p className="mt-1.5 text-sm text-ocean-900/70">{v.text}</p>
            </Reveal>
          ))}
        </div>
      </section>
      <CTASection />
    </>
  )
}
