// ===================================================================
// TIPOS DE AUTENTICAÇÃO - MEDIQUO ARAUJO
// ===================================================================

import { UpdateUserApiResponse, UpdateProfileResponse } from './user-types'

// PASSO 1: Solicitar código OTP
export interface SignupRequest {
  email: string
  userApplication: 'CLIENT'
}

export interface SignupApiResponse {
  id: number
  createdAt: string
  updatedAt: string
  active: boolean
  needMoreInformation: boolean
}

// PASSO 2: Validar código OTP
export interface OTPRequest {
  email: string
  code: string
}

export interface OTPApiResponse {
  token: string
  expiresIn: number
}

// Email URL Authentication
export interface EmailUrlAuthApiResponse {
  token: string
  expiresIn: number
  needMoreInformation: boolean
}

export interface EmailUrlAuthResponse {
  success: boolean
  data?: EmailUrlAuthApiResponse
  error?: string
}

// Responses encapsuladas
export interface SignupResponse {
  success: boolean
  data?: SignupApiResponse
  error?: string
}

export interface OTPResponse {
  success: boolean
  data?: OTPApiResponse
  error?: string
}

// Estados do Context
export interface AuthState {
  // Dados do usuário retornados no Passo 1 (signup)
  signupData: SignupApiResponse | null
  // Dados completos do usuário após completar perfil
  userData: UpdateUserApiResponse | null
  // Token retornado no Passo 2 (OTP)
  token: string | null
  // Email usado para autenticação
  email: string | null
  // Estados de controle
  isAuthenticated: boolean
  isLoading: boolean
  isInitialized: boolean
}

// Ações do Context
export interface AuthActions {
  // PASSO 1: Solicitar código OTP
  requestOTP: (email: string) => Promise<SignupResponse>
  // PASSO 2: Validar código OTP
  validateOTP: (email: string, code: string) => Promise<OTPResponse>
  // PASSO 3: Completar registro
  completeProfile: (profileData: {
    fullName: string
    phone: string
    documentNumber: string
    birthDate?: string
    gender?: 'MASCULINO' | 'FEMININO'
  }) => Promise<UpdateProfileResponse>
  // Logout
  logout: () => void
}

// Context completo
export interface AuthContextType extends AuthState, AuthActions {}

// Tipos de erro
export interface AuthError {
  code: string
  message: string
  details?: any
}
