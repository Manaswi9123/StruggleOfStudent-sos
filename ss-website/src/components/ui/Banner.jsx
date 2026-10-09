import { useState } from 'react'
import { cx } from '../../utils/format'

/**
 * Event banner: shows the event's photo. If no photo is set (or it fails to
 * load) it falls back to a calm on-brand pattern so cards never look broken.
 */
const sized = (url, w) => (url.includes('images.unsplash.com') ? `${url.split('?')[0]}?auto=format&fit=crop&w=${w}&q=70` : url)
const tones = {
  ocean: { bg: 'bg-ocean-800', a: '#0096c7', b: '#48cae4', c: '#caf0f8' },
  lagoon: { bg: 'bg-lagoon-deep', a: '#25a18e', b: '#00a5cf', c: '#9fffcb' },
  leaf: { bg: 'bg-ocean-700', a: '#25a18e', b: '#7ae582', c: '#9fffcb' },
}

export function Banner({ imageUrl, tone = 'ocean', title, className, children }) {
  const t = tones[tone] || tones.ocean
  const [broken, setBroken] = useState(false)
  const showPhoto = imageUrl && !broken
  return (
    <div className={cx('relative overflow-hidden', t.bg, className)}>
      {showPhoto ? (
        <>
          <img
            src={sized(imageUrl, 800)}
            srcSet={`${sized(imageUrl, 480)} 480w, ${sized(imageUrl, 800)} 800w, ${sized(imageUrl, 1400)} 1400w`}
            sizes="(min-width:1024px) 33vw, 100vw"
            alt={title}
            loading="lazy"
            onError={() => setBroken(true)}
            className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-[1.04]"
          />
          {/* soft tint so date/badges stay readable on any photo */}
          <div className="absolute inset-0 bg-gradient-to-b from-ocean-900/35 via-transparent to-ocean-900/25" aria-hidden />
        </>
      ) : (
        <svg className="absolute inset-0 size-full" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" aria-hidden>
          <circle cx="330" cy="40" r="90" fill={t.a} opacity=".55" />
          <circle cx="360" cy="170" r="60" fill={t.b} opacity=".5" />
          <path d="M0 150 C 80 120, 160 190, 240 150 S 380 120, 400 140 V200 H0Z" fill={t.c} opacity=".18" />
          <path d="M0 170 C 90 150, 170 200, 260 170 S 380 150, 400 165 V200 H0Z" fill={t.c} opacity=".22" />
          <g opacity=".35" fill={t.c}>
            {Array.from({ length: 6 }).map((_, i) => <circle key={i} cx={30 + i * 22} cy={30} r="2" />)}
            {Array.from({ length: 6 }).map((_, i) => <circle key={i} cx={30 + i * 22} cy={50} r="2" />)}
          </g>
        </svg>
      )}
      {children && <div className="relative">{children}</div>}
    </div>
  )
}
