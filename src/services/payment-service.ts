// ===================================================================
// SERVIÇO DE PAGAMENTO - MEDIQUO VERO
// ===================================================================

import { API_BASE_URL, getHeaders, handleResponse } from './api-config'
import { logger } from '@/utils/logger'
import { getToken } from '@/utils/auth-storage'
import { 
  PaymentRecurrencyResponseDTO, 
  RecurrencyApiResponse,
  CancelRecurrencyResponse,
  PaymentDTO,
  PaymentsApiResponse
} from '@/types/payment-types'

// ===================================================================
// FUNÇÕES DE RECORRÊNCIA/ASSINATURA
// ===================================================================

/**
 * Busca informações sobre a assinatura recorrente do usuário atual
 * Endpoint: GET /v2/payment/recurrency/current-user
 * 
 * @returns Dados da assinatura ou erro se não houver assinatura ativa
 */
export async function getCurrentUserRecurrency(): Promise<RecurrencyApiResponse> {
  logger.authFlow('Fetching current user recurrency status')

  try {
    const token = getToken()
    if (!token) {
      logger.authError('No token found for recurrency check', null)
      throw new Error('Token não encontrado. Faça login novamente.')
    }

    const url = `${API_BASE_URL}/v2/payment/recurrency/current-user`

    logger.apiRequest('GET', url, {})

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(true),
      cache: 'no-store'
    })

    // Se retornar 404, significa que não há assinatura ativa
    if (response.status === 404) {
      logger.authFlow('No active recurrency found for user (404)')
      return {
        success: false,
        error: 'Nenhuma assinatura ativa encontrada'
      }
    }

    // Se retornar 401, token inválido
    if (response.status === 401) {
      logger.authError('Unauthorized access to recurrency endpoint', { status: 401 })
      return {
        success: false,
        error: 'Sessão expirada. Faça login novamente.'
      }
    }

    const data = await handleResponse<PaymentRecurrencyResponseDTO>(
      response, 
      'getCurrentUserRecurrency', 
      'GET'
    )

    logger.authFlow('User recurrency fetched successfully', {
      id: data.id,
      externalPaymentId: data.externalPaymentId,
      hasLicence: !!data.licenceCode,
      amount: data.amount,
      startDate: data.startDate,
      nextChargeDate: data.nextChargeDate,
      couponCode: data.couponCode
    })

    return {
      success: true,
      data
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar informações da assinatura'
    logger.authError('Failed to fetch user recurrency', error)

    // Se o erro for relacionado a não ter assinatura, não é um erro crítico
    if (errorMessage.includes('404') || errorMessage.includes('Not Found')) {
      return {
        success: false,
        error: 'Nenhuma assinatura ativa encontrada'
      }
    }

    return {
      success: false,
      error: errorMessage
    }
  }
}

/**
 * Verifica se o usuário precisa ser redirecionado para o checkout
 * 
 * @returns true se o usuário não tem assinatura ativa e precisa fazer checkout
 */
export async function checkNeedsCheckout(): Promise<boolean> {
  const result = await getCurrentUserRecurrency()
  
  // Se não conseguiu buscar ou não tem dados, precisa de checkout
  return !result.success || !result.data
}

/**
 * Busca histórico de pagamentos por ID externo do pagamento
 * Endpoint: GET /v2/payment/by-payment-id/{externalPaymentId}
 * 
 * @param externalPaymentId ID externo do pagamento retornado pela recorrência
 * @returns Lista de pagamentos associados ao ID externo
 */
export async function getPaymentsByExternalPaymentId(externalPaymentId: string): Promise<PaymentsApiResponse> {
  logger.authFlow('Fetching payments by external payment ID', { externalPaymentId })

  try {
    const token = getToken()
    if (!token) {
      logger.authError('No token found for fetching payments', null)
      throw new Error('Token não encontrado. Faça login novamente.')
    }

    const url = `${API_BASE_URL}/v2/payment/by-payment-id/${encodeURIComponent(externalPaymentId)}`

    logger.apiRequest('GET', url, {})

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(true),
      cache: 'no-store'
    })

    // Se retornar 404, significa que não há pagamentos para este ID
    if (response.status === 404) {
      logger.authFlow('No payments found for external ID (404)')
      return {
        success: true,
        data: []
      }
    }

    // Se retornar 401, token inválido
    if (response.status === 401) {
      logger.authError('Unauthorized access to payments endpoint', { status: 401 })
      return {
        success: false,
        error: 'Sessão expirada. Faça login novamente.'
      }
    }

    const data = await handleResponse<PaymentDTO[]>(
      response, 
      'getPaymentsByExternalPaymentId', 
      'GET'
    )

    logger.authFlow('Payments fetched successfully', {
      externalPaymentId,
      paymentsCount: data.length
    })

    return {
      success: true,
      data
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar histórico de pagamentos'
    logger.authError('Failed to fetch payments by external ID', error)

    return {
      success: false,
      error: errorMessage
    }
  }
}

/**
 * Cancela a assinatura recorrente do usuário atual
 * Endpoint: POST /v2/payment/recurrency/cancel
 * 
 * @returns Confirmação do cancelamento ou erro
 */
export async function cancelCurrentUserRecurrency(): Promise<CancelRecurrencyResponse> {
  logger.authFlow('Initiating recurrency cancellation')

  try {
    const token = getToken()
    if (!token) {
      logger.authError('No token found for recurrency cancellation', null)
      return {
        success: false,
        error: 'Token não encontrado. Faça login novamente.'
      }
    }

    const url = `${API_BASE_URL}/v2/payment/recurrency/cancel`

    logger.apiRequest('POST', url, {})

    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(true),
      cache: 'no-store'
    })

    // Se retornar 401, token inválido
    if (response.status === 401) {
      logger.authError('Unauthorized access to cancel recurrency endpoint', { status: 401 })
      return {
        success: false,
        error: 'Sessão expirada. Faça login novamente.'
      }
    }

    // Se retornar 404, não há assinatura para cancelar
    if (response.status === 404) {
      logger.authFlow('No active recurrency to cancel (404)')
      return {
        success: false,
        error: 'Nenhuma assinatura ativa encontrada para cancelar'
      }
    }

    // Se retornar 409, pode haver conflito
    if (response.status === 409) {
      logger.authError('Conflict while cancelling recurrency', { status: 409 })
      return {
        success: false,
        error: 'Não foi possível cancelar a assinatura. Tente novamente mais tarde.'
      }
    }

    // Processar resposta de sucesso (200/204)
    if (response.ok) {
      logger.authFlow('Recurrency cancelled successfully')
      
      // Resposta pode ser vazia (204) ou conter dados
      let message = 'Assinatura cancelada com sucesso'
      
      // Tentar obter mensagem da resposta se houver
      if (response.status !== 204) {
        try {
          const data = await response.json()
          if (data.message) {
            message = data.message
          }
        } catch {
          // Se não houver JSON válido, usar mensagem padrão
        }
      }

      return {
        success: true,
        message
      }
    }

    // Para outros códigos de erro
    logger.authError(`Failed to cancel recurrency: ${response.status}`, { status: response.status })
    
    return {
      success: false,
      error: 'Erro ao cancelar assinatura. Tente novamente ou contate o suporte.'
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro ao cancelar assinatura'
    logger.authError('Failed to cancel recurrency', error)

    return {
      success: false,
      error: errorMessage
    }
  }
}