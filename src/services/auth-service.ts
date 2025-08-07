// ===================================================================
// SERVIÇOS DE AUTENTICAÇÃO - MEDIQUO ARAUJO
// ===================================================================

import {
  SignupRequest,
  SignupResponse,
  SignupApiResponse,
  OTPRequest,
  OTPResponse,
  OTPApiResponse,
  EmailUrlAuthResponse,
  EmailUrlAuthApiResponse
} from '@/types/auth-types'
import { logger } from '@/utils/logger'
import { API_BASE_URL, getHeaders, handleResponse } from './api-config'

// ===================================================================
// API FUNCTIONS
// ===================================================================

export async function signupUser(request: SignupRequest): Promise<SignupResponse> {
  logger.authFlow('Starting signup', { email: request.email })

  try {
    const url = `${API_BASE_URL}/auth/signup`

    logger.apiRequest('POST', url, request)

    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(request),
      cache: 'no-store',
    })

    const data = await handleResponse<SignupApiResponse>(response, 'signup')

    logger.authFlow('Signup successful', {
      userId: data.id,
      needMoreInformation: data.needMoreInformation
    })

    return {
      success: true,
      data
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Não foi possível cadastrar o usuário. Verifique sua conexão e tente novamente.'
    logger.authError('Signup failed', error)

    return {
      success: false,
      error: errorMessage
    }
  }
}

export async function validateOTP(request: OTPRequest): Promise<OTPResponse> {
  logger.authFlow('Starting OTP validation', { email: request.email })

  try {
    const url = `${API_BASE_URL}/auth/login`

    logger.apiRequest('POST', url, { email: request.email, code: '***' })

    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(request),
      cache: 'no-store',
    })

    const data = await handleResponse<OTPApiResponse>(response, 'otp-validation')

    logger.authFlow('OTP validation successful', {
      hasToken: !!data.token,
      expiresIn: data.expiresIn
    })

    return {
      success: true,
      data
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro ao validar código'
    logger.authError('OTP validation failed', error)

    return {
      success: false,
      error: errorMessage
    }
  }
}

export async function authenticateByEmailUrl(code: string): Promise<EmailUrlAuthResponse> {
  logger.authFlow('Starting email URL authentication', { code: '***' })

  try {
    const url = `${API_BASE_URL}/auth/email-url?code=${code}`

    logger.apiRequest('POST', url, {})

    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: '',
      cache: 'no-store',
    })

    const data = await handleResponse<EmailUrlAuthApiResponse>(response, 'email-url-auth')

    logger.authFlow('Email URL authentication successful', {
      hasToken: !!data.token,
      expiresIn: data.expiresIn,
      needMoreInformation: data.needMoreInformation
    })

    return {
      success: true,
      data
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Falha na autenticação via email'
    logger.authError('Email URL authentication failed', error)

    return {
      success: false,
      error: errorMessage
    }
  }
}

export async function logout(): Promise<void> {
  logger.authFlow('Starting logout')

  try {
    const { clearAllAuthData } = await import('@/utils/auth-storage')
    clearAllAuthData()

    logger.authFlow('Logout completed')
  } catch (error) {
    logger.authError('Logout error', error)
  }
}
