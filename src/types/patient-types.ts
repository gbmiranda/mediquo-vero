// ===================================================================
// TIPOS DO SERVIÇO DE PACIENTE - MEDIQUO ARAUJO
// ===================================================================

export interface CreatePatientRequest {
  name: string
  email: string
  birthDate: string // ISO 8601 format
  gender: string
  documentNumber: string
  phone: string
}

export interface CreatePatientApiResponse {
  id: number
  name: string
  email: string
  birthDate: string
  gender: string
  documentNumber: string
  phone: string
  createdAt: string
  updatedAt: string
}

export interface CreatePatientResponse {
  success: boolean
  data?: CreatePatientApiResponse
  error?: string
}

// Patient List Types
export interface PatientListItem {
  id: number
  name: string
  email: string
  birthDate: string
  gender: string
  documentNumber: string
  phone: string
  createdAt: string
  updatedAt: string
}

export interface PatientListApiResponse {
  content: PatientListItem[]
  pageable: {
    pageNumber: number
    pageSize: number
    sort: {
      sorted: boolean
      empty: boolean
      unsorted: boolean
    }
    offset: number
    paged: boolean
    unpaged: boolean
  }
  totalElements: number
  totalPages: number
  last: boolean
  first: boolean
  numberOfElements: number
  size: number
  number: number
  sort: {
    sorted: boolean
    empty: boolean
    unsorted: boolean
  }
  empty: boolean
}

export interface PatientListResponse {
  success: boolean
  data?: PatientListApiResponse
  error?: string
}
