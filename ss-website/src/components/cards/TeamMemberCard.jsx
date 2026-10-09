import { Avatar } from '../ui/Avatar'
import { SocialIcon } from '../ui/Icon'

export function TeamMemberCard({ member, index = 0, featured = false }) {
  const links = [
    member.linkedin && { name: 'linkedin', url: member.linkedin },
    member.instagram && { name: 'instagram', url: member.instagram },
  ].filter(Boolean)

  if (featured) {
    return (
      <article className="card flex h-full flex-col p-6 sm:p-7">
        <div className="flex items-center gap-4">
          <Avatar name={member.name} photo={member.photo} size="lg" index={index} />
          <div className="min-w-0">
            <h3 className="text-xl font-bold">{member.name}</h3>
            <p className="font-semibold text-brand">{member.designation}</p>
            {member.responsibility && <p className="mt-0.5 text-sm text-ocean-900/60">{member.responsibility}</p>}
          </div>
        </div>
        <p className="mt-5 leading-relaxed text-ocean-900/75">“{member.bio}”</p>
        {links.length > 0 && <Socials links={links} name={member.name} className="mt-auto pt-5" />}
      </article>
    )
  }
  return (
    <article className="card card-hover flex items-start gap-4 p-4 sm:p-5">
      <Avatar name={member.name} photo={member.photo} index={index} />
      <div className="min-w-0 flex-1">
        <h3 className="font-bold leading-tight">{member.name}</h3>
        <p className="text-sm font-semibold text-brand">{member.designation}</p>
        {member.bio && <p className="mt-1 line-clamp-2 text-sm text-ocean-900/65">{member.bio}</p>}
        {links.length > 0 && <Socials links={links} name={member.name} className="mt-2" />}
      </div>
    </article>
  )
}

function Socials({ links, name, className }) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {links.map((l) => (
        <a key={l.name} href={l.url} target="_blank" rel="noreferrer" aria-label={`${name} on ${l.name}`} className="grid size-9 place-items-center rounded-full border border-ocean-100 text-ocean-700 hover:border-ocean-300 hover:bg-ocean-50">
          <SocialIcon name={l.name} size={16} />
        </a>
      ))}
    </div>
  )
}
