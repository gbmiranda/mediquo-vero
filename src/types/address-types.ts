// ===================================================================
// TIPOS DO SERVIÇO DE ENDEREÇO - MEDIQUO ARAUJO
// ===================================================================

export interface ViaCepApiResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
  erro?: boolean
}

export interface AddressData {
  zipCode: string
  street: string
  complement: string
  neighborhood: string
  city: string
  state: string
  ibgeCode: string
  areaCode: string
}

export interface AddressResponse {
  success: boolean
  data?: AddressData
  error?: string
}
