import { Users, UserCheck } from 'lucide-react'
import { PageHero } from '../components/layout/Layout'
import { SectionHeader, Reveal } from '../components/ui/SectionHeader'
import { TeamMemberCard } from '../components/cards/TeamMemberCard'
import { CTASection } from '../components/sections/CTASection'
import { StatCard } from '../components/cards/StatCard'
import { useCollection } from '../hooks/useCollection'

export default function Community() {
  const team = useCollection('team')
  const members = useCollection('members')
  const leadership = team.data.filter((t) => t.group === 'leadership')
  const core = team.data.filter((t) => t.group !== 'leadership')

  return (
    <>
      <PageHero eyebrow="Community & team" title="The people who make SS happen" intro="SS is run entirely by students who volunteer their time. Say hi — we don’t bite.">
        <div className="grid max-w-md grid-cols-2 gap-3">
          <StatCard icon={UserCheck} value={team.data.length} label="Active team members" />
          <StatCard icon={Users} value={members.data.length + team.data.length} label="Community members" />
        </div>
      </PageHero>

      <section className="container-ss py-16 sm:py-20">
        <SectionHeader eyebrow="Founder & leadership" title="Leading with heart" intro="The people steering SS — and the reasons they care." />
        <div className="grid gap-4 md:grid-cols-3">
          {leadership.map((m, i) => <Reveal key={m.id} delay={i * 60}><TeamMemberCard member={m} index={i} featured /></Reveal>)}
        </div>
      </section>

      <section className="border-t border-ocean-100 bg-white py-16 sm:py-20">
        <div className="container-ss">
          <SectionHeader eyebrow="Core team" title="The everyday heroes" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {core.map((m, i) => <Reveal key={m.id} delay={(i % 3) * 50}><TeamMemberCard member={m} index={i + 1} /></Reveal>)}
          </div>
        </div>
      </section>
      <CTASection title="Want to be on this page?" text="Join SS, volunteer at an event or apply for the Leadership Circle. Everyone on the team started as a member." />
    </>
  )
}
