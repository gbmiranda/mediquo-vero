// ===================================================================
// TIPOS DO SERVIÇO MEDIQUO - MEDIQUO ARAUJO
// ===================================================================

export interface MediquoTokenRequest {
  cpf: string
}

export interface MediquoTokenApiResponse {
  access_token: string
  token_type?: string
  expires_in?: number
}

export interface MediquoTokenResponse {
  success: boolean
  data?: MediquoTokenApiResponse
  error?: string
}
