import { useEffect } from 'react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

/** Public single-page shell. */
export function Layout({ children }) {
  // open at the right section when the URL has a #hash (e.g. shared links)
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (id) setTimeout(() => document.getElementById(id)?.scrollIntoView(), 50)
  }, [])
  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2">Skip to content</a>
      <Navbar />
      <main id="main" className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
