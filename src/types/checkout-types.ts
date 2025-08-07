// ===================================================================
// TIPOS DO SERVIÇO DE CHECKOUT - MEDIQUO ARAUJO
// ===================================================================

export interface CardPagarmeDTO {
  number: string
  exp_month: string
  exp_year: string
  cvv: string
  holder_name: string
  holder_document: string
}

export interface AddressPagarmeDTO {
  street: string
  number: string
  complement?: string
  city: string
  state: string
  zip_code: string
  country: string
}

export interface CardTransactionRequest {
  userId: string
  cardPagarmeDTO: CardPagarmeDTO
  addressPagarmeDTO: AddressPagarmeDTO
}

export interface CardTransactionApiResponse {
  id: string
  status: string
  amount: number
  currency: string
  payment_method: string
  created_at: string
  updated_at: string
  transaction_id?: string
  gateway_response?: any
}

export interface CardTransactionResponse {
  success: boolean
  data?: CardTransactionApiResponse
  error?: string
}

// ===================================================================
// TIPOS PARA LISTAGEM DE TRANSAÇÕES
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
