'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState, startTransition } from 'react'

export default function Header() {
  const router = useRouter()

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

  function handleLogout() {
    localStorage.removeItem('user')
    setIsLogged(false) // força UI atualizar
    router.push('/login')
 }

  return (
    <>
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
                  onClick={() => router.push('/')}
                  className="hover:text-yellow-400 transition cursor-pointer"
                >
                  Pagina Principal
                </button>

                <button
                  onClick={() => router.push('/sobrenos')}
                  className="hover:text-yellow-400 transition cursor-pointer"
                >
                  Sobre Nós
                </button>

                <button
                  onClick={() => router.push('/contato')}
                  className="hover:text-yellow-400 transition cursor-pointer"
                >
                  Contato
                </button>

                <span className="ml-2 font-semibold text-yellow-400">
                  Bem vindo, {userName.split(' ')[0]}
                </span>

                <button
                    onClick={handleLogout}
                    className="px-3 py-1 border border-yellow-400 text-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-[#0d2160] transition cursor-pointer"
                    >
                    Sair
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push('/register')}
                  className="px-4 py-2 bg-yellow-400 text-[#0d2160] font-bold rounded-xl hover:bg-yellow-300 transition text-gray-800"
                >
                  Criar Conta
                </button>

                <button
                  onClick={() => router.push('/login')}
                  className="px-4 py-2 border border-white text-white font-bold rounded-xl hover:bg-white hover:text-[#0d2160] transition text-gray-800"
                >
                  Fazer Login
                </button>
              </>
            )}

          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex md:hidden flex-col gap-1 cursor-pointer"
          >
            <span className="w-6 h-0.5 bg-white" />
            <span className="w-6 h-0.5 bg-white" />
            <span className="w-6 h-0.5 bg-white" />
          </button>

        </div>
      </header>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed md:hidden inset-0 bg-black/40 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Menu Mobile */}
      <div className={`fixed md:hidden top-0 right-0 h-full w-72 bg-white shadow-xl z-50 transform transition ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        <div className="bg-[#0d2160] text-white px-6 py-6">
          {isLogged ? (
            <>
              <p className="text-sm opacity-80">Bem-vindo,</p>
              <p className="font-bold text-lg">{userName}</p>
            </>
          ) : (
            <p className="font-bold text-lg">Menu</p>
          )}
        </div>

        <div className="flex flex-col">

          {isLogged ? (
            <>
              <button
                onClick={() => { router.push('/'); setMenuOpen(false) }}
                className="px-6 py-4 border-b hover:bg-slate-100 text-left text-gray-700 cursor-pointer"
              >
                Pagina Principal
              </button>

              <button
                onClick={() => { router.push('/sobrenos'); setMenuOpen(false) }}
                className="px-6 py-4 border-b hover:bg-slate-100 text-left text-gray-700 cursor-pointer"
              >
                Sobre Nós
              </button>

              <button
                onClick={() => { router.push('/contato'); setMenuOpen(false) }}
                className="px-6 py-4 border-b hover:bg-slate-100 text-left text-gray-700 cursor-pointer"
              >
                Contato
              </button>

              <button
                onClick={() => {
                    handleLogout()
                    setMenuOpen(false)
                }}
                className="px-6 py-4 text-left text-red-500 border-b hover:bg-red-50 cursor-pointer"
                >
                Sair
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => { router.push('/register'); setMenuOpen(false) }}
                className="px-6 py-4 border-b hover:bg-slate-100 text-gray-700 cursor-pointer"
              >
                Criar Conta
              </button>

              <button
                onClick={() => { router.push('/login'); setMenuOpen(false) }}
                className="px-6 py-4 border-b hover:bg-slate-100 text-gray-700 cursor-pointer"
              >
                Fazer Login
              </button>
            </>
          )}

        </div>

      </div>
    </>
  )
}