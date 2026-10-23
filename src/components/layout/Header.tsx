import { HeartPulse } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Nav } from './Nav'

export function Header() {
  return (
    <header className="faixa-escura bg-verde-posto text-papel">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <Link to="/" className="flex items-center gap-2 text-papel">
          <HeartPulse className="size-7 shrink-0" aria-hidden="true" />
          <span className="font-heading text-xl font-bold tracking-tight">Saúde Perto</span>
        </Link>
        <Nav />
      </div>
    </header>
  )
}
