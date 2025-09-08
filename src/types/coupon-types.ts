// ===================================================================
// TIPOS DO SERVIÇO DE CUPONS - MEDIQUO ARAUJO
// ===================================================================

// Sort configuration
export interface SortConfig {
  direction: string
  nullHandling: string
  ascending: boolean
  property: string
  ignoreCase: boolean
}

// Pageable configuration
export interface PageableConfig {
  paged: boolean
  pageSize: number
  pageNumber: number
  unpaged: boolean
  offset: number
  sort: SortConfig[]
}

// Coupon data structure
export interface Coupon {
  id: number
  createdAt: string
  updatedAt: string
  active: boolean
  patientId: number
  checkoutId: number
  validUntil: string
  usedAt: string | null
  code: string
}

// Paginated response for coupons
export interface CouponsPageResponse {
  totalPages: number
  totalElements: number
  pageable: PageableConfig
  numberOfElements: number
  first: boolean
  last: boolean
  size: number
  content: Coupon[]
  number: number
  sort: SortConfig[]
  empty: boolean
}

// Service response wrapper
export interface CouponsListResponse {
  success: boolean
  data?: CouponsPageResponse
  error?: string
}

// Parameters for coupon search
export interface CouponsSearchParams {
  page?: number
  size?: number
  sort?: string[]
}

// ===================================================================
// TIPOS DE VALIDAÇÃO DE CUPONS - V2 API
// ===================================================================

/**
 * Tipos de cliente suportados pela API de cupons
 */
export enum CouponClientType {
  ARAUJO = 'ARAUJO',
  EMAGRECER = 'EMAGRECER',
  VERO = 'VERO'
}

/**
 * Request para validação de cupom
 * Endpoint: POST /v2/coupons/validate
 */
export interface CouponValidationRequestDTO {
  code: string // maxLength: 50, minLength: 0
}

/**
 * Response da validação de cupom
 * Retorna detalhes sobre o cupom validado
 */
export interface CouponValidationResponseDTO {
  code: string
  clientType: CouponClientType
  discountPercentage: number
  expirationDate: string // formato: date-time
  valid: boolean
  used: boolean
  expired: boolean
  message?: string
}

/**
 * Wrapper para resposta da API de validação de cupom
 */
export interface CouponValidationResult {
  success: boolean
  data?: CouponValidationResponseDTO
  error?: string
}
