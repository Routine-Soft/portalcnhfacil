'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '../components/Header'
import WhatsappButton from '../components/WhatsappButton'
import Footer from '../components/Footer'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [showSenha, setShowSenha] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Email ou senha incorretos.')
        return
      }

      // Salva tokens e dados do usuário no localStorage
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      localStorage.setItem('user', JSON.stringify(data.user))

      // Redireciona para a área do aluno
      router.push('/')

    } catch {
      setError('Não foi possível conectar ao servidor. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#eef2fb] flex flex-col font-sans">
      <Header />
      <WhatsappButton />

      {/* Hero azul com onda */}
      <section className="relative bg-[#0d2160] px-6 pt-10 pb-24 text-center overflow-hidden">
        <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-blue-800 opacity-30" />
        <div className="absolute -bottom-16 -right-10 w-64 h-64 rounded-full bg-blue-900 opacity-40" />

        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="bg-white rounded-2xl px-6 py-3 shadow-xl flex items-center gap-3 mb-1">
            <div className="w-12 h-12 rounded-full bg-[#0d2160] flex items-center justify-center text-yellow-400 font-black text-xl">
              C
            </div>
            <div className="text-left">
              <p className="text-[#0d2160] font-black text-xl tracking-wider leading-none">CNH FÁCIL</p>
              <p className="text-yellow-500 text-xs font-semibold tracking-widest">✓ verificado</p>
            </div>
          </div>
          <h1 className="text-white font-black text-xl tracking-wide uppercase">
            Bem-vindo de volta!
          </h1>
          <p className="text-blue-200 text-sm">Acesse sua conta para continuar</p>
        </div>
      </section>

      {/* Card de login */}
      <section className="px-5 -mt-10 pb-16 relative z-10 max-w-md mx-auto w-full flex flex-col gap-4">

        <div className="bg-white rounded-3xl shadow-xl shadow-blue-100 overflow-hidden">

          {/* Barra colorida no topo do card — igual ao estilo dos cards de curso */}
          <div className="h-2 w-full bg-gradient-to-r from-yellow-400 via-blue-500 to-emerald-500" />

          <div className="px-7 py-8 flex flex-col gap-6">

            <div>
              <h2 className="text-[#0d2160] font-black text-2xl">Entrar</h2>
              <p className="text-slate-400 text-sm mt-1">Digite seus dados de acesso</p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#0d2160] tracking-wide uppercase">
                  E-mail
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base">
                    ✉️
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="
                      w-full pl-11 pr-4 py-3.5
                      border-2 border-slate-200
                      rounded-xl text-slate-800 text-sm
                      placeholder:text-slate-300
                      focus:outline-none focus:border-blue-500
                      transition-colors
                    "
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#0d2160] tracking-wide uppercase">
                  Senha
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base">
                    🔒
                  </span>
                  <input
                    type={showSenha ? 'text' : 'password'}
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="
                      w-full pl-11 pr-12 py-3.5
                      border-2 border-slate-200
                      rounded-xl text-slate-800 text-sm
                      placeholder:text-slate-300
                      focus:outline-none focus:border-blue-500
                      transition-colors
                    "
                  />
                  <button
                    type="button"
                    onClick={() => setShowSenha(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm hover:text-slate-600 transition-colors"
                  >
                    {showSenha ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Esqueci a senha */}
              <div className="flex justify-end -mt-1">
                <Link
                  href="/esqueci-senha"
                  className="text-xs text-blue-500 font-semibold hover:text-blue-700 transition-colors"
                >
                  Esqueci minha senha
                </Link>
              </div>

              {/* Mensagem de erro */}
              {error && (
                <div className="
                  bg-red-50 border-2 border-red-200
                  rounded-xl px-4 py-3
                  flex items-center gap-3
                ">
                  <span className="text-red-500 text-base shrink-0">⚠️</span>
                  <p className="text-red-600 text-sm font-semibold">{error}</p>
                </div>
              )}

              {/* Botão entrar — estilo card amarelo */}
              <button
                type="submit"
                disabled={loading}
                className="
                  relative w-full py-4 mt-1
                  bg-gradient-to-r from-yellow-400 to-yellow-500
                  text-yellow-900 font-black text-base tracking-wide uppercase
                  rounded-2xl shadow-lg shadow-yellow-200
                  hover:from-yellow-500 hover:to-yellow-600
                  active:scale-[0.98]
                  transition-all duration-200
                  disabled:opacity-60 disabled:cursor-not-allowed
                  overflow-hidden
                "
              >
                {/* onda decorativa igual aos cards */}
                <div className="absolute inset-0 opacity-20">
                  <svg viewBox="0 0 400 80" preserveAspectRatio="none" className="w-full h-full">
                    <path d="M0,40 C100,10 200,70 300,40 C350,25 380,55 400,40 L400,80 L0,80 Z" fill="white"/>
                  </svg>
                </div>
                <span className="relative z-10">
                  {loading ? 'Entrando...' : 'Entrar'}
                </span>
              </button>

            </form>

            {/* Divisor */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400 font-semibold">ou</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Criar conta — estilo card azul */}
            <Link href="/cadastro">
              <div className="
                relative flex items-center justify-between
                bg-gradient-to-r from-blue-500 to-blue-600
                rounded-2xl overflow-hidden
                shadow-lg shadow-blue-200
                px-6 py-4 cursor-pointer
                hover:scale-[1.02] active:scale-[0.98]
                transition-transform duration-200
              ">
                <div className="absolute inset-0 opacity-20">
                  <svg viewBox="0 0 400 80" preserveAspectRatio="none" className="w-full h-full">
                    <path d="M0,40 C100,10 200,70 300,40 C350,25 380,55 400,40 L400,80 L0,80 Z" fill="white"/>
                  </svg>
                </div>
                <div className="relative z-10">
                  <p className="text-white font-black text-base">Criar conta grátis</p>
                  <p className="text-blue-100 text-xs mt-0.5">Leva menos de 1 minuto</p>
                </div>
                <span className="relative z-10 text-4xl">🚗</span>
              </div>
            </Link>

          </div>
        </div>

        {/* Selos de segurança */}
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="text-xs text-slate-400">🔒 Conexão segura</span>
          <span className="text-slate-300">·</span>
          <span className="text-xs text-slate-400">✅ Homologado SENATRAN</span>
        </div>

      </section>

      {/* Footer */}
      <Footer />

    </main>
  )
}