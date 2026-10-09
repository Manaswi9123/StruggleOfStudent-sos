import { Megaphone, School, Users, CalendarCheck, MessageSquareHeart, Award, Rocket, Sparkles, Handshake, ArrowRight } from 'lucide-react'
import { Section } from '../components/layout/Section'
import { SectionHeader, Reveal } from '../components/ui/SectionHeader'
import { Input, Select, Textarea, FormError } from '../components/ui/Field'
import { Button } from '../components/ui/Button'
import { SuccessMessage } from '../components/ui/Feedback'
import { useSubmit, formToObject } from '../components/forms/useSubmit'
import { applyAmbassador } from '../services/api'
import { yearsOfStudy } from '../config/site'
import { contactAbout } from '../utils/scroll'

const steps = [
  { title: 'Apply', text: 'Fill the 2-minute form. Any year, any stream.' },
  { title: 'Get onboarded', text: 'A short call with the SS team and your ambassador kit.' },
  { title: 'Lead your campus', text: 'Share opportunities, host meetups, connect clubs with SS.' },
  { title: 'Grow with SS', text: 'Top ambassadors move into the SS core team.' },
]

const duties = [
  { icon: School, text: 'Be SS’s point of contact at your college' },
  { icon: Megaphone, text: 'Share opportunities & events with your batchmates' },
  { icon: Handshake, text: 'Connect SS with your clubs, cells and faculty' },
  { icon: CalendarCheck, text: 'Host small meetups or sessions on campus' },
  { icon: MessageSquareHeart, text: 'Tell us what students at your college need' },
]

const perks = [
  { icon: Award, text: 'Certificate of recognition' },
  { icon: Sparkles, text: 'Early access to SS opportunities' },
  { icon: Users, text: 'Network with ambassadors from other colleges' },
  { icon: Rocket, text: 'Leadership experience for your resume' },
]

export function AmbassadorSection() {

  return (
    <Section id="ambassador" tone="mint">
      <SectionHeader
        eyebrow="Campus Ambassador Program"
        title={<>Bring SS to <span className="mark-mint">your college</span>.</>}
        intro="Campus Ambassadors are how SS connects with colleges. You represent SS on your campus, bring opportunities to your batchmates, and help your college’s students, clubs and placement cell partner with the SS community."
      />

      {/* how it works */}
      <ol className="mb-12 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {steps.map((s, i) => (
          <Reveal as="li" key={s.title} delay={i * 70} className="relative rounded-2xl bg-white p-4 ring-1 ring-lagoon-mint sm:p-5">
            <span className="font-display text-3xl font-extrabold text-lagoon-jade/30 sm:text-4xl">0{i + 1}</span>
            <h3 className="mt-1 font-bold sm:text-lg">{s.title}</h3>
            <p className="mt-1 text-sm text-ocean-900/70">{s.text}</p>
          </Reveal>
        ))}
      </ol>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
        <div className="space-y-8">
          <div>
            <h3 className="mb-4 text-xl font-bold">What you’ll do</h3>
            <ul className="space-y-3">
              {duties.map(({ icon: I, text }) => (
                <li key={text} className="flex items-center gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-brand ring-1 ring-ocean-100"><I size={18} /></span><span className="font-medium">{text}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xl font-bold">What you get</h3>
            <ul className="grid gap-3 sm:grid-cols-2">
              {perks.map(({ icon: I, text }) => (
                <li key={text} className="flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-lagoon-mint"><I size={18} className="shrink-0 text-lagoon-jade" /><span className="text-sm font-semibold">{text}</span></li>
              ))}
            </ul>
          </div>

          {/* colleges & clubs can partner directly */}
          <div className="flex flex-col gap-3 rounded-2xl bg-white p-5 ring-1 ring-ocean-100 sm:flex-row sm:items-center">
              <p className="flex-1 text-sm"><b>Are you a college, club or placement cell?</b> Partner with SS to bring opportunities and events to your students.</p>
              <Button variant="outline" size="sm" onClick={() => contactAbout('Partnership')}>Partner with us <ArrowRight size={14} /></Button>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-5 sm:p-8">
            <h3 className="text-2xl font-bold">Apply to be an ambassador</h3>
            <p className="mb-6 mt-1 text-sm text-ocean-900/65">One ambassador team per college — applications reviewed on a rolling basis.</p>
            <AmbassadorForm />
          </div>
        </div>
      </div>
    </Section>
  )
}

function AmbassadorForm() {
  const { sending, error, result, submit } = useSubmit(applyAmbassador)
  if (result) {
    return (
      <SuccessMessage title="Application received! 🎓">
        Thanks, {result.name.split(' ')[0]}! The SS team will contact you at <b>{result.email}</b> to schedule a short onboarding call for <b>{result.college}</b>.
      </SuccessMessage>
    )
  }
  return (
    <form onSubmit={(e) => { e.preventDefault(); submit(formToObject(e.currentTarget)) }} className="grid gap-4 sm:grid-cols-2">
      <Input name="name" label="Full name" required autoComplete="name" className="sm:col-span-2" />
      <Input name="email" type="email" label="Email" required autoComplete="email" />
      <Input name="phone" type="tel" label="Phone / WhatsApp" required autoComplete="tel" />
      <Input name="college" label="College / University" required className="sm:col-span-2" />
      <Input name="city" label="City" required />
      <Select name="year" label="Year" required options={yearsOfStudy} />
      <Input name="course" label="Course" className="sm:col-span-2" placeholder="e.g. B.Com, B.Tech ECE" />
      <Textarea name="why" label="Why do you want to represent SS?" required rows={3} placeholder="A few lines is perfect." className="sm:col-span-2" />
      <Input name="social" label="Instagram / LinkedIn" placeholder="@handle or link" className="sm:col-span-2" />
      <FormError>{error}</FormError>
      <Button type="submit" size="lg" disabled={sending} className="sm:col-span-2">{sending ? 'Sending…' : 'Apply as Campus Ambassador'}</Button>
    </form>
  )
}
