'use client'

// ===================================================================
// HEADER DO USUÁRIO AUTENTICADO - MEDIQUO ARAUJO
// ===================================================================

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { LogOut, User, ChevronDown, ShoppingBag } from 'lucide-react'
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
import OrdersDialog from './orders-dialog'

interface UserHeaderProps {
  className?: string
}

export function UserHeader({ className = '' }: UserHeaderProps) {
  const router = useRouter()
  const { userData, signupData, email, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
  const [isOrdersDialogOpen, setIsOrdersDialogOpen] = useState(false)

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
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="text-sm text-gray-600">
        Olá!
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-100">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-600 text-white text-xs">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-gray-900">
              {getUserName()}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
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

          <DropdownMenuItem
            onClick={() => setIsOrdersDialogOpen(true)}
            className="cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Meus Pedidos
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

      {/* Profile Dialog */}
      <ProfileDialog
        open={isProfileDialogOpen}
        onOpenChange={setIsProfileDialogOpen}
      />

      {/* Orders Dialog */}
      <OrdersDialog
        open={isOrdersDialogOpen}
        onOpenChange={setIsOrdersDialogOpen}
      />
    </div>
  )
}
