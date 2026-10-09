import { useState } from 'react'
import { PageHero } from '../components/layout/Layout'
import { ServiceCard } from '../components/cards/ServiceCard'
import { ServiceModal } from '../components/sections/ServiceModal'
import { CTASection } from '../components/sections/CTASection'
import { Reveal } from '../components/ui/SectionHeader'
import { CardSkeleton } from '../components/ui/Feedback'
import { useCollection } from '../hooks/useCollection'

export default function Services() {
  const { data, loading } = useCollection('services')
  const [active, setActive] = useState(null)
  return (
    <>
      <PageHero eyebrow="Services" title="Ways SS supports students & organisations" intro="Every service is run by students. Tap one to see who it’s for, who to contact, and send an enquiry." />
      <section className="container-ss py-12 sm:py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? <CardSkeleton count={6} /> : data.map((s, i) => <Reveal key={s.id} delay={(i % 3) * 60}><ServiceCard service={s} index={i} onEnquire={setActive} /></Reveal>)}
        </div>
      </section>
      <ServiceModal service={active} onClose={() => setActive(null)} />
      <CTASection title="Not sure where to start?" text="Send us a message and we’ll point you to the right person." primary={{ to: '/contact', label: 'Contact SS' }} secondary={null} />
    </>
  )
}
