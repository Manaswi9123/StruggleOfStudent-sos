import { ButtonLink } from '../components/ui/Button'

export default function NotFound() {
  return (
    <section className="container-ss py-24 text-center">
      <p className="font-display text-7xl font-extrabold text-ocean-200">404</p>
      <h1 className="mt-4 text-3xl font-bold">This page is still struggling to exist.</h1>
      <p className="mt-2 text-ocean-900/70">Let’s get you somewhere useful.</p>
      <div className="mt-8 flex justify-center gap-3"><ButtonLink to="/">Go home</ButtonLink><ButtonLink to="/opportunities" variant="outline">Opportunities</ButtonLink></div>
    </section>
  )
}
