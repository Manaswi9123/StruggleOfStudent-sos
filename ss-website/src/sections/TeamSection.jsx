import { Section } from '../components/layout/Section'
import { SectionHeader, Reveal } from '../components/ui/SectionHeader'
import { Avatar } from '../components/ui/Avatar'
import { SocialIcon } from '../components/ui/Icon'
import { useCollection } from '../hooks/useCollection'
import { StatCard } from '../components/cards/StatCard'
import { Users, Mic, UserCheck } from 'lucide-react'

/** Founder & Directors — personal, not corporate. */
export function TeamSection() {
  const { data } = useCollection('team')
  const members = useCollection('members')
  const talents = useCollection('talents')
  const leaders = data.filter((t) => t.group === 'leadership')
  const core = data.filter((t) => t.group !== 'leadership')
  if (!data.length) return null
  return (
    <Section id="team" tone="white">
      <SectionHeader
        eyebrow="Our team"
        title="The students behind SS"
        intro="SS is run entirely by students who give their time because someone once did the same for them."
      />
      <div className="mb-8 grid grid-cols-3 gap-3 sm:gap-4">
        <StatCard icon={Users} value={members.data.length + talents.data.length + data.length} label="Active community members" />
        <StatCard icon={UserCheck} value={data.length} label="Team members" />
        <StatCard icon={Mic} value={talents.data.length} label="Featured talent" />
      </div>
      <h3 className="mb-4 text-lg font-bold text-ocean-900/80">Founder & Directors</h3>
      <div className="grid gap-4 md:grid-cols-3">
        {leaders.map((m, i) => (
          <Reveal key={m.id} delay={i * 70}>
            <article className="card flex h-full flex-col p-6 sm:p-7">
              <div className="flex items-center gap-4">
                <Avatar name={m.name} photo={m.photo} size="lg" index={i} />
                <div className="min-w-0">
                  <h3 className="text-xl font-bold">{m.name}</h3>
                  <p className="font-semibold text-brand">{m.designation}</p>
                  {m.responsibility && <p className="mt-0.5 text-sm text-ocean-900/60">{m.responsibility}</p>}
                </div>
              </div>
              <p className="mt-5 leading-relaxed text-ocean-900/75">“{m.bio}”</p>
              {(m.linkedin || m.instagram) && (
                <div className="mt-auto flex gap-2 pt-5">
                  {m.linkedin && <a href={m.linkedin} target="_blank" rel="noreferrer" aria-label={`${m.name} on LinkedIn`} className="grid size-9 place-items-center rounded-full border border-ocean-100 text-ocean-700 hover:bg-ocean-50"><SocialIcon name="linkedin" size={16} /></a>}
                  {m.instagram && <a href={m.instagram} target="_blank" rel="noreferrer" aria-label={`${m.name} on Instagram`} className="grid size-9 place-items-center rounded-full border border-ocean-100 text-ocean-700 hover:bg-ocean-50"><SocialIcon name="instagram" size={16} /></a>}
                </div>
              )}
            </article>
          </Reveal>
        ))}
      </div>

      {core.length > 0 && (
        <>
          <h3 className="mb-4 mt-12 text-lg font-bold text-ocean-900/80">Core team</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {core.map((m, i) => (
              <Reveal key={m.id} delay={(i % 3) * 50}>
                <article className="card card-hover flex h-full items-start gap-4 p-4 sm:p-5">
                  <Avatar name={m.name} photo={m.photo} index={i + 1} />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold leading-tight">{m.name}</h4>
                    <p className="text-sm font-semibold text-brand">{m.designation}</p>
                    {m.bio && <p className="mt-1 text-sm text-ocean-900/65">{m.bio}</p>}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </>
      )}
    </Section>
  )
}
