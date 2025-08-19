// ===================================================================
// GOOGLE ANALYTICS TRACKING - MEDIQUO VERO
// ===================================================================

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'set',
      targetId: string,
      config?: any
    ) => void;
  }
}

const GA_TRACKING_ID = 'G-9RM3WQZ401';

// ===================================================================
// FUNÇÕES DE TRACKING
// ===================================================================

/**
 * Define o User ID para identificar usuários únicos no GA4
 * @param userId - ID único do usuário
 */
export function setUserId(userId: string | number) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      user_id: userId.toString()
    });
  }
}

/**
 * Evento de login bem-sucedido
 * @param method - Método de login (otp, email_link, etc.)
 */
export function login(method: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'login', {
      method: method
    });
  }
}

/**
 * Evento de cadastro/signup
 * @param method - Método de cadastro (otp, email_link, etc.)
 */
export function signUp(method: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'sign_up', {
      method: method
    });
  }
}

/**
 * Evento de geração de lead (captura de email)
 * @param value - Valor do lead em reais
 */
export function generateLead(value: number) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'generate_lead', {
      currency: 'BRL',
      value: value
    });
  }
}

/**
 * Evento de início do checkout
 * @param value - Valor total em reais
 * @param items - Array de itens no checkout
 */
export function beginCheckout(value: number, items?: any[]) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'begin_checkout', {
      currency: 'BRL',
      value: value,
      items: items || [
        {
          item_id: 'MEDIQUO_SUBSCRIPTION',
          item_name: 'Assinatura MediQuo',
          price: value,
          quantity: 1
        }
      ]
    });
  }
}

/**
 * Evento de adicionar informações de pagamento
 * @param paymentType - Tipo de pagamento (credit_card, pix, etc.)
 * @param value - Valor em reais
 */
export function addPaymentInfo(paymentType: string, value: number) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'add_payment_info', {
      currency: 'BRL',
      value: value,
      payment_type: paymentType
    });
  }
}

/**
 * Evento de compra/purchase completa
 * @param transactionId - ID único da transação
 * @param value - Valor total em reais
 * @param items - Array de itens comprados
 * @param paymentMethod - Método de pagamento usado
 */
export function purchase(
  transactionId: string,
  value: number,
  items?: any[],
  paymentMethod?: string
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      currency: 'BRL',
      value: value,
      payment_type: paymentMethod || 'credit_card',
      items: items || [
        {
          item_id: 'MEDIQUO_SUBSCRIPTION',
          item_name: 'Assinatura MediQuo',
          price: value,
          quantity: 1
        }
      ]
    });
  }
}

/**
 * Evento de início de consulta/atendimento
 * @param type - Tipo de consulta (online, chat, video, etc.)
 */
export function beginConsultation(type: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'begin_consultation', {
      consultation_type: type,
      service: 'mediquo'
    });
  }
}

// ===================================================================
// EXPORT DEFAULT PARA FACILITAR IMPORTAÇÃO
// ===================================================================

const gtag = {
  setUserId,
  login,
  signUp,
  generateLead,
  beginCheckout,
  addPaymentInfo,
  purchase,
  beginConsultation
};

export default gtag;