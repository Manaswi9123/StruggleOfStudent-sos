import { PageHero } from '../components/layout/Layout'
import { PlacementCard } from '../components/cards/PlacementCard'
import { StatCard } from '../components/cards/StatCard'
import { SampleBadge } from '../components/ui/Badge'
import { Reveal } from '../components/ui/SectionHeader'
import { CTASection } from '../components/sections/CTASection'
import { useCollection } from '../hooks/useCollection'
import { Building2, GraduationCap, Briefcase } from 'lucide-react'

export default function Impact() {
  const { data } = useCollection('placements')
  const total = data.reduce((n, p) => n + Number(p.studentsPlaced || 0), 0)
  const roles = new Set(data.flatMap((p) => p.roles || []))
  const max = Math.max(1, ...data.map((p) => Number(p.studentsPlaced || 0)))
  const sample = data.some((p) => p.isSample)

  return (
    <>
      <PageHero eyebrow="Impact" title="Where SS students are going" intro="Every number here is a student who found their next step through the community.">
        {sample && <SampleBadge>Sample numbers shown — real placement data will be added by the SS team</SampleBadge>}
      </PageHero>
      <section className="container-ss py-12 sm:py-16">
        <div className="mb-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          <StatCard icon={GraduationCap} value={total} label="Students placed" />
          <StatCard icon={Building2} value={data.length} label="Organisations" />
          <StatCard icon={Briefcase} value={roles.size} label="Different roles" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[...data].sort((a, b) => b.studentsPlaced - a.studentsPlaced).map((p, i) => <Reveal key={p.id} delay={(i % 2) * 60}><PlacementCard placement={p} max={max} /></Reveal>)}
        </div>
      </section>
      <CTASection title="Your name could be next." primary={{ to: '/opportunities', label: 'Find an opportunity' }} secondary={{ to: '/join', label: 'Join SS' }} />
    </>
  )
}
