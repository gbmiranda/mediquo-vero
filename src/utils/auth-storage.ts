// ===================================================================
// UTILITÁRIOS DE PERSISTÊNCIA - MEDIQUO ARAUJO
// ===================================================================

import { SignupApiResponse } from '@/types/auth-types'
import { UpdateUserApiResponse } from '@/types/user-types'
import { logger } from './logger'

const STORAGE_KEYS = {
  TOKEN: 'mediquo_token',
  TOKEN_EXPIRES: 'mediquo_token_expires',
  SIGNUP_DATA: 'mediquo_signup_data',
  USER_DATA: 'mediquo_user_data',
  EMAIL: 'mediquo_email',
  USER_APPLICATION: 'mediquo_user_application'
} as const

// ===================================================================
// COOKIE MANAGEMENT (CLIENT-SIDE)
// ===================================================================

export function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null

  try {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null
    }
    return null
  } catch (error) {
    logger.error('Failed to get cookie', error)
    return null
  }
}

export function setCookie(name: string, value: string, options: {
  expires?: Date
  maxAge?: number
  path?: string
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
} = {}): void {
  if (typeof window === 'undefined') return

  try {
    let cookieString = `${name}=${value}`

    if (options.expires) {
      cookieString += `; expires=${options.expires.toUTCString()}`
    }

    if (options.maxAge) {
      cookieString += `; max-age=${options.maxAge}`
    }

    if (options.path) {
      cookieString += `; path=${options.path}`
    }

    if (options.secure) {
      cookieString += `; secure`
    }

    if (options.sameSite) {
      cookieString += `; samesite=${options.sameSite}`
    }

    document.cookie = cookieString
    logger.debug('Cookie set successfully', { name, hasValue: !!value })
  } catch (error) {
    logger.error('Failed to set cookie', error)
  }
}

