'use client'

// ===================================================================
// DIALOG DE PEDIDOS DO USUÁRIO - MEDIQUO ARAUJO
// ===================================================================

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Eye, Calendar, Package, CreditCard, Loader2 } from 'lucide-react'
import { listTransactions } from '@/services/checkout-service'
import { Transaction } from '@/types/checkout-types'

interface OrdersDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Helper function para mapear o status da API para display
const getStatusDisplay = (status: string) => {
  switch (status) {
    case 'APPROVED':
      return { label: 'Aprovado', value: 'completed' }
    case 'PENDING':
      return { label: 'Pendente', value: 'pending' }
    case 'FAILED':
      return { label: 'Cancelado', value: 'cancelled' }
    case 'EXPIRED':
      return { label: 'Cancelado', value: 'cancelled' }
    default:
      return { label: 'Em Andamento', value: 'in_progress' }
  }
}

// Helper function para mapear o tipo de pagamento
const getPaymentTypeDisplay = (paymentType: string) => {
  switch (paymentType) {
    case 'CARD_CREDIT':
      return 'Cartão de Crédito'
    case 'CARD_DEBIT':
      return 'Cartão de Débito'
    case 'PIX':
      return 'PIX'
    default:
      return 'Pagamento'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    case 'in_progress':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export default function OrdersDialog({ open, onOpenChange }: OrdersDialogProps) {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [orders, setOrders] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Carregar pedidos quando o dialog abrir
  useEffect(() => {
    if (open) {
      loadOrders()
    }
  }, [open])

  const loadOrders = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await listTransactions({
        page: 0,
        size: 20,
        sort: ['createdAt,desc']
      })

      if (response.success && response.data) {
        setOrders(response.data.content)
      } else {
        setError(response.error || 'Erro ao carregar pedidos')
      }
    } catch (err) {
      setError('Erro ao carregar pedidos')
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDetails = (orderId: string) => {
    setSelectedOrder(selectedOrder === orderId ? null : orderId)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Meus Pedidos
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 mx-auto animate-spin text-blue-600 mb-4" />
              <p className="text-gray-500">Carregando pedidos...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-red-400 mb-4" />
              <p className="text-red-500 mb-2">Erro ao carregar pedidos</p>
              <p className="text-gray-500 text-sm">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={loadOrders}
                className="mt-4"
              >
                Tentar novamente
              </Button>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Você ainda não possui pedidos.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => {
                const statusDisplay = getStatusDisplay(order.checkoutStatusType)
                const orderId = `PED-${String(order.id).padStart(3, '0')}`

                return (
                  <Card key={order.id} className="border border-gray-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-lg font-semibold">
                            {orderId}
                          </CardTitle>
                          <Badge className={getStatusColor(statusDisplay.value)}>
                            {statusDisplay.label}
                          </Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(order.id.toString())}
                          className="flex items-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          {selectedOrder === order.id.toString() ? 'Ocultar' : 'Ver Detalhes'}
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDateTime(order.createdAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <CreditCard className="h-4 w-4" />
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(order.amount)}
                          </span>
                        </div>
                      </div>

                      {selectedOrder === order.id.toString() && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-3">
                            Detalhes do Pedido:
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Data/Hora da Contratação:</span>
                              <span className="font-medium">{formatDateTime(order.createdAt)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Tipo de Pagamento:</span>
                              <span className="font-medium">{getPaymentTypeDisplay(order.paymentType)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Parcelas:</span>
                              <span className="font-medium">{order.installments}x</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Data do Pagamento:</span>
                              <span className="font-medium">
                                {order.paymentAt ? formatDate(order.paymentAt) : 'Pendente'}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Consulta de Telemedicina:</span>
                              <span className="font-medium">{formatCurrency(order.amount)}</span>
                            </div>
                          </div>
                          <div className="border-t pt-2 mt-2">
                            <div className="flex justify-between items-center font-semibold">
                              <span>Total:</span>
                              <span>{formatCurrency(order.amount)}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
