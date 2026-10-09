import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { cx } from '../../utils/format'

/** Accessible modal: bottom sheet on phones, centred dialog on larger screens. */
export function Modal({ open, onClose, title, children, size = 'md' }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    ref.current?.focus()
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey) }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-ocean-900/40 backdrop-blur-[2px] animate-[rise_.25s_ease-out_both]" onClick={onClose} />
      <div
        ref={ref}
        tabIndex={-1}
        className={cx(
          'relative max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-[var(--shadow-lift)] outline-none animate-rise sm:rounded-3xl sm:p-7',
          size === 'lg' ? 'sm:max-w-2xl' : 'sm:max-w-lg',
        )}
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-ocean-100 sm:hidden" />
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
          <button onClick={onClose} className="-m-1 rounded-full p-2 text-ocean-900/60 hover:bg-ocean-50 hover:text-ink" aria-label="Close">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
