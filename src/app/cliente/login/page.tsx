'use client'

// filepath: /Users/gbmiranda/Desenvolvimento/projetos/workspacePersonal/mediquo-araujo/app/cliente/login/page.tsx
// ===================================================================
// PÁGINA DE LOGIN - MEDIQUO ARAUJO
// ===================================================================

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { SiteHeader } from '@/components/site-header'
import { Loader2, Mail, ArrowLeft } from 'lucide-react'
import { logger } from '@/utils/logger'
import { toast } from '@/hooks/use-toast'
import gtag from '@/utils/analytics'
import {
  VALIDATION_ERRORS,
  AUTH_ERRORS,
  NETWORK_ERRORS,
  formatErrorForToast,
  formatSuccessForToast
} from '@/config/error-messages'

// ===================================================================
// TIPOS
// ===================================================================

type LoginStep = 'email' | 'otp'

// ===================================================================
// COMPONENTE PRINCIPAL
// ===================================================================

export default function LoginPage() {
  const router = useRouter()
  const { requestOTP, validateOTP, signupData, token, email, isLoading, logout } = useAuth()

  const [step, setStep] = useState<LoginStep>('email')
  const [emailInput, setEmailInput] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ===================================================================
  // EFEITOS
  // ===================================================================

  // Verificar se já está autenticado
  useEffect(() => {
    if (token && signupData) {
      logger.authFlow('User already authenticated, redirecting')

      // Redirecionar baseado em needMoreInformation
      if (signupData.needMoreInformation) {
        router.push('/cliente/complete-profile')
      } else {
        // Sempre redirecionar para assinatura após login
        // A página de assinatura verificará se tem assinatura ativa
        router.push('/cliente/assinatura')
      }
    }
  }, [token, signupData, router])

  // Se já temos email e dados de signup, ir direto para OTP
  useEffect(() => {
    if (email && signupData && !token) {
      setEmailInput(email)
      setStep('otp')
      logger.authFlow('Resuming OTP validation', { email })
    }
  }, [email, signupData, token])

  // ===================================================================
  // HANDLERS
  // ===================================================================

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      logger.authFlow('Submitting email for OTP', { email: emailInput })

      const result = await requestOTP(emailInput)

      if (result.success) {
        setStep('otp')
        logger.authFlow('OTP requested successfully, moving to validation step')
        
        // GA4: Evento de geração de lead
        gtag.generateLead(149)
      } else {
        const errorMsg = result.error || 'Erro ao solicitar código de verificação'
        if (errorMsg.includes('Email não encontrado')) {
          toast(formatErrorForToast({
            title: "Email não encontrado",
            description: "O email informado não está cadastrado no sistema.",
            actionable: "Verifique o endereço digitado e tente novamente."
          }))
        } else if (errorMsg.includes('Muitas tentativas')) {
          toast(formatErrorForToast({
            title: "Muitas tentativas",
            description: "Muitas tentativas em pouco tempo.",
            actionable: "Aguarde alguns minutos antes de tentar novamente."
          }))
        } else {
          toast(formatErrorForToast({
            title: "Erro ao solicitar código",
            description: "Não foi possível enviar o código de verificação.",
            actionable: "Verifique o email e tente novamente."
          }))
        }
        logger.authError('OTP request failed', result.error)
      }
    } catch (error) {
      toast(formatErrorForToast(NETWORK_ERRORS.CONNECTION_FAILED))
      logger.authError('Unexpected error in email submit', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (otpCode.length !== 6) {
      toast(formatErrorForToast(VALIDATION_ERRORS.OTP_INCOMPLETE))
      return
    }

    setIsSubmitting(true)

    try {
      logger.authFlow('Submitting OTP for validation', { email: emailInput })

      const result = await validateOTP(emailInput, otpCode)

      if (result.success) {
        logger.authFlow('OTP validation successful, checking subscription')
        
        // GA4: Set User ID e evento de login/signup
        if (signupData?.id) {
          gtag.setUserId(signupData.id)
          
          // Se precisa completar perfil, é signup; caso contrário, é login
          if (signupData.needMoreInformation) {
            gtag.signUp('otp')
          } else {
            gtag.login('otp')
          }
        }

        // Verificar se precisa completar perfil
        if (signupData?.needMoreInformation) {
          router.push('/cliente/complete-profile')
        } else {
          // Sempre redirecionar para assinatura após login
          // A página de assinatura verificará se tem assinatura ativa
          router.push('/cliente/assinatura')
        }
      } else {
        const errorMsg = result.error || 'Código de verificação inválido'
        if (errorMsg.includes('inválido') || errorMsg.includes('incorreto')) {
          toast(formatErrorForToast(VALIDATION_ERRORS.INVALID_OTP))
        } else if (errorMsg.includes('expirado') || errorMsg.includes('expired')) {
          toast(formatErrorForToast({
            title: "Código expirado",
            description: "O código de verificação expirou.",
            actionable: "Solicite um novo código para continuar."
          }))
        } else if (errorMsg.includes('Muitas tentativas')) {
          toast(formatErrorForToast({
            title: "Muitas tentativas",
            description: "Muitas tentativas com código incorreto.",
            actionable: "Aguarde alguns minutos antes de tentar novamente."
          }))
        } else {
          toast(formatErrorForToast({
            title: "Erro na validação",
            description: errorMsg,
            actionable: "Verifique o código e tente novamente."
          }))
        }
        logger.authError('OTP validation failed', result.error)
      }
    } catch (error) {
      toast(formatErrorForToast(NETWORK_ERRORS.CONNECTION_FAILED))
      logger.authError('Unexpected error in OTP submit', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBackToEmail = () => {
    setStep('email')
    setOtpCode('')
    logger.authFlow('User went back to email step')
  }

  const handleBackToHome = async () => {
    setIsSubmitting(true)

    try {
      logger.authFlow('User going back to home, clearing all session data')

      // Limpar todos os dados de sessão
      await logout()

      // Redirecionar para home
      router.push('/')
    } catch (error) {
      logger.authError('Error clearing session data', error)
      // Mesmo com erro, redirecionar para home
      router.push('/')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendOTP = async () => {
    setIsSubmitting(true)

    try {
      logger.authFlow('Resending OTP', { email: emailInput })

      const result = await requestOTP(emailInput)

      if (result.success) {
        setOtpCode('')
        toast(formatSuccessForToast({
          title: "Código reenviado",
          description: "Um novo código foi enviado para seu email.",
        }))
        logger.authFlow('OTP resent successfully')
      } else {
        const errorMsg = result.error || 'Erro ao reenviar código de verificação'
        if (errorMsg.includes('Muitas tentativas')) {
          toast(formatErrorForToast({
            title: "Muitas tentativas de reenvio",
            description: "Muitas tentativas de reenvio em pouco tempo.",
            actionable: "Aguarde alguns minutos antes de solicitar novamente."
          }))
        } else {
          toast(formatErrorForToast({
            title: "Erro ao reenviar código",
            description: "Não foi possível reenviar o código de verificação.",
            actionable: "Tente novamente em alguns instantes."
          }))
        }
        logger.authError('OTP resend failed', result.error)
      }
    } catch (error) {
      toast(formatErrorForToast(NETWORK_ERRORS.CONNECTION_FAILED))
      logger.authError('Unexpected error in OTP resend', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // ===================================================================
  // RENDER
  // ===================================================================

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <>
      <SiteHeader />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 pt-20">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {step === 'email' ? 'Entrar' : 'Verificar Código'}
            </CardTitle>
            <CardDescription>
              {step === 'email'
                ? 'Digite seu email para receber o código de acesso'
                : `Enviamos um código de 6 dígitos para ${emailInput}.`
              }
            </CardDescription>

             <CardDescription>

               {step === 'email'
                ? ''
                : `Verifique sua caixa de SPAM.`
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {step === 'email' ? (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="w-full"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-pink-600 hover:bg-pink-700"
                  disabled={isSubmitting || !emailInput.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Receber Código
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBackToHome}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para Home
                </Button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Código de Verificação</Label>
                  <div className="flex justify-center">
                    <InputOTP
                      value={otpCode}
                      onChange={(value) => setOtpCode(value)}
                      maxLength={6}
                      disabled={isSubmitting}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-pink-600 hover:bg-pink-700"
                  disabled={isSubmitting || otpCode.length !== 6}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    'Entrar'
                  )}
                </Button>

                <div className="flex flex-col space-y-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleResendOTP}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    Reenviar código
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleBackToEmail}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para Email
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleBackToHome}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para Home
                  </Button>
                </div>
              </form>
            )}
          </CardContent>

          <CardFooter className="text-center">
            <p className="text-sm text-gray-600">
              Problemas para entrar? Entre em contato conosco.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
    </>
  )
}
