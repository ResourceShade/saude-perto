import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  HeartPulse,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

export function RedefinirSenha() {
  const navigate = useNavigate()

  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [verificando, setVerificando] = useState(true)
  const [sessaoValida, setSessaoValida] = useState(false)

  useEffect(() => {
    let ativo = true

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((event, session) => {
        if (!ativo) return

        if (event === 'PASSWORD_RECOVERY') {
          setSessaoValida(!!session)
          setVerificando(false)
          setErro('')
        }
      })

    async function verificarSessao() {
      const parametros = new URLSearchParams(window.location.search)
      const hash = new URLSearchParams(
        window.location.hash.substring(1)
      )

      const erroLink =
        parametros.get('error') || hash.get('error')

      const { data, error } = await supabase.auth.getSession()

      if (!ativo) return

      if (erroLink || error || !data.session) {
        setSessaoValida(false)
        setErro('Link inválido ou expirado. Solicite um novo link de recuperação.')
      } else {
        setSessaoValida(true)
        setErro('')
      }

      setVerificando(false)
    }

    void verificarSessao()

    return () => {
      ativo = false
      subscription.unsubscribe()
    }
  }, [])

  async function redefinirSenha(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErro('')

    if (!sessaoValida) {
      setErro('Solicite um novo link de recuperação.')
      return
    }

    if (senha.length < 8) {
      setErro('A senha deve possuir pelo menos 8 caracteres.')
      return
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas informadas não coincidem.')
      return
    }

    setCarregando(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: senha,
      })

      if (error) {
        setErro('Não foi possível alterar a senha. Verifique se o link ainda é válido e tente usar uma senha diferente da anterior.')
        return
      }

      setSucesso(true)

      await supabase.auth.signOut()
    } catch {
      setErro('Erro de conexão. Tente novamente.')
    } finally {
      setCarregando(false)
    }
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
              Sua segurança também importa.
            </h2>

            <p className="mt-5 leading-relaxed text-emerald-100">
              Redefina sua senha para recuperar o acesso
              à sua conta no Saúde Perto.
            </p>

            <div className="mt-10 flex items-center gap-4">
              <ShieldCheck size={28} />
              <span>Proteção e segurança da sua conta</span>
            </div>
          </div>

          <p className="mt-12 text-sm text-emerald-200">
            Saúde Perto • Tecnologia a serviço da saúde
          </p>
        </div>

        <div className="p-6 sm:p-12">

          <Link
            to="/login"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-900"
          >
            <ArrowLeft size={16} />
            Voltar para o login
          </Link>

          <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <LockKeyhole size={30} />
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            {sucesso ? 'Senha alterada!' : 'Redefinir senha'}
          </h1>

          <p className="mb-8 mt-3 text-sm leading-relaxed text-gray-500">
            {sucesso
              ? 'Sua senha foi atualizada com sucesso.'
              : 'Crie uma nova senha para acessar sua conta.'}
          </p>

          {verificando ? (
            <p role="status" className="text-sm text-gray-500">
              Verificando link de recuperação...
            </p>
          ) : sucesso ? (
            <div className="space-y-6">

              <div
                role="status"
                className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-700"
              >
                <CheckCircle size={24} />
                Senha redefinida com sucesso!
              </div>

              <button
                type="button"
                onClick={() => navigate('/login', { replace: true })}
                className="w-full rounded-xl bg-emerald-700 py-4 font-semibold text-white transition hover:bg-emerald-800"
              >
                Entrar na minha conta
              </button>

            </div>
          ) : (
            <form onSubmit={redefinirSenha} className="space-y-5">

              {sessaoValida && (
                <>
                  <div>
                    <label
                      htmlFor="nova-senha"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Nova senha
                    </label>

                    <div className="relative">
                      <LockKeyhole
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        id="nova-senha"
                        type={mostrarSenha ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        placeholder="Digite sua nova senha"
                        minLength={8}
                        required
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-4 pl-12 pr-12 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                      />

                      <button
                        type="button"
                        aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                        onClick={() => setMostrarSenha(!mostrarSenha)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        {mostrarSenha
                          ? <EyeOff size={20} />
                          : <Eye size={20} />}
                      </button>
                    </div>

                    <p className="mt-2 text-xs text-gray-500">
                      Utilize pelo menos 8 caracteres.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="confirmar-senha"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Confirmar nova senha
                    </label>

                    <input
                      id="confirmar-senha"
                      type={mostrarSenha ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      placeholder="Confirme sua nova senha"
                      minLength={8}
                      required
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>
                </>
              )}

              {erro && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"
                >
                  {erro}
                </p>
              )}

              {sessaoValida ? (
                <button
                  type="submit"
                  disabled={carregando}
                  className="w-full rounded-xl bg-emerald-700 py-4 font-semibold text-white shadow-md transition hover:bg-emerald-800 disabled:opacity-50"
                >
                  {carregando
                    ? 'Alterando senha...'
                    : 'Redefinir minha senha'}
                </button>
              ) : (
                <Link
                  to="/login"
                  className="block w-full rounded-xl bg-emerald-700 py-4 text-center font-semibold text-white hover:bg-emerald-800"
                >
                  Solicitar novo link pelo login
                </Link>
              )}

            </form>
          )}
        </div>
      </div>
    </div>
  )
}