// ===================================================================
// CENTRALIZED ERROR MESSAGES - MEDIQUO ARAUJO
// ===================================================================
// This file provides consistent, user-friendly error messages across the application

export interface ErrorMessage {
  title: string
  description: string
  actionable?: string
}

export interface ApiErrorDetails {
  status?: number
  code?: string
  message?: string
}

// ===================================================================
// ERROR CATEGORIES
// ===================================================================

// Authentication & Authorization Errors
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: {
    title: "Acesso não autorizado",
    description: "Verifique suas credenciais e tente novamente.",
    actionable: "Confirme se o email e código estão corretos"
  },
  SESSION_EXPIRED: {
    title: "Sessão expirada",
    description: "Sua sessão expirou por segurança. Faça login novamente.",
    actionable: "Clique em 'Fazer Login' para continuar"
  },
  ACCESS_DENIED: {
    title: "Acesso negado",
    description: "Você não tem permissão para acessar este recurso.",
    actionable: "Entre em contato com o suporte se precisar de acesso"
  },
  INVALID_TOKEN: {
    title: "Token inválido",
    description: "O token de acesso é inválido ou expirou.",
    actionable: "Faça login novamente para obter um novo token"
  }
} as const

// Form Validation Errors
export const VALIDATION_ERRORS = {
  REQUIRED_FIELD: (fieldName: string): ErrorMessage => ({
    title: "Campo obrigatório",
    description: `O campo "${fieldName}" é obrigatório para continuar.`,
    actionable: `Preencha o campo ${fieldName} e tente novamente`
  }),
  INVALID_EMAIL: {
    title: "Email inválido",
    description: "Digite um endereço de email válido.",
    actionable: "Verifique o formato do email (exemplo: nome@email.com)"
  },
  INVALID_CPF: {
    title: "CPF inválido",
    description: "O CPF digitado não é válido.",
    actionable: "Digite um CPF válido com 11 dígitos"
  },
  INVALID_PHONE: {
    title: "Telefone inválido",
    description: "Digite um número de telefone válido.",
    actionable: "Use o formato (11) 99999-9999"
  },
  INVALID_DATE: {
    title: "Data inválida",
    description: "A data informada não é válida.",
    actionable: "Use o formato DD/MM/AAAA"
  },
  INVALID_DATA: {
    title: "Dados inválidos",
    description: "Alguns dados não estão no formato correto.",
    actionable: "Verifique os campos destacados e corrija as informações"
  },
  INVALID_OTP: {
    title: "Código inválido",
    description: "O código de verificação está incorreto ou expirou.",
    actionable: "Verifique o código recebido por email ou solicite um novo"
  },
  OTP_INCOMPLETE: {
    title: "Código incompleto",
    description: "Digite o código de verificação de 6 dígitos.",
    actionable: "Complete todos os campos do código"
  }
} as const

// Network & API Errors
export const NETWORK_ERRORS = {
  CONNECTION_FAILED: {
    title: "Erro de conexão",
    description: "Não foi possível conectar ao servidor. Verifique sua internet.",
    actionable: "Verifique sua conexão e tente novamente"
  },
  SERVER_ERROR: {
    title: "Erro interno do servidor",
    description: "Ocorreu um problema em nossos servidores.",
    actionable: "Tente novamente em alguns minutos ou contate o suporte"
  },
  TIMEOUT: {
    title: "Tempo limite excedido",
    description: "A operação demorou mais que o esperado.",
    actionable: "Verifique sua conexão e tente novamente"
  },
  RATE_LIMIT: {
    title: "Muitas tentativas",
    description: "Você fez muitas tentativas em pouco tempo.",
    actionable: "Aguarde alguns minutos antes de tentar novamente"
  }
} as const

