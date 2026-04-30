'use client'

import Image from 'next/image'
import Link from 'next/link'
import { startTransition, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../components/Header'
import WhatsappButton from '../components/WhatsappButton'
import Footer from '../components/Footer'

export default function SobreNosPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [userName, setUserName] = useState('Usuário')
    const [isLogged, setIsLogged] = useState(false)

    useEffect(() => {
      startTransition(() => {
          try {
            const userStr = localStorage.getItem('user')
    
            if (!userStr) {
              setIsLogged(false)
              return
            }
    
            const user = JSON.parse(userStr)
    
            if (user?.nome) {
              setUserName(user.nome)
              setIsLogged(true)
            }
    
          } catch {
            setIsLogged(false)
          }
      })
    }, [])

  return (
    <main className="min-h-screen bg-[#eef2fb] font-sans">

      <Header />
      <WhatsappButton />

      {/* Hero */}
      <section className="relative bg-[#0d2160] px-6 pt-12 pb-24 text-center overflow-hidden">

        <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-blue-800 opacity-30" />
        <div className="absolute -bottom-16 -right-10 w-64 h-64 rounded-full bg-blue-900 opacity-40" />

        <div className="relative z-10 flex flex-col items-center gap-4">

          <div className="bg-white rounded-2xl px-6 py-3 shadow-xl flex items-center gap-3 mb-2">
            <div className="text-left">
                <Link href="/">
                <Image
                    src="/img/logotransparente1.png"
                    alt="Logo"
                    width={110}
                    height={80}
                    style={{ width: 110, height: 'auto' }}
                />
                </Link>
            </div>

          </div>

          <h1 className="text-white font-black text-2xl md:text-3xl tracking-wide uppercase leading-snug">
            Sobre Nós
          </h1>

          <p className="text-blue-200 text-sm max-w-xs">
            Conheça a nossa história e missão
          </p>

        </div>

      </section>



      {/* Conteúdo */}
      <section className="px-6 -mt-14 pb-16 relative z-10 max-w-3xl mx-auto">

        <div className="bg-white rounded-3xl shadow-xl shadow-blue-100 p-8 md:p-10 space-y-8 text-slate-700 leading-relaxed">

          <p>
            O Portal CNH Fácil surge em 2026 como um novo marco na educação digital para o trânsito.
            Nascemos com a missão de desburocratizar o acesso ao conhecimento e oferecer soluções
            tecnológicas de ponta que tornam o processo de formação, reciclagem e especialização
            de condutores algo ágil, eficiente e, acima de tudo, acessível.
          </p>

          <p>
            Nosso foco vai além da simples emissão de certificados: trabalhamos para transformar
            a experiência do aluno por meio de metodologias estratégicas, desenvolvidas para
            garantir que o aprendizado se traduza em segurança e consciência nas vias.
          </p>

          <p>
            Cada curso oferecido pelo Portal CNH Fácil é elaborado por especialistas e rigorosamente
            alinhado às exigências legais vigentes. Nosso compromisso é com a excelência educacional
            e com a construção de um trânsito mais humano e seguro para todos os brasileiros.
          </p>


          <h2 className="text-[#0d2160] font-black text-xl uppercase mt-10">
            Tecnologia e Conformidade
          </h2>

          <p>
            A plataforma tecnológica do Portal CNH Fácil foi projetada para atender aos mais
            altos padrões de segurança e usabilidade. Operamos em total conformidade com
            as diretrizes da SENATRAN (Secretaria Nacional de Trânsito) para a modalidade
            de ensino a distância (EAD), garantindo a validade jurídica e a qualidade
            técnica necessária para a capacitação de condutores em todo o território nacional.
          </p>


          <h2 className="text-[#0d2160] font-black text-xl uppercase mt-10">
            Nossa Trajetória
          </h2>

          <h3 className="text-[#0d2160] font-bold text-lg">
            Rumo à Inovação no Trânsito
          </h3>

          <p>
            Fundado em 2026, o Portal CNH Fácil já nasce com o DNA da inovação. Em um cenário
            onde a mobilidade urbana exige respostas rápidas e digitais, estruturamos nossa
            operação para ser a ponte entre o condutor e a sua qualificação.
          </p>

          <p>
            Embora iniciemos nossa jornada neste ano, nossa estrutura conta com a expertise
            de profissionais renomados do setor, focados em oferecer cursos de capacitação,
            reciclagem e especializações (como MOPP, Transporte Escolar e Cargas Indivisíveis)
            com um suporte personalizado.
          </p>

          <p>
            Nossa meta é clara: tornar-nos a principal referência nacional em agilidade
            e qualidade no ensino para o trânsito. Com o Portal CNH Fácil, o caminho para
            a sua documentação e aprimoramento profissional nunca foi tão simples.
          </p>


          {/* Destaque final */}
          <div className="bg-[#0d2160] text-white rounded-2xl px-6 py-6 text-center mt-10 shadow-lg">

            <p className="font-black text-lg tracking-wide">
              Portal CNH Fácil
            </p>

            <p className="text-yellow-400 font-bold mt-2">
              Inovação, Agilidade e Segurança no seu Caminho.
            </p>

          </div>

        </div>

      </section>



      {/* Footer */}
      <Footer />

    </main>
  )
}