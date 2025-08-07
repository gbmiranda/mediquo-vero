// ===================================================================
// CONFIGURAÇÃO BASE DA API - MEDIQUO ARAUJO
// ===================================================================

import { logger } from '@/utils/logger'
import { getToken } from '@/utils/auth-storage'

export const API_BASE_URL = 'https://araujo-api.mediquo.com.br'

// ===================================================================
// HELPERS
// ===================================================================

export function getHeaders(includeAuth = false): HeadersInit {
  const headers: HeadersInit = {
    'accept': 'application/hal+json',
    'Content-Type': 'application/json',
  }

  if (includeAuth) {
    const token = getToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  return headers
}

export async function handleResponse<T>(response: Response, operation: string, method: string = 'POST'): Promise<T> {
  const data = await response.json()

  logger.apiResponse(method, operation, response.status, data)

  if (!response.ok) {
    let errorMessage = 'Erro na operação'

    switch (response.status) {
      case 400:
        errorMessage = 'Os dados enviados são inválidos. Verifique as informações e tente novamente.'
        break
      case 401:
        errorMessage = 'Código inválido ou expirado. Solicite um novo código de verificação.'
        break
      case 404:
        errorMessage = 'Email não encontrado no sistema. Verifique o endereço digitado.'
        break
      case 409:
        errorMessage = 'Dados já existem no sistema. Verifique as informações duplicadas.'
        break
      case 422:
        errorMessage = 'Dados em formato incorreto. Verifique os campos obrigatórios.'
        break
      case 429:
        errorMessage = 'Muitas tentativas em pouco tempo. Aguarde alguns minutos antes de tentar novamente.'
        break
      case 500:
      case 502:
      case 503:
      case 504:
        errorMessage = 'Erro interno do servidor. Tente novamente em alguns minutos ou contate o suporte.'
        break
      default:
        // Use server message if available, otherwise provide context-appropriate fallback
        errorMessage = data.message || 'Ocorreu um erro inesperado. Tente novamente ou contate o suporte se o problema persistir.'
    }

    throw new Error(errorMessage)
  }

  return data
}
