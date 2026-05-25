'use client'

import { useState, useEffect } from 'react'

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
  endereco?: {
    logradouro?: string
    numero?: string
    complemento?: string
    bairro?: string
    cidade?: string
    estado?: string
    cep?: string
  }
  access?: boolean
  createdAt?: string
  updatedAt?: string
}

type EditingUser = Partial<User> & { _id?: string }

export default function Usuarios() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingUser, setEditingUser] = useState<EditingUser | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    let isMounted = true

    ;(async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_URL}/api/users`)
        const data = await response.json()
        if (isMounted) {
          setUsers(data)
        }
      } catch (error) {
        console.error('Erro ao buscar usuários:', error)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    })()

    return () => {
      isMounted = false
    }
  }, [API_URL])

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja deletar este usuário?')) return

    try {
      const response = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setUsers(users.filter(u => u._id !== id))
        setDeletingId(null)
      }
    } catch (error) {
      console.error('Erro ao deletar usuário:', error)
    }
  }

  function startEdit(user: User) {
    setEditingUser({ ...user })
    setShowEditModal(true)
  }

  async function handleSaveEdit() {
    if (!editingUser?._id) return

    try {
      const response = await fetch(`${API_URL}/api/users/${editingUser._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUsers(users.map(u => u._id === updatedUser._id ? updatedUser : u))
        setShowEditModal(false)
        setEditingUser(null)
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
    }
  }

  function handleEditChange(field: string, value: string | string[] | boolean) {
    setEditingUser(prev => {
      if (!prev) return prev
      
      // Se é um campo de endereço
      if (field.startsWith('endereco.')) {
        const subfield = field.replace('endereco.', '')
        return {
          ...prev,
          endereco: {
            ...prev.endereco,
            [subfield]: value,
          },
        }
      }
      
      // Campo simples
      return {
        ...prev,
        [field]: value,
      }
    })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-10 shadow-xl text-center">
        <p className="text-slate-500">Carregando usuários...</p>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-10 shadow-xl text-center">
        <p className="text-slate-500">Nenhum usuário encontrado</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {users.map((user) => (
        <div
          key={user._id}
          className="bg-white rounded-3xl shadow-xl border border-slate-100"
        >
          {/* Cabeçalho - Sempre visível */}
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                {user.nome.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#0d2160] truncate">{user.nome}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </div>

            <div className="flex gap-2 ml-4">
              <button
                onClick={() =>
                  setExpandedId(expandedId === user._id ? null : user._id)
                }
                className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full text-sm transition-colors cursor-pointer"
              >
                {expandedId === user._id ? 'Ver menos' : 'Ver mais'}
              </button>
            </div>
          </div>

          {/* Detalhes - Visível quando expandido */}
          {expandedId === user._id && (
            <div className="px-6 pb-6 border-t border-slate-100 pt-6">
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <Info label="Nome" value={user.nome} />
                <Info label="Email" value={user.email} />
                <Info 
                  label="WhatsApp" 
                  value={user.whatsapp} 
                  onClick={() => {
                    if (user.whatsapp) {
                      window.open(`https://wa.me/${user.whatsapp.replace(/\D/g, '')}`, '_blank')
                    }
                  }}
                />
                <Info label="CPF" value={user.cpf} />
                <Info
                  label="Data de Nascimento"
                  value={
                    user.dataNascimento
                      ? new Date(user.dataNascimento).toLocaleDateString('pt-BR')
                      : '-'
                  }
                />
                <Info label="CNH" value={user.cnh} />
                <Info
                  label="Categoria CNH"
                  value={user.categoriaCnh?.join(', ') || '-'}
                />
                <Info label="UF CNH" value={user.ufCnh} />
                <Info label="Logradouro" value={user.endereco?.logradouro} />
                <Info label="Número" value={user.endereco?.numero} />
                <Info label="Complemento" value={user.endereco?.complemento} />
                <Info label="Bairro" value={user.endereco?.bairro} />
                <Info label="Cidade" value={user.endereco?.cidade} />
                <Info label="Estado" value={user.endereco?.estado} />
                <Info label="CEP" value={user.endereco?.cep} />
                <Info
                  label="Acesso Administrativo"
                  value={user.access ? 'Sim' : 'Não'}
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => startEdit(user)}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-2xl transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-2xl transition-colors"
                >
                  Deletar
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Modal de Edição */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-[#0d2160] mb-6">Editar Usuário</h2>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {/* Dados Pessoais */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  value={editingUser.nome || ''}
                  onChange={(e) => handleEditChange('nome', e.target.value)}
                  className="w-full text-gray-700 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={editingUser.email || ''}
                  onChange={(e) => handleEditChange('email', e.target.value)}
                  className="w-full text-gray-700 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  WhatsApp
                </label>
                <input
                  type="text"
                  value={editingUser.whatsapp || ''}
                  onChange={(e) => handleEditChange('whatsapp', e.target.value)}
                  className="w-full text-gray-700 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  CPF
                </label>
                <input
                  type="text"
                  value={editingUser.cpf || ''}
                  onChange={(e) => handleEditChange('cpf', e.target.value)}
                  className="w-full text-gray-700 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  CNH
                </label>
                <input
                  type="text"
                  value={editingUser.cnh || ''}
                  onChange={(e) => handleEditChange('cnh', e.target.value)}
                  className="w-full text-gray-700 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Categoria CNH
                </label>
                <input
                  type="text"
                  placeholder="Ex: A, B, D, E (separadas por vírgula)"
                  value={editingUser.categoriaCnh?.join(', ') || ''}
                  onChange={(e) => handleEditChange('categoriaCnh', e.target.value.split(',').map(c => c.trim()))}
                  className="w-full text-gray-700 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  UF CNH
                </label>
                <input
                  type="text"
                  maxLength={2}
                  value={editingUser.ufCnh || ''}
                  onChange={(e) => handleEditChange('ufCnh', e.target.value.toUpperCase())}
                  className="w-full text-gray-700 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  value={editingUser.dataNascimento ? new Date(editingUser.dataNascimento).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleEditChange('dataNascimento', e.target.value)}
                  className="w-full text-gray-700 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Endereço */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Logradouro
                </label>
                <input
                  type="text"
                  value={editingUser.endereco?.logradouro || ''}
                  onChange={(e) => handleEditChange('endereco.logradouro', e.target.value)}
                  className="w-full text-gray-700 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Número
                </label>
                <input
                  type="text"
                  value={editingUser.endereco?.numero || ''}
                  onChange={(e) => handleEditChange('endereco.numero', e.target.value)}
                  className="w-full text-gray-700 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Complemento
                </label>
                <input
                  type="text"
                  value={editingUser.endereco?.complemento || ''}
                  onChange={(e) => handleEditChange('endereco.complemento', e.target.value)}
                  className="w-full text-gray-700 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Bairro
                </label>
                <input
                  type="text"
                  value={editingUser.endereco?.bairro || ''}
                  onChange={(e) => handleEditChange('endereco.bairro', e.target.value)}
                  className="w-full text-gray-700 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Cidade
                </label>
                <input
                  type="text"
                  value={editingUser.endereco?.cidade || ''}
                  onChange={(e) => handleEditChange('endereco.cidade', e.target.value)}
                  className="w-full text-gray-700 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Estado
                </label>
                <input
                  type="text"
                  maxLength={2}
                  value={editingUser.endereco?.estado || ''}
                  onChange={(e) => handleEditChange('endereco.estado', e.target.value.toUpperCase())}
                  className="w-full text-gray-700 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  CEP
                </label>
                <input
                  type="text"
                  value={editingUser.endereco?.cep || ''}
                  onChange={(e) => handleEditChange('endereco.cep', e.target.value)}
                  className="w-full text-gray-700 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Acesso Administrativo
                </label>
                <select
                  value={editingUser.access ? 'sim' : 'nao'}
                  onChange={(e) => handleEditChange('access', e.target.value === 'sim')}
                  className="w-full text-gray-700 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="nao">Não</option>
                  <option value="sim">Sim</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-2xl transition-colors"
              >
                Salvar
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingUser(null)
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 rounded-2xl transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
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
