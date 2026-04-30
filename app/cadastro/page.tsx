'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '../components/Header'
import WhatsappButton from '../components/WhatsappButton'
import Footer from '../components/Footer'

const UFS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS',
  'MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC',
  'SP','SE','TO',
]

const CATEGORIAS_CNH = ['A','B','C','D','E','AB','AC','AD','AE']

type Endereco = {
  logradouro: string
  numero: string
  bairro: string
  cidade: string
  estado: string
  cep: string
}

type FormData = {
  nome: string
  email: string
  senha: string
  confirmarSenha: string
  whatsapp: string
  cpf: string
  cnh: string
  categoriaCnh: string[]
  ufCnh: string
  dataNascimento: string
  endereco: Endereco
}

const STEPS = [
  { label: 'Pessoal',   emoji: '👤', color: 'from-yellow-400 to-yellow-500', text: 'text-yellow-900', shadow: 'shadow-yellow-200' },
  { label: 'CNH',       emoji: '🪪', color: 'from-blue-500 to-blue-600',     text: 'text-white',      shadow: 'shadow-blue-200'   },
  { label: 'Endereço',  emoji: '📍', color: 'from-emerald-500 to-green-600', text: 'text-white',      shadow: 'shadow-emerald-200'},
  { label: 'Acesso',    emoji: '🔑', color: 'from-red-500 to-red-600',       text: 'text-white',      shadow: 'shadow-red-200'    },
]

function formatCPF(v: string) {
  return v.replace(/\D/g,'').slice(0,11)
    .replace(/(\d{3})(\d)/,'$1.$2')
    .replace(/(\d{3})(\d)/,'$1.$2')
    .replace(/(\d{3})(\d{1,2})$/,'$1-$2')
}

function formatWhatsapp(v: string) {
  return v.replace(/\D/g,'').slice(0,11)
    .replace(/(\d{2})(\d)/,'($1) $2')
    .replace(/(\d{5})(\d{4})$/,'$1-$2')
}

function formatCEP(v: string) {
  return v.replace(/\D/g,'').slice(0,8)
    .replace(/(\d{5})(\d)/,'$1-$2')
}

