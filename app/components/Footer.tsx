'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MessageCircle, Camera  } from 'lucide-react'

export default function Footer() {
  const whatsappMessage = encodeURIComponent(
    'Olá, Portal CNH Facil. Vim pelo site e gostaria de falar com a atendente.'
  )

  return (
    <footer className="bg-[#0d2160] text-white px-6 py-10 mt-10">

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center md:text-left">

  {/* Logo + Social */}
  <div className="space-y-4 flex flex-col items-center md:items-start">

    <Image
      src="/img/logotransparente1.png"
      alt="Logo"
      width={110}
      height={80}
      style={{ width: 110, height: 'auto' }}
    />

    <p className="text-sm text-blue-200">
      Inovação, Agilidade e Segurança no seu Caminho.
    </p>

  </div>

  {/* Mapa do site */}
  <div className="space-y-3 flex flex-col items-center md:items-start">
    <h3 className="text-yellow-400 font-bold uppercase">
      Mapa do Site
    </h3>

    <div className="flex flex-col gap-2 text-sm text-blue-100 items-center md:items-start">

      <Link href="/">Início</Link>
      <Link href="/sobrenos">Sobre Nós</Link>
      <Link href="/cursos">Cursos</Link>
      <Link href="/contato">Fale Conosco</Link>

    </div>
  </div>

  {/* Atendimento */}
  <div className="space-y-3 flex flex-col items-center md:items-start">
    <h3 className="text-yellow-400 font-bold uppercase">
      Atendimento
    </h3>

    <div className="text-sm text-blue-100 space-y-2">

      <p>WhatsApp: (21) 96724-4785</p>
      <p>Instagram: @portalcnhfacil</p>

      <p className="mt-4 text-blue-200 max-w-xs">
        Atendimento rápido, eficiente e feito por especialistas prontos para te ajudar.
      </p>

    </div>
  </div>

</div>

      <div className="border-t border-blue-800 mt-10 pt-6 text-center text-xs text-blue-300">
        © 2026 Portal CNH Fácil. Todos os direitos reservados.
      </div>

    </footer>
  )
}