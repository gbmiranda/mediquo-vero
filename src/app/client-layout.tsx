'use client'

// ===================================================================
// LAYOUT CLIENT-SIDE - MEDIQUO ARAUJO
// ===================================================================

import '../styles/globals.css'
import { AuthProvider } from '@/contexts/auth-context'
import { Toaster } from '@/components/ui/toaster'
import SupportButton from '@/components/support-button'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      {children}
      <Toaster />
      <SupportButton />
    </AuthProvider>
  )
}
