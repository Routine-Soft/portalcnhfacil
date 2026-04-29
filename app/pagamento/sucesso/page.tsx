'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'

export default function PagamentoSucessoPage() {

  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const whatsappNumber = '5521989643074'

  function handleWhatsapp() {
    window.open(
      `https://wa.me/${whatsappNumber}`,
      '_blank'
    )
  }

  return (
    <main className="min-h-screen bg-[#eef2fb] font-sans">

      {/* Header */}
      <header className="bg-[#0d2160] px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <Image
            src="/img/logotransparente1.png"
            alt="Logo"
            width={110}
            height={80}
            style={{ width: 110, height: 'auto' }}
          />
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex md:hidden flex-col justify-center cursor-pointer items-center gap-1"
        >
          <span className="w-6 h-0.5 bg-white rounded" />
          <span className="w-6 h-0.5 bg-white rounded" />
          <span className="w-6 h-0.5 bg-white rounded" />
        </button>
      </header>

      {/* Overlay mobile */}
      {menuOpen && (
        <div
          className="fixed md:hidden inset-0 bg-black/40 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Hero */}
      <section className="relative bg-[#0d2160] px-6 pt-12 pb-28 text-center overflow-hidden">

        <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-blue-800 opacity-30" />
        <div className="absolute -bottom-16 -right-10 w-64 h-64 rounded-full bg-blue-900 opacity-40" />

        <div className="relative z-10 flex flex-col items-center gap-4">

          <div className="bg-white rounded-2xl px-6 py-3 shadow-xl flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-[#0d2160] flex items-center justify-center text-yellow-400 font-black text-xl">
              ✓
            </div>

            <div className="text-left">
              <p className="text-[#0d2160] font-black text-xl tracking-wider leading-none">
                PORTAL CNH FÁCIL
              </p>
              <p className="text-yellow-500 text-xs font-semibold tracking-widest">
                PAGAMENTO CONFIRMADO
              </p>
            </div>
          </div>

          <h1 className="text-white font-black text-xl md:text-2xl tracking-wide uppercase leading-snug">
            Obrigado pela sua compra!
          </h1>

          <p className="text-blue-200 text-sm max-w-sm">
            Seu pagamento foi recebido com sucesso.
          </p>

        </div>

      </section>

      {/* Card principal */}
      <section className="px-5 -mt-16 pb-16 relative z-10 max-w-md mx-auto">

        <div className="bg-white rounded-3xl shadow-xl shadow-blue-100 overflow-hidden">

          {/* Barra topo */}
          <div className="h-2 w-full bg-gradient-to-r from-emerald-500 to-green-600" />

          <div className="px-8 py-10 flex flex-col items-center text-center gap-6">

            {/* Ícone */}
            <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-5xl">
              🎉
            </div>

            {/* Texto */}
            <div className="flex flex-col gap-3">

              <h2 className="text-[#0d2160] font-black text-xl">
                Compra realizada com sucesso
              </h2>

              <p className="text-slate-500 text-sm leading-relaxed">

                Obrigado por confiar no <b>PORTAL CNH FÁCIL</b>.

                <br /><br />

                Em até <b>72 horas</b>, você receberá no seu e-mail
                o <b>link de acesso ao curso</b> adquirido.

              </p>

            </div>

            {/* Suporte WhatsApp */}
            <div className="w-full bg-slate-50 rounded-2xl px-5 py-5 flex flex-col gap-4">

              <p className="text-sm text-slate-600 font-semibold">
                Precisa de ajuda ou suporte?
              </p>

              <button
                onClick={handleWhatsapp}
                className="relative w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black text-sm tracking-wide uppercase rounded-2xl shadow-lg shadow-green-200 active:scale-[0.98] transition-all overflow-hidden cursor-pointer"
              >

                <Wave />

                <span className="relative z-10">
                  💬 Falar no WhatsApp
                </span>

              </button>

            </div>

            {/* Botão voltar */}
            <button
              onClick={() => router.push('/cursos')}
              className="relative w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-black text-sm tracking-wide uppercase rounded-2xl shadow-lg shadow-blue-200 active:scale-[0.98] transition-all overflow-hidden cursor-pointer"
            >

              <Wave />

              <span className="relative z-10">
                ← Voltar aos Cursos
              </span>

            </button>

            <p className="text-xs text-slate-300">
              CNH FÁCIL · Ambiente seguro
            </p>

          </div>

        </div>

      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 px-6 py-6">

        <div className="flex items-center justify-center gap-6 flex-wrap">

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-600" />
            <span className="text-blue-700 font-bold text-xs">
              Serpro
            </span>
          </div>

          <div className="text-[#0d2160] font-black text-xs tracking-wider">
            CNH FÁCIL
          </div>

          <div className="text-slate-500 text-xs text-center leading-tight">
            MINISTÉRIO DOS<br />TRANSPORTES
          </div>

          <div className="text-green-700 font-black text-xs">
            GOVERNO DO BRASIL
          </div>

        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          © 2026 LM Cursos de Trânsito & Especializados Brasil
        </p>

      </footer>

    </main>
  )
}

function Wave() {
  return (
    <div className="absolute inset-0 opacity-20">
      <svg
        viewBox="0 0 400 80"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <path
          d="M0,40 C100,10 200,70 300,40 C350,25 380,55 400,40 L400,80 L0,80 Z"
          fill="white"
        />
      </svg>
    </div>
  )
}