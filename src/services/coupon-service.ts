// ===================================================================
// SERVIÇOS DE CUPONS - MEDIQUO ARAUJO
// ===================================================================

import {
  CouponsPageResponse,
  CouponsListResponse,
  CouponsSearchParams,
  CouponValidationRequestDTO,
  CouponValidationResponseDTO,
  CouponValidationResult
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

// ===================================================================
// VALIDAÇÃO DE CUPONS - V2 API
// ===================================================================

/**
 * Valida um cupom de desconto
 * Endpoint: POST /v2/coupons/validate
 * 
 * @param code - Código do cupom a ser validado
 * @returns Detalhes sobre a validação do cupom
 */
export async function validateCoupon(code: string): Promise<CouponValidationResult> {
  logger.authFlow('Starting coupon validation', { code })

  try {
    // Validar entrada
    if (!code || code.trim().length === 0) {
      logger.authError('Invalid coupon code provided: empty string')
      return {
        success: false,
        error: 'Por favor, informe um código de cupom válido'
      }
    }

    // Limitar tamanho do código (max 50 caracteres conforme API)
    const trimmedCode = code.trim().substring(0, 50)

    // Preparar body da requisição
    const requestBody: CouponValidationRequestDTO = {
      code: trimmedCode
    }

    const url = `${API_BASE_URL}/v2/coupons/validate`

    logger.apiRequest('POST', 'validateCoupon', { url, code: trimmedCode })

    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(false), // Não precisa de autenticação
      body: JSON.stringify(requestBody),
      cache: 'no-store'
    })

    // Tratar respostas específicas de cupom
    if (response.status === 404) {
      logger.authFlow('Coupon not found', { code: trimmedCode })
      return {
        success: false,
        error: 'Cupom não encontrado'
      }
    }

    if (response.status === 400) {
      logger.authError('Invalid coupon format', { code: trimmedCode })
      return {
        success: false,
        error: 'Formato de cupom inválido'
      }
    }

    if (response.status === 409) {
      logger.authFlow('Coupon already used', { code: trimmedCode })
      return {
        success: false,
        error: 'Este cupom já foi utilizado'
      }
    }

    if (response.status === 410) {
      logger.authFlow('Coupon expired', { code: trimmedCode })
      return {
        success: false,
        error: 'Este cupom está expirado'
      }
    }

    // Processar resposta de sucesso
    const data = await handleResponse<CouponValidationResponseDTO>(
      response, 
      'validateCoupon', 
      'POST'
    )

    logger.authFlow('Coupon validated successfully', {
      code: data.code,
      valid: data.valid,
      discountPercentage: data.discountPercentage,
      clientType: data.clientType,
      expired: data.expired,
      used: data.used
    })

    // Verificar validade do cupom na resposta
    if (!data.valid) {
      let errorMessage = 'Cupom inválido'
      
      if (data.expired) {
        errorMessage = 'Este cupom está expirado'
      } else if (data.used) {
        errorMessage = 'Este cupom já foi utilizado'
      } else if (data.message) {
        errorMessage = data.message
      }

      return {
        success: false,
        error: errorMessage,
        data // Incluir dados mesmo quando inválido para análise
      }
    }

    return {
      success: true,
      data
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro ao validar cupom'
    logger.authError('Failed to validate coupon', error)

    return {
      success: false,
      error: errorMessage
    }
  }
}

/**
 * Aplica um cupom de desconto e retorna o valor com desconto
 * 
 * @param code - Código do cupom
 * @param originalPrice - Valor original sem desconto
 * @returns Objeto com informações do desconto aplicado
 */
export async function applyCoupon(
  code: string, 
  originalPrice: number
): Promise<{
  success: boolean
  discountedPrice?: number
  discountAmount?: number
  discountPercentage?: number
  couponData?: CouponValidationResponseDTO
  error?: string
}> {
  const validation = await validateCoupon(code)

  if (!validation.success || !validation.data) {
    return {
      success: false,
      error: validation.error
    }
  }

  const { discountPercentage } = validation.data
  const discountAmount = (originalPrice * discountPercentage) / 100
  const discountedPrice = originalPrice - discountAmount

  return {
    success: true,
    discountedPrice: Math.max(0, discountedPrice), // Garantir que não seja negativo
    discountAmount,
    discountPercentage,
    couponData: validation.data
  }
}
