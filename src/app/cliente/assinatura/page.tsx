'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserHeader } from '@/components/user-header'
import { useAuth } from '@/contexts/auth-context'
import { getCurrentUserRecurrency, cancelCurrentUserRecurrency, getPaymentsByExternalPaymentId } from '@/services/payment-service'
import { PaymentRecurrencyResponseDTO, PaymentDTO } from '@/types/payment-types'
import gtag from '@/utils/analytics'
import { logger } from '@/utils/logger'
import { toast } from '@/hooks/use-toast'
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Copy,
  CreditCard,
  Key,
  Loader2,
  XCircle
} from 'lucide-react'

export default function AssinaturaPage() {
  const router = useRouter()
  const { signupData, isAuthenticated } = useAuth()

  const [subscription, setSubscription] = useState<PaymentRecurrencyResponseDTO | null>(null)
  const [paymentHistory, setPaymentHistory] = useState<PaymentDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)
  const [error, setError] = useState('')
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [licenseCode, setLicenseCode] = useState('') // Será preenchido com o código real
  const [isPendingPayment, setIsPendingPayment] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    // Verificar autenticação
    if (!isAuthenticated) {
      router.push('/cliente/login')
      return
    }

    loadSubscriptionData()
  }, [isAuthenticated, router])

  const loadSubscriptionData = async () => {
    setIsLoading(true)
    setError('')

    try {
      // Buscar dados da assinatura recorrente
      logger.authFlow('Loading subscription data')
      const result = await getCurrentUserRecurrency()

      if (result.success && result.data) {
        // Verificar o status da assinatura
        const subscriptionStatus = result.data.status

        logger.authFlow('Subscription data loaded', {
          status: subscriptionStatus,
          hasLicense: !!result.data.licenceCode,
          nextCharge: result.data.nextChargeDate,
          externalPaymentId: result.data.externalPaymentId,
          couponCode: result.data.couponCode
        })

        // Se o status for PAID, exibir assinatura normalmente
        if (subscriptionStatus === 'PAID') {
          setSubscription(result.data)
          setLicenseCode(result.data.licenceCode)
          setIsPendingPayment(false)
        }
        // Se o status for PENDING, mostrar mensagem de pendência
        else if (subscriptionStatus === 'PENDING') {
          logger.authFlow('Payment is pending approval')
          setIsPendingPayment(true)
          setSubscription(result.data) // Guardar dados para exibir informações parciais
        }
        // Para qualquer outro status, redirecionar para checkout
        else {
          logger.authFlow('Invalid subscription status, redirecting to checkout', { status: subscriptionStatus })
          router.push('/cliente/checkout')
          return
        }

        // Carregar histórico de pagamentos usando o externalPaymentId
        if (result.data.externalPaymentId) {
          try {
            const paymentsResult = await getPaymentsByExternalPaymentId(result.data.externalPaymentId)
            if (paymentsResult.success && paymentsResult.data) {
              // Ordenar por data de pagamento decrescente
              const sortedPayments = [...paymentsResult.data].sort((a, b) => {
                const dateA = new Date(a.paymentAt || a.createdAt).getTime()
                const dateB = new Date(b.paymentAt || b.createdAt).getTime()
                return dateB - dateA // Ordem decrescente
              })
              setPaymentHistory(sortedPayments)
            }
          } catch (historyError) {
            logger.error('Error loading payment history', historyError)
            // Não é crítico, apenas log
          }
        }
      } else {
        // Usuário não tem assinatura ativa - redirecionar para checkout
        logger.authFlow('No active subscription found, redirecting to checkout')
        router.push('/cliente/checkout')
        return
      }
    } catch (error) {
      logger.error('Error loading subscription data', error)
      
      // Se o erro for 404 (não tem assinatura), redirecionar para checkout
      if (error instanceof Error && (error.message.includes('404') || error.message.includes('Nenhuma assinatura'))) {
        logger.authFlow('No subscription found (404), redirecting to checkout')
        router.push('/cliente/checkout')
        return
      }
      
      // Outros erros, mostrar mensagem
      setError('Erro ao carregar informações da assinatura. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    setIsCancelling(true)
    setError('')
    
    try {
      logger.authFlow('User initiated subscription cancellation')
      
      const result = await cancelCurrentUserRecurrency()
      
      if (result.success) {
        // Sucesso no cancelamento
        logger.authFlow('Subscription cancelled successfully')
        
        toast({
          title: "Assinatura cancelada",
          description: result.message || "Sua assinatura foi cancelada com sucesso. Você ainda tem acesso até o final do período pago.",
        })
        
        // Aguardar um momento para o usuário ver a mensagem e redirecionar
        setTimeout(() => {
          router.push('/cliente/checkout')
        }, 3000)
      } else {
        // Erro no cancelamento
        logger.authError('Failed to cancel subscription', { error: result.error })
        
        setError(result.error || 'Erro ao cancelar assinatura')
        toast({
          variant: "destructive",
          title: "Erro ao cancelar",
          description: result.error || "Não foi possível cancelar sua assinatura. Tente novamente.",
        })
      }
    } catch (error) {
      logger.error('Error cancelling subscription', error)
      
      const errorMessage = error instanceof Error ? error.message : 'Erro inesperado ao cancelar assinatura'
      setError(errorMessage)
      
      toast({
        variant: "destructive",
        title: "Erro",
        description: errorMessage,
      })
    } finally {
      setIsCancelling(false)
      setShowCancelConfirm(false)
    }
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Data não disponível'

    try {
      let date: Date

      // Se é formato YYYY-MM-DD (date only), parsear manualmente para evitar problemas de timezone
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const [year, month, day] = dateString.split('-').map(Number)
        date = new Date(year, month - 1, day) // month é 0-indexed no JavaScript
      } else {
        // Para outros formatos (com timestamp/timezone), usar construtor normal
        date = new Date(dateString)
      }

      // Verificar se a data é válida
      if (isNaN(date.getTime())) {
        return 'Data inválida'
      }

      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    } catch (error) {
      logger.error('Error formatting date', { dateString, error })
      return 'Data inválida'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  const getStatusBadge = () => {
    // Se tem assinatura, está ativa
    if (subscription) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-4 w-4 mr-1" />
          Ativa
        </span>
      )
    }
    return null
  }

  const copyLicenseCode = () => {
    navigator.clipboard.writeText(licenseCode)
    // Poderia adicionar um toast aqui para confirmar a cópia
    
    // GA4: Quando o usuário copia o código, possivelmente vai acessar o MediQuo
    // Evento será disparado quando a integração real estiver ativa
    // gtag.beginConsultation('online')
  }
  
  // Função para quando o usuário clica para acessar o MediQuo
  // Será usada quando a integração estiver completa
  const handleAccessMediquo = () => {
    // GA4: Evento de início de consulta
    gtag.beginConsultation('online')

    // Aqui viria a lógica de redirecionamento ou abertura do app MediQuo
    // Por enquanto apenas logamos o evento
  }

  const handleRefreshStatus = async () => {
    setIsRefreshing(true)
    try {
      await loadSubscriptionData()
      toast({
        title: "Status atualizado",
        description: "Verificamos o status do seu pagamento.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: "Não foi possível verificar o status. Tente novamente.",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserHeader />
        <div className="flex items-center justify-center min-h-[60vh] pt-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />

      <main className="max-w-4xl mx-auto px-4 py-8 pt-28">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Minha Assinatura</h1>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Mensagem para pagamento pendente */}
        {isPendingPayment && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-800">
                <AlertCircle className="h-5 w-5 mr-2" />
                Pagamento em Processamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-700 mb-4">
                Seu pagamento está sendo processado pela operadora do cartão.
                Este processo pode levar alguns minutos. Você será notificado assim que for aprovado.
              </p>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded-lg border border-yellow-200">
                  <p className="text-sm font-medium text-gray-700">O que fazer agora?</p>
                  <ul className="mt-2 space-y-1 text-sm text-gray-600">
                    <li>• Aguarde a aprovação do pagamento</li>
                    <li>• Verifique seu e-mail para atualizações</li>
                    <li>• Você pode fechar esta página e voltar mais tarde</li>
                  </ul>
                </div>
                <Button
                  onClick={handleRefreshStatus}
                  disabled={isRefreshing}
                  variant="outline"
                  className="w-full"
                >
                  {isRefreshing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Verificando status...
                    </>
                  ) : (
                    <>Verificar status novamente</>
                  )}
                </Button>

                {/* Botão de cancelar assinatura */}
                <div className="pt-2 border-t border-yellow-200">
                  {!showCancelConfirm ? (
                    <Button
                      variant="outline"
                      onClick={() => setShowCancelConfirm(true)}
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                      Cancelar Assinatura
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <Alert className="border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                          Tem certeza que deseja cancelar esta assinatura? O pagamento pendente será cancelado.
                        </AlertDescription>
                      </Alert>
                      <div className="flex gap-2">
                        <Button
                          variant="destructive"
                          onClick={handleCancelSubscription}
                          disabled={isCancelling}
                          className="flex-1"
                        >
                          {isCancelling ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Cancelando...
                            </>
                          ) : (
                            'Confirmar'
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowCancelConfirm(false)}
                          disabled={isCancelling}
                          className="flex-1"
                        >
                          Voltar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {subscription && !isPendingPayment && (
          <>
            {/* Status da Assinatura */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Status da Assinatura</span>
                  {getStatusBadge()}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Plano</p>
                    <p className="font-semibold">Plano Mensal MediQuo</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Valor mensal</p>
                    <p className="font-semibold text-lg">
                      {formatCurrency(subscription.amount)}
                      {subscription.couponCode && (
                        <span className="text-sm text-green-600 ml-2">
                          (Cupom: {subscription.couponCode})
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Data de início</p>
                    <p className="font-semibold flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      {formatDate(subscription.startDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Próxima cobrança</p>
                    <p className="font-semibold flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      {subscription ? formatDate(subscription.nextChargeDate) : '-'}
                    </p>
                  </div>
                </div>

                {/* Campo de Licença/Código de Acesso */}
                <div className="pt-4 border-t">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Key className="h-5 w-5 mr-2 text-blue-600" />
                          <p className="text-sm font-semibold text-blue-900">Código de Acesso ao App</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <code className="text-lg font-mono font-bold text-blue-900 bg-white px-3 py-2 rounded border border-blue-300">
                            {licenseCode}
                          </code>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={copyLicenseCode}
                            className="hover:bg-blue-100"
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copiar
                          </Button>
                        </div>
                        <p className="text-xs text-blue-700 mt-2">
                          Use este código para acessar o aplicativo MediQuo no seu celular
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">Forma de pagamento</p>
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-gray-500" />
                    <span className="font-medium">
                      Cartão de Crédito (Recorrência Mensal)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Histórico de Pagamentos */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Histórico de Pagamentos</CardTitle>
              </CardHeader>
              <CardContent>
                {paymentHistory.length > 0 ? (
                  <div className="space-y-3">
                    {paymentHistory.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between py-3 border-b last:border-0">
                        <div className="flex items-center space-x-3">
                          {payment.checkoutStatusType === 'APPROVED' ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : payment.checkoutStatusType === 'FAILED' ? (
                            <XCircle className="h-5 w-5 text-red-600" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-yellow-600" />
                          )}
                          <div>
                            <p className="font-medium">{formatDate(payment.paymentAt || payment.createdAt)}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span>
                                {payment.checkoutStatusType === 'APPROVED' ? 'Aprovado' : 
                                 payment.checkoutStatusType === 'FAILED' ? 'Falhou' : 
                                 payment.checkoutStatusType === 'PENDING' ? 'Pendente' : 
                                 payment.checkoutStatusType === 'RECURRING' ? 'Recorrente' :
                                 payment.checkoutStatusType}
                              </span>
                              {payment.paymentType && (
                                <>
                                  <span className="text-gray-400">•</span>
                                  <span>
                                    {payment.paymentType === 'CARD_CREDIT' ? 'Cartão de Crédito' :
                                     payment.paymentType === 'CARD_CREDIT_RECURRENCY' ? 'Recorrência' :
                                     payment.paymentType === 'CARD_DEBIT' ? 'Cartão de Débito' :
                                     payment.paymentType === 'PIX' ? 'PIX' :
                                     payment.paymentType}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(payment.amount)}</p>
                          {payment.nfeCode && (
                            <p className="text-xs text-gray-500">
                              NFe: {payment.nfeCode}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">Nenhum pagamento registrado ainda.</p>
                )}
              </CardContent>
            </Card>

            {/* Ações */}
            {subscription && (
              <Card>
                <CardHeader>
                  <CardTitle>Gerenciar Assinatura</CardTitle>
                </CardHeader>
                <CardContent>
                  {!showCancelConfirm ? (
                    <Button
                      variant="destructive"
                      onClick={() => setShowCancelConfirm(true)}
                      className="w-full md:w-auto"
                    >
                      Cancelar Assinatura
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Tem certeza que deseja cancelar sua assinatura? Você perderá acesso aos benefícios ao final do período já pago.
                        </AlertDescription>
                      </Alert>
                      <div className="flex gap-3">
                        <Button
                          variant="destructive"
                          onClick={handleCancelSubscription}
                          disabled={isCancelling}
                        >
                          {isCancelling ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Cancelando...
                            </>
                          ) : (
                            'Confirmar Cancelamento'
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowCancelConfirm(false)}
                          disabled={isCancelling}
                        >
                          Manter Assinatura
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  )
}

