import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export function Cadastro() {
  const navigate = useNavigate()

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function cadastrar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErro('')
    setSucesso('')

    if (!nome.trim()) {
      setErro('Informe seu nome completo.')
      return
    }

    if (senha.length < 8) {
      setErro('A senha deve ter pelo menos 8 caracteres.')
      return
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }

    setCarregando(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: senha,
        options: {
          data: {
            nome: nome.trim(),
          },
        },
      })

      if (error) {
        setErro('Não foi possível realizar o cadastro. Verifique os dados e tente novamente.')
        return
      }

      if (data.session) {
        navigate('/')
      } else {
        setSucesso('Verifique seu e-mail para confirmar o cadastro.')
      }
    } catch {
      setErro('Ocorreu um erro inesperado. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-center text-3xl font-bold text-emerald-700">
          Saúde Perto
        </h1>

        <h2 className="mb-2 text-center text-xl font-semibold">
          Criar conta
        </h2>

        <p className="mb-6 text-center text-sm text-gray-500">
          Cadastre-se para acessar os serviços disponíveis.
        </p>

        <form onSubmit={cadastrar} className="space-y-4">
          <div>
            <label htmlFor="nome" className="mb-1 block text-sm font-medium">
              Nome completo
            </label>

            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite seu nome completo"
              autoComplete="name"
              required
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              E-mail
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              autoComplete="email"
              required
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label htmlFor="senha" className="mb-1 block text-sm font-medium">
              Senha
            </label>

            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Mínimo de 8 caracteres"
              autoComplete="new-password"
              required
              minLength={8}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label htmlFor="confirmarSenha" className="mb-1 block text-sm font-medium">
              Confirmar senha
            </label>

            <input
              id="confirmarSenha"
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              placeholder="Digite novamente sua senha"
              autoComplete="new-password"
              required
              className="w-full rounded-lg border p-3"
            />
          </div>

          {erro && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {erro}
            </p>
          )}

          {sucesso && (
            <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
              {sucesso}
            </p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full rounded-lg bg-emerald-700 p-3 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
          >
            {carregando ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Já possui uma conta?{' '}
          <Link to="/login" className="font-semibold text-emerald-700">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}