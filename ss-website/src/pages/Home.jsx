import { HeroSection } from '../sections/HeroSection'
import { AboutSection } from '../sections/AboutSection'
import { OpportunitiesSection } from '../sections/OpportunitiesSection'
import { AmbassadorSection } from '../sections/AmbassadorSection'
import { EventsSection } from '../sections/EventsSection'
import { ServicesSection } from '../sections/ServicesSection'
import { ImpactSection } from '../sections/ImpactSection'
import { TalentSection } from '../sections/TalentSection'
import { TeamSection } from '../sections/TeamSection'
import { JoinSection } from '../sections/JoinSection'
import { ContactSection } from '../sections/ContactSection'

/**
 * The whole public site is this one page. Section order follows the student's
 * journey: who we are → opportunities → participate → talent → support → join → contact.
 * Section ids must match `sections` in src/config/site.js (navbar).
 */
export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <OpportunitiesSection />
      <AmbassadorSection />
      <EventsSection />
      <TalentSection />
      <ServicesSection />
      <ImpactSection />
      <TeamSection />
      <JoinSection />
      <ContactSection />
    </>
  )
}
