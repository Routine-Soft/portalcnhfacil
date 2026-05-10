'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, startTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/app/components/Header'
import WhatsappButton from './components/WhatsappButton'
import Footer from './components/Footer'

type Course = {
  id: number
  titulo: string
  subtitulo: string | null
  categoria: string
  bg: string
  shadow: string
  textColor: string
  emoji: string
  preco: string,
  productId: string,
}

// const courses: Course[] = [
//   { id: 1, titulo: 'Curso MOPP',                    subtitulo: 'Produtos Perigosos',    bg: 'from-yellow-400 to-yellow-500', shadow: 'shadow-yellow-300', textColor: 'text-yellow-900', emoji: '🚛', preco: 'R$ 199,90', productId: 'prod_NTGEAJ2DfU4PnLmwYzPeYKSC' },
//   { id: 2, titulo: 'Curso para Taxista',             subtitulo: null,                    bg: 'from-blue-500 to-blue-600',     shadow: 'shadow-blue-300',   textColor: 'text-white',      emoji: '🚕', preco: 'R$ 199,90', productId: 'prod_r5nJ2MwdHgD544SQHZrey23j' },
//   { id: 3, titulo: 'Curso de Transporte Escolar',    subtitulo: null,                    bg: 'from-emerald-500 to-green-600', shadow: 'shadow-emerald-300',textColor: 'text-white',      emoji: '🚌', preco: 'R$ 199,90', productId: 'prod_1234567890' },
//   { id: 4, titulo: 'Curso para Condutor de Ambulância', subtitulo: null,                 bg: 'from-red-500 to-red-600',       shadow: 'shadow-red-300',    textColor: 'text-white',      emoji: '🚑', preco: 'R$ 199,90', productId: 'prod_0987654321' },
//   { id: 5, titulo: 'Curso de Reciclagem CNH',        subtitulo: 'Condutores Infratores', bg: 'from-purple-500 to-purple-700', shadow: 'shadow-purple-300', textColor: 'text-white',      emoji: '🔄', preco: 'R$ 199,90', productId: 'prod_1122334455' },
//   { id: 6, titulo: 'Curso NR-35',                    subtitulo: 'Trabalho em Altura',    bg: 'from-orange-400 to-orange-500', shadow: 'shadow-orange-300', textColor: 'text-orange-900', emoji: '🏗️', preco: 'R$ 199,90', productId: 'prod_5566778899' },
// ]

