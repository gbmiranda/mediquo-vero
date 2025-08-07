// ===================================================================
// SERVIÇOS DE ENDEREÇO - MEDIQUO ARAUJO
// ===================================================================

import { logger } from '@/utils/logger'
import {
  ViaCepApiResponse,
  AddressData,
  AddressResponse
} from '@/types/address-types'

// ===================================================================
// API FUNCTIONS
// ===================================================================

export async function getAddressByCep(cep: string): Promise<AddressResponse> {
  logger.authFlow('Starting address lookup by CEP', {
    cepPreview: cep.substring(0, 5) + '***'
  })

  try {
    // Remove caracteres não numéricos do CEP
    const cleanCep = cep.replace(/\D/g, '')

    // Verifica se o CEP tem 8 dígitos
    if (cleanCep.length !== 8) {
      throw new Error('CEP deve conter exatamente 8 dígitos.')
    }

    const url = `https://viacep.com.br/ws/${cleanCep}/json/`

    logger.apiRequest('GET', url, { cleanCep: cleanCep.substring(0, 5) + '***' })

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Erro na consulta CEP: ${response.status} ${response.statusText}`)
    }

    const data: ViaCepApiResponse = await response.json()

    // Verifica se o CEP é válido (API retorna erro: true para CEPs inválidos)
    if (data.erro) {
      throw new Error('CEP não encontrado.')
    }

    logger.authFlow('Address lookup successful', {
      city: data.localidade,
      state: data.uf,
      neighborhood: data.bairro
    })

    // Converte para o formato padronizado
    const addressData: AddressData = {
      zipCode: data.cep,
      street: data.logradouro,
      complement: data.complemento,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf,
      ibgeCode: data.ibge,
      areaCode: data.ddd
    }

    return {
      success: true,
      data: addressData
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar endereço por CEP'
    logger.authError('Address lookup failed', error)

    return {
      success: false,
      error: errorMessage
    }
  }
}

/**
 * Valida se um CEP tem formato válido
 */
export function validateCep(cep: string): boolean {
  const cleanCep = cep.replace(/\D/g, '')
  return cleanCep.length === 8
}

/**
 * Formata CEP para exibição (00000-000)
 */
export function formatCep(cep: string): string {
  const cleanCep = cep.replace(/\D/g, '')
  if (cleanCep.length === 8) {
    return `${cleanCep.slice(0, 5)}-${cleanCep.slice(5)}`
  }
  return cep
}
