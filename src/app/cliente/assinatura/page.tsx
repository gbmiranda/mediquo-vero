'use client'

import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation' // Comentado temporariamente
import { useAuth } from '@/contexts/auth-context'
import {
  getSubscriptionDetails,
  getPaymentHistory,
  cancelSubscription,
  SubscriptionDetails,
  PaymentHistoryItem
} from '@/services/subscription-service'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { UserHeader } from '@/components/user-header'
import {
  Calendar,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Loader2,
  XCircle
} from 'lucide-react'
import { logger } from '@/utils/logger'

export default function AssinaturaPage() {
  // const router = useRouter() // Comentado temporariamente
  const { signupData, isAuthenticated } = useAuth()

  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null)
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)
  const [error, setError] = useState('')
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  useEffect(() => {
    // TEMPORÁRIO: Comentado para permitir acesso sem autenticação
    // if (!isAuthenticated || !signupData?.subscriptionId) {
    //   router.push('/cliente/login')
    //   return
    // }

    // loadSubscriptionData()

    // TEMPORÁRIO: Dados mockados para teste
    setSubscription({
      id: 'sub_mock_123',
      status: 'active',
      planName: 'Plano Mensal MediQuo',
      amount: 15.90,
      startDate: '2024-01-15',
      nextBillingDate: '2024-02-15',
      paymentMethod: {
        brand: 'Visa',
        lastFourDigits: '4242'
      }
    } as SubscriptionDetails)

    setPaymentHistory([
      {
        id: 'pay_1',
        date: '2024-01-15',
        amount: 15.90,
        status: 'paid' as const,
        invoiceUrl: '#'
      },
      {
        id: 'pay_2',
        date: '2023-12-15',
        amount: 15.90,
        status: 'paid' as const,
        invoiceUrl: '#'
      }
    ])

    setIsLoading(false)
  }, [isAuthenticated, signupData])

  const loadSubscriptionData = async () => {
    // if (!signupData?.subscriptionId) return
    return // Temporário

    // setIsLoading(true)
    // setError('')

    // try {
    //   // Carregar detalhes da assinatura
    //   const subResult = await getSubscriptionDetails('temp-id') // signupData.subscriptionId
    //   if (subResult.success && subResult.data) {
    //     setSubscription(subResult.data)

    //     // Carregar histórico de pagamentos
    //     const historyResult = await getPaymentHistory('temp-id') // signupData.subscriptionId
    //     if (historyResult.success && historyResult.data) {
    //       setPaymentHistory(historyResult.data)
    //     }
    //   } else {
    //     setError('Erro ao carregar dados da assinatura')
    //   }
    // } catch (error) {
    //   logger.error('Error loading subscription data', error)
    //   setError('Erro ao carregar informações da assinatura')
    // } finally {
    //   setIsLoading(false)
    // }
  }

  const handleCancelSubscription = async () => {
    // if (!signupData?.subscriptionId) return
    return // Temporário

    setIsCancelling(true)
    setError('')

    try {
      const result = await cancelSubscription('temp-id') // signupData.subscriptionId
      if (result.success) {
        // Recarregar dados após cancelamento
        await loadSubscriptionData()
        setShowCancelConfirm(false)
      } else {
        setError(result.error || 'Erro ao cancelar assinatura')
      }
    } catch (error) {
      logger.error('Error cancelling subscription', error)
      setError('Erro ao processar cancelamento')
    } finally {
      setIsCancelling(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-4 w-4 mr-1" />
            Ativa
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <XCircle className="h-4 w-4 mr-1" />
            Cancelada
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        )
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

        {subscription && (
          <>
            {/* Status da Assinatura */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Status da Assinatura</span>
                  {getStatusBadge(subscription.status)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Plano</p>
                    <p className="font-semibold">{subscription.planName || 'Plano Mensal MediQuo'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Valor mensal</p>
                    <p className="font-semibold text-lg">{formatCurrency(subscription.amount)}</p>
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
                      {subscription.status === 'active' ? formatDate(subscription.nextBillingDate) : '-'}
                    </p>
                  </div>
                </div>

                {subscription.paymentMethod && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-2">Forma de pagamento</p>
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-gray-500" />
                      <span className="font-medium">
                        {subscription.paymentMethod.brand || 'Cartão'} terminado em {subscription.paymentMethod.lastFourDigits || '****'}
                      </span>
                    </div>
                  </div>
                )}
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
                          {payment.status === 'paid' ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : payment.status === 'failed' ? (
                            <XCircle className="h-5 w-5 text-red-600" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-yellow-600" />
                          )}
                          <div>
                            <p className="font-medium">{formatDate(payment.date)}</p>
                            <p className="text-sm text-gray-600">
                              {payment.status === 'paid' ? 'Pago' : payment.status === 'failed' ? 'Falhou' : 'Pendente'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(payment.amount)}</p>
                          {payment.invoiceUrl && (
                            <a
                              href={payment.invoiceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              Ver recibo
                            </a>
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
            {subscription.status === 'active' && (
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

