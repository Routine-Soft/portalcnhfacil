// app/cursos/[slug]/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useState, use as usePromise } from 'react'
import Header from '@/app/components/Header'
import WhatsappButton from '@/app/components/WhatsappButton'
import Footer from '@/app/components/Footer'
import {
  getCourseBySlug,
  parsePreco,
  REQUISITOS_CURSOS,
  validarRequisitoCurso,
  validarEstadoReciclagem,
  type User,
  type ValidationError,
  type ValidationErrorEstado,
} from '../../lib/courses'

// Next.js 15: params chega como Promise em Client Components.
// Se seu projeto for Next 13/14, troque a assinatura para
// `{ params }: { params: { slug: string } }` e use `params.slug` direto.
export default function CursoDetalhePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = usePromise(params)
  const router = useRouter()
  const course = getCourseBySlug(slug)

  const [loading, setLoading] = useState(false)
  const [validationError, setValidationError] = useState<ValidationError | null>(null)
  const [validationErrorEstado, setValidationErrorEstado] = useState<ValidationErrorEstado | null>(null)

  if (!course) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-lg">Curso não encontrado.</p>
        <button onClick={() => router.push('/cursos')} className="text-blue-600 underline">
          Voltar para cursos
        </button>
      </main>
    )
  }

  function handleInscricao() {
    if (!course) return

    const userStr = localStorage.getItem('user')
    if (!userStr) {
      router.push(`/login?next=/cursos/${course.slug}`)
      return
    }

    try {
      const user: User = JSON.parse(userStr)

      const requiresValidation = REQUISITOS_CURSOS[course.titulo] !== undefined
      if (requiresValidation) {
        const validation = validarRequisitoCurso(course, user)
        if (validation.hasError) {
          setValidationError(validation)
          return
        }
      }

      const isReciclagemCourse = [11, 12, 13].includes(course.id)
      if (isReciclagemCourse) {
        const validationEstado = validarEstadoReciclagem(course.id, user)
        if (validationEstado.hasError) {
          setValidationErrorEstado(validationEstado)
          return
        }
      }

      setLoading(true)
      const params = new URLSearchParams({
        name: course.titulo,
        price: String(parsePreco(course.preco)),
        productId: course.productId,
      })
      router.push(`/pagamento?${params.toString()}`)
    } catch {
      router.push('/login')
    }
  }

  return (
    <main className="min-h-screen bg-[#eef2fb] font-sans">
      <Header />
      <WhatsappButton />

      <section className="max-w-5xl mx-auto px-5 py-12">
        <button onClick={() => router.push('/cursos')} className="mb-6 text-sm text-gray-600 hover:underline">
          ← Voltar para todos os cursos
        </button>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="rounded-2xl overflow-hidden shadow-xl h-80 md:h-full">
            <img src={course.imagem} alt={course.titulo} className="w-full h-full object-cover" />
          </div>

          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/70 text-gray-700 mb-3">
              {course.categoria}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{course.titulo}</h1>
            {course.subtitulo && <p className="mt-1 text-gray-500">{course.subtitulo}</p>}

            <p className="mt-5 text-gray-700 leading-relaxed">{course.descricaoLonga}</p>

            {/* A quem se destina? */}
            {course.publicoAlvo && (
              <div className="mt-5 rounded-xl bg-white p-4 shadow-sm">
                <p className="font-semibold text-gray-900">A quem se destina?</p>
                <p className="text-sm text-gray-600 mt-1">{course.publicoAlvo}</p>
              </div>
            )}

            {/* Carga horária */}
            {course.cargaHorariaDetalhe && (
              <div className="mt-5 rounded-xl bg-white p-4 shadow-sm">
                <p className="font-semibold text-gray-900">Carga horária</p>
                <p className="text-sm text-gray-600 mt-1">{course.cargaHorariaDetalhe}</p>
              </div>
            )}

            {/* Requisitos (categoria CNH / idade) */}
            {REQUISITOS_CURSOS[course.titulo] && (
              <div className="mt-5 rounded-xl bg-white p-4 shadow-sm">
                <p className="font-semibold text-gray-900">Requisitos</p>
                <p className="text-sm text-gray-600 mt-1">
                  Idade mínima de 21 anos • Categoria de CNH: {REQUISITOS_CURSOS[course.titulo].join(', ')}
                </p>
              </div>
            )}

            {/* O que você vai aprender */}
            {course.oQueVaiAprender && course.oQueVaiAprender.length > 0 && (
              <div className="mt-5 rounded-xl bg-white p-4 shadow-sm overflow-hidden">
                <p className="font-semibold text-gray-900 mb-2">O que você vai aprender</p>
                <ul>
                  {course.oQueVaiAprender.map((item, i) => (
                    <li
                      key={i}
                      className={`px-3 py-2 text-sm text-gray-700 ${
                        i % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      }`}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Com quem você vai aprender? */}
            {course.instrutor && (
              <div className="mt-5 rounded-xl bg-white p-4 shadow-sm">
                <p className="font-semibold text-gray-900 mb-2">Com quem você vai aprender?</p>
                <p className="text-sm text-gray-700">
                  <span className="font-bold">{course.instrutor.nome}</span>
                  {' — '}
                  {course.instrutor.descricao}
                </p>
              </div>
            )}

            {/* Informações do curso */}
            {course.informacoesCurso && course.informacoesCurso.length > 0 && (
              <div className="mt-5 rounded-xl bg-white p-4 shadow-sm">
                <p className="font-semibold text-gray-900 mb-2">Informações do curso</p>
                <ul className="space-y-1.5">
                  {course.informacoesCurso.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-[#f8b400] mt-0.5">●</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between rounded-xl bg-white p-5 shadow-sm">
              <div>
                <p className="text-sm text-gray-500">Investimento</p>
                <p className="text-2xl font-bold text-gray-900">{course.preco}</p>
              </div>
              <button
                onClick={handleInscricao}
                disabled={loading}
                className="rounded-full bg-[#f8b400] px-8 py-4 text-white font-bold transition hover:bg-[#e9a600] disabled:opacity-60"
              >
                {loading ? 'Aguarde...' : 'Fazer inscrição'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Fale com um consultor */}
      <section className="max-w-3xl mx-auto px-5 pb-16">
        <div className="rounded-2xl bg-[#25D366] p-6 text-center shadow-lg">
          <p className="text-white font-semibold text-lg">
            Fale com um consultor e tire todas as suas dúvidas!
          </p>
          <a
            href="https://wa.me/5521967244785"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block rounded-full bg-white px-8 py-3 font-bold text-[#25D366] hover:bg-gray-100 transition"
          >
            📱 (21) 96724-4785
          </a>
        </div>
      </section>

      <Footer />

      {/* Modal de requisitos */}
      {validationError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm shadow-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Requisitos não cumpridos</h2>
            <p className="text-gray-700 mb-4 font-semibold">{course.titulo}</p>

            <div className="space-y-3 mb-6 text-sm">
              <p className={validationError.idadeOk ? 'text-green-700' : 'text-red-700'}>
                {validationError.idadeOk ? '✓' : '✗'} Idade mínima: 21 anos
              </p>
              {validationError.requiredCategories.length > 0 && (
                <p className={validationError.categoriaOk ? 'text-green-700' : 'text-red-700'}>
                  {validationError.categoriaOk ? '✓' : '✗'} Categoria requerida: {validationError.requiredCategories.join(', ')}
                  {' '}(sua: {validationError.userCategories.join(', ') || '—'})
                </p>
              )}
            </div>

            <button
              onClick={() => setValidationError(null)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Modal de estado (reciclagem) */}
      {validationErrorEstado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm shadow-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Localização não permitida</h2>
            <p className="text-sm text-gray-600 mb-4">
              Estados permitidos: {validationErrorEstado.allowedStates.join(', ')}. Seu estado: {validationErrorEstado.userState || '—'}.
            </p>
            <button
              onClick={() => setValidationErrorEstado(null)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </main>
  )
}