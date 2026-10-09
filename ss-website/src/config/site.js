/**
 * SITE CONFIGURATION
 * ------------------
 * Static, rarely-changing info lives here.
 *
 * LOGO: the official SS logo. ss-logo-original.jpg is the untouched file;
 * ss-mark.png (SS + student) and ss-logo-full.jpg are cropped from it.
 */
import logo from '../assets/ss-mark.png' // compact mark (navbar, favicon-sized uses)
import logoFull from '../assets/ss-logo-full.jpg' // full logo with wordmark + tagline

export const site = {
  name: 'Struggle of Students',
  shortName: 'SS',
  tagline: 'Built by students. For students.',
  logo,
  logoFull,
  motto: ['Your talent', 'Your skills', 'Your opportunity'],
  // SS is contacted through its social handles (below) and the website contact form.
  socials: [
    { label: 'Instagram', handle: '@struggle.of.student', icon: 'instagram', url: 'https://www.instagram.com/struggle.of.student' },
    { label: 'X (Twitter)', handle: '@Struggleofstdnt', icon: 'x', url: 'https://x.com/Struggleofstdnt' },
    { label: 'YouTube', handle: '@struggleofstudents-o30', icon: 'youtube', url: 'https://www.youtube.com/@struggleofstudents-o30' },
    { label: 'WhatsApp community', handle: 'Join the group', icon: 'whatsapp', url: 'https://chat.whatsapp.com/I9OSqm30mAM5wEnUhDN17Y' },
  ],
  /**
   * Front-end-only admin gate. This is NOT real security — anyone can read
   * this value in the browser bundle. Swap for real auth when a backend exists.
   */
  adminPasscode: 'ss-admin',
}

export const enquiryTypes = [
  'Internship', 'Job', 'Event', 'Volunteering', 'Student guidance',
  'IT solution', 'Collaboration', 'Partnership', 'General enquiry',
]

export const opportunityCategories = [
  'Internship', 'Job', 'Campus Ambassador', 'Volunteering', 'Event',
  'Talent Showcase', 'Leadership', 'Workshop', 'Student Project',
  'Collaboration', 'Career', 'Personal Growth',
]

export const interestAreas = [
  'Internships & jobs', 'Events', 'Volunteering', 'Music & band', 'Tech & IT',
  'Leadership', 'Workshops', 'Content & design', 'Mentorship',
]

/** Single-page navigation: label → section id on the homepage. */
export const sections = [
  { id: 'about', label: 'About' },
  { id: 'opportunities', label: 'Opportunities' },
  { id: 'ambassador', label: 'Ambassadors' },
  { id: 'events', label: 'Events' },
  { id: 'talent', label: 'Talent' },
  { id: 'services', label: 'Services' },
  { id: 'impact', label: 'Impact' },
  { id: 'team', label: 'Team' },
  { id: 'contact', label: 'Contact' },
]

export const yearsOfStudy = ['1st year', '2nd year', '3rd year', '4th year', '5th year', 'Postgraduate', 'Recently graduated']
