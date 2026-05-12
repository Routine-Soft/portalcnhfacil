'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import WhatsappButton from '@/app/components/WhatsappButton'

const UFS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS',
  'MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC',
  'SP','SE','TO',
]

const CATEGORIAS_CNH = ['A','B','C','D','E','AB','AC','AD','AE']

type Endereco = {
  logradouro?: string
  numero?: string
  bairro?: string
  cidade?: string
  estado?: string
  cep?: string
}

type User = {
  _id: string
  nome: string
  email: string
  whatsapp?: string
  cpf?: string
  cnh?: string
  categoriaCnh?: string[]
  ufCnh?: string
  dataNascimento?: string
  endereco?: Endereco
}

type FormData = {
  nome: string
  whatsapp: string
  cpf: string
  cnh: string
  categoriaCnh: string[]
  ufCnh: string
  dataNascimento: string
  endereco: Endereco
}

type PasswordForm = {
  senhaAtual: string
  senhaNova: string
  confirmarSenha: string
}

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

export default function MinhaContaPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [cepLoading, setCepLoading] = useState(false)
  const [authStatus, setAuthStatus] = useState<'authorized' | 'unauthorized' | 'checking'>('checking')

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const [form, setForm] = useState<FormData>({
    nome: '', whatsapp: '', cpf: '', cnh: '',
    categoriaCnh: [], ufCnh: '', dataNascimento: '',
    endereco: { logradouro: '', numero: '', bairro: '', cidade: '', estado: '', cep: '' },
  })

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    senhaAtual: '', senhaNova: '', confirmarSenha: '',
  })

  // Verificar auth e carregar dados em um único effect
  useEffect(() => {
    async function initializePage() {
      try {
        const userStr = localStorage.getItem('user')
        if (!userStr) {
          setAuthStatus('unauthorized')
          setLoading(false)
          return
        }
        
        const userData = JSON.parse(userStr)
        if (userData.access !== true) {
          setAuthStatus('unauthorized')
          setLoading(false)
          return
        }

        // Autorizado, agora busca os dados
        setAuthStatus('authorized')
        
        const response = await fetch(`${API_URL}/api/users/${userData._id}`)
        const data: User = await response.json()

        setUser(data)
        setForm({
          nome: data.nome || '',
          whatsapp: data.whatsapp || '',
          cpf: data.cpf || '',
          cnh: data.cnh || '',
          categoriaCnh: data.categoriaCnh || [],
          ufCnh: data.ufCnh || '',
          dataNascimento: data.dataNascimento?.split('T')[0] || '',
          endereco: data.endereco || { logradouro: '', numero: '', bairro: '', cidade: '', estado: '', cep: '' },
        })
        setLoading(false)
      } catch (error) {
        console.error('Erro ao inicializar página:', error)
        setError('Erro ao carregar dados da conta')
        setLoading(false)
      }
    }

    initializePage()
  }, [API_URL])

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

  function validateForm() {
    setError('')
    if (!form.nome.trim()) return setError('Informe seu nome completo.')
    if (!form.whatsapp.trim()) return setError('Informe seu WhatsApp.')
    if (!form.cpf.trim()) return setError('Informe seu CPF.')
    if (!form.dataNascimento) return setError('Informe sua data de nascimento.')
    if (!form.cnh.trim()) return setError('Informe o número da CNH.')
    if (!form.ufCnh) return setError('Selecione a UF da CNH.')
    if (form.categoriaCnh.length === 0) return setError('Selecione ao menos uma categoria.')
    const e = form.endereco
    if (!e.cep || !e.logradouro || !e.numero || !e.bairro || !e.cidade || !e.estado)
      return setError('Preencha todos os campos do endereço.')
    return true
  }

  async function handleSave() {
    if (!validateForm()) return
    if (!user) return

    setSaving(true)
    setError('')
    setSuccess('')

    const payload = {
      nome: form.nome,
      whatsapp: form.whatsapp.replace(/\D/g,''),
      cpf: form.cpf,
      cnh: form.cnh,
      categoriaCnh: form.categoriaCnh,
      ufCnh: form.ufCnh,
      dataNascimento: form.dataNascimento,
      endereco: form.endereco,
    }

    try {
      const response = await fetch(`${API_URL}/api/users/${user._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Erro ao salvar alterações.')
        return
      }

      setSuccess('Dados atualizados com sucesso!')
      setEditing(false)
      setUser(data)
    } catch {
      setError('Não foi possível conectar ao servidor. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  async function handleChangePassword() {
    setError('')
    setSuccess('')

    if (!passwordForm.senhaAtual) return setError('Informe sua senha atual.')
    if (!passwordForm.senhaNova) return setError('Informe a nova senha.')
    if (passwordForm.senhaNova.length < 6) return setError('A nova senha deve ter no mínimo 6 caracteres.')
    if (passwordForm.senhaNova !== passwordForm.confirmarSenha) return setError('As senhas não coincidem.')

    setSaving(true)

    try {
      const response = await fetch(`${API_URL}/api/users/${user?._id}/password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senhaAtual: passwordForm.senhaAtual,
          senhaNova: passwordForm.senhaNova,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Erro ao alterar senha.')
        return
      }

      setSuccess('Senha alterada com sucesso!')
      setShowPasswordModal(false)
      setPasswordForm({ senhaAtual: '', senhaNova: '', confirmarSenha: '' })
    } catch {
      setError('Não foi possível conectar ao servidor. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!user) return

    setDeleting(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/api/users/${user._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Erro ao deletar conta.')
        setDeleting(false)
        return
      }

      localStorage.removeItem('user')
      router.push('/?conta_deletada=sucesso')
    } catch {
      setError('Não foi possível conectar ao servidor. Tente novamente.')
      setDeleting(false)
    }
  }

  if (authStatus === 'unauthorized') {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#eef2fb]">
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
              Faça login para acessar sua conta
            </p>
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-2xl transition-colors"
            >
              Ir para Login
            </button>
          </div>
        </div>
      </main>
    )
  }

  if (authStatus === 'checking' || loading) {
    return (
      <main className="min-h-screen bg-[#eef2fb] font-sans">
        <Header />
        <section className="px-6 py-10 text-center">
          <p className="text-slate-500">Carregando dados da conta...</p>
        </section>
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
            Minha Conta
          </h1>
          <p className="text-blue-200 text-sm mt-2">
            Visualize e edite seus dados
          </p>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="px-5 -mt-10 pb-16 relative z-10 max-w-2xl mx-auto">
        {/* Mensagens */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl px-4 py-3 flex items-center gap-3 mb-4">
            <span className="text-red-500 shrink-0">⚠️</span>
            <p className="text-red-600 text-sm font-semibold">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl px-4 py-3 flex items-center gap-3 mb-4">
            <span className="text-green-500 shrink-0">✓</span>
            <p className="text-green-600 text-sm font-semibold">{success}</p>
          </div>
        )}

        {/* Card principal */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-4">
          <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-blue-600" />

          <div className="px-7 py-8 flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-[#0d2160] font-black text-2xl">👤 Dados Pessoais</h2>
                <p className="text-slate-400 text-sm mt-1">Informações da sua conta</p>
              </div>
              {!editing && (
                <button
                  onClick={() => { setEditing(true); setError(''); setSuccess('') }}
                  className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full text-sm transition-colors"
                >
                  ✏️ Editar
                </button>
              )}
            </div>

            {/* Formulário */}
            <div className="flex flex-col gap-5">
              {/* Email (somente leitura) */}
              <Field label="E-mail" emoji="✉️">
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className={inputClass + ' bg-slate-50 opacity-60'}
                />
                <p className="text-xs text-slate-400 mt-1">E-mail não pode ser alterado</p>
              </Field>

              {/* Nome */}
              <Field label="Nome completo" emoji="👤">
                <input
                  type="text"
                  placeholder="João Silva"
                  value={form.nome}
                  onChange={e => set('nome', e.target.value)}
                  disabled={!editing}
                  className={inputClass + (editing ? '' : ' bg-slate-50')}
                />
              </Field>

              {/* WhatsApp e CPF */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="WhatsApp" emoji="📱">
                  <input
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={form.whatsapp}
                    onChange={e => set('whatsapp', formatWhatsapp(e.target.value))}
                    disabled={!editing}
                    className={inputClass + (editing ? '' : ' bg-slate-50')}
                  />
                </Field>
                <Field label="CPF" emoji="🪪">
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={form.cpf}
                    onChange={e => set('cpf', formatCPF(e.target.value))}
                    disabled={!editing}
                    className={inputClass + (editing ? '' : ' bg-slate-50')}
                  />
                </Field>
              </div>

              {/* Data de nascimento */}
              <Field label="Data de nascimento" emoji="🎂">
                <input
                  type="date"
                  value={form.dataNascimento}
                  onChange={e => set('dataNascimento', e.target.value)}
                  disabled={!editing}
                  className={inputClass + (editing ? '' : ' bg-slate-50')}
                />
              </Field>
            </div>

            {/* Divisor */}
            <div className="border-t border-slate-100 pt-5 mt-3" />

            {/* Seção CNH */}
            <div>
              <h3 className="text-[#0d2160] font-black text-lg mb-4">🪪 Dados da CNH</h3>
              <div className="flex flex-col gap-5">
                <Field label="Número da CNH" emoji="🪪">
                  <input
                    type="text"
                    placeholder="12345678900"
                    value={form.cnh}
                    onChange={e => set('cnh', e.target.value.replace(/\D/g,'').slice(0,11))}
                    disabled={!editing}
                    className={inputClass + (editing ? '' : ' bg-slate-50')}
                  />
                </Field>

                <Field label="UF da CNH" emoji="📍">
                  <select
                    value={form.ufCnh}
                    onChange={e => set('ufCnh', e.target.value)}
                    disabled={!editing}
                    className={inputClass + (editing ? '' : ' bg-slate-50')}
                  >
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
                      <button
                        key={cat}
                        type="button"
                        onClick={() => editing && toggleCategoria(cat)}
                        disabled={!editing}
                        className={`
                          px-4 py-2 rounded-xl text-sm font-black border-2 transition-all
                          ${form.categoriaCnh.includes(cat)
                            ? 'bg-[#0d2160] border-[#0d2160] text-white scale-105'
                            : 'bg-white border-slate-200 text-slate-400'}
                          ${editing ? 'hover:border-blue-300 cursor-pointer' : 'opacity-60 cursor-not-allowed'}
                        `}
                      >{cat}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Divisor */}
            <div className="border-t border-slate-100 pt-5 mt-3" />

            {/* Seção Endereço */}
            <div>
              <h3 className="text-[#0d2160] font-black text-lg mb-4">📍 Endereço</h3>
              <div className="flex flex-col gap-5">
                <Field label="CEP" emoji="📬">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="00000-000"
                      value={form.endereco.cep}
                      onChange={e => {
                        const v = formatCEP(e.target.value)
                        setEnd('cep', v)
                        if (editing && v.replace(/\D/g,'').length === 8) buscarCEP(v)
                      }}
                      disabled={!editing}
                      className={inputClass + ' pl-11' + (editing ? '' : ' bg-slate-50')}
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">📬</span>
                    {cepLoading && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-blue-400 font-semibold">Buscando...</span>}
                  </div>
                </Field>

                <Field label="Logradouro" emoji="🏠">
                  <input
                    type="text"
                    placeholder="Rua das Flores"
                    value={form.endereco.logradouro}
                    onChange={e => setEnd('logradouro', e.target.value)}
                    disabled={!editing}
                    className={inputClass + (editing ? '' : ' bg-slate-50')}
                  />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Número" emoji="🔢">
                    <input
                      type="text"
                      placeholder="123"
                      value={form.endereco.numero}
                      onChange={e => setEnd('numero', e.target.value)}
                      disabled={!editing}
                      className={inputClass + (editing ? '' : ' bg-slate-50')}
                    />
                  </Field>
                  <Field label="Estado" emoji="📍">
                    <select
                      value={form.endereco.estado}
                      onChange={e => setEnd('estado', e.target.value)}
                      disabled={!editing}
                      className={inputClass + (editing ? '' : ' bg-slate-50')}
                    >
                      <option value="">UF</option>
                      {UFS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                    </select>
                  </Field>
                </div>

                <Field label="Bairro" emoji="🏘️">
                  <input
                    type="text"
                    placeholder="Centro"
                    value={form.endereco.bairro}
                    onChange={e => setEnd('bairro', e.target.value)}
                    disabled={!editing}
                    className={inputClass + (editing ? '' : ' bg-slate-50')}
                  />
                </Field>

                <Field label="Cidade" emoji="🏙️">
                  <input
                    type="text"
                    placeholder="São Paulo"
                    value={form.endereco.cidade}
                    onChange={e => setEnd('cidade', e.target.value)}
                    disabled={!editing}
                    className={inputClass + (editing ? '' : ' bg-slate-50')}
                  />
                </Field>
              </div>
            </div>

            {/* Botões de ação */}
            {editing && (
              <div className="flex gap-3 mt-3">
                <button
                  type="button"
                  onClick={() => { setEditing(false); setError(''); setSuccess('') }}
                  className="flex-1 py-3.5 border-2 border-slate-200 text-slate-500 font-black rounded-2xl hover:bg-slate-50 active:scale-[0.98] transition-all text-sm"
                >
                  ✕ Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-200 active:scale-[0.98] transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? '💾 Salvando...' : '✅ Salvar alterações'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Card Segurança */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-4">
          <div className="h-2 w-full bg-gradient-to-r from-amber-500 to-orange-600" />
          <div className="px-7 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[#0d2160] font-black text-2xl">🔒 Segurança</h2>
                <p className="text-slate-400 text-sm mt-1">Altere sua senha</p>
              </div>
              <button
                onClick={() => { setShowPasswordModal(true); setError('') }}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-full text-sm transition-colors"
              >
                🔑 Trocar senha
              </button>
            </div>
          </div>
        </div>

        {/* Card Deletar */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="h-2 w-full bg-gradient-to-r from-red-500 to-red-600" />
          <div className="px-7 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[#0d2160] font-black text-2xl">⚠️ Zona de Risco</h2>
                <p className="text-slate-400 text-sm mt-1">Deletar sua conta permanentemente</p>
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full text-sm transition-colors"
              >
                🗑️ Deletar conta
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Trocar Senha */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full">
            <div className="h-2 w-full bg-gradient-to-r from-amber-500 to-orange-600" />
            <div className="px-7 py-8">
              <h2 className="text-[#0d2160] font-black text-2xl mb-2">🔑 Trocar Senha</h2>
              <p className="text-slate-400 text-sm mb-5">Digite sua senha atual e a nova senha</p>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl px-4 py-3 flex items-center gap-3 mb-4">
                  <span className="text-red-500">⚠️</span>
                  <p className="text-red-600 text-sm font-semibold">{error}</p>
                </div>
              )}

              <div className="flex flex-col gap-4 mb-6">
                <Field label="Senha atual" emoji="🔒">
                  <input
                    type="password"
                    placeholder="Digite sua senha"
                    value={passwordForm.senhaAtual}
                    onChange={e => setPasswordForm(f => ({ ...f, senhaAtual: e.target.value }))}
                    className={inputClass}
                  />
                </Field>
                <Field label="Nova senha" emoji="🔒">
                  <input
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={passwordForm.senhaNova}
                    onChange={e => setPasswordForm(f => ({ ...f, senhaNova: e.target.value }))}
                    className={inputClass}
                  />
                </Field>
                <Field label="Confirmar senha" emoji="🔒">
                  <input
                    type="password"
                    placeholder="Repita a nova senha"
                    value={passwordForm.confirmarSenha}
                    onChange={e => setPasswordForm(f => ({ ...f, confirmarSenha: e.target.value }))}
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false)
                    setPasswordForm({ senhaAtual: '', senhaNova: '', confirmarSenha: '' })
                    setError('')
                  }}
                  className="flex-1 py-3 border-2 border-slate-200 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleChangePassword}
                  disabled={saving}
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? 'Alterando...' : 'Alterar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Deletar Conta */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full">
            <div className="h-2 w-full bg-gradient-to-r from-red-500 to-red-600" />
            <div className="px-7 py-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-3xl">
                  ⚠️
                </div>
              </div>
              <h2 className="text-[#0d2160] font-black text-2xl text-center mb-2">Deletar Conta?</h2>
              <p className="text-slate-600 text-center text-sm mb-6 leading-relaxed">
                Essa ação é irreversível. Todos seus dados serão permanentemente deletados.
              </p>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl px-4 py-3 flex items-center gap-3 mb-4">
                  <span className="text-red-500">⚠️</span>
                  <p className="text-red-600 text-sm font-semibold">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 border-2 border-slate-200 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {deleting ? 'Deletando...' : 'Sim, deletar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  )
}

const inputClass = `
  w-full px-4 py-3.5
  border-2 border-slate-200
  rounded-xl text-slate-800 text-sm
  placeholder:text-slate-300
  focus:outline-none focus:border-blue-500
  transition-colors
  disabled:cursor-not-allowed disabled:opacity-60
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
