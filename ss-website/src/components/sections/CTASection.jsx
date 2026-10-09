import { ArrowRight, Sprout } from 'lucide-react'
import { ButtonLink } from '../ui/Button'
import { Reveal } from '../ui/SectionHeader'

export function CTASection({
  title = 'Your people are already here.',
  text = 'Join SS to get opportunities first, meet students who get it, and grow at your own pace. It takes less than a minute.',
  primary = { to: '/join', label: 'Join the community' },
  secondary = { to: '/opportunities', label: 'Browse opportunities' },
}) {
  return (
    <section className="container-ss py-16 sm:py-20">
      <Reveal className="relative overflow-hidden rounded-[2rem] bg-ocean-900 px-6 py-12 text-center sm:px-12 sm:py-16">
        <svg className="absolute inset-0 size-full" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice" aria-hidden>
          <circle cx="720" cy="40" r="150" fill="#0077b6" opacity=".35" />
          <circle cx="60" cy="280" r="120" fill="#25a18e" opacity=".25" />
          <path d="M0 240 C 200 200, 400 290, 800 220 V300 H0Z" fill="#48cae4" opacity=".1" />
        </svg>
        <div className="relative mx-auto max-w-2xl">
          <div className="mx-auto mb-5 grid size-12 place-items-center rounded-2xl bg-lagoon-mint text-ocean-900 animate-float"><Sprout size={24} /></div>
          <h2 className="text-3xl font-extrabold text-white sm:text-5xl">{title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-ocean-100/85 sm:text-lg">{text}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink to={primary.to} variant="mint" size="lg">{primary.label} <ArrowRight size={18} /></ButtonLink>
            {secondary && <ButtonLink to={secondary.to} variant="light" size="lg" className="!bg-white/10 !text-white ring-1 ring-white/20 hover:!bg-white/15">{secondary.label}</ButtonLink>}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
