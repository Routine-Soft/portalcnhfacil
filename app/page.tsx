'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, startTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type Course = {
  id: number
  titulo: string
  subtitulo: string | null
  bg: string
  shadow: string
  textColor: string
  emoji: string
  preco: string,
  productId: string,
}

const courses: Course[] = [
  { id: 1, titulo: 'Curso MOPP',                    subtitulo: 'Produtos Perigosos',    bg: 'from-yellow-400 to-yellow-500', shadow: 'shadow-yellow-300', textColor: 'text-yellow-900', emoji: '🚛', preco: 'R$ 199,90', productId: 'prod_NTGEAJ2DfU4PnLmwYzPeYKSC' },
  { id: 2, titulo: 'Curso para Taxista',             subtitulo: null,                    bg: 'from-blue-500 to-blue-600',     shadow: 'shadow-blue-300',   textColor: 'text-white',      emoji: '🚕', preco: 'R$ 199,90', productId: 'prod_r5nJ2MwdHgD544SQHZrey23j' },
  { id: 3, titulo: 'Curso de Transporte Escolar',    subtitulo: null,                    bg: 'from-emerald-500 to-green-600', shadow: 'shadow-emerald-300',textColor: 'text-white',      emoji: '🚌', preco: 'R$ 199,90', productId: 'prod_1234567890' },
  { id: 4, titulo: 'Curso para Condutor de Ambulância', subtitulo: null,                 bg: 'from-red-500 to-red-600',       shadow: 'shadow-red-300',    textColor: 'text-white',      emoji: '🚑', preco: 'R$ 199,90', productId: 'prod_0987654321' },
  { id: 5, titulo: 'Curso de Reciclagem CNH',        subtitulo: 'Condutores Infratores', bg: 'from-purple-500 to-purple-700', shadow: 'shadow-purple-300', textColor: 'text-white',      emoji: '🔄', preco: 'R$ 199,90', productId: 'prod_1122334455' },
  { id: 6, titulo: 'Curso NR-35',                    subtitulo: 'Trabalho em Altura',    bg: 'from-orange-400 to-orange-500', shadow: 'shadow-orange-300', textColor: 'text-orange-900', emoji: '🏗️', preco: 'R$ 199,90', productId: 'prod_5566778899' },
]

// 'R$ 199,90' → 199.9
function parsePreco(preco: string): number {
  return parseFloat(preco.replace('R$', '').replace(/\./g, '').replace(',', '.').trim())
}

