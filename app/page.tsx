'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, startTransition } from 'react'
import Header from '@/app/components/Header'
import WhatsappButton from './components/WhatsappButton'
import Footer from './components/Footer'
import { courses, REQUISITOS_CURSOS } from './lib/courses'

export default function CursosPage() {
  const router = useRouter()
  const [isLogged, setIsLogged] = useState(false)
  const [userName, setUserName] = useState('Usuário')

  useEffect(() => {
    startTransition(() => {
      try {
        const userStr = localStorage.getItem('user')
        if (!userStr) return
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

      <section className="max-w-7xl mx-auto px-5 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => router.push(`/cursos/${course.slug}`)}
              className="group relative h-[430px] overflow-hidden rounded-xl shadow-xl cursor-pointer"
            >
              <img
                src={course.imagem}
                alt={course.titulo}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/45" />
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h3 className="text-3xl font-semibold text-white leading-tight">
                  {course.titulo}
                </h3>
                {course.subtitulo && (
                  <p className="mt-2 text-white/90 text-sm">{course.subtitulo}</p>
                )}
                {REQUISITOS_CURSOS[course.titulo] && (
                  <p className="mt-3 text-xs text-white/80">
                    Requisitos: 21 anos • Categoria {REQUISITOS_CURSOS[course.titulo].join(', ')}
                  </p>
                )}
                <button className="mt-6 w-full rounded-full bg-[#f8b400] py-4 text-white font-bold transition hover:bg-[#e9a600]">
                  SAIBA MAIS
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}