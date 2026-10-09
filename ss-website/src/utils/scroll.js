/** Smooth-scroll to a homepage section, accounting for the sticky navbar. */
export function scrollToSection(id) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  try { history.replaceState(null, '', `#${id}`) } catch { /* ignore */ }
}

/** Pre-select an enquiry type in the contact form, then scroll to it. */
export function contactAbout(type) {
  window.dispatchEvent(new CustomEvent('ss:enquiry', { detail: type }))
  scrollToSection('contact')
}
