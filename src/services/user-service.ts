// ===================================================================
// SERVIÇOS DE USUÁRIO - MEDIQUO ARAUJO
// ===================================================================

import {
  UpdateUserRequest,
  UpdateUserApiResponse,
  UpdateProfileResponse
} from '@/types/user-types'
import {
  UserProfileApiResponse,
  UserProfileResponse,
  UpdateUserProfileRequest,
  UpdateUserProfileResponse
} from '@/types/user-types'
import { logger } from '@/utils/logger'
import { getToken } from '@/utils/auth-storage'
import { API_BASE_URL, getHeaders, handleResponse } from './api-config'

// ===================================================================
// API FUNCTIONS
// ===================================================================

export async function updateProfile(profileData: {
  fullName: string
  phone: string
  documentNumber: string
  birthDate?: string
  gender?: 'MASCULINO' | 'FEMININO'
}): Promise<UpdateProfileResponse> {
  logger.authFlow('Starting profile update')

  try {
    const token = getToken()
    if (!token) {
      throw new Error('Token não encontrado. Faça login novamente.')
    }

    // Obter dados atuais do signup
    const { getSignupData, getEmail } = await import('@/utils/auth-storage')
    const signupData = getSignupData()
    const email = getEmail()

    if (!signupData || !email) {
      throw new Error('Dados de cadastro não encontrados.')
    }

    const url = `${API_BASE_URL}/user-crud/${signupData.id}`
    const now = new Date().toISOString()

    const updateData: UpdateUserRequest = {
      id: signupData.id,
      createdAt: signupData.createdAt,
      updatedAt: now,
      active: true,
      fullName: profileData.fullName,
      email: email,
      phone: profileData.phone,
      documentNumber: profileData.documentNumber,
      birthDate: profileData.birthDate,
      gender: profileData.gender,
    }

    logger.apiRequest('PUT', url, updateData)

    const response = await fetch(url, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(updateData),
    })

    const data = await handleResponse<UpdateUserApiResponse>(response, 'profile-update')

    logger.authFlow('Profile update successful', { userId: data.id })

    return {
      success: true,
      data
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar perfil'
    logger.authError('Profile update failed', error)

    return {
      success: false,
      error: errorMessage
    }
  }
}

export async function getUserProfile(userId: number): Promise<UserProfileResponse> {
  logger.authFlow('Starting get user profile', { userId })

  try {
    const token = getToken()
    if (!token) {
      throw new Error('Token não encontrado. Faça login novamente.')
    }

    const url = `${API_BASE_URL}/user-crud/${userId}`

    logger.apiRequest('GET', url, { userId })

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(true),
      cache: 'no-store',
    })

    const data = await handleResponse<UserProfileApiResponse>(response, 'get-user-profile', 'GET')

    logger.authFlow('Get user profile successful', { userId: data.id })

    return {
      success: true,
      data
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar perfil do usuário'
    logger.authError('Get user profile failed', error)

    return {
      success: false,
      error: errorMessage
    }
  }
}

export async function updateUserProfile(userId: number, profileData: UpdateUserProfileRequest): Promise<UpdateUserProfileResponse> {
  logger.authFlow('Starting update user profile', { userId })

  try {
    const token = getToken()
    if (!token) {
      throw new Error('Token não encontrado. Faça login novamente.')
    }

    // Get current user data first
    const currentProfile = await getUserProfile(userId)
    if (!currentProfile.success || !currentProfile.data) {
      throw new Error('Erro ao carregar dados atuais do usuário')
    }

    const url = `${API_BASE_URL}/user-crud/${userId}`
    const now = new Date().toISOString()

    const updateData = {
      ...currentProfile.data,
      fullName: profileData.fullName,
      phone: profileData.phone,
      birthDate: profileData.birthDate,
      gender: profileData.gender,
      updatedAt: now
    }

    logger.apiRequest('PUT', url, updateData)

    const response = await fetch(url, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(updateData),
      cache: 'no-store',
    })

    const data = await handleResponse<UserProfileApiResponse>(response, 'update-user-profile')

    logger.authFlow('Update user profile successful', { userId: data.id })

    return {
      success: true,
      data
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar perfil do usuário'
    logger.authError('Update user profile failed', error)

    return {
      success: false,
      error: errorMessage
    }
  }
}
