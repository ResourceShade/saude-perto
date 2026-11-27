import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export function RotaProtegida() {
  const [session, setSession] = useState<Session | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
        setCarregando(false)
      })

    return () => subscription.unsubscribe()
  }, [])

  if (carregando) {
    return <div>Carregando...</div>
  }

  if (!session) {
    return <Navigate to="/cadastro" replace />
  }

  return <Outlet />
}