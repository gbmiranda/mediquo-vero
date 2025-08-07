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
