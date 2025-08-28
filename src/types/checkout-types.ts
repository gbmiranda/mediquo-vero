// ===================================================================
// TIPOS DO SERVIÇO DE CHECKOUT - MEDIQUO ARAUJO (V2 API)
// ===================================================================

// ===================================================================
// NOVOS TIPOS PARA V2 API (/v2/payment/card-transaction)
// ===================================================================

export interface PagarmeAddressRequest {
  id?: string
  line_1: string
  line_2?: string
  zip_code: string
  city: string
  state: string
  country: string
  neighborhood: string
}

export interface PagarmeCardRequest {
  number: string
  holder_name: string
  holder_document?: string
  exp_month: number
  exp_year: number
  cvv: string
  billing_address_id?: string
}

export interface PaymentCardTransactionRequestDTO {
  id?: number
  createdAt?: string
  updatedAt?: string
  active?: boolean
  paymentAt?: string
  installments?: number
  checkoutStatusType?: 'PENDING' | 'APPROVED' | 'FAILED' | 'EXPIRED' | 'RECURRING'
  paymentType: 'CARD_CREDIT' | 'CARD_CREDIT_RECURRENCY' | 'CARD_DEBIT' | 'PIX'
  amount: number
  unitaryPricing: number
  patientId?: number
  validAt?: string
  nfeCode?: string
  qrcodeUrl?: string
  pixCode?: string
  pagarmeAddressRequest: PagarmeAddressRequest
  pagarmeCardRequest: PagarmeCardRequest
}

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
}

export interface CardTransactionResponse {
  success: boolean
  data?: PaymentDTO
  error?: string
}

// ===================================================================
// TIPOS PARA LISTAGEM DE TRANSAÇÕES (mantidos inalterados)
// ===================================================================

export interface SortCriteria {
  direction: string
  nullHandling: string
  ascending: boolean
  property: string
  ignoreCase: boolean
}

export interface Pageable {
  unpaged: boolean
  offset: number
  sort: SortCriteria[]
  paged: boolean
  pageSize: number
  pageNumber: number
}

export interface Transaction {
  id: number
  createdAt: string
  updatedAt: string
  active: boolean
  paymentAt: string
  installments: number
  checkoutStatusType: 'PENDING' | 'APPROVED' | 'FAILED' | 'EXPIRED'
  paymentType: 'CARD_CREDIT' | 'CARD_DEBIT' | 'PIX'
  amount: number
  unitaryPricing: number
  patientId: number
  validAt: string
}

export interface TransactionListResponse {
  totalPages: number
  totalElements: number
  numberOfElements: number
  first: boolean
  last: boolean
  size: number
  content: Transaction[]
  number: number
  sort: SortCriteria[]
  pageable: Pageable
  empty: boolean
}

export interface ListTransactionsParams {
  page?: number
  size?: number
  sort?: string[]
}

export interface ListTransactionsResponse {
  success: boolean
  data?: TransactionListResponse
  error?: string
}