const courses: Course[] = [
 
  // ─── FORMAÇÃO ESPECIALIZADA ───────────────────────────────────────────────
  { id: 1,  titulo: 'Carga Indivisível Formação',             subtitulo: 'CETCI',  categoria: 'Formação', bg: 'from-yellow-400 to-yellow-500', shadow: 'shadow-yellow-300', textColor: 'text-yellow-900', emoji: '🚛', preco: 'R$ 130,00', productId: 'prod_r5nJ2MwdHgD544SQHZrey23j' },
  { id: 2,  titulo: 'Coletivo de Passageiros Formação',       subtitulo: 'CETCP',  categoria: 'Formação', bg: 'from-yellow-400 to-yellow-500', shadow: 'shadow-yellow-300', textColor: 'text-yellow-900', emoji: '🚌', preco: 'R$ 130,00', productId: 'prod_NTGEAJ2DfU4PnLmwYzPeYKSC' },
  { id: 3,  titulo: 'Emergência Formação',                    subtitulo: 'CETVE',  categoria: 'Formação', bg: 'from-yellow-400 to-yellow-500', shadow: 'shadow-yellow-300', textColor: 'text-yellow-900', emoji: '🚑', preco: 'R$ 130,00', productId: 'prod_HPzBuHw5epT2kfMYzzzbY3Z3' },
  { id: 4,  titulo: 'Escolar Formação',                       subtitulo: 'CETE',   categoria: 'Formação', bg: 'from-yellow-400 to-yellow-500', shadow: 'shadow-yellow-300', textColor: 'text-yellow-900', emoji: '🏫', preco: 'R$ 130,00', productId: 'prod_t6Fk0z0pL2Dq3yFsYXHMQueW' },
  { id: 5,  titulo: 'Produtos Perigosos - MOPP Formação',     subtitulo: 'CETPP',  categoria: 'Formação', bg: 'from-yellow-400 to-yellow-500', shadow: 'shadow-yellow-300', textColor: 'text-yellow-900', emoji: '☢️', preco: 'R$ 130,00', productId: 'prod_PqxH2eC0YMmhfk0bQNshE1mt' },
 
  // ─── ATUALIZAÇÃO ESPECIALIZADA ────────────────────────────────────────────
  { id: 6,  titulo: 'Carga Indivisível Atualização',          subtitulo: 'CETCI',  categoria: 'Atualização', bg: 'from-blue-500 to-blue-600',     shadow: 'shadow-blue-300',   textColor: 'text-white',      emoji: '🚛', preco: 'R$ 110,00', productId: 'COLE_O_ID_AQUI' },
  { id: 7,  titulo: 'Coletivo de Passageiros Atualização',    subtitulo: 'CETCP',  categoria: 'Atualização', bg: 'from-blue-500 to-blue-600',     shadow: 'shadow-blue-300',   textColor: 'text-white',      emoji: '🚌', preco: 'R$ 110,00', productId: 'COLE_O_ID_AQUI' },
  { id: 8,  titulo: 'Emergência Atualização',                 subtitulo: 'CETVE',  categoria: 'Atualização', bg: 'from-blue-500 to-blue-600',     shadow: 'shadow-blue-300',   textColor: 'text-white',      emoji: '🚑', preco: 'R$ 110,00', productId: 'COLE_O_ID_AQUI' },
  { id: 9,  titulo: 'Escolar Atualização',                    subtitulo: 'CETE',   categoria: 'Atualização', bg: 'from-blue-500 to-blue-600',     shadow: 'shadow-blue-300',   textColor: 'text-white',      emoji: '🏫', preco: 'R$ 110,00', productId: 'COLE_O_ID_AQUI' },
  { id: 10, titulo: 'Produtos Perigosos - MOPP Atualização',  subtitulo: 'CETPP',  categoria: 'Atualização', bg: 'from-blue-500 to-blue-600',     shadow: 'shadow-blue-300',   textColor: 'text-white',      emoji: '☢️', preco: 'R$ 110,00', productId: 'COLE_O_ID_AQUI' },
 
  // ─── RECICLAGEM CNH ───────────────────────────────────────────────────────
  { id: 11, titulo: 'Atualização para Renovação da CNH',      subtitulo: null,     categoria: 'Reciclagem', bg: 'from-red-500 to-red-600',       shadow: 'shadow-red-300',    textColor: 'text-white',      emoji: '🔄', preco: 'R$ 50,00',  productId: 'COLE_O_ID_AQUI' },
  { id: 12, titulo: 'Curso Preventivo de Reciclagem',         subtitulo: null,     categoria: 'Reciclagem', bg: 'from-red-500 to-red-600',       shadow: 'shadow-red-300',    textColor: 'text-white',      emoji: '🔄', preco: 'R$ 50,00',  productId: 'COLE_O_ID_AQUI' },
  { id: 13, titulo: 'Reciclagem para Condutores Infratores',  subtitulo: null,     categoria: 'Reciclagem', bg: 'from-red-500 to-red-600',       shadow: 'shadow-red-300',    textColor: 'text-white',      emoji: '⚠️', preco: 'R$ 50,00',  productId: 'COLE_O_ID_AQUI' },
 
  // ─── TAXISTA / APP ────────────────────────────────────────────────────────
  { id: 14, titulo: 'Curso para Taxista',                     subtitulo: null,     categoria: 'Profissional', bg: 'from-emerald-500 to-green-600', shadow: 'shadow-emerald-300',textColor: 'text-white',      emoji: '🚕', preco: 'R$ 90,00',  productId: 'prod_r5nJ2MwdHgD544SQHZrey23j' },
  { id: 15, titulo: 'Curso para Condutor de App',             subtitulo: null,     categoria: 'Profissional', bg: 'from-emerald-500 to-green-600', shadow: 'shadow-emerald-300',textColor: 'text-white',      emoji: '📱', preco: 'R$ 90,00',  productId: 'COLE_O_ID_AQUI' },
 
  // ─── MOTO ─────────────────────────────────────────────────────────────────
  { id: 16, titulo: 'Motofrete Atualização',                  subtitulo: '100% online', categoria: 'Moto', bg: 'from-orange-400 to-orange-500', shadow: 'shadow-orange-300', textColor: 'text-orange-900', emoji: '🏍️', preco: 'R$ 130,00', productId: 'COLE_O_ID_AQUI' },
  { id: 17, titulo: 'Motofrete Formação',                     subtitulo: '100% online', categoria: 'Moto', bg: 'from-orange-400 to-orange-500', shadow: 'shadow-orange-300', textColor: 'text-orange-900', emoji: '🏍️', preco: 'R$ 130,00', productId: 'COLE_O_ID_AQUI' },
  { id: 18, titulo: 'Mototáxi Atualização',                   subtitulo: '100% online', categoria: 'Moto', bg: 'from-orange-400 to-orange-500', shadow: 'shadow-orange-300', textColor: 'text-orange-900', emoji: '🛵', preco: 'R$ 130,00', productId: 'COLE_O_ID_AQUI' },
  { id: 19, titulo: 'Mototáxi Formação',                      subtitulo: '100% online', categoria: 'Moto', bg: 'from-orange-400 to-orange-500', shadow: 'shadow-orange-300', textColor: 'text-orange-900', emoji: '🛵', preco: 'R$ 130,00', productId: 'COLE_O_ID_AQUI' },
 
  // ─── NORMAS REGULAMENTADORAS (NR) ─────────────────────────────────────────
  { id: 20, titulo: 'Operador de Empilhadeiras Atualização',  subtitulo: '100% online', categoria: 'NR', bg: 'from-purple-500 to-purple-700', shadow: 'shadow-purple-300', textColor: 'text-white', emoji: '🏗️', preco: 'R$ 65,00', productId: 'COLE_O_ID_AQUI' },
  { id: 21, titulo: 'NR 06',                                  subtitulo: '16h',         categoria: 'NR', bg: 'from-purple-500 to-purple-700', shadow: 'shadow-purple-300', textColor: 'text-white', emoji: '🦺', preco: 'R$ 65,00', productId: 'COLE_O_ID_AQUI' },
  { id: 22, titulo: 'NR 10',                                  subtitulo: '40h',         categoria: 'NR', bg: 'from-purple-500 to-purple-700', shadow: 'shadow-purple-300', textColor: 'text-white', emoji: '⚡', preco: 'R$ 65,00', productId: 'COLE_O_ID_AQUI' },
  { id: 23, titulo: 'NR 11',                                  subtitulo: '16h',         categoria: 'NR', bg: 'from-purple-500 to-purple-700', shadow: 'shadow-purple-300', textColor: 'text-white', emoji: '📦', preco: 'R$ 65,00', productId: 'COLE_O_ID_AQUI' },
  { id: 24, titulo: 'NR 12',                                  subtitulo: '16h',         categoria: 'NR', bg: 'from-purple-500 to-purple-700', shadow: 'shadow-purple-300', textColor: 'text-white', emoji: '⚙️', preco: 'R$ 65,00', productId: 'COLE_O_ID_AQUI' },
  { id: 25, titulo: 'NR 16',                                  subtitulo: '16h',         categoria: 'NR', bg: 'from-purple-500 to-purple-700', shadow: 'shadow-purple-300', textColor: 'text-white', emoji: '🔥', preco: 'R$ 65,00', productId: 'COLE_O_ID_AQUI' },
  { id: 26, titulo: 'NR 20 - Básico',                         subtitulo: '8h',          categoria: 'NR', bg: 'from-purple-500 to-purple-700', shadow: 'shadow-purple-300', textColor: 'text-white', emoji: '🛢️', preco: 'R$ 65,00', productId: 'COLE_O_ID_AQUI' },
  { id: 27, titulo: 'NR 20 - Intermediário Classe 01',        subtitulo: null,          categoria: 'NR', bg: 'from-purple-500 to-purple-700', shadow: 'shadow-purple-300', textColor: 'text-white', emoji: '🛢️', preco: 'R$ 65,00', productId: 'COLE_O_ID_AQUI' },
  { id: 28, titulo: 'NR 20 - Intermediário Classe 02',        subtitulo: null,          categoria: 'NR', bg: 'from-purple-500 to-purple-700', shadow: 'shadow-purple-300', textColor: 'text-white', emoji: '🛢️', preco: 'R$ 65,00', productId: 'COLE_O_ID_AQUI' },
  { id: 29, titulo: 'NR 20 - Intermediário Classe 03',        subtitulo: null,          categoria: 'NR', bg: 'from-purple-500 to-purple-700', shadow: 'shadow-purple-300', textColor: 'text-white', emoji: '🛢️', preco: 'R$ 65,00', productId: 'COLE_O_ID_AQUI' },
  { id: 30, titulo: 'NR 29',                                  subtitulo: '24h',         categoria: 'NR', bg: 'from-purple-500 to-purple-700', shadow: 'shadow-purple-300', textColor: 'text-white', emoji: '⚓', preco: 'R$ 65,00', productId: 'COLE_O_ID_AQUI' },
  { id: 31, titulo: 'NR 33',                                  subtitulo: '16h',         categoria: 'NR', bg: 'from-purple-500 to-purple-700', shadow: 'shadow-purple-300', textColor: 'text-white', emoji: '🕳️', preco: 'R$ 65,00', productId: 'COLE_O_ID_AQUI' },
  { id: 32, titulo: 'NR 35 - 2024',                           subtitulo: '16h',         categoria: 'NR', bg: 'from-purple-500 to-purple-700', shadow: 'shadow-purple-300', textColor: 'text-white', emoji: '🧗', preco: 'R$ 65,00', productId: 'COLE_O_ID_AQUI' },
 
  // ─── CAPACITAÇÃO PROFISSIONAL ─────────────────────────────────────────────
  { id: 33, titulo: 'Atendimento ao Cliente',                              subtitulo: null, categoria: 'Capacitação', bg: 'from-sky-500 to-cyan-600',     shadow: 'shadow-sky-300',   textColor: 'text-white', emoji: '🤝', preco: 'R$ 65,00', productId: 'COLE_O_ID_AQUI' },
  { id: 34, titulo: 'Atendimento Pré-Hospitalar (APH)',                    subtitulo: null, categoria: 'Capacitação', bg: 'from-sky-500 to-cyan-600',     shadow: 'shadow-sky-300',   textColor: 'text-white', emoji: '🏥', preco: 'R$ 65,00', productId: 'COLE_O_ID_AQUI' },
  { id: 35, titulo: 'Condutor e Monitor para Passageiros com Mobilidade Reduzida', subtitulo: null, categoria: 'Capacitação', bg: 'from-sky-500 to-cyan-600', shadow: 'shadow-sky-300', textColor: 'text-white', emoji: '♿', preco: 'R$ 65,00', productId: 'COLE_O_ID_AQUI' },
  { id: 36, titulo: 'Condução Segura para Motoristas de Caminhão',         subtitulo: null, categoria: 'Capacitação', bg: 'from-sky-500 to-cyan-600',     shadow: 'shadow-sky-300',   textColor: 'text-white', emoji: '🚚', preco: 'R$ 65,00', productId: 'COLE_O_ID_AQUI' },
  { id: 37, titulo: 'Condução Segura para Motoristas de Ônibus',           subtitulo: null, categoria: 'Capacitação', bg: 'from-sky-500 to-cyan-600',     shadow: 'shadow-sky-300',   textColor: 'text-white', emoji: '🚍', preco: 'R$ 65,00', productId: 'COLE_O_ID_AQUI' },
  { id: 38, titulo: 'Direção Defensiva',                                   subtitulo: 'Validade 1 ano',   categoria: 'Capacitação', bg: 'from-sky-500 to-cyan-600', shadow: 'shadow-sky-300', textColor: 'text-white', emoji: '🛡️', preco: 'R$ 65,00', productId: 'COLE_O_ID_AQUI' },
  { id: 39, titulo: 'Direção Defensiva',                                   subtitulo: 'Validade 2 anos',  categoria: 'Capacitação', bg: 'from-sky-500 to-cyan-600', shadow: 'shadow-sky-300', textColor: 'text-white', emoji: '🛡️', preco: 'R$ 65,00', productId: 'COLE_O_ID_AQUI' },
  { id: 40, titulo: 'Manutenção Automotiva para Profissionais do Transporte', subtitulo: null, categoria: 'Capacitação', bg: 'from-sky-500 to-cyan-600', shadow: 'shadow-sky-300', textColor: 'text-white', emoji: '🔧', preco: 'R$ 65,00', productId: 'COLE_O_ID_AQUI' },
  { id: 41, titulo: 'Segurança e Saúde no Transporte de Cargas',           subtitulo: null, categoria: 'Capacitação', bg: 'from-sky-500 to-cyan-600',     shadow: 'shadow-sky-300',   textColor: 'text-white', emoji: '🦺', preco: 'R$ 65,00', productId: 'COLE_O_ID_AQUI' },
  { id: 42, titulo: 'Transporte de Cargas',                                subtitulo: null, categoria: 'Capacitação', bg: 'from-sky-500 to-cyan-600',     shadow: 'shadow-sky-300',   textColor: 'text-white', emoji: '📦', preco: 'R$ 65,00', productId: 'COLE_O_ID_AQUI' },
  { id: 43, titulo: 'Direção Econômica e Tecnologia no Transporte',        subtitulo: null, categoria: 'Capacitação', bg: 'from-sky-500 to-cyan-600',     shadow: 'shadow-sky-300',   textColor: 'text-white', emoji: '♻️', preco: 'R$ 65,00', productId: 'COLE_O_ID_AQUI' },
  { id: 44, titulo: 'Gestão Logística e Otimização de Processos',          subtitulo: null, categoria: 'Capacitação', bg: 'from-sky-500 to-cyan-600',     shadow: 'shadow-sky-300',   textColor: 'text-white', emoji: '📊', preco: 'R$ 65,00', productId: 'COLE_O_ID_AQUI' },
  { id: 45, titulo: 'Gestão de Fretes',                                    subtitulo: null, categoria: 'Capacitação', bg: 'from-sky-500 to-cyan-600',     shadow: 'shadow-sky-300',   textColor: 'text-white', emoji: '💰', preco: 'R$ 65,00', productId: 'COLE_O_ID_AQUI' },
  { id: 46, titulo: 'Gestão de Pneus no Transporte',                       subtitulo: null, categoria: 'Capacitação', bg: 'from-sky-500 to-cyan-600',     shadow: 'shadow-sky-300',   textColor: 'text-white', emoji: '🔵', preco: 'R$ 65,00', productId: 'COLE_O_ID_AQUI' },
  { id: 47, titulo: 'Monitor de Transporte Escolar',                       subtitulo: null, categoria: 'Capacitação', bg: 'from-sky-500 to-cyan-600',     shadow: 'shadow-sky-300',   textColor: 'text-white', emoji: '🏫', preco: 'R$ 65,00', productId: 'COLE_O_ID_AQUI' },
  { id: 48, titulo: 'Noções Básicas de Primeiros Socorros',                subtitulo: null, categoria: 'Capacitação', bg: 'from-sky-500 to-cyan-600',     shadow: 'shadow-sky-300',   textColor: 'text-white', emoji: '🩺', preco: 'R$ 65,00', productId: 'COLE_O_ID_AQUI' },
  { id: 49, titulo: 'Prevenção e Combate a Incêndio',                      subtitulo: null, categoria: 'Capacitação', bg: 'from-sky-500 to-cyan-600',     shadow: 'shadow-sky-300',   textColor: 'text-white', emoji: '🧯', preco: 'R$ 65,00', productId: 'COLE_O_ID_AQUI' },
]


