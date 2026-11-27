import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function entrar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: senha,
      })

      if (error) {
        setErro('Não foi possível entrar. Verifique seus dados.')
        return
      }

      navigate('/', { replace: true })
    } catch {
      setErro('Erro de conexão. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[65vh] max-w-md flex-col justify-center px-4 py-10">
      <div className="rounded-2xl border p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold">
          Entrar na sua conta
        </h1>

        <p className="mb-6 text-sm opacity-70">
          Acesse sua conta no Saúde Perto.
        </p>

        <form onSubmit={entrar} className="space-y-4">
          <div>
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border bg-transparent p-3"
              placeholder="Seu e-mail"
              required
            />
          </div>

          <div>
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="mt-1 w-full rounded-lg border bg-transparent p-3"
              placeholder="Sua senha"
              required
            />
          </div>

          {erro && (
            <p role="alert" className="text-sm text-red-600">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full rounded-lg bg-emerald-700 p-3 font-semibold text-white disabled:opacity-50"
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-5 space-y-3 text-center text-sm">
          <Link to="/recuperar-senha" className="underline">
            Esqueci minha senha
          </Link>

          <p>
            Não possui uma conta?{' '}
            <Link to="/cadastro" className="font-semibold underline">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}