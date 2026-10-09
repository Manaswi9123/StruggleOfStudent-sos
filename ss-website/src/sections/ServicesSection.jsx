import { useState } from 'react'
import { Section } from '../components/layout/Section'
import { SectionHeader, Reveal } from '../components/ui/SectionHeader'
import { ServiceCard } from '../components/cards/ServiceCard'
import { ServiceModal } from '../components/sections/ServiceModal'
import { CardSkeleton } from '../components/ui/Feedback'
import { useCollection } from '../hooks/useCollection'

export function ServicesSection() {
  const { data, loading } = useCollection('services')
  const [active, setActive] = useState(null)
  return (
    <Section id="services" tone="tint">
      <SectionHeader eyebrow="Our services" title="How SS can help you (or your org)" intro="From live music to websites to someone to talk to — all run by students. Tap a service to see who it’s for and who to contact." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? <CardSkeleton count={6} /> : data.map((s, i) => <Reveal key={s.id} delay={(i % 3) * 60}><ServiceCard service={s} index={i} onEnquire={setActive} /></Reveal>)}
      </div>
      <ServiceModal service={active} onClose={() => setActive(null)} />
    </Section>
  )
}