// 'R$ 199,90' → 199.9
function parsePreco(preco: string): number {
  return parseFloat(preco.replace('R$', '').replace(/\./g, '').replace(',', '.').trim())
}

// Requisitos de categorias CNH para cursos de Formação e Atualização
const REQUISITOS_CURSOS: Record<string, string[]> = {
  'Carga Indivisível Formação': ['C', 'D', 'E'],
  'Carga Indivisível Atualização': ['C', 'D', 'E'],
  'Coletivo de Passageiros Formação': ['D', 'E'],
  'Coletivo de Passageiros Atualização': ['D', 'E'],
  'Emergência Formação': ['A', 'B', 'C', 'D', 'E'],
  'Emergência Atualização': ['A', 'B', 'C', 'D', 'E'],
  'Escolar Formação': ['D', 'E'],
  'Escolar Atualização': ['D', 'E'],
  'Produtos Perigosos - MOPP Formação': ['B', 'C', 'D', 'E'],
  'Produtos Perigosos - MOPP Atualização': ['B', 'C', 'D', 'E'],
}

type User = {
  _id: string
  nome: string
  email: string
  whatsapp: string
  cpf: string
  cnh: string
  categoriaCnh: string[]
  ufCnh: string
  dataNascimento: string
  endereco: {
    logradouro: string
    numero: string
    bairro: string
    cidade: string
    estado: string
    cep: string
  }
  access: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

type ValidationError = {
  hasError: boolean
  idadeOk: boolean
  categoriaOk: boolean
  requiredCategories: string[]
  userCategories: string[]
}

// Calcula idade a partir da data de nascimento
function calcularIdade(dataNascimento: string): number {
  const hoje = new Date()
  const nascimento = new Date(dataNascimento)
  let idade = hoje.getFullYear() - nascimento.getFullYear()
  const mes = hoje.getMonth() - nascimento.getMonth()
  
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--
  }
  
  return idade
}

