'use client'

import Header from '../components/Header'
import Image from 'next/image'
import WhatsappButton from '../components/WhatsappButton'
import Footer from '../components/Footer'

export default function ContatoPage() {
  return (
    <main className="min-h-screen bg-[#eef2fb] font-sans">
      <WhatsappButton />
      {/* Header reutilizado */}
      <Header />

      {/* Hero */}
      <section className="relative bg-[#0d2160] px-6 pt-12 pb-24 text-center overflow-hidden">

        <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-blue-800 opacity-30" />
        <div className="absolute -bottom-16 -right-10 w-64 h-64 rounded-full bg-blue-900 opacity-40" />

        <div className="relative z-10 flex flex-col items-center gap-4">

          <div className="bg-white rounded-2xl px-6 py-3 shadow-xl">
            <Image
              src="/img/logotransparente1.png"
              alt="Logo"
              width={110}
              height={80}
              style={{ width: 110, height: 'auto' }}
            />
          </div>

          <h1 className="text-white font-black text-2xl md:text-3xl uppercase">
            Fale Conosco
          </h1>

          <p className="text-blue-200 text-sm">
            Atendimento rápido, humano e eficiente
          </p>

        </div>
      </section>

      {/* Conteúdo */}
      <section className="px-6 mt-14 pb-16 max-w-3xl mx-auto">

        <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6 text-slate-700 leading-relaxed">

          <p>
            Precisa de ajuda? Nosso time está pronto para te atender com rapidez,
            eficiência e total atenção. Aqui no Portal CNH Fácil, você conta com
            um atendimento humanizado, feito por pessoas qualificadas e preparadas
            para resolver qualquer situação.
          </p>

          <p>
            Estamos disponíveis para tirar dúvidas, oferecer suporte completo,
            ajudar com pagamentos, resolver problemas técnicos e até tratar
            parcerias. Nosso objetivo é simples: você entra em contato e nós resolvemos.
          </p>

          <p>
            Não importa a sua necessidade — estamos aqui para garantir que sua
            experiência seja tranquila, rápida e sem complicações.
          </p>

          {/* WhatsApp */}
          <div className="bg-[#0d2160] text-white rounded-2xl px-6 py-6 text-center mt-6 shadow-lg">

            <p className="font-bold text-lg">
              Fale conosco pelo WhatsApp
            </p>

            <p className="text-yellow-400 mt-2 font-semibold">
              +55 21 96724-4785
            </p>

            <a
            href="https://wa.me/5521967244785?text=Ol%C3%A1%2C%20Portal%20CNH%20Facil.%20Vim%20pelo%20site%20e%20gostaria%20de%20falar%20com%20a%20atendente."
            target="_blank"
            className="inline-block mt-4 px-6 py-3 bg-yellow-400 text-[#0d2160] font-bold rounded-xl hover:bg-yellow-300 transition"
            >
            Iniciar Conversa
            </a>

          </div>

        </div>

      </section>

      {/* Footer */}
      <Footer />

    </main>
  )
}