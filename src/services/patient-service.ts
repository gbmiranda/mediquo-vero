// ===================================================================
// SERVIÇOS DE PACIENTE - MEDIQUO ARAUJO
// ===================================================================

import { logger } from '@/utils/logger'
import { getToken } from '@/utils/auth-storage'
import { API_BASE_URL, getHeaders, handleResponse } from './api-config'
import {
  CreatePatientRequest,
  CreatePatientApiResponse,
  CreatePatientResponse,
  PatientListItem,
  PatientListApiResponse,
  PatientListResponse
} from '@/types/patient-types'

// ===================================================================
// API FUNCTIONS
// ===================================================================

export async function createPatient(patientData: CreatePatientRequest): Promise<CreatePatientResponse> {
  logger.authFlow('Starting patient creation', {
    name: patientData.name,
    email: patientData.email,
    documentNumber: patientData.documentNumber
  })

  try {
    const token = getToken()
    if (!token) {
      throw new Error('Token não encontrado. Faça login novamente.')
    }

    const url = `${API_BASE_URL}/patient`

    logger.apiRequest('POST', url, patientData)

    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(patientData),
      cache: 'no-store',
    })

    const data = await handleResponse<CreatePatientApiResponse>(response, 'create-patient')

    logger.authFlow('Patient creation successful', {
      patientId: data.id,
      name: data.name
    })

    return {
      success: true,
      data
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro ao cadastrar paciente'
    logger.authError('Patient creation failed', error)

    return {
      success: false,
      error: errorMessage
    }
  }
}

export async function getPatients(page: number = 0, size: number = 10): Promise<PatientListResponse> {
  logger.authFlow('Starting patient list retrieval', {
    page,
    size
  })

  try {
    const token = getToken()
    if (!token) {
      throw new Error('Token não encontrado. Faça login novamente.')
    }

    // Build URL with pagination parameters
    const url = `${API_BASE_URL}/patient?page=${page}&size=${size}&sort=createdAt,desc`

    logger.apiRequest('GET', url, { page, size })

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(true),
      cache: 'no-store',
    })

    const data = await handleResponse<PatientListApiResponse>(response, 'get-patients', 'GET')

    logger.authFlow('Patient list retrieval successful', {
      totalElements: data.totalElements,
      totalPages: data.totalPages,
      currentPage: data.number
    })

    return {
      success: true,
      data
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar pacientes'
    logger.authError('Patient list retrieval failed', error)

    return {
      success: false,
      error: errorMessage
    }
  }
}
