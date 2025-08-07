// ===================================================================
// TIPOS DO SERVIÇO DE USUÁRIO - MEDIQUO ARAUJO
// ===================================================================

// Update user during auth flow (PASSO 3: Completar dados)
export interface UpdateUserRequest {
  id: number
  createdAt: string
  updatedAt: string
  active: boolean
  fullName: string
  email: string
  phone: string
  documentNumber: string
  birthDate?: string
  gender?: 'MASCULINO' | 'FEMININO'
}

export interface UpdateUserApiResponse {
  id: number
  createdAt: string
  updatedAt: string
  active: boolean
  fullName: string
  email: string
  phone: string
  documentNumber: string
  birthDate?: string
  gender?: 'MASCULINO' | 'FEMININO'
}

// User Profile API Response (GET /user-crud/{id})
export interface UserProfileApiResponse {
  id: number
  createdAt: string
  updatedAt: string
  active: boolean
  fullName: string
  email: string
  phone: string
  documentNumber: string
  birthDate?: string
  gender?: 'MASCULINO' | 'FEMININO'
}

// Response encapsulated
export interface UserProfileResponse {
  success: boolean
  data?: UserProfileApiResponse
  error?: string
}

// Update user profile request
export interface UpdateUserProfileRequest {
  fullName: string
  phone: string
  birthDate?: string
  gender?: 'MASCULINO' | 'FEMININO'
}

export interface UpdateUserProfileResponse {
  success: boolean
  data?: UserProfileApiResponse
  error?: string
}

// Update profile response for auth flow
export interface UpdateProfileResponse {
  success: boolean
  data?: UpdateUserApiResponse
  error?: string
}
