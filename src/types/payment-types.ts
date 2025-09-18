// ===================================================================
// TIPOS DO SERVIÇO DE PAGAMENTO - MEDIQUO VERO
// ===================================================================

// ===================================================================
// TIPOS DE RECORRÊNCIA/ASSINATURA
// ===================================================================

/**
 * Resposta do endpoint /v2/payment/recurrency/current-user
 * Retorna informações sobre a assinatura recorrente do usuário atual
 */
export interface PaymentRecurrencyResponseDTO {
  id?: number // ID da recorrência
  externalPaymentId?: string // ID externo para buscar histórico de pagamentos
  amount: number
  licenceCode: string
  startDate: string // formato: "YYYY-MM-DD"
  nextChargeDate: string // formato: "YYYY-MM-DD"
  couponCode?: string // Código do cupom aplicado (se houver)
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'CANCELLED' // Status da assinatura
}

/**
 * Resposta padrão para chamadas de API de recorrência
 */
export interface RecurrencyApiResponse {
  success: boolean
  data?: PaymentRecurrencyResponseDTO
  error?: string
}

/**
 * Status da assinatura para uso interno
 */
export interface SubscriptionStatus {
  hasActiveSubscription: boolean
  subscription?: PaymentRecurrencyResponseDTO
  needsCheckout: boolean
}

// ===================================================================
// TIPOS DE PAGAMENTOS
// ===================================================================

/**
 * DTO de Pagamento retornado pela API
 * Usado pelo endpoint /v2/payment/by-payment-id/{externalPaymentId}
 */
export interface PaymentDTO {
  id: number
  createdAt: string
  updatedAt: string
  active: boolean
  paymentAt?: string
  installments?: number
  checkoutStatusType: 'PENDING' | 'APPROVED' | 'FAILED' | 'EXPIRED' | 'RECURRING'
  paymentType: 'CARD_CREDIT' | 'CARD_CREDIT_RECURRENCY' | 'CARD_DEBIT' | 'PIX'
  amount: number
  unitaryPricing: number
  patientId?: number
  validAt?: string
  nfeCode?: string
  qrcodeUrl?: string
  pixCode?: string
  licenceCode?: string
  startDate?: string
  nextChargeDate?: string
  mediquoClient?: string
  couponCode?: string
}

/**
 * Resposta da API para listagem de pagamentos
 */
export interface PaymentsApiResponse {
  success: boolean
  data?: PaymentDTO[]
  error?: string
}

// ===================================================================
// TIPOS DE CANCELAMENTO DE RECORRÊNCIA
// ===================================================================

/**
 * Resposta do endpoint /v2/payment/recurrency/cancel
 * Retorna confirmação do cancelamento da assinatura recorrente
 */
export interface CancelRecurrencyResponse {
  success: boolean
  message?: string
  error?: string
}