'use client'

// ===================================================================
// HEADER DO USUÁRIO AUTENTICADO - MEDIQUO ARAUJO
// ===================================================================

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import Image from 'next/image'
import Link from 'next/link'
import { LogOut, User, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import ProfileDialog from '@/components/profile-dialog'

interface UserHeaderProps {
  className?: string
}

export function UserHeader({ className = '' }: UserHeaderProps) {
  const router = useRouter()
  const { userData, signupData, email, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)

  // Tentar obter o nome do usuário de diferentes fontes
  const getUserName = () => {
    if (userData?.fullName) return userData.fullName
    if (email) return email.split('@')[0]
    return 'Usuário'
  }

  // Obter iniciais para o avatar
  const getUserInitials = () => {
    const name = getUserName()
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await logout()
      router.push('/')
    } catch (error) {
      console.error('Erro no logout:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 shadow-lg" style={{ backgroundColor: '#D63066' }}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-20 h-6">
              <Image 
                src="/logo-vero.svg" 
                alt="Vero" 
                fill
                className="object-contain brightness-0 invert"
                priority
              />
            </div>
            <span className="text-white text-2xl font-light">+</span>
            <div className="relative w-24 h-5">
              <Image 
                src="/logo-mediquo.svg" 
                alt="MediQuo" 
                fill
                className="object-contain brightness-0 invert"
                priority
              />
            </div>
          </Link>

          {/* User Menu Section */}
          <div className="flex items-center gap-4">
            <div className="text-sm text-white">
              Olá!
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 hover:bg-white/10 text-white">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-white text-pink-600 text-xs font-semibold">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">
                    {getUserName()}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <div className="px-3 py-2">
            <p className="text-sm font-medium text-gray-900">
              {getUserName()}
            </p>
            <p className="text-xs text-gray-500">
              {email}
            </p>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setIsProfileDialogOpen(true)}
            className="cursor-pointer"
          >
            <User className="h-4 w-4 mr-2" />
            Meu Perfil
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer text-red-600 focus:text-red-600"
            disabled={isLoggingOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {isLoggingOut ? 'Saindo...' : 'Sair'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Profile Dialog */}
      <ProfileDialog
        open={isProfileDialogOpen}
        onOpenChange={setIsProfileDialogOpen}
      />
    </header>
  )
}
