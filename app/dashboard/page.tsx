'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import WhatsappButton from '@/app/components/WhatsappButton'
import Usuarios from '@/app/components/Usuarios'

type Purchase = {
  _id: string
  titulo: string
  preco: number
  status: string
  paid_at: string

  gateway_response?: {
    payerInformation?: {
      method?: string
    }
    methods?: string[]
  }

  user?: {
    nome?: string
    email?: string
    whatsapp?: string
    cpf?: string
    cnh?: string
    categoriaCnh?: string[]
    ufCnh?: string
    dataNascimento?: string
    endereco?: {
      logradouro?: string
      numero?: string
      bairro?: string
      cidade?: string
      estado?: string
      cep?: string
    }
  }
}

function getPaymentMethodLabel(method: string | undefined): string {
  if (!method) return '-'

  const translations: Record<string, string> = {
    card: 'Cartão',
    boleto: 'Boleto',
    pix: 'PIX',
    debit_card: 'Cartão de Débito',
    credit_card: 'Cartão de Crédito',
  }

  return translations[method.toLowerCase()] || method
}

export default function DashboardPage() {
  const router = useRouter()
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [authStatus, setAuthStatus] = useState<'authorized' | 'unauthorized' | 'checking'>('checking')
  const [activeView, setActiveView] = useState<'purchases' | 'users'>('purchases')

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    let isMounted = true

    ;(async () => {
      try {
        const userStr = localStorage.getItem('user')
        if (!isMounted) return

        if (!userStr) {
          setAuthStatus('unauthorized')
          return
        }
        const user = JSON.parse(userStr)
        if (isMounted) {
          setAuthStatus(user.access === true ? 'authorized' : 'unauthorized')
        }
      } catch {
        if (isMounted) {
          setAuthStatus('unauthorized')
        }
      }
    })()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (authStatus !== 'authorized') return

    let isMounted = true

    ;(async () => {
      try {
        const response = await fetch(`${API_URL}/api/history`)
        const data = await response.json()

        if (!isMounted) return

        const sorted = data
          .filter((purchase: Purchase) => purchase.status === 'paid')
          .sort((a: Purchase, b: Purchase) => {
            return new Date(b.paid_at).getTime() - new Date(a.paid_at).getTime()
          })

        setPurchases(sorted)
      } catch (error) {
        console.error(error)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    })()

    return () => {
      isMounted = false
    }
  }, [authStatus, API_URL])

  if (authStatus === 'checking') {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#eef2fb] font-sans">
        <div className="text-center">
          <p className="text-slate-500">Verificando autenticação...</p>
        </div>
      </main>
    )
  }

  if (authStatus === 'unauthorized') {
    return (
      <main className="min-h-screen bg-[#eef2fb] font-sans">
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white text-3xl">
                ✕
              </div>
            </div>

            <h2 className="text-[#0d2160] font-black text-2xl text-center mb-3">
              Acesso não autorizado
            </h2>

            <p className="text-slate-600 text-center mb-8 leading-relaxed">
              Essa página é restrita apenas aos administradores da Portal CNH Fácil
            </p>

            <button
              onClick={() => router.push('/')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-2xl transition-colors"
            >
              Voltar para Home
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#eef2fb] font-sans">
      <Header />
      <WhatsappButton />

      {/* Hero */}
      <section className="relative bg-[#0d2160] px-6 pt-10 pb-20 text-center overflow-hidden">
        <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-blue-800 opacity-30" />
        <div className="absolute -bottom-16 -right-10 w-64 h-64 rounded-full bg-blue-900 opacity-40" />
        <div className="relative z-10">
          <h1 className="text-white font-black text-2xl uppercase tracking-wide">
            Dashboard
          </h1>
          <p className="text-blue-200 text-sm mt-2">
            {activeView === 'purchases' ? 'Histórico de pagamentos aprovados' : 'Gerenciamento de usuários'}
          </p>
          
          {/* Botões de alternância */}
          <div className="flex gap-3 justify-center mt-6">
            <button
              onClick={() => setActiveView('purchases')}
              className={`px-6 py-2 font-bold rounded-full transition-colors ${
                activeView === 'purchases'
                  ? 'bg-white text-[#0d2160]'
                  : 'bg-blue-700 hover:bg-blue-800 text-white'
              }`}
            >
              Ver Compras
            </button>
            <button
              onClick={() => setActiveView('users')}
              className={`px-6 py-2 font-bold rounded-full transition-colors ${
                activeView === 'users'
                  ? 'bg-white text-[#0d2160]'
                  : 'bg-blue-700 hover:bg-blue-800 text-white'
              }`}
            >
              Ver Usuários
            </button>
          </div>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="px-5 -mt-10 pb-16 relative z-10 max-w-6xl mx-auto">
        {activeView === 'purchases' ? (
          // VISUALIZAÇÃO DE COMPRAS
          <>
            {loading ? (
              <div className="bg-white rounded-3xl p-10 shadow-xl text-center">
                <p className="text-slate-500">Carregando compras...</p>
              </div>
            ) : purchases.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 shadow-xl text-center">
                <p className="text-slate-500">Nenhuma compra encontrada</p>
              </div>
            ) : (
              <div className="space-y-3">
                {purchases.map((purchase) => (
                  <div
                    key={purchase._id}
                    className="bg-white rounded-3xl shadow-xl border border-slate-100"
                  >
                    {/* Cabeçalho - Sempre visível */}
                    <div className="flex items-center justify-between p-6">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                          {purchase.user?.nome?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                          <h2 className="text-[#0d2160] font-bold text-lg">
                            {purchase.user?.nome || 'Usuário'}
                          </h2>
                          <p className="text-slate-400 text-xs">
                            {purchase.paid_at
                              ? new Date(purchase.paid_at).toLocaleString('pt-BR')
                              : '-'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          setExpandedId(
                            expandedId === purchase._id ? null : purchase._id
                          )
                        }
                        className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full text-sm transition-colors cursor-pointer"
                      >
                        {expandedId === purchase._id ? 'Ver menos' : 'Ver mais'}
                      </button>
                    </div>

                    {/* Detalhes - Visível quando expandido */}
                    {expandedId === purchase._id && (
                      <div className="px-6 pb-6 border-t border-slate-100 pt-6">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-12 h-12 rounded-2xl bg-green-500 flex items-center justify-center text-white text-2xl shadow-lg">
                            ✓
                          </div>
                          <div>
                            <h3 className="text-[#0d2160] font-black text-lg">
                              {purchase.titulo}
                            </h3>
                            <p className="text-green-600 font-bold text-sm">
                              Pagamento aprovado
                            </p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                          <Info label="Nome" value={purchase.user?.nome} />
                          <Info label="Email" value={purchase.user?.email} />
                          <Info 
                            label="WhatsApp" 
                            value={purchase.user?.whatsapp}
                            onClick={() => {
                              if (purchase.user?.whatsapp) {
                                window.open(`https://wa.me/${purchase.user.whatsapp.replace(/\D/g, '')}`, '_blank')
                              }
                            }}
                          />
                          <Info label="CPF" value={purchase.user?.cpf} />
                          <Info
                            label="Data de Nascimento"
                            value={
                              purchase.user?.dataNascimento
                                ? new Date(purchase.user.dataNascimento).toLocaleDateString('pt-BR')
                                : '-'
                            }
                          />
                          <Info
                            label="Data do Pagamento"
                            value={
                              purchase.paid_at
                                ? new Date(purchase.paid_at).toLocaleString('pt-BR')
                                : '-'
                            }
                          />
                          <Info label="CNH" value={purchase.user?.cnh} />
                          <Info
                            label="Categoria CNH"
                            value={purchase.user?.categoriaCnh?.join(', ') || '-'}
                          />
                          <Info label="UF CNH" value={purchase.user?.ufCnh} />
                          <Info
                            label="Método de Pagamento"
                            value={getPaymentMethodLabel(
                              purchase.gateway_response?.payerInformation?.method ||
                              purchase.gateway_response?.methods?.[0]
                            )}
                          />
                          <Info label="Logradouro" value={purchase.user?.endereco?.logradouro} />
                          <Info label="Número" value={purchase.user?.endereco?.numero} />
                          <Info label="Bairro" value={purchase.user?.endereco?.bairro} />
                          <Info label="Cidade" value={purchase.user?.endereco?.cidade} />
                          <Info label="Estado" value={purchase.user?.endereco?.estado} />
                          <Info label="CEP" value={purchase.user?.endereco?.cep} />
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                          <div className="bg-emerald-50 text-emerald-700 font-black text-2xl px-6 py-3 rounded-2xl">
                            R$ {Number(purchase.preco).toFixed(2)}
                          </div>
                          <span className="bg-green-100 text-green-700 text-sm font-bold px-4 py-2 rounded-full">
                            ✓ PAGO
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          // VISUALIZAÇÃO DE USUÁRIOS
          <Usuarios />
        )}
      </section>

      <Footer />
    </main>
  )
}

function Info({ label, value, onClick }: { label: string; value?: string; onClick?: () => void }) {
  return (
    <div 
      className={`bg-slate-50 rounded-2xl p-4 ${onClick ? 'cursor-pointer hover:bg-slate-100 transition-colors' : ''}`}
      onClick={onClick}
    >
      <p className="text-xs uppercase tracking-wide text-slate-400 font-bold mb-1">
        {label}
      </p>
      <p className={`${onClick ? 'text-green-600 font-bold' : 'text-[#0d2160]'} font-semibold break-all`}>{value || '-'}</p>
    </div>
  )
}