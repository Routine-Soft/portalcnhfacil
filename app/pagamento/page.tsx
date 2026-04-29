'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

type Status = 'loading' | 'error'

export default function PagamentoPage() {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const hasFetched   = useRef(false)

  // Recebe name e price da página de cursos
  const name  = searchParams.get('name')
  const price = searchParams.get('price')
  const productId = searchParams.get('productId')

  const [status,   setStatus]   = useState<Status>('loading')
  const [errorMsg, setErrorMsg] = useState('')

  function fail(msg: string) {
    setErrorMsg(msg)
    setStatus('error')
  }

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    if (!name || !price) {
      setTimeout(() => fail('Parâmetros inválidos. Volte e tente novamente.'), 0)
      return
    }

    const processPagamento = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken')

        // Chama o backend — igual ao Postman, só name e price
        const response = await fetch('http://localhost:4000/api/payments/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          body: JSON.stringify({
            name:  name,
            price: Number(price),
            productId: productId,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          fail(data.message || data.error || 'Erro ao iniciar pagamento.')
          return
        }

        // Redireciona para o checkout do AbacatePay
        if (data.url) {
          window.location.href = data.url
        } else {
          fail('Não foi possível gerar o link de pagamento.')
        }
      } catch {
        fail('Erro ao conectar com o servidor de pagamento.')
      }
    }

    processPagamento()
  }, [name, price])

  return (
    <main className="min-h-screen bg-[#eef2fb] flex flex-col font-sans">

      {/* Header */}
      <header className="bg-[#0d2160] px-6 py-4 flex items-center shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-[#0d2160] font-black text-lg">C</div>
          <span className="text-white font-bold text-lg tracking-wide">CNH FÁCIL</span>
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-[#0d2160] px-6 pt-10 pb-24 text-center overflow-hidden">
        <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-blue-800 opacity-30" />
        <div className="absolute -bottom-16 -right-10 w-64 h-64 rounded-full bg-blue-900 opacity-40" />
        <div className="relative z-10">
          <h1 className="text-white font-black text-xl tracking-wide uppercase mb-1">Pagamento Seguro</h1>
          {name && <p className="text-yellow-400 font-bold text-sm mt-1">{decodeURIComponent(name)}</p>}
          <p className="text-blue-200 text-sm mt-1">
            {status === 'loading' ? 'Processando sua compra...' : 'Algo deu errado'}
          </p>
        </div>
      </section>

      {/* Card */}
      <section className="flex-1 px-5 -mt-10 pb-16 relative z-10 max-w-md mx-auto w-full">
        <div className="bg-white rounded-3xl shadow-xl shadow-blue-100 overflow-hidden w-full">

          <div className={`h-2 w-full bg-gradient-to-r transition-all duration-500 ${
            status === 'loading' ? 'from-blue-500 to-blue-600' : 'from-red-500 to-red-600'
          }`} />

          <div className="px-8 py-10 flex flex-col items-center gap-6 text-center">

            {status === 'loading' && (
              <>
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-blue-100 border-t-[#0d2160] rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center text-2xl">💳</div>
                </div>
                <div>
                  <h2 className="text-[#0d2160] font-black text-xl mb-2">Preparando seu pagamento</h2>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Você será redirecionado para o checkout seguro em instantes...
                  </p>
                </div>
                <div className="w-full bg-slate-50 rounded-2xl px-5 py-4">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest mb-3">Métodos aceitos</p>
                  <div className="flex justify-center gap-4">
                    {[
                      { icon: '🏦', label: 'PIX',    bg: 'bg-emerald-500', shadow: 'shadow-emerald-200' },
                      { icon: '💳', label: 'Cartão', bg: 'bg-blue-500',    shadow: 'shadow-blue-200'    },
                      { icon: '🔒', label: 'Seguro', bg: 'bg-purple-500',  shadow: 'shadow-purple-200'  },
                    ].map(m => (
                      <div key={m.label} className="flex flex-col items-center gap-1">
                        <div className={`w-12 h-12 rounded-xl ${m.bg} flex items-center justify-center text-white text-xl shadow-md ${m.shadow}`}>{m.icon}</div>
                        <span className="text-xs text-slate-500 font-semibold">{m.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-300">Processado por AbacatePay · Ambiente seguro</p>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="text-6xl">⚠️</div>
                <div>
                  <h2 className="text-red-600 font-black text-xl mb-2">Erro ao processar pagamento</h2>
                  <p className="text-slate-500 text-sm leading-relaxed">{errorMsg}</p>
                </div>
                <div className="w-full flex flex-col gap-3">
                  <button
                    onClick={() => { hasFetched.current = false; setStatus('loading'); setErrorMsg(''); window.location.reload() }}
                    className="relative w-full py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 font-black text-sm tracking-wide uppercase rounded-2xl shadow-lg shadow-yellow-200 active:scale-[0.98] transition-all overflow-hidden"
                  >
                    <Wave /><span className="relative z-10">🔄 Tentar novamente</span>
                  </button>
                  <button
                    onClick={() => router.push('/cursos')}
                    className="relative w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-black text-sm tracking-wide uppercase rounded-2xl shadow-lg shadow-blue-200 active:scale-[0.98] transition-all overflow-hidden"
                  >
                    <Wave /><span className="relative z-10">← Voltar aos Cursos</span>
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 px-6 py-6">
        <div className="flex items-center justify-center gap-6 flex-wrap">
          <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-blue-600" /><span className="text-blue-700 font-bold text-xs">Serpro</span></div>
          <div className="text-[#0d2160] font-black text-xs tracking-wider">CNH FÁCIL</div>
          <div className="text-slate-500 text-xs text-center leading-tight">MINISTÉRIO DOS<br />TRANSPORTES</div>
          <div className="text-green-700 font-black text-xs">GOVERNO DO BRASIL</div>
        </div>
        <p className="text-center text-xs text-slate-400 mt-4">© 2026 LM Cursos de Trânsito & Especializados Brasil</p>
      </footer>

    </main>
  )
}

function Wave() {
  return (
    <div className="absolute inset-0 opacity-20">
      <svg viewBox="0 0 400 80" preserveAspectRatio="none" className="w-full h-full">
        <path d="M0,40 C100,10 200,70 300,40 C350,25 380,55 400,40 L400,80 L0,80 Z" fill="white"/>
      </svg>
    </div>
  )
}