export function removeCookie(name: string, path = '/'): void {
  if (typeof window === 'undefined') return

  try {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`
    logger.debug('Cookie removed successfully', { name })
  } catch (error) {
    logger.error('Failed to remove cookie', error)
  }
}

// ===================================================================
// TOKEN MANAGEMENT (PASSO 2)
// ===================================================================

export function saveToken(token: string, expiresIn: number): void {
  if (typeof window === 'undefined') return

  try {
    const expiresAt = Date.now() + (expiresIn * 1000)

    localStorage.setItem(STORAGE_KEYS.TOKEN, token)
    localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRES, expiresAt.toString())

    logger.info('Token saved successfully', { expiresIn, expiresAt })
  } catch (error) {
    logger.error('Failed to save token', error)
  }
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null

  try {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)

    if (!token) return null

    // Verificar se token está expirado usando isTokenExpired
    if (isTokenExpired()) {
      // Exibir mensagem para o usuário
      alert('Sua sessão expirou. Você será redirecionado para a página inicial.')

      // Limpar o token (deslogar)
      clearToken()

      // Redirecionar para home
      window.location.href = '/'

      return null
    }

    return token
  } catch (error) {
    logger.error('Failed to get token', error)
    return null
  }
}

export function clearToken(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRES)

    logger.info('Token cleared successfully')
  } catch (error) {
    logger.error('Failed to clear token', error)
  }
}

export function isTokenExpired(): boolean {
  if (typeof window === 'undefined') return true

  try {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)

    if (!token) return true

    // Decodificar o JWT para extrair a propriedade exp
    const payload = decodeJWTPayload(token)

    if (!payload || !payload.exp) {
      logger.warn('Token does not contain exp property')
      return true
    }

    // exp está em segundos, converter para milissegundos
    const expirationTime = payload.exp * 1000
    const currentTime = Date.now()

    logger.info('expirationTime / currentTime', { expirationTime, currentTime })

    return currentTime >= expirationTime
  } catch (error) {
    logger.error('Failed to check token expiration', error)
    return true
  }
}

// Função auxiliar para decodificar o payload do JWT
function decodeJWTPayload(token: string): any {
  try {
    // JWT tem 3 partes separadas por ponto: header.payload.signature
    const parts = token.split('.')

    if (parts.length !== 3) {
      throw new Error('Invalid JWT format')
    }

    // Decodificar o payload (segunda parte)
    const payload = parts[1]

    // Adicionar padding se necessário para base64
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4)

    // Decodificar base64
    const decodedPayload = atob(paddedPayload)

    // Parse JSON
    return JSON.parse(decodedPayload)
  } catch (error) {
    logger.error('Failed to decode JWT payload', error)
    return null
  }
}

// Função para extrair o userId do token atual
export function getUserIdFromToken(): number | null {
  if (typeof window === 'undefined') return null

  try {
    const token = getToken()
    if (!token) return null

    const payload = decodeJWTPayload(token)
    if (!payload) return null

    // Tentar diferentes campos comuns para userId no JWT
    return payload.userId || payload.sub || payload.id || null
  } catch (error) {
    logger.error('Failed to get userId from token', error)
    return null
  }
}

// ===================================================================
// SIGNUP DATA MANAGEMENT (PASSO 1)
// ===================================================================

export function saveSignupData(signupData: SignupApiResponse): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEYS.SIGNUP_DATA, JSON.stringify(signupData))

    logger.info('Signup data saved successfully', {
      userId: signupData.id,
      needMoreInfo: signupData.needMoreInformation
    })
  } catch (error) {
    logger.error('Failed to save signup data', error)
  }
}

export function getSignupData(): SignupApiResponse | null {
  if (typeof window === 'undefined') return null

  try {
    const signupData = localStorage.getItem(STORAGE_KEYS.SIGNUP_DATA)
    if (!signupData) return null

    const data = JSON.parse(signupData) as SignupApiResponse

    // Validar estrutura básica
    if (!data.id || typeof data.needMoreInformation !== 'boolean') {
      logger.warn('Invalid signup data structure, clearing')
      clearSignupData()
      return null
    }

    return data
  } catch (error) {
    logger.error('Failed to get signup data', error)
    clearSignupData()
    return null
  }
}

export function clearSignupData(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(STORAGE_KEYS.SIGNUP_DATA)

    logger.info('Signup data cleared successfully')
  } catch (error) {
    logger.error('Failed to clear signup data', error)
  }
}

// ===================================================================
// EMAIL MANAGEMENT
// ===================================================================

export function saveEmail(email: string): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEYS.EMAIL, email)

    logger.info('Email saved successfully')
  } catch (error) {
    logger.error('Failed to save email', error)
  }
}

export function getEmail(): string | null {
  if (typeof window === 'undefined') return null

  try {
    return localStorage.getItem(STORAGE_KEYS.EMAIL)
  } catch (error) {
    logger.error('Failed to get email', error)
    return null
  }
}

export function clearEmail(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(STORAGE_KEYS.EMAIL)

    logger.info('Email cleared successfully')
  } catch (error) {
    logger.error('Failed to clear email', error)
  }
}

// ===================================================================
// USER DATA MANAGEMENT (PASSO 3)
// ===================================================================

export function saveUserData(userData: UpdateUserApiResponse): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData))

    logger.info('User data saved successfully', {
      userId: userData.id,
      fullName: userData.fullName
    })
  } catch (error) {
    logger.error('Failed to save user data', error)
  }
}

export function getUserData(): UpdateUserApiResponse | null {
  if (typeof window === 'undefined') return null

  try {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA)
    if (!userData) return null

    const data = JSON.parse(userData) as UpdateUserApiResponse

    // Validar estrutura básica
    if (!data.id || !data.fullName) {
      logger.warn('Invalid user data structure, clearing')
      clearUserData()
      return null
    }

    return data
  } catch (error) {
    logger.error('Failed to get user data', error)
    clearUserData()
    return null
  }
}

export function clearUserData(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(STORAGE_KEYS.USER_DATA)

    logger.info('User data cleared successfully')
  } catch (error) {
    logger.error('Failed to clear user data', error)
  }
}

// ===================================================================
// USER APPLICATION MANAGEMENT
// ===================================================================

export function saveUserApplication(applicationData: any): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEYS.USER_APPLICATION, JSON.stringify(applicationData))

    logger.info('User application data saved successfully')
  } catch (error) {
    logger.error('Failed to save user application data', error)
  }
}

export function getUserApplication(): any | null {
  if (typeof window === 'undefined') return null

  try {
    const applicationData = localStorage.getItem(STORAGE_KEYS.USER_APPLICATION)
    if (!applicationData) return null

    return JSON.parse(applicationData)
  } catch (error) {
    logger.error('Failed to get user application data', error)
    return null
  }
}

export function clearUserApplication(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(STORAGE_KEYS.USER_APPLICATION)

    logger.info('User application data cleared successfully')
  } catch (error) {
    logger.error('Failed to clear user application data', error)
  }
}



// ===================================================================
// COMPLETE CLEANUP
// ===================================================================

export function clearAllAuthData(): void {
  clearToken()
  clearSignupData()
  clearUserData()
  clearEmail()
  clearUserApplication()

  // Also clear cookies for 100% CSR
  removeCookie('mediquo_otp_token')
  removeCookie('mediquo_user_data')

  logger.info('All auth data cleared')
}