export default function CadastroPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [cepLoading, setCepLoading] = useState(false)

  const [form, setForm] = useState<FormData>({
    nome: '', email: '', senha: '', confirmarSenha: '',
    whatsapp: '', cpf: '', cnh: '', categoriaCnh: [],
    ufCnh: '', dataNascimento: '',
    endereco: { logradouro: '', numero: '', bairro: '', cidade: '', estado: '', cep: '' },
  })

  function set(field: keyof FormData, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function setEnd(field: keyof Endereco, value: string) {
    setForm(f => ({ ...f, endereco: { ...f.endereco, [field]: value } }))
  }

  function toggleCategoria(cat: string) {
    setForm(f => ({
      ...f,
      categoriaCnh: f.categoriaCnh.includes(cat)
        ? f.categoriaCnh.filter(c => c !== cat)
        : [...f.categoriaCnh, cat],
    }))
  }

  async function buscarCEP(cep: string) {
    const digits = cep.replace(/\D/g,'')
    if (digits.length !== 8) return
    setCepLoading(true)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
      const data = await res.json()
      if (!data.erro) {
        setForm(f => ({
          ...f,
          endereco: {
            ...f.endereco,
            logradouro: data.logradouro || '',
            bairro: data.bairro || '',
            cidade: data.localidade || '',
            estado: data.uf || '',
          }
        }))
      }
    } finally {
      setCepLoading(false)
    }
  }

  function validateStep() {
    setError('')
    if (step === 0) {
      if (!form.nome.trim()) return setError('Informe seu nome completo.')
      if (!form.whatsapp.trim()) return setError('Informe seu WhatsApp.')
      if (!form.cpf.trim()) return setError('Informe seu CPF.')
      if (!form.dataNascimento) return setError('Informe sua data de nascimento.')
      return true
    }
    if (step === 1) {
      if (!form.cnh.trim()) return setError('Informe o número da CNH.')
      if (!form.ufCnh) return setError('Selecione a UF da CNH.')
      if (form.categoriaCnh.length === 0) return setError('Selecione ao menos uma categoria.')
      return true
    }
    if (step === 2) {
      const e = form.endereco
      if (!e.cep || !e.logradouro || !e.numero || !e.bairro || !e.cidade || !e.estado)
        return setError('Preencha todos os campos do endereço.')
      return true
    }
    if (step === 3) {
      if (!form.email.trim()) return setError('Informe seu e-mail.')
      if (!form.senha) return setError('Crie uma senha.')
      if (form.senha.length < 6) return setError('A senha deve ter no mínimo 6 caracteres.')
      if (form.senha !== form.confirmarSenha) return setError('As senhas não coincidem.')
      return true
    }
    return true
  }

  function nextStep() {
    if (validateStep()) setStep(s => s + 1)
  }

  async function handleSubmit() {
    if (!validateStep()) return
    setLoading(true)
    setError('')

    const payload = {
      nome: form.nome,
      email: form.email,
      senha: form.senha,
      whatsapp: form.whatsapp.replace(/\D/g,''),
      cpf: form.cpf,
      cnh: form.cnh,
      categoriaCnh: form.categoriaCnh,
      ufCnh: form.ufCnh,
      dataNascimento: form.dataNascimento,
      endereco: form.endereco,
    }

    try {
      const res = await fetch('http://localhost:4000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Erro ao criar conta. Verifique os dados.')
        return
      }

      router.push('/login?cadastro=sucesso')

    } catch {
      setError('Não foi possível conectar ao servidor. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const currentStep = STEPS[step]

  return (
    <main className="min-h-screen bg-[#eef2fb] flex flex-col font-sans">
      <Header />
      <WhatsappButton />

      {/* Hero */}
      <section className="relative bg-[#0d2160] px-6 pt-8 pb-24 text-center overflow-hidden">
        <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-blue-800 opacity-30" />
        <div className="absolute -bottom-16 -right-10 w-64 h-64 rounded-full bg-blue-900 opacity-40" />
        <div className="relative z-10">
          <h1 className="text-white font-black text-xl tracking-wide uppercase mb-1">Criar conta</h1>
          <p className="text-blue-200 text-sm">Preencha os dados para se cadastrar</p>

          {/* Step indicators */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all
                  ${i === step ? 'bg-yellow-400 text-yellow-900 scale-110' : i < step ? 'bg-emerald-400 text-white' : 'bg-blue-800 text-blue-400'}
                `}>
                  {i < step ? '✓' : i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-8 h-0.5 ${i < step ? 'bg-emerald-400' : 'bg-blue-800'}`} />
                )}
              </div>
            ))}
          </div>
          <p className="text-blue-300 text-xs mt-2 font-semibold tracking-widest uppercase">
            {currentStep.emoji} {currentStep.label}
          </p>
        </div>
      </section>

      {/* Form card */}
      <section className="px-5 -mt-10 pb-16 relative z-10 max-w-md mx-auto w-full">
        <div className="bg-white rounded-3xl shadow-xl shadow-blue-100 overflow-hidden">

          {/* barra colorida top — muda por step */}
          <div className={`h-2 w-full bg-gradient-to-r ${currentStep.color}`} />

          <div className="px-7 py-8 flex flex-col gap-5">

            {/* STEP 0 — Dados pessoais */}
            {step === 0 && (
              <>
                <StepHeader emoji="👤" title="Dados pessoais" subtitle="Suas informações básicas" />
                <Field label="Nome completo" emoji="👤">
                  <input type="text" placeholder="João Silva" value={form.nome}
                    onChange={e => set('nome', e.target.value)}
                    className={inputClass} />
                </Field>
                <Field label="WhatsApp" emoji="📱">
                  <input type="tel" placeholder="(11) 99999-9999" value={form.whatsapp}
                    onChange={e => set('whatsapp', formatWhatsapp(e.target.value))}
                    className={inputClass} />
                </Field>
                <Field label="CPF" emoji="🪪">
                  <input type="text" placeholder="000.000.000-00" value={form.cpf}
                    onChange={e => set('cpf', formatCPF(e.target.value))}
                    className={inputClass} />
                </Field>
                <Field label="Data de nascimento" emoji="🎂">
                  <input type="date" value={form.dataNascimento}
                    onChange={e => set('dataNascimento', e.target.value)}
                    className={inputClass} />
                </Field>
              </>
            )}

            {/* STEP 1 — CNH */}
            {step === 1 && (
              <>
                <StepHeader emoji="🪪" title="Dados da CNH" subtitle="Informações da sua habilitação" />
                <Field label="Número da CNH" emoji="🪪">
                  <input type="text" placeholder="12345678900" value={form.cnh}
                    onChange={e => set('cnh', e.target.value.replace(/\D/g,'').slice(0,11))}
                    className={inputClass} />
                </Field>
                <Field label="UF da CNH" emoji="📍">
                  <select value={form.ufCnh} onChange={e => set('ufCnh', e.target.value)} className={inputClass}>
                    <option value="">Selecione o estado</option>
                    {UFS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                  </select>
                </Field>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-[#0d2160] tracking-widest uppercase">
                    🚗 Categorias da CNH
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIAS_CNH.map(cat => (
                      <button key={cat} type="button" onClick={() => toggleCategoria(cat)}
                        className={`
                          px-4 py-2 rounded-xl text-sm font-black border-2 transition-all
                          ${form.categoriaCnh.includes(cat)
                            ? 'bg-[#0d2160] border-[#0d2160] text-white scale-105'
                            : 'bg-white border-slate-200 text-slate-400 hover:border-blue-300'}
                        `}
                      >{cat}</button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* STEP 2 — Endereço */}
            {step === 2 && (
              <>
                <StepHeader emoji="📍" title="Endereço" subtitle="Onde você mora" />
                <Field label="CEP" emoji="📬">
                  <div className="relative">
                    <input type="text" placeholder="00000-000"
                      value={form.endereco.cep}
                      onChange={e => {
                        const v = formatCEP(e.target.value)
                        setEnd('cep', v)
                        if (v.replace(/\D/g,'').length === 8) buscarCEP(v)
                      }}
                      className={inputClass + ' pl-11'} />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">📬</span>
                    {cepLoading && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-blue-400 font-semibold">Buscando...</span>}
                  </div>
                </Field>
                <Field label="Logradouro" emoji="🏠">
                  <input type="text" placeholder="Rua das Flores" value={form.endereco.logradouro}
                    onChange={e => setEnd('logradouro', e.target.value)} className={inputClass} />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Número" emoji="🔢">
                    <input type="text" placeholder="123" value={form.endereco.numero}
                      onChange={e => setEnd('numero', e.target.value)} className={inputClass} />
                  </Field>
                  <Field label="Estado" emoji="📍">
                    <select value={form.endereco.estado} onChange={e => setEnd('estado', e.target.value)} className={inputClass}>
                      <option value="">UF</option>
                      {UFS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                    </select>
                  </Field>
                </div>
                <Field label="Bairro" emoji="🏘️">
                  <input type="text" placeholder="Centro" value={form.endereco.bairro}
                    onChange={e => setEnd('bairro', e.target.value)} className={inputClass} />
                </Field>
                <Field label="Cidade" emoji="🏙️">
                  <input type="text" placeholder="São Paulo" value={form.endereco.cidade}
                    onChange={e => setEnd('cidade', e.target.value)} className={inputClass} />
                </Field>
              </>
            )}

            {/* STEP 3 — Acesso */}
            {step === 3 && (
              <>
                <StepHeader emoji="🔑" title="Dados de acesso" subtitle="E-mail e senha para entrar" />
                <Field label="E-mail" emoji="✉️">
                  <input type="email" placeholder="seu@email.com" value={form.email}
                    onChange={e => set('email', e.target.value)} className={inputClass} />
                </Field>
                <Field label="Senha" emoji="🔒">
                  <input type="password" placeholder="mínimo 6 caracteres" value={form.senha}
                    onChange={e => set('senha', e.target.value)} className={inputClass} />
                </Field>
                <Field label="Confirmar senha" emoji="🔒">
                  <input type="password" placeholder="repita a senha" value={form.confirmarSenha}
                    onChange={e => set('confirmarSenha', e.target.value)} className={inputClass} />
                </Field>
              </>
            )}

            {/* Erro */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl px-4 py-3 flex items-center gap-3">
                <span className="text-red-500 shrink-0">⚠️</span>
                <p className="text-red-600 text-sm font-semibold">{error}</p>
              </div>
            )}

            {/* Botões navegação */}
            <div className="flex gap-3 mt-1">
              {step > 0 && (
                <button type="button" onClick={() => { setError(''); setStep(s => s - 1) }}
                  className="flex-1 py-3.5 border-2 border-slate-200 text-slate-500 font-black rounded-2xl hover:bg-slate-50 active:scale-[0.98] transition-all text-sm">
                  ← Voltar
                </button>
              )}

              {step < STEPS.length - 1 ? (
                <button type="button" onClick={nextStep}
                  className={`flex-1 relative py-3.5 bg-gradient-to-r ${currentStep.color} ${currentStep.text} font-black rounded-2xl shadow-lg ${currentStep.shadow} active:scale-[0.98] transition-all text-sm overflow-hidden`}>
                  <Wave />
                  <span className="relative z-10">Continuar →</span>
                </button>
              ) : (
                <button type="button" onClick={handleSubmit} disabled={loading}
                  className="flex-1 relative py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-200 active:scale-[0.98] transition-all text-sm overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed">
                  <Wave />
                  <span className="relative z-10">{loading ? 'Criando conta...' : '✅ Criar conta'}</span>
                </button>
              )}
            </div>

            {/* Já tem conta */}
            {step === 0 && (
              <p className="text-center text-sm text-slate-400 mt-1">
                Já tem conta?{' '}
                <Link href="/login" className="text-blue-500 font-bold hover:text-blue-700 transition-colors">
                  Entrar
                </Link>
              </p>
            )}
          </div>
        </div>

        {/* Progresso textual */}
        <p className="text-center text-xs text-slate-400 mt-4">
          Passo {step + 1} de {STEPS.length} — {currentStep.emoji} {currentStep.label}
        </p>
      </section>

      {/* Footer */}
      <Footer />

    </main>
  )
}

// Componentes auxiliares
const inputClass = `
  w-full px-4 py-3.5
  border-2 border-slate-200
  rounded-xl text-slate-800 text-sm
  placeholder:text-slate-300
  focus:outline-none focus:border-blue-500
  transition-colors bg-white
`

function Field({ label, emoji, children }: { label: string; emoji: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-black text-[#0d2160] tracking-widest uppercase">
        {emoji} {label}
      </label>
      {children}
    </div>
  )
}

function StepHeader({ emoji, title, subtitle }: { emoji: string; title: string; subtitle: string }) {
  return (
    <div className="mb-1">
      <h2 className="text-[#0d2160] font-black text-2xl">{emoji} {title}</h2>
      <p className="text-slate-400 text-sm mt-0.5">{subtitle}</p>
    </div>
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