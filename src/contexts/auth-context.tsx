'use client'

// ===================================================================
// CONTEXTO DE AUTENTICAÇÃO - MEDIQUO ARAUJO
// ===================================================================

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import {
  AuthState,
  AuthContextType,
  SignupResponse,
  OTPResponse,
  SignupApiResponse
} from '@/types/auth-types'
import { UpdateProfileResponse, UpdateUserApiResponse } from '@/types/user-types'
import {
  saveToken,
  getToken,
  saveSignupData,
  getSignupData,
  saveEmail,
  getEmail,
  saveUserData,
  getUserData,
  clearAllAuthData
} from '@/utils/auth-storage'
import { signupUser, validateOTP, logout as logoutApi } from '@/services/auth-service'
import { updateProfile } from '@/services/user-service'
import { logger } from '@/utils/logger'
import gtag from '@/utils/analytics'

// ===================================================================
// ESTADO INICIAL
// ===================================================================

const initialState: AuthState = {
  signupData: null,
  userData: null,
  token: null,
  email: null,
  isAuthenticated: false,
  isLoading: true,
  isInitialized: false
}

// ===================================================================
// AÇÕES DO REDUCER
// ===================================================================

type AuthAction =
  | { type: 'INITIALIZE'; payload: { signupData: SignupApiResponse | null; userData: UpdateUserApiResponse | null; token: string | null; email: string | null } }
  | { type: 'SIGNUP_SUCCESS'; payload: { signupData: SignupApiResponse; email: string } }
  | { type: 'OTP_SUCCESS'; payload: { token: string } }
  | { type: 'PROFILE_COMPLETE'; payload: { userData: UpdateUserApiResponse } }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        ...state,
        signupData: action.payload.signupData,
        userData: action.payload.userData,
        token: action.payload.token,
        email: action.payload.email,
        isAuthenticated: !!action.payload.token,
        isLoading: false,
        isInitialized: true
      }

    case 'SIGNUP_SUCCESS':
      return {
        ...state,
        signupData: action.payload.signupData,
        email: action.payload.email,
        isLoading: false
      }

    case 'OTP_SUCCESS':
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false
      }

    case 'PROFILE_COMPLETE':
      // Atualizar signupData no estado para refletir que não precisa mais de informações
      const updatedSignupData = state.signupData ? {
        ...state.signupData,
        needMoreInformation: false
      } : null

      return {
        ...state,
        signupData: updatedSignupData,
        userData: action.payload.userData,
        isLoading: false
      }

    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
        isInitialized: true
      }

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }

    default:
      return state
  }
}

// ===================================================================
// CONTEXTO
// ===================================================================

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// ===================================================================
// PROVIDER
// ===================================================================

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // ===================================================================
  // INICIALIZAÇÃO
  // ===================================================================

  useEffect(() => {
    // Evitar hidratação mismatch
    if (typeof window === 'undefined') return

    async function initializeAuth() {
      try {
        logger.authFlow('Initializing auth context')

        const token = getToken()
        const signupData = getSignupData()
        const userData = getUserData()
        const email = getEmail()

        logger.authFlow('Auth initialization data', {
          hasToken: !!token,
          hasSignupData: !!signupData,
          hasUserData: !!userData,
          hasEmail: !!email
        })

        dispatch({
          type: 'INITIALIZE',
          payload: { signupData, userData, token, email }
        })
        
        // GA4: Se já está autenticado na inicialização, definir User ID
        if (token && signupData?.id) {
          gtag.setUserId(signupData.id)
        }

      } catch (error) {
        logger.authError('Auth initialization failed', error)
        dispatch({
          type: 'INITIALIZE',
          payload: { signupData: null, userData: null, token: null, email: null }
        })
      }
    }

    initializeAuth()
  }, [])

  // ===================================================================
  // AÇÕES
  // ===================================================================

  const requestOTP = async (email: string): Promise<SignupResponse> => {
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      logger.authFlow('Starting OTP request', { email })

      const result = await signupUser({
        email,
        userApplication: 'CLIENT'
      })

      if (result.success && result.data) {
        // Salvar dados no localStorage
        saveSignupData(result.data)
        saveEmail(email)

        dispatch({
          type: 'SIGNUP_SUCCESS',
          payload: {
            signupData: result.data,
            email
          }
        })

        logger.authFlow('OTP request successful', { userId: result.data.id })
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
        logger.authError('OTP request failed', result.error)
      }

      return result

    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false })
      logger.authError('OTP request error', error)

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao solicitar código'
      }
    }
  }

  const validateOTPCode = async (email: string, code: string): Promise<OTPResponse> => {
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      logger.authFlow('Starting OTP validation', { email })

      const result = await validateOTP({ email, code })

      if (result.success && result.data) {
        // Salvar token no localStorage
        saveToken(result.data.token, result.data.expiresIn)

        dispatch({
          type: 'OTP_SUCCESS',
          payload: {
            token: result.data.token
          }
        })

        logger.authFlow('OTP validation successful')
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
        logger.authError('OTP validation failed', result.error)
      }

      return result

    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false })
      logger.authError('OTP validation error', error)

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao validar código'
      }
    }
  }

  const completeProfile = async (profileData: {
    fullName: string
    phone: string
    documentNumber: string
    birthDate?: string
    gender?: 'MASCULINO' | 'FEMININO'
  }): Promise<UpdateProfileResponse> => {
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      logger.authFlow('Starting profile completion')

      const result = await updateProfile(profileData)

      if (result.success) {
        // CRITICAL FIX: Atualizar signupData para indicar que o perfil foi completado
        const currentSignupData = getSignupData()
        if (currentSignupData) {
          const updatedSignupData: SignupApiResponse = {
            ...currentSignupData,
            needMoreInformation: false
          }

          // Salvar dados atualizados no localStorage
          saveSignupData(updatedSignupData)

          logger.authFlow('Updated signupData with needMoreInformation: false')
        }

        // Salvar userData no localStorage se existir
        if (result.data) {
          saveUserData(result.data)

          dispatch({
            type: 'PROFILE_COMPLETE',
            payload: { userData: result.data }
          })
          logger.authFlow('Profile completion successful')
        } else {
          dispatch({ type: 'SET_LOADING', payload: false })
          logger.authError('Profile completion failed - no user data returned', {})
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
        logger.authError('Profile completion failed', result.error)
      }

      return result

    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false })
      logger.authError('Profile completion error', error)

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao completar perfil'
      }
    }
  }

  const logout = async (): Promise<void> => {
    try {
      logger.authFlow('Starting logout from context')

      await logoutApi()

      dispatch({ type: 'LOGOUT' })

      logger.authFlow('Logout completed from context')
    } catch (error) {
      logger.authError('Logout error from context', error)

      // Mesmo com erro, limpar estado local
      clearAllAuthData()
      dispatch({ type: 'LOGOUT' })
    }
  }

  // ===================================================================
  // CONTEXT VALUE
  // ===================================================================

  const contextValue: AuthContextType = {
    // Estado
    ...state,

    // Ações
    requestOTP,
    validateOTP: validateOTPCode,
    completeProfile,
    logout
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}
