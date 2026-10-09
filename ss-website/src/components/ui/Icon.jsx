import {
  Briefcase, CalendarDays, Code2, HeartHandshake, Music, Handshake, Sparkles, Users, Megaphone,
  GraduationCap, Rocket, Lightbulb, Trophy, Mic, Compass, Sprout, Globe,
} from 'lucide-react'

/** Map of icon names (stored in data) → icon components. */
const map = {
  music: Music, calendar: CalendarDays, code: Code2, heart: HeartHandshake, briefcase: Briefcase,
  handshake: Handshake, sparkles: Sparkles, users: Users, megaphone: Megaphone, grad: GraduationCap,
  rocket: Rocket, bulb: Lightbulb, trophy: Trophy, mic: Mic, compass: Compass, sprout: Sprout, globe: Globe,
}
export const iconNames = Object.keys(map)

export function Icon({ name, ...props }) {
  const C = map[name] || Sparkles
  return <C {...props} />
}

/* Brand icons aren't in lucide — tiny inline SVGs instead. */
const social = {
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" /></>,
  linkedin: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" /></>,
  x: <path d="M17.2 4h2.9l-6.3 7.2L21.2 20h-5.8l-4.5-5.9L5.7 20H2.8l6.7-7.7L2.4 4h5.9l4.1 5.4zm-1 14.3h1.6L7.4 5.6H5.7z" fill="currentColor" stroke="none" />,
  youtube: <><rect x="2.5" y="5.5" width="19" height="13" rx="4" /><path d="m10 9.5 5 2.5-5 2.5z" fill="currentColor" /></>,
  whatsapp: <><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z" /><path d="M9 9.5c.3 2 2.5 4.2 4.5 4.5l1-1.2 1.8.8c-.2 1-1 1.7-2 1.7A6 6 0 0 1 8.2 9.2c0-1 .7-1.8 1.7-2l.8 1.8z" /></>,
}
export function SocialIcon({ name, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {social[name]}
    </svg>
  )
}