// Business Logic Errors
export const BUSINESS_ERRORS = {
  PATIENT_REGISTRATION_FAILED: {
    title: "Erro no cadastro do paciente",
    description: "Não foi possível cadastrar o paciente no sistema.",
    actionable: "Verifique os dados e tente novamente"
  },
  DUPLICATE_PATIENT: {
    title: "Paciente já cadastrado",
    description: "Este paciente já está registrado no sistema.",
    actionable: "Verifique os dados ou procure pelo paciente existente"
  },
  PROFILE_UPDATE_FAILED: {
    title: "Erro ao atualizar perfil",
    description: "Não foi possível salvar as alterações no seu perfil.",
    actionable: "Verifique os dados e tente novamente"
  },
  WIDGET_INITIALIZATION_FAILED: {
    title: "Erro no serviço de atendimento",
    description: "Não foi possível inicializar o sistema de atendimento.",
    actionable: "Recarregue a página ou contate o suporte"
  },
  WIDGET_CONNECTION_FAILED: {
    title: "Erro de conexão com atendimento",
    description: "Não foi possível conectar ao serviço de telemedicina.",
    actionable: "Verifique sua conexão e tente novamente"
  },
  INVALID_PATIENT_DATA: {
    title: "Dados do paciente inválidos",
    description: "Alguns dados do paciente não estão corretos.",
    actionable: "Revise as informações e corrija os campos destacados"
  },
  INVALID_TOKEN_ACCESS: {
    title: "Token de acesso inválido",
    description: "O token de acesso ao atendimento é inválido ou expirou.",
    actionable: "Solicite um novo token ou entre em contato com o suporte"
  }
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: {
    title: "Perfil atualizado",
    description: "Suas informações foram salvas com sucesso!"
  },
  PATIENT_REGISTERED: {
    title: "Paciente cadastrado",
    description: "O paciente foi cadastrado com sucesso no sistema."
  },
  LOGIN_SUCCESS: {
    title: "Login realizado",
    description: "Você será redirecionado em instantes..."
  },
  OTP_SENT: {
    title: "Código enviado",
    description: "Verifique seu email para o código de verificação."
  }
} as const

// ===================================================================
// UTILITY FUNCTIONS
// ===================================================================

/**
 * Maps HTTP status codes to appropriate error messages
 */
export function getErrorFromStatus(status: number, context?: string): ErrorMessage {
  switch (status) {
    case 400:
      return {
        title: "Dados inválidos",
        description: "Os dados enviados não são válidos.",
        actionable: "Verifique as informações e tente novamente"
      }
    case 401:
      return AUTH_ERRORS.INVALID_CREDENTIALS
    case 403:
      return AUTH_ERRORS.ACCESS_DENIED
    case 404:
      return {
        title: "Não encontrado",
        description: context ? `${context} não foi encontrado.` : "O recurso solicitado não foi encontrado.",
        actionable: "Verifique os dados e tente novamente"
      }
    case 429:
      return NETWORK_ERRORS.RATE_LIMIT
    case 500:
    case 502:
    case 503:
    case 504:
      return NETWORK_ERRORS.SERVER_ERROR
    default:
      return {
        title: "Erro inesperado",
        description: "Ocorreu um erro inesperado durante a operação.",
        actionable: "Tente novamente ou contate o suporte se o problema persistir"
      }
  }
}

/**
 * Creates a user-friendly error message from API error details
 */
export function createApiErrorMessage(details: ApiErrorDetails, context?: string): ErrorMessage {
  // Check for specific error codes first
  if (details.code) {
    switch (details.code) {
      case 'INVALID_TOKEN':
        return AUTH_ERRORS.INVALID_TOKEN
      case 'EXPIRED_TOKEN':
        return AUTH_ERRORS.SESSION_EXPIRED
      case 'RATE_LIMITED':
        return NETWORK_ERRORS.RATE_LIMIT
    }
  }

  // Fallback to HTTP status
  if (details.status) {
    return getErrorFromStatus(details.status, context)
  }

  // Generic fallback
  return {
    title: "Erro na operação",
    description: details.message || "Não foi possível completar a operação.",
    actionable: "Tente novamente ou contate o suporte"
  }
}

/**
 * Formats error message for toast display
 */
export function formatErrorForToast(error: ErrorMessage) {
  return {
    variant: "destructive" as const,
    title: error.title,
    description: error.actionable ? `${error.description} ${error.actionable}` : error.description
  }
}

/**
 * Formats success message for toast display
 */
export function formatSuccessForToast(success: { title: string; description: string }) {
  return {
    variant: "default" as const,
    title: success.title,
    description: success.description
  }
}
