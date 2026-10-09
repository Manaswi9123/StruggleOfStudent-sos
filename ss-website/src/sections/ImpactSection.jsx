import { Building2, GraduationCap, Briefcase } from 'lucide-react'
import { Section } from '../components/layout/Section'
import { SectionHeader, Reveal } from '../components/ui/SectionHeader'
import { PlacementCard } from '../components/cards/PlacementCard'
import { StatCard } from '../components/cards/StatCard'
import { useCollection } from '../hooks/useCollection'

export function ImpactSection() {
  const { data } = useCollection('placements')
  const total = data.reduce((n, p) => n + Number(p.studentsPlaced || 0), 0)
  const roles = new Set(data.flatMap((p) => p.roles || []))
  const max = Math.max(1, ...data.map((p) => Number(p.studentsPlaced || 0)))
  return (
    <Section id="impact">
      <SectionHeader
        eyebrow="Impact"
        title="Where SS students are going"
        intro="Every number here is a student who found their next step through the community."
      />
      <div className="mb-6 grid grid-cols-3 gap-3 sm:gap-4">
        <StatCard icon={GraduationCap} value={total} label="Students placed" />
        <StatCard icon={Building2} value={data.length} label="Organisations" />
        <StatCard icon={Briefcase} value={roles.size} label="Different roles" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[...data].sort((a, b) => b.studentsPlaced - a.studentsPlaced).map((p, i) => <Reveal key={p.id} delay={(i % 2) * 60}><PlacementCard placement={p} max={max} /></Reveal>)}
      </div>
    </Section>
  )
}
