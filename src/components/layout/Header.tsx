import { useEffect, useState } from 'react'
import { HeartPulse, LogOut, LogIn } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'

import { supabase } from '@/lib/supabase'
import { Nav } from './Nav'

export function Header() {
  const [session, setSession] = useState<Session | null>(null)
  const [carregando, setCarregando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
        setCarregando(false)
      })

    return () => subscription.unsubscribe()
  }, [])

  async function sair() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      alert('Não foi possível sair da conta.')
      return
    }

    navigate('/login', { replace: true })
  }

  return (
    <header className="faixa-escura bg-verde-posto text-papel">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <Link to="/" className="flex items-center gap-2 text-papel">
          <HeartPulse className="size-7 shrink-0" aria-hidden="true" />
          <span className="font-heading text-xl font-bold tracking-tight">
            Saúde Perto
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-4">
          <Nav />

          {!carregando && (
            session ? (
              <button
                type="button"
                onClick={sair}
                className="flex items-center gap-2 rounded-lg border border-white/40 px-4 py-2 font-semibold transition hover:bg-white/10"
              >
                <LogOut className="size-4" />
                Sair
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 rounded-lg border border-white/40 px-4 py-2 font-semibold transition hover:bg-white/10"
              >
                <LogIn className="size-4" />
                Entrar
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  )
}