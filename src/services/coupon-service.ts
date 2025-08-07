// ===================================================================
// SERVIÇOS DE CUPONS - MEDIQUO ARAUJO
// ===================================================================

import {
  CouponsPageResponse,
  CouponsListResponse,
  CouponsSearchParams
} from '@/types/coupon-types'
import { logger } from '@/utils/logger'
import { API_BASE_URL, getHeaders, handleResponse } from './api-config'

// ===================================================================
// API FUNCTIONS
// ===================================================================

/**
 * Busca uma listagem paginada de cupons
 * @param params - Parâmetros de busca (page, size, sort)
 * @returns Promise com a resposta paginada de cupons
 */
export async function getCoupons(params: CouponsSearchParams = {}): Promise<CouponsListResponse> {
  logger.authFlow('Starting coupons list request')

  try {
    // Configurar parâmetros padrão
    const {
      page = 0,
      size = 10,
      sort = []
    } = params

    // Construir URL com parâmetros
    const searchParams = new URLSearchParams()
    searchParams.append('page', page.toString())
    searchParams.append('size', size.toString())

    // Adicionar parâmetros de ordenação
    sort.forEach(sortParam => {
      searchParams.append('sort', sortParam)
    })

    const url = `${API_BASE_URL}/coupon?${searchParams.toString()}`

    logger.apiRequest('GET', 'getCoupons', { url, params })

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(true), // incluir autenticação se necessário
    })

    const data = await handleResponse<CouponsPageResponse>(response, 'getCoupons', 'GET')

    logger.authFlow('Coupons list request completed successfully')

    return {
      success: true,
      data
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao buscar cupons'

    logger.authFlow(`Coupons list request failed: ${errorMessage}`)

    return {
      success: false,
      error: errorMessage
    }
  }
}

/**
 * Busca cupons com parâmetros específicos de paginação
 * @param page - Número da página (0-based)
 * @param size - Tamanho da página
 * @param sortProperties - Array de propriedades para ordenação
 * @returns Promise com a resposta paginada de cupons
 */
export async function getCouponsPaginated(
  page: number = 0,
  size: number = 10,
  sortProperties: string[] = []
): Promise<CouponsListResponse> {
  return getCoupons({
    page,
    size,
    sort: sortProperties
  })
}

/**
 * Busca todos os cupons ativos
 * @returns Promise com a resposta de cupons ativos
 */
export async function getActiveCoupons(): Promise<CouponsListResponse> {
  // Para buscar cupons ativos, podemos usar filtros se a API suportar
  // Por enquanto, retornamos todos e filtramos no frontend se necessário
  return getCoupons({
    page: 0,
    size: 100, // tamanho maior para pegar mais cupons
    sort: ['createdAt,desc'] // ordenar por data de criação, mais recentes primeiro
  })
}
