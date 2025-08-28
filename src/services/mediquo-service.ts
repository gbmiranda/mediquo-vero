// ===================================================================
// SERVIÇOS DO MEDIQUO - MEDIQUO ARAUJO
// ===================================================================

import { logger } from '@/utils/logger'
import { getToken } from '@/utils/auth-storage'
import { API_BASE_URL, getHeaders, handleResponse } from './api-config'
import {
  MediquoTokenRequest,
  MediquoTokenApiResponse,
  MediquoTokenResponse
} from '@/types/mediquo-types'

// ===================================================================
// API FUNCTIONS
// ===================================================================

export async function getMediquoToken(cpf: string): Promise<MediquoTokenResponse> {
  logger.authFlow('Starting Mediquo token retrieval', {
    cpfPreview: cpf.substring(0, 3) + '***'
  })

  try {
    const token = getToken()
    if (!token) {
      throw new Error('Token não encontrado. Faça login novamente.')
    }

    // Remover máscaras do CPF (manter apenas números)
    const cleanCpf = cpf.replace(/\D/g, '')

    if (!cleanCpf || cleanCpf.length !== 11) {
      throw new Error('CPF inválido. Deve conter 11 dígitos.')
    }

    const url = `${API_BASE_URL}/patient/${cleanCpf}/mediquo-login`

    logger.apiRequest('GET', url, { cpfPreview: cleanCpf.substring(0, 3) + '***' })

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(true),
      cache: 'no-store',
    })

    logger.authFlow('Mediquo token API response received', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    })

    if (!response.ok) {
      const errorText = await response.text()
      logger.authError('Mediquo token API error', {
        status: response.status,
        statusText: response.statusText,
        responseBody: errorText
      })

      // Customize error messages based on status
      let errorMessage = 'Erro ao buscar token do MediQuo'
      switch (response.status) {
        case 404:
          errorMessage = 'Usuário não encontrado no sistema de telemedicina. Você precisa contratar uma consulta.'
          break
        case 401:
          errorMessage = 'Acesso não autorizado. Faça login novamente.'
          break
        case 403:
          errorMessage = 'Acesso negado aos serviços de telemedicina.'
          break
        default:
          errorMessage = `Erro no servidor (${response.status}). Tente novamente em alguns minutos.`
      }

      throw new Error(errorMessage)
    }

    const data = await handleResponse<MediquoTokenApiResponse>(response, 'get-mediquo-token', 'GET')

    logger.authFlow('Mediquo token retrieved successfully', {
      hasAccessToken: !!data.access_token,
      tokenPreview: data.access_token ? data.access_token.substring(0, 10) + '...' : 'N/A',
      expiresIn: data.expires_in
    })

    return {
      success: true,
      data
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar token do MediQuo'
    logger.authError('Mediquo token retrieval failed', error)

    return {
      success: false,
      error: errorMessage
    }
  }
}

export async function validateMediquoAccess(cpf: string): Promise<boolean> {
  logger.authFlow('Validating Mediquo access', {
    cpfPreview: cpf.substring(0, 3) + '***'
  })

  try {
    const result = await getMediquoToken(cpf)
    return result.success && !!result.data?.access_token
  } catch (error) {
    logger.authError('Mediquo access validation failed', error)
    return false
  }
}