// Valida requisitos do curso (apenas para Formação e Atualização)
function validarRequisitoCurso(course: Course, user: User): ValidationError {
  const idadeOk = calcularIdade(user.dataNascimento) >= 21
  const requiredCategories = REQUISITOS_CURSOS[course.titulo] || []
  const categoriaOk = requiredCategories.length === 0 || requiredCategories.some(cat => user.categoriaCnh.includes(cat))

  return {
    hasError: !idadeOk || !categoriaOk,
    idadeOk,
    categoriaOk,
    requiredCategories,
    userCategories: user.categoriaCnh,
  }
}

export default function CursosPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userName, setUserName] = useState('Usuário')
  const [isLogged, setIsLogged] = useState(false)
  const [validationError, setValidationError] = useState<ValidationError | null>(null)
  const [courseTitle, setCourseTitle] = useState('')

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

    try {
      const user: User = JSON.parse(userStr)
      
      // Verifica se o curso requer validação (Formação ou Atualização)
      const requiresValidation = REQUISITOS_CURSOS[course.titulo] !== undefined

      if (requiresValidation) {
        const validation = validarRequisitoCurso(course, user)
        
        if (validation.hasError) {
          setValidationError(validation)
          setCourseTitle(course.titulo)
          return
        }
      }

      setLoading(true)

      // Passa nome e preço via query params para a página de pagamento
      const params = new URLSearchParams({
        name:  course.titulo,
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

      {/* Hero */}
      <section className="relative bg-[#0d2160] px-6 pt-10 pb-20 text-center overflow-hidden">
        <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-blue-800 opacity-30" />
        <div className="absolute -bottom-16 -right-10 w-64 h-64 rounded-full bg-blue-900 opacity-40" />
        <div className="relative z-10 flex flex-col items-center gap-4">
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
              {REQUISITOS_CURSOS[course.titulo] && (
                <div className={`text-xs mt-1.5 opacity-75 ${course.textColor}`}>
                  <p>Requisitos: Idade 21 anos - Categoria: {REQUISITOS_CURSOS[course.titulo].join(', ')}</p>
                </div>
              )}
            </div>
            <div className="relative z-10 text-5xl ml-4 drop-shadow-md select-none">{course.emoji}</div>
          </div>
        ))}
      </section>

      {/* Footer */}
      <Footer />

      {/* Modal de Erro de Requisitos */}
      {validationError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Requisitos não cumpridos</h2>
            </div>
            
            <p className="text-gray-700 mb-4 font-semibold">{courseTitle}</p>
            
            <div className="space-y-3 mb-6">
              {/* Validação de Idade */}
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 mt-0.5 ${validationError.idadeOk ? 'text-green-500' : 'text-red-500'}`}>
                  {validationError.idadeOk ? (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className={`font-semibold ${validationError.idadeOk ? 'text-green-700' : 'text-red-700'}`}>
                    Idade mínima: 21 anos
                  </p>
                  <p className="text-sm text-gray-600">
                    {validationError.idadeOk ? '✓ Você atende este requisito' : '✗ Você não tem 21 anos ainda'}
                  </p>
                </div>
              </div>

              {/* Validação de Categoria CNH */}
              {validationError.requiredCategories.length > 0 && (
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 mt-0.5 ${validationError.categoriaOk ? 'text-green-500' : 'text-red-500'}`}>
                    {validationError.categoriaOk ? (
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className={`font-semibold ${validationError.categoriaOk ? 'text-green-700' : 'text-red-700'}`}>
                      Categoria CNH requerida: {validationError.requiredCategories.join(', ')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {validationError.categoriaOk 
                        ? `✓ Sua categoria ${validationError.userCategories.join(', ')} atende` 
                        : `✗ Sua categoria ${validationError.userCategories.join(', ')} não atende`}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setValidationError(null)
                setCourseTitle('')
              }}
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