// ===================================================================
// SERVIÇOS DE CHECKOUT - MEDIQUO ARAUJO
// ===================================================================

import { logger } from '@/utils/logger'
import { getToken } from '@/utils/auth-storage'
import { API_BASE_URL, getHeaders, handleResponse } from './api-config'
import {
  CardPagarmeDTO,
  AddressPagarmeDTO,
  CardTransactionRequest,
  CardTransactionApiResponse,
  CardTransactionResponse,
  ListTransactionsParams,
  ListTransactionsResponse,
  TransactionListResponse
} from '@/types/checkout-types'

// ===================================================================
// API FUNCTIONS
// ===================================================================

export async function processCardTransaction(
  transactionData: CardTransactionRequest
): Promise<CardTransactionResponse> {
  logger.authFlow('Starting card transaction processing', {
    userId: transactionData.userId,
    cardLast4: transactionData.cardPagarmeDTO.number.slice(-4),
    amount: 'checkout'
  })

  try {
    const token = getToken()
    if (!token) {
      throw new Error('Token não encontrado. Faça login novamente.')
    }

    const url = `${API_BASE_URL}/checkout/card-transaction`

    logger.apiRequest('POST', url, {
      userId: transactionData.userId,
      cardLast4: transactionData.cardPagarmeDTO.number.slice(-4),
      city: transactionData.addressPagarmeDTO.city,
      state: transactionData.addressPagarmeDTO.state
    })

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'accept': 'application/hal+json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(transactionData),
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.message || `Erro HTTP ${response.status}: ${response.statusText}`

      logger.authError('Card transaction API error', {
        status: response.status,
        statusText: response.statusText,
        errorData
      })

      throw new Error(errorMessage)
    }

    const data = await response.json()

    logger.authFlow('Card transaction successful', {
      transactionId: data.id,
      status: data.status,
      paymentMethod: data.payment_method
    })

    return {
      success: true,
      data
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro no processamento do pagamento'
    logger.authError('Card transaction failed', error)

    return {
      success: false,
      error: errorMessage
    }
  }
}

export async function listTransactions(
  params: ListTransactionsParams = {}
): Promise<ListTransactionsResponse> {
  const { page = 0, size = 10, sort = [] } = params

  logger.authFlow('Starting list transactions request', {
    page,
    size,
    sort
  })

  try {
    const token = getToken()
    if (!token) {
      throw new Error('Token não encontrado. Faça login novamente.')
    }

    // Construir query parameters
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    })

    // Adicionar parâmetros de ordenação se fornecidos
    sort.forEach(sortParam => {
      queryParams.append('sort', sortParam)
    })

    const url = `${API_BASE_URL}/checkout/list-transaction?${queryParams.toString()}`

    logger.apiRequest('GET', url, {
      page,
      size,
      sort
    })

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/hal+json',
        'Authorization': `Bearer ${token}`
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.message || `Erro HTTP ${response.status}: ${response.statusText}`

      logger.authError('List transactions API error', {
        status: response.status,
        statusText: response.statusText,
        errorData
      })

      throw new Error(errorMessage)
    }

    const data: TransactionListResponse = await response.json()

    logger.authFlow('List transactions successful', {
      totalElements: data.totalElements,
      totalPages: data.totalPages,
      numberOfElements: data.numberOfElements,
      currentPage: data.number
    })

    return {
      success: true,
      data
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro ao listar transações'
    logger.authError('List transactions failed', error)

    return {
      success: false,
      error: errorMessage
    }
  }
}

export async function processPixTransaction(
  userId: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  logger.authFlow('Starting PIX transaction processing', { userId })

  try {
    const token = getToken()
    if (!token) {
      throw new Error('Token não encontrado. Faça login novamente.')
    }

    const url = `${API_BASE_URL}/checkout/pix-transaction`

    logger.apiRequest('POST', url, { userId })

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'accept': 'application/hal+json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ patientId: parseInt(userId) })
    })

    if (!response.ok) {
      const errorText = await response.text()
      logger.authError('PIX transaction API error', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      })
      throw new Error(`Erro na API: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()

    logger.authFlow('PIX transaction processed successfully', {
      userId,
      hasQrCode: !!data?.qrcodeUrl,
      hasPixCode: !!data?.pixCode
    })

    return {
      success: true,
      data: data
    }
  } catch (error) {
    logger.authError('PIX transaction exception', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }
  }
}
