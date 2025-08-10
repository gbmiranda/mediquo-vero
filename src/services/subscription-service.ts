// ===================================================================
// SERVIÇO DE ASSINATURA - MEDIQUO VERO
// ===================================================================

import { API_BASE_URL, getHeaders, handleResponse } from './api-config'
import { logger } from '@/utils/logger'

// ===================================================================
// TYPES
// ===================================================================

export interface SubscriptionStatus {
  active: boolean
  subscriptionId?: string
  startDate?: string
  nextBillingDate?: string
  amount?: number
  status?: 'active' | 'cancelled' | 'expired' | 'pending'
}

export interface SubscriptionDetails {
  id: string
  userId: string
  startDate: string
  nextBillingDate: string
  amount: number
  status: 'active' | 'cancelled' | 'expired' | 'pending'
  planName: string
  paymentMethod: {
    type: string
    lastFourDigits?: string
    brand?: string
  }
}

export interface PaymentHistoryItem {
  id: string
  date: string
  amount: number
  status: 'paid' | 'pending' | 'failed'
  invoiceUrl?: string
}

// ===================================================================
// FUNÇÕES
// ===================================================================

/**
 * Verifica se o usuário tem uma assinatura ativa
 */
export async function checkSubscriptionStatus(userId: string): Promise<{ 
  success: boolean
  data?: SubscriptionStatus
  error?: string 
}> {
  try {
    logger.apiRequest('GET', 'checkSubscriptionStatus', { userId })

    const response = await fetch(
      `${API_BASE_URL}/subscriptions/status/${userId}`,
      {
        method: 'GET',
        headers: getHeaders(true),
      }
    )

    // Se não encontrar assinatura (404), retornar como não ativa
    if (response.status === 404) {
      return {
        success: true,
        data: {
          active: false
        }
      }
    }

    const data = await handleResponse<SubscriptionStatus>(response, 'checkSubscriptionStatus', 'GET')

    return {
      success: true,
      data
    }
  } catch (error) {
    logger.error('Error checking subscription status', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao verificar status da assinatura'
    }
  }
}

/**
 * Obtém os detalhes completos da assinatura
 */
export async function getSubscriptionDetails(subscriptionId: string): Promise<{ 
  success: boolean
  data?: SubscriptionDetails
  error?: string 
}> {
  try {
    logger.apiRequest('GET', 'getSubscriptionDetails', { subscriptionId })

    const response = await fetch(
      `${API_BASE_URL}/subscriptions/${subscriptionId}`,
      {
        method: 'GET',
        headers: getHeaders(true),
      }
    )

    const data = await handleResponse<SubscriptionDetails>(response, 'getSubscriptionDetails', 'GET')

    return {
      success: true,
      data
    }
  } catch (error) {
    logger.error('Error getting subscription details', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao obter detalhes da assinatura'
    }
  }
}

/**
 * Obtém o histórico de pagamentos da assinatura
 */
export async function getPaymentHistory(subscriptionId: string): Promise<{ 
  success: boolean
  data?: PaymentHistoryItem[]
  error?: string 
}> {
  try {
    logger.apiRequest('GET', 'getPaymentHistory', { subscriptionId })

    const response = await fetch(
      `${API_BASE_URL}/subscriptions/${subscriptionId}/payments`,
      {
        method: 'GET',
        headers: getHeaders(true),
      }
    )

    const data = await handleResponse<PaymentHistoryItem[]>(response, 'getPaymentHistory', 'GET')

    return {
      success: true,
      data
    }
  } catch (error) {
    logger.error('Error getting payment history', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao obter histórico de pagamentos'
    }
  }
}

/**
 * Cancela uma assinatura ativa
 */
export async function cancelSubscription(subscriptionId: string, reason?: string): Promise<{ 
  success: boolean
  error?: string 
}> {
  try {
    logger.apiRequest('POST', 'cancelSubscription', { subscriptionId, reason })

    const response = await fetch(
      `${API_BASE_URL}/subscriptions/${subscriptionId}/cancel`,
      {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify({ reason })
      }
    )

    await handleResponse(response, 'cancelSubscription', 'POST')

    return {
      success: true
    }
  } catch (error) {
    logger.error('Error cancelling subscription', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao cancelar assinatura'
    }
  }
}