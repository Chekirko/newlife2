'use client'

import { useId, useRef, useState, type ReactNode } from 'react'
import { ControlIcon as Icon } from '@/components/ui/ControlIcon'

export function MobileMenu({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const button = useRef<HTMLButtonElement>(null)
  const id = useId()
  return <div className="lg:hidden" onKeyDown={event => {
    if (event.key === 'Escape') { setOpen(false); button.current?.focus() }
  }}>
    <button ref={button} type="button" aria-label={open ? 'Закрити меню' : 'Відкрити меню'} aria-controls={id} aria-expanded={open}
      onClick={() => setOpen(value => !value)} className="flex h-12 w-12 items-center justify-center text-xl text-gray-800">
      {open ? <Icon name="fas fa-times" /> : <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 5h18M3 12h18M3 19h18" strokeWidth="2" /></svg>}
    </button>
    <nav id={id} aria-label="Мобільна навігація" hidden={!open} inert={!open}
      className="absolute left-0 right-0 top-full max-h-[calc(100dvh-124px)] overflow-y-auto bg-white shadow-lg"
      onClick={event => { if ((event.target as HTMLElement).closest('a')) setOpen(false) }}>
      <div className="container-larexa py-4">{children}</div>
    </nav>
  </div>
}
