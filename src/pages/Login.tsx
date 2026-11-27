import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  HeartPulse,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  MapPin,
  CalendarCheck,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

export function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [recuperando, setRecuperando] = useState(false)

  async function entrar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErro('')
    setSucesso('')
    setCarregando(true)

    try {
      if (recuperando) {
        const { error } = await supabase.auth.resetPasswordForEmail(
          email.trim(),
          {
            redirectTo: `${window.location.origin}/redefinir-senha`,
          }
        )

        if (error) {
          setErro('Não foi possível solicitar a recuperação. Tente novamente.')
          return
        }

        setSucesso(
          'Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.'
        )
        return
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: senha,
      })

      if (error) {
        setErro('Não foi possível entrar. Verifique seu e-mail e sua senha.')
        return
      }

      navigate('/', { replace: true })
    } catch {
      setErro('Erro de conexão. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  function alternarRecuperacao() {
    setRecuperando(!recuperando)
    setErro('')
    setSucesso('')
    setSenha('')
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-emerald-50/50 px-4 py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-xl md:grid-cols-2">

        <div className="hidden flex-col justify-between bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-600 p-12 text-white md:flex">

          <div>
            <div className="flex items-center gap-3">
              <HeartPulse size={36} />
              <span className="text-2xl font-bold">
                Saúde Perto
              </span>
            </div>

            <h2 className="mt-16 text-4xl font-bold leading-tight">
              Sua saúde, mais perto de você.
            </h2>

            <p className="mt-5 leading-relaxed text-emerald-100">
              Encontre informações, conheça unidades de saúde
              e tenha acesso aos recursos disponíveis em nossa plataforma.
            </p>

            <div className="mt-10 space-y-6">
              <div className="flex items-center gap-4">
                <MapPin size={24} />
                <span>Encontre unidades de saúde</span>
              </div>

              <div className="flex items-center gap-4">
                <CalendarCheck size={24} />
                <span>Solicitações de agendamento demonstrativas</span>
              </div>

              <div className="flex items-center gap-4">
                <ShieldCheck size={24} />
                <span>Informações e orientações de saúde</span>
              </div>
            </div>
          </div>

          <p className="mt-12 text-sm text-emerald-200">
            Saúde Perto • Tecnologia a serviço da saúde
          </p>
        </div>

        <div className="p-6 sm:p-12">

          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-900"
          >
            <ArrowLeft size={16} />
            Voltar ao início
          </Link>

          <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <HeartPulse size={30} />
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            {recuperando ? 'Recuperar senha' : 'Bem-vindo de volta!'}
          </h1>

          <p className="mb-8 mt-3 text-sm leading-relaxed text-gray-500">
            {recuperando
              ? 'Informe seu e-mail para receber o link de recuperação.'
              : 'Entre na sua conta para continuar acessando o Saúde Perto.'}
          </p>

          <form onSubmit={entrar} className="space-y-5">

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                E-mail
              </label>

              <div className="relative">
                <Mail
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu e-mail"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-4 pl-12 pr-4 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            {!recuperando && (
              <div>
                <label
                  htmlFor="senha"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Senha
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    aria-hidden="true"
                  />

                  <input
                    id="senha"
                    type={mostrarSenha ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Digite sua senha"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-4 pl-12 pr-12 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />

                  <button
                    type="button"
                    aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-700"
                  >
                    {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="mt-3 text-right">
                  <button
                    type="button"
                    disabled={carregando}
                    onClick={alternarRecuperacao}
                    className="text-sm font-semibold text-emerald-700 hover:underline"
                  >
                    Esqueci minha senha
                  </button>
                </div>
              </div>
            )}

            {erro && (
              <p
                role="alert"
                className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"
              >
                {erro}
              </p>
            )}

            {sucesso && (
              <p
                role="status"
                className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700"
              >
                {sucesso}
              </p>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-700 py-4 font-semibold text-white shadow-md transition hover:bg-emerald-800 active:scale-[0.98] disabled:opacity-50"
            >
              {carregando
                ? 'Aguarde...'
                : recuperando
                  ? 'Enviar link de recuperação'
                  : 'Entrar na minha conta'}

              {!carregando && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-8 border-t border-gray-100 pt-6 text-center text-sm text-gray-600">
            {recuperando ? (
              <button
                type="button"
                disabled={carregando}
                onClick={alternarRecuperacao}
                className="font-semibold text-emerald-700 hover:underline"
              >
                Voltar para o login
              </button>
            ) : (
              <p>
                Ainda não possui uma conta?{' '}
                <Link
                  to="/cadastro"
                  className="font-semibold text-emerald-700 hover:underline"
                >
                  Criar conta
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}