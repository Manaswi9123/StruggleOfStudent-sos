import { Compass, HandHeart, LifeBuoy, Target, Eye, Heart, Users, Lightbulb, ShieldCheck, Sprout } from 'lucide-react'
import { Section } from '../components/layout/Section'
import { SectionHeader, Reveal } from '../components/ui/SectionHeader'
import { scrollToSection } from '../utils/scroll'
import { site } from '../config/site'

const pillars = [
  { icon: Compass, title: 'Find opportunities', text: 'Internships, jobs, projects and roles — verified and shared by students.', to: 'opportunities' },
  { icon: HandHeart, title: 'Participate', text: 'Volunteer at events, perform with the SS Band, lead on your campus, join live sessions.', to: 'events' },
  { icon: LifeBuoy, title: 'Get support', text: 'Stuck on academics, careers or life? Talk to seniors and peers who actually get it.', to: 'services' },
]
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

export function AboutSection() {
  return (
    <Section id="about">
      <div className="mb-10 grid items-center gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:gap-12">
        <SectionHeader
          eyebrow="About SS"
          title={<>We’re students who got tired of <span className="mark-mint">struggling alone</span>.</>}
          intro="Every student hits the same walls: where do I find an internship? Who do I ask? Am I the only one who doesn’t know this? The answers exist — scattered across group chats, seniors and luck. SS brings them together in one calm place, and puts students in charge of helping each other."
          className="!mb-0"
        />
        <Reveal delay={100} className="mx-auto w-full max-w-xs lg:max-w-none">
          <img src={site.logoFull} alt="Struggle of Students logo — Your talent, Your skills, Your opportunity" width="800" height="740" loading="lazy" className="w-full rounded-[2rem] shadow-[var(--shadow-lift)] ring-1 ring-ocean-900/10" />
        </Reveal>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {pillars.map((p, i) => (
          <Reveal key={p.title} delay={i * 80}>
            <button onClick={() => scrollToSection(p.to)} className="card card-hover group flex h-full w-full flex-col p-6 text-left">
              <p.icon size={26} className="text-brand" />
              <h3 className="mt-5 text-xl font-bold">{p.title}</h3>
              <p className="mt-2 text-ocean-900/70">{p.text}</p>
            </button>
          </Reveal>
        ))}
      </div>

      <div className="mt-12 grid gap-4 lg:grid-cols-[1fr_1fr_1.2fr]">
        <Reveal className="card p-6">
          <Target className="text-brand" /><h3 className="mt-4 text-xl font-bold">Our mission</h3>
          <p className="mt-2 text-ocean-900/75">Make opportunities, guidance and community accessible to every student — regardless of college, city or background.</p>
        </Reveal>
        <Reveal delay={70} className="card p-6">
          <Eye className="text-lagoon-jade" /><h3 className="mt-4 text-xl font-bold">Our vision</h3>
          <p className="mt-2 text-ocean-900/75">A world where no student has to figure it all out alone.</p>
        </Reveal>
        <Reveal delay={140} className="card p-6">
          <h3 className="text-xl font-bold">What you gain</h3>
          <ul className="mt-3 space-y-2.5">
            {gains.map((g) => <li key={g} className="flex gap-2.5 text-sm"><Sprout size={17} className="mt-0.5 shrink-0 text-lagoon-jade" />{g}</li>)}
          </ul>
        </Reveal>
      </div>

      <h3 className="mb-4 mt-12 text-xl font-bold">What we stand for</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {values.map((v, i) => (
          <Reveal key={v.title} delay={i * 60} className="rounded-2xl bg-white p-5 ring-1 ring-ocean-100">
            <v.icon className="text-brand" size={22} />
            <h4 className="mt-3 font-bold">{v.title}</h4>
            <p className="mt-1 text-sm text-ocean-900/70">{v.text}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
