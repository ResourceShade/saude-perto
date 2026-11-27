import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import {
  HeartPulse,
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  MapPin,
  CalendarDays,
  ShieldCheck,
  CheckCircle2,
  LoaderCircle,
} from 'lucide-react'

export function Cadastro() {
  const navigate = useNavigate()

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] = useState(false)

  const forcaSenha = [
    senha.length >= 8,
    senha.length >= 12,
    /[A-Z]/.test(senha) && /[a-z]/.test(senha),
    /[0-9]/.test(senha),
    /[^A-Za-z0-9]/.test(senha),
  ].filter(Boolean).length

  const nivelSenha =
    forcaSenha <= 2
      ? 'Fraca'
      : forcaSenha <= 3
        ? 'Moderada'
        : 'Forte'

  const corSenha =
    forcaSenha <= 2
      ? 'bg-red-500'
      : forcaSenha <= 3
        ? 'bg-amber-500'
        : 'bg-emerald-500'

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
        if (error.code === 'user_already_exists') {
          setErro('Este e-mail já está cadastrado. Acesse sua conta.')
        } else if (error.code === 'weak_password') {
          setErro('Escolha uma senha mais segura.')
        } else if (error.code === 'over_email_send_rate_limit') {
          setErro('Muitas tentativas. Aguarde alguns minutos.')
        } else {
          setErro('Não foi possível criar sua conta. Tente novamente.')
        }

        return
      }

      if (data.session) {
        navigate('/', { replace: true })
      } else {
        setSucesso('Verifique seu e-mail para confirmar o cadastro.')
      }
    } catch {
      setErro('Ocorreu um erro inesperado. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  const classeInput =
    'w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-12 text-sm outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100'

  return (
    <div className="min-h-screen bg-emerald-50/40 lg:grid lg:grid-cols-2">

      <aside className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-600 p-14 text-white lg:flex">

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/10"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-32 h-[500px] w-[500px] rounded-full bg-white/5"
        />

        <div className="relative flex items-center gap-3">
          <div className="rounded-2xl bg-white/15 p-3">
            <HeartPulse size={30} />
          </div>

          <span className="text-2xl font-bold">
            Saúde Perto
          </span>
        </div>

        <div className="relative max-w-lg">

          <span className="mb-6 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm">
            Tecnologia a serviço da saúde
          </span>

          <h1 className="text-5xl font-bold leading-tight">
            Sua saúde, mais perto de você.
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-emerald-100">
            Encontre atendimento, informações e serviços de
            saúde em uma plataforma simples e acessível.
          </p>

          <div className="mt-10 space-y-5">

            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-white/10 p-3">
                <MapPin size={23} />
              </div>
              <span>Encontre unidades de saúde próximas</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-white/10 p-3">
                <CalendarDays size={23} />
              </div>
              <span>Solicite agendamentos com facilidade</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-white/10 p-3">
                <ShieldCheck size={23} />
              </div>
              <span>Acesse informações sobre saúde e prevenção</span>
            </div>

          </div>
        </div>

        <p className="relative text-sm text-emerald-200">
          Saúde Perto © {new Date().getFullYear()}
        </p>

      </aside>

      <main className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">

        <div className="w-full max-w-md">

          <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <div className="rounded-xl bg-emerald-700 p-3 text-white">
              <HeartPulse size={28} />
            </div>

            <span className="text-2xl font-bold text-emerald-800">
              Saúde Perto
            </span>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl sm:p-9">

            <div className="mb-7">

              <span className="text-sm font-semibold text-emerald-700">
                Comece por aqui
              </span>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                Crie sua conta
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                Preencha seus dados para começar a utilizar
                os serviços do Saúde Perto.
              </p>

            </div>

            <form onSubmit={cadastrar} className="space-y-5">

              <div>
                <label htmlFor="nome" className="mb-2 block text-sm font-medium text-gray-700">
                  Nome completo
                </label>

                <div className="relative">
                  <UserRound className="absolute left-3.5 top-3.5 text-gray-400" size={19} />

                  <input
                    id="nome"
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Seu nome completo"
                    autoComplete="name"
                    required
                    className={classeInput}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                  E-mail
                </label>

                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 text-gray-400" size={19} />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Seu endereço de e-mail"
                    autoComplete="email"
                    required
                    className={classeInput}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="senha" className="mb-2 block text-sm font-medium text-gray-700">
                  Senha
                </label>

                <div className="relative">
                  <LockKeyhole className="absolute left-3.5 top-3.5 text-gray-400" size={19} />

                  <input
                    id="senha"
                    type={mostrarSenha ? 'text' : 'password'}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Mínimo de 8 caracteres"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    className={classeInput}
                  />

                  <button
                    type="button"
                    aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-4 top-3.5 text-gray-400 transition hover:text-emerald-700"
                  >
                    {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {senha && (
                  <div className="mt-3">

                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((nivel) => (
                        <div
                          key={nivel}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            nivel <= forcaSenha
                              ? corSenha
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>

                    <p className="mt-1.5 text-xs text-gray-500">
                      Força estimada da senha: {nivelSenha}
                    </p>

                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmarSenha" className="mb-2 block text-sm font-medium text-gray-700">
                  Confirmar senha
                </label>

                <div className="relative">
                  <LockKeyhole className="absolute left-3.5 top-3.5 text-gray-400" size={19} />

                  <input
                    id="confirmarSenha"
                    type={mostrarConfirmacao ? 'text' : 'password'}
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    placeholder="Repita sua senha"
                    autoComplete="new-password"
                    required
                    className={classeInput}
                  />

                  <button
                    type="button"
                    aria-label={mostrarConfirmacao ? 'Ocultar confirmação' : 'Mostrar confirmação'}
                    onClick={() => setMostrarConfirmacao(!mostrarConfirmacao)}
                    className="absolute right-4 top-3.5 text-gray-400 transition hover:text-emerald-700"
                  >
                    {mostrarConfirmacao ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {confirmarSenha && senha === confirmarSenha && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600">
                    <CheckCircle2 size={15} />
                    As senhas coincidem
                  </p>
                )}

                {confirmarSenha && senha !== confirmarSenha && (
                  <p className="mt-2 text-xs text-red-600">
                    As senhas não coincidem
                  </p>
                )}
              </div>

              {erro && (
                <p role="alert" className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
                  {erro}
                </p>
              )}

              {sucesso && (
                <p role="status" className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-700">
                  {sucesso}
                </p>
              )}

              <button
                type="submit"
                disabled={carregando}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 p-4 font-semibold text-white shadow-md transition duration-200 hover:bg-emerald-800 active:scale-[0.98] disabled:opacity-50"
              >
                {carregando ? (
                  <>
                    <LoaderCircle size={20} className="animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  <>
                    Criar minha conta
                    <ArrowRight size={19} />
                  </>
                )}
              </button>

            </form>

            <div className="mt-7 border-t border-gray-100 pt-6 text-center text-sm text-gray-600">
              Já possui uma conta?{' '}

              <Link
                to="/login"
                className="font-semibold text-emerald-700 hover:underline"
              >
                Fazer login
              </Link>
            </div>

          </div>

        </div>

      </main>

    </div>
  )
}