export default function CursosPage() {
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

  function handleCourseClick(course: Course) {
    // Verifica login
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      router.push('/login')
      return
    }

    setLoading(true)

    // Passa nome e preço via query params para a página de pagamento
    const params = new URLSearchParams({
      name:  course.titulo,
      price: String(parsePreco(course.preco)),
      productId: course.productId,
    })
    router.push(`/pagamento?${params.toString()}`)
  }

  return (
    <main className="min-h-screen bg-[#eef2fb] font-sans">

      {/* Header */}
      <header className="bg-[#0d2160] px-6 py-4 flex items-center justify-between shadow-md">

        <div className="flex items-center gap-3">
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

        <div className="flex items-center gap-4">

          <nav className="hidden md:flex items-center gap-4 text-white font-medium">

            {isLogged ? (

              <>
                <button
                  onClick={() => router.push('/conta')}
                  className="hover:text-yellow-400 transition"
                >
                  Minha Conta
                </button>

                <span className="ml-2 font-semibold text-yellow-400">
                  Bem vindo, {userName.split(' ')[0]}
                </span>
              </>

            ) : (

              <>
                <button
                  onClick={() => router.push('/register')}
                  className="px-4 py-2 bg-yellow-400 text-[#0d2160] font-bold rounded-xl hover:bg-yellow-300 transition"
                >
                  Criar Conta
                </button>

                <button
                  onClick={() => router.push('/login')}
                  className="px-4 py-2 border border-white text-white font-bold rounded-xl hover:bg-white hover:text-[#0d2160] transition"
                >
                  Fazer Login
                </button>
              </>

            )}

          </nav>

          {/* Menu mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex md:hidden flex-col justify-center cursor-pointer items-center gap-1"
          >
            <span className="w-6 h-0.5 bg-white rounded" />
            <span className="w-6 h-0.5 bg-white rounded" />
            <span className="w-6 h-0.5 bg-white rounded" />
          </button>

        </div>

      </header>

      {/* Overlay mobile */}
      {menuOpen && <div className="fixed md:hidden inset-0 bg-black/40 z-40" onClick={() => setMenuOpen(false)} />}

      {/* Menu lateral mobile */}
      <div className="flex flex-col">

        {isLogged ? (

          <>
            <button
              onClick={() => { router.push('/conta'); setMenuOpen(false) }}
              className="px-6 py-4 text-left text-gray-700 border-b hover:bg-slate-100"
            >
              Minha Conta
            </button>

            <button
              onClick={() => { router.push('/cursos'); setMenuOpen(false) }}
              className="px-6 py-4 text-left text-gray-700 border-b hover:bg-slate-100"
            >
              Cursos
            </button>
          </>

        ) : (

          <>
            <button
              onClick={() => { router.push('/register'); setMenuOpen(false) }}
              className="px-6 py-4 text-left text-gray-700 border-b hover:bg-slate-100"
            >
              Criar Conta
            </button>

            <button
              onClick={() => { router.push('/login'); setMenuOpen(false) }}
              className="px-6 py-4 text-left text-gray-700 border-b hover:bg-slate-100"
            >
              Fazer Login
            </button>
          </>

        )}

        <button
          onClick={() => { router.push('/contato'); setMenuOpen(false) }}
          className="px-6 py-4 text-left text-gray-700 hover:bg-slate-100"
        >
          Contato
        </button>

      </div>

      {/* Hero */}
      <section className="relative bg-[#0d2160] px-6 pt-10 pb-20 text-center overflow-hidden">
        <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-blue-800 opacity-30" />
        <div className="absolute -bottom-16 -right-10 w-64 h-64 rounded-full bg-blue-900 opacity-40" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="bg-white rounded-2xl px-6 py-3 shadow-xl flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-[#0d2160] flex items-center justify-center text-yellow-400 font-black text-xl">C</div>
            <div className="text-left">
              <p className="text-[#0d2160] font-black text-xl tracking-wider leading-none">CNH FÁCIL</p>
              <p className="text-yellow-500 text-xs font-semibold tracking-widest">✓ verificado</p>
            </div>
          </div>
          <h1 className="text-white font-black text-xl md:text-2xl tracking-wide uppercase leading-snug">
            Cursos de Especialização<br />para Condutores
          </h1>
          <p className="text-blue-200 text-sm max-w-xs">Certificados válidos em todo o Brasil · Homologado pelo SENATRAN</p>
        </div>
      </section>

      {/* Cards */}
      <section className="px-5 -mt-8 pb-16 relative z-10 max-w-lg mx-auto flex flex-col gap-4">
        <h2 className="text-[#0d2160] font-black text-xl tracking-wide uppercase mb-1">Cursos</h2>

        {courses.map((course) => (
          <div
            key={course.id}
            onClick={() => !loading && handleCourseClick(course)}
            className={`relative flex items-center justify-between bg-gradient-to-r ${course.bg} rounded-2xl overflow-hidden shadow-lg ${course.shadow} px-6 py-5 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <div className="absolute inset-0 opacity-20">
              <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="w-full h-full">
                <path d="M0,60 C100,20 200,100 300,60 C350,40 380,80 400,60 L400,120 L0,120 Z" fill="white"/>
              </svg>
            </div>
            <div className="relative z-10 flex-1">
              <p className={`font-black text-lg leading-snug ${course.textColor}`}>{course.titulo}</p>
              {course.subtitulo && <p className={`text-sm font-semibold mt-0.5 opacity-80 ${course.textColor}`}>({course.subtitulo})</p>}
            </div>
            <div className="relative z-10 text-5xl ml-4 drop-shadow-md select-none">{course.emoji}</div>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 px-6 py-6">
        <div className="flex items-center justify-center gap-6 flex-wrap">
          <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-blue-600" /><span className="text-blue-700 font-bold text-sm">Serpro</span></div>
          <div className="text-[#0d2160] font-black text-sm tracking-wider">CNH FÁCIL</div>
          <div className="text-slate-500 text-xs text-center leading-tight">MINISTÉRIO DOS<br />TRANSPORTES</div>
          <div className="text-green-700 font-black text-sm">GOVERNO DO<br /><span className="text-green-600 text-xs">BRASIL</span></div>
        </div>
        <p className="text-center text-xs text-slate-400 mt-4">© 2026 LM Cursos de Trânsito & Especializados Brasil</p>
      </footer>

    </main>
  )
}