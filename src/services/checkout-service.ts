// ===================================================================
// SERVIÇOS DE CHECKOUT - MEDIQUO ARAUJO (V2 API)
// ===================================================================

import { logger } from '@/utils/logger'
import { getToken } from '@/utils/auth-storage'
import { API_BASE_URL, getHeaders, handleResponse } from './api-config'
import {
  PaymentCardTransactionRequestDTO,
  PagarmeAddressRequest,
  PagarmeCardRequest,
  CardTransactionResponse,
  PaymentDTO,
  ListTransactionsParams,
  ListTransactionsResponse,
  TransactionListResponse
} from '@/types/checkout-types'

// ===================================================================
// API FUNCTIONS
// ===================================================================

export interface CardTransactionRequestData {
  cardData: {
    number: string
    holder_name: string
    holder_document: string
    exp_month: number
    exp_year: number
    cvv: string
  }
  addressData: {
    line_1: string
    line_2?: string
    zip_code: string
    city: string
    state: string
    country: string
    neighborhood: string
  }
  patientId: number
  amount?: number
  paymentType?: 'CARD_CREDIT' | 'CARD_CREDIT_RECURRENCY' | 'CARD_DEBIT' | 'PIX'
}

export async function processCardTransaction(
  transactionData: CardTransactionRequestData
): Promise<CardTransactionResponse> {
  logger.authFlow('Starting card transaction processing (V2 API)', {
    patientId: transactionData.patientId,
    cardLast4: transactionData.cardData.number.slice(-4),
    amount: transactionData.amount || 15.90,
    paymentType: transactionData.paymentType || 'CARD_CREDIT_RECURRENCY'
  })

  try {
    const token = getToken()
    if (!token) {
      throw new Error('Token não encontrado. Faça login novamente.')
    }

    const url = `${API_BASE_URL}/v2/payment/card-transaction`

    // Preparar dados do cartão para a nova API
    const pagarmeCardRequest: PagarmeCardRequest = {
      number: transactionData.cardData.number,
      holder_name: transactionData.cardData.holder_name,
      holder_document: transactionData.cardData.holder_document,
      exp_month: transactionData.cardData.exp_month,
      exp_year: transactionData.cardData.exp_year,
      cvv: transactionData.cardData.cvv
    }

    // Preparar dados do endereço para a nova API
    const pagarmeAddressRequest: PagarmeAddressRequest = {
      line_1: transactionData.addressData.line_1,
      line_2: transactionData.addressData.line_2,
      zip_code: transactionData.addressData.zip_code,
      city: transactionData.addressData.city,
      state: transactionData.addressData.state,
      country: transactionData.addressData.country,
      neighborhood: transactionData.addressData.neighborhood
    }

    // Preparar payload da nova API
    const requestPayload: PaymentCardTransactionRequestDTO = {
      amount: transactionData.amount || 15.90,
      unitaryPricing: transactionData.amount || 15.90,
      paymentType: transactionData.paymentType || 'CARD_CREDIT_RECURRENCY',
      patientId: transactionData.patientId,
      installments: 1, // Para assinatura mensal
      pagarmeCardRequest,
      pagarmeAddressRequest
    }

    logger.apiRequest('POST', url, {
      patientId: transactionData.patientId,
      cardLast4: transactionData.cardData.number.slice(-4),
      city: transactionData.addressData.city,
      state: transactionData.addressData.state,
      amount: requestPayload.amount,
      paymentType: requestPayload.paymentType
    })

    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(requestPayload),
      cache: 'no-store',
    })

    const data = await handleResponse<PaymentDTO>(response, 'processCardTransaction', 'POST')

    logger.authFlow('Card transaction successful (V2 API)', {
      transactionId: data.id,
      checkoutStatusType: data.checkoutStatusType,
      paymentType: data.paymentType,
      amount: data.amount
    })

    return {
      success: true,
      data
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro no processamento do pagamento'
    logger.authError('Card transaction failed (V2 API)', error)

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
      headers: getHeaders(true),
      cache: 'no-store',
    })

    const data = await handleResponse<TransactionListResponse>(response, 'listTransactions', 'GET')

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
      headers: getHeaders(true),
      body: JSON.stringify({ patientId: parseInt(userId) })
    })

    const data = await handleResponse<any>(response, 'processPixTransaction', 'POST')

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