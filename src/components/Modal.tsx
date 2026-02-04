import type { ReactNode } from 'react'
import { useEffect } from 'react'

type ModalProps = {
  open: boolean
  title?: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}

export default function Modal({ open, title, onClose, children, footer }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-carbon_black-100/45 px-4 py-12 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="interactive-card w-full max-w-2xl rounded-2xl border border-silver-700 bg-white_smoke-900 shadow-2xl shadow-silver-400/60 transition duration-200 ease-out origin-top scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-silver-700 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-carbon_black-500">{title}</h3>
            <p className="text-xs text-silver-600">Lengkapi data member baru</p>
          </div>
          <button
            className="interactive-icon flex h-10 w-10 items-center justify-center rounded-lg border border-silver-700 bg-white_smoke-800 text-carbon_black-500 hover:border-strawberry_red-500 hover:text-strawberry_red-500"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div className="px-6 py-6 text-sm text-carbon_black-500">{children}</div>
        {footer ? <div className="flex items-center justify-between gap-3 border-t border-silver-700 px-6 py-4">{footer}</div> : null}
      </div>
    </div>
  )
}
