'use client'

// filepath: /Users/gbmiranda/Desenvolvimento/projetos/workspacePersonal/mediquo-araujo/app/cliente/complete-profile/page.tsx
// ===================================================================
// PÁGINA DE COMPLETAR PERFIL - MEDIQUO ARAUJO
// ===================================================================

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { MaskedInput } from '@/components/ui/masked-input'
import { logger } from '@/utils/logger'
import { toast } from '@/hooks/use-toast'
import {
  VALIDATION_ERRORS,
  BUSINESS_ERRORS,
  NETWORK_ERRORS,
  formatErrorForToast,
  formatSuccessForToast
} from '@/config/error-messages'

// ===================================================================
// COMPONENTE PRINCIPAL
// ===================================================================

export default function CompleteProfile() {
  const router = useRouter()
  const {
    signupData,
    token,
    email,
    isAuthenticated,
    isLoading: authLoading,
    completeProfile
  } = useAuth()

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    documentNumber: '',
    birthDate: '',
    gender: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // ===================================================================
  // FUNÇÕES AUXILIARES
  // ===================================================================

  // ===================================================================
  // EFEITOS
  // ===================================================================

  // Verificar autenticação e redirecionamento
  useEffect(() => {
    if (!authLoading) {
      // Se não autenticado, redirecionar para login
      if (!isAuthenticated || !token) {
        logger.authFlow('User not authenticated, redirecting to login')
        router.push('/cliente/login')
        return
      }

      // Se não precisa completar perfil, ir para atendimento
      if (signupData && !signupData.needMoreInformation) {
        logger.authFlow('Profile already complete, redirecting to atendimento')
        router.push('/cliente/atendimento')
        return
      }

      // Se não tem dados de signup, algo deu errado
      if (!signupData) {
        logger.authError('No signup data found, redirecting to login', { signupData })
        router.push('/cliente/login')
        return
      }
    }
  }, [authLoading, isAuthenticated, token, signupData, router])

  // ===================================================================
  // HANDLERS
  // ===================================================================

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleGenderChange = (value: string) => {
    setFormData({
      ...formData,
      gender: value,
    })
  }

  const validateForm = () => {
    const errors: string[] = []

    // Validar nome completo
    if (!formData.fullName.trim()) {
      errors.push("Nome completo é obrigatório")
    } else if (formData.fullName.trim().split(' ').length < 2) {
      errors.push("Digite nome e sobrenome completos")
    }

    // Validar telefone
    const phoneNumbers = formData.phone.replace(/\D/g, '')
    if (!phoneNumbers) {
      errors.push("Telefone é obrigatório")
    } else if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
      errors.push("Telefone deve ter 10 ou 11 dígitos")
    }

    // Validar CPF
    const cpfNumbers = formData.documentNumber.replace(/\D/g, '')
    if (!cpfNumbers) {
      errors.push("CPF é obrigatório")
    } else if (cpfNumbers.length !== 11) {
      errors.push("CPF deve ter 11 dígitos")
    } else if (!/^(?!(.)\1{10})[0-9]{11}$/.test(cpfNumbers)) {
      errors.push("CPF inválido")
    }

    // Validar data de nascimento
    if (!formData.birthDate) {
      errors.push("Data de nascimento é obrigatória")
    } else {
      const birthDate = new Date(formData.birthDate)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      if (birthDate > today) {
        errors.push("Data de nascimento não pode ser futura")
      } else if (age > 150) {
        errors.push("Data de nascimento parece incorreta")
      } else if (age < 16) {
        errors.push("Usuário deve ter pelo menos 16 anos")
      }
    }

    // Validar gênero
    if (!formData.gender) {
      errors.push("Gênero é obrigatório")
    }

    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validar formulário antes de enviar
    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      toast(formatErrorForToast({
        title: "Dados incompletos ou inválidos",
        description: validationErrors[0],
        actionable: "Corrija os dados destacados e tente novamente."
      }))
      return
    }

    setIsSubmitting(true)

    try {
      logger.authFlow('Starting profile completion', {
        email,
        fullName: formData.fullName
      })

      // Converter data de DD/MM/YYYY para YYYY-MM-DD para API
      const convertDateForAPI = (dateStr: string) => {
        if (!dateStr) return undefined
        const cleaned = dateStr.replace(/\D/g, '')
        if (cleaned.length !== 8) return undefined
        const day = cleaned.slice(0, 2)
        const month = cleaned.slice(2, 4)
        const year = cleaned.slice(4, 8)
        return `${year}-${month}-${day}`
      }

      const result = await completeProfile({
        fullName: formData.fullName,
        phone: formData.phone.replace(/\D/g, ''), // Remove formatting
        documentNumber: formData.documentNumber.replace(/\D/g, ''), // Remove formatting
        birthDate: convertDateForAPI(formData.birthDate),
        gender: formData.gender as 'MASCULINO' | 'FEMININO' | undefined,
      })

      if (result.success) {
        setSuccess(true)

        // Redirecionar para atendimento após sucesso
        const redirectPath = '/cliente/atendimento'

        logger.authFlow('Profile completion successful, redirecting', {
          redirectPath
        })

        // Aguardar um pouco para mostrar sucesso, depois redirecionar
        setTimeout(() => {
          router.push(redirectPath)
        }, 1500)
      } else {
        const errorMsg = result.error || ""
        if (errorMsg.includes('já existe') || errorMsg.includes('duplicate')) {
          toast(formatErrorForToast({
            title: "CPF já cadastrado",
            description: "Este CPF já está registrado no sistema.",
            actionable: "Verifique o CPF ou entre em contato com o suporte se este é seu número."
          }))
        } else if (errorMsg.includes('inválid') || errorMsg.includes('formato')) {
          toast(formatErrorForToast(VALIDATION_ERRORS.INVALID_DATA))
        } else {
          toast(formatErrorForToast(BUSINESS_ERRORS.PROFILE_UPDATE_FAILED))
        }
        logger.authError('Profile completion failed', result.error)
      }
    } catch (error) {
      logger.error('Profile completion error', error)
      toast(formatErrorForToast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor para completar o perfil.",
        actionable: "Verifique sua conexão com a internet e tente novamente."
      }))
      logger.authError('Unexpected error in profile completion', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // ===================================================================
  // RENDER
  // ===================================================================

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-2 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-center">
            <Link href="/" className="flex items-center">
              <img src="/logo.svg" alt="MediQuo" className="h-8" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <Card>
            <CardHeader>

              <CardTitle className="text-2xl font-bold">Complete seu perfil</CardTitle>
              <CardDescription>
                Preencha os dados abaixo para finalizar seu cadastro
              </CardDescription>
            </CardHeader>

            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-4 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Perfil completado com sucesso! Redirecionando...
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome completo</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Digite seu nome completo"
                    required
                    disabled={isSubmitting || success}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <MaskedInput
                    id="phone"
                    name="phone"
                    mask="(99) 99999-9999"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                    required
                    disabled={isSubmitting || success}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="documentNumber">CPF</Label>
                  <MaskedInput
                    id="documentNumber"
                    name="documentNumber"
                    mask="999.999.999-99"
                    value={formData.documentNumber}
                    onChange={handleChange}
                    placeholder="000.000.000-00"
                    required
                    disabled={isSubmitting || success}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  <MaskedInput
                    id="birthDate"
                    name="birthDate"
                    mask="99/99/9999"
                    value={formData.birthDate}
                    onChange={handleChange}
                    placeholder="DD/MM/AAAA"
                    required
                    disabled={isSubmitting || success}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gênero</Label>
                  <Select value={formData.gender} onValueChange={handleGenderChange} disabled={isSubmitting || success}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione seu gênero" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MASCULINO">Masculino</SelectItem>
                      <SelectItem value="FEMININO">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-pink-600 hover:bg-pink-700"
                  disabled={isSubmitting || success}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Redirecionando...
                    </>
                  ) : (
                    'Finalizar Cadastro'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-600">
            © 2024 Vero + MediQuo. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
