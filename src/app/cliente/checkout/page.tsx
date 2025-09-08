'use client'

// filepath: /Users/gbmiranda/Desenvolvimento/projetos/workspacePersonal/mediquo-araujo/app/cliente/checkout/page.tsx
// ===================================================================
// PÁGINA DE CHECKOUT - MEDIQUO ARAUJO
// ===================================================================

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MaskedInput } from '@/components/ui/masked-input'
import { UserHeader } from '@/components/user-header'
import { useAuth } from '@/contexts/auth-context'
import { getAddressByCep, validateCep } from '@/services/address-service'
import { processCardTransaction } from '@/services/checkout-service'
import { getUserProfile } from '@/services/user-service'
import { logger } from '@/utils/logger'
import gtag from '@/utils/analytics'
import { Check, CreditCard, Loader2, Shield } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function CheckoutPage() {
  const router = useRouter()
  const {
    signupData,
    userData,
    token,
    email,
    isAuthenticated,
    isLoading: authLoading
  } = useAuth()

  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    cpf: '',
    phone: '',
    zipCode: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoadingCep, setIsLoadingCep] = useState(false)
  const [cepError, setCepError] = useState('')
  const [isLoadingUserData, setIsLoadingUserData] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false)
  const [redirectCountdown, setRedirectCountdown] = useState(10)
  // Payment is always by credit card for subscriptions

  // Ref para focar no campo número após busca do CEP
  const numberInputRef = useRef<HTMLInputElement>(null)
  // Ref para prevenir cliques duplicados no botão de pagamento
  const isSubmittingRef = useRef(false)

  // ===================================================================
  // EFEITOS
  // ===================================================================

  // Buscar dados do usuário da API quando necessário
  useEffect(() => {
    const loadUserData = async () => {
      // Se já temos dados do usuário no contexto, usar esses dados
      if (userData && userData.documentNumber && userData.phone) {
        setFormData(prev => ({
          ...prev,
          cpf: userData.documentNumber,
          phone: userData.phone
        }))
        logger.authFlow('Pre-filled CPF and phone from userData context', {
          cpf: userData.documentNumber?.substring(0, 3) + '***',
          phone: userData.phone?.substring(0, 4) + '***'
        })
        return
      }

      // Se não temos dados completos no contexto, buscar da API
      if (isAuthenticated && signupData?.id && !isLoadingUserData) {
        setIsLoadingUserData(true)
        logger.authFlow('Loading user data from API for checkout', { userId: signupData.id })

        try {
          const response = await getUserProfile(signupData.id)

          if (response.success && response.data) {
            const { documentNumber, phone } = response.data

            if (documentNumber && phone) {
              setFormData(prev => ({
                ...prev,
                cpf: documentNumber,
                phone: phone
              }))
              logger.authFlow('Pre-filled CPF and phone from API', {
                cpf: documentNumber?.substring(0, 3) + '***',
                phone: phone?.substring(0, 4) + '***'
              })
            } else {
              logger.authFlow('User profile loaded but missing CPF or phone', {
                hasDocumentNumber: !!documentNumber,
                hasPhone: !!phone
              })
            }
          } else {
            logger.authError('Failed to load user profile for checkout', response.error)
          }
        } catch (error) {
          logger.authError('Error loading user profile for checkout', error)
        } finally {
          setIsLoadingUserData(false)
        }
      }
    }

    if (!authLoading && isAuthenticated) {
      loadUserData()
    }
  }, [userData, isAuthenticated, signupData, authLoading])

  // Preencher dados pessoais se disponíveis no contexto (fallback)
  useEffect(() => {
    if (userData && userData.documentNumber && userData.phone) {
      setFormData(prev => ({
        ...prev,
        cpf: userData.documentNumber,
        phone: userData.phone
      }))
      logger.authFlow('Pre-filled CPF and phone from userData', {
        cpf: userData.documentNumber?.substring(0, 3) + '***',
        phone: userData.phone?.substring(0, 4) + '***'
      })
    }
  }, [userData])

  useEffect(() => {
    if (!authLoading) {
      // Verificar autenticação
      if (!isAuthenticated || !token) {
        logger.authFlow('User not authenticated for checkout, redirecting to login')
        router.push('/cliente/login')
        return
      }

      // Se ainda precisa completar perfil, redirecionar
      if (signupData?.needMoreInformation) {
        logger.authFlow('User needs to complete profile, redirecting')
        router.push('/cliente/complete-profile')
        return
      }

      logger.authFlow('User authenticated and ready for checkout', { email })
    }
  }, [authLoading, isAuthenticated, token, signupData, email, router])

  // ===================================================================
  // HANDLERS
  // ===================================================================

  const validateCardExpiry = (month: number, year: number): { isValid: boolean; error?: string } => {
    // Verificar se o mês é válido (1-12)
    if (month < 1 || month > 12) {
      return { isValid: false, error: 'Mês de validade inválido' }
    }

    // Obter data atual
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1 // getMonth() retorna 0-11
    const currentYear = currentDate.getFullYear()

    // Verificar se a data não é anterior à data atual
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return { isValid: false, error: 'Cartão expirado ou data de validade inválida' }
    }

    return { isValid: true }
  }

  const processCardTransactionHandler = async (cardData: any, addressData: any, patientId: string) => {
    try {
      const transactionData = {
        cardData: {
          number: cardData.number,
          holder_name: cardData.holder_name,
          holder_document: cardData.holder_document,
          exp_month: cardData.exp_month,
          exp_year: cardData.exp_year,
          cvv: cardData.cvv
        },
        addressData: {
          line_1: addressData.line_1,
          line_2: addressData.line_2,
          zip_code: addressData.zip_code,
          city: addressData.city,
          state: addressData.state,
          country: addressData.country,
          neighborhood: addressData.neighborhood
        },
        patientId: parseInt(patientId),
        amount: 15.90,
        paymentType: 'CARD_CREDIT_RECURRENCY' as const
      }

      const result = await processCardTransaction(transactionData)

      if (!result.success) {
        throw new Error(result.error || 'Erro no processamento do pagamento')
      }

      return { success: true, data: result.data }
    } catch (error) {
      logger.authError('Card transaction handler failed', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro no processamento do pagamento'
      }
    }
  }

  const fetchAddressByCepHandler = async (cep: string) => {
    if (!validateCep(cep)) {
      return null
    }

    try {
      const result = await getAddressByCep(cep)

      if (!result.success) {
        logger.authError('CEP lookup failed', result.error)
        return null
      }

      return result.data
    } catch (error) {
      logger.authError('Error fetching CEP', error)
      return null
    }
  }

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Atualiza o valor do CEP no formulário
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Limpa erro anterior
    setCepError('')

    // Verifica se o CEP está completo (8 dígitos)
    const cleanCep = value.replace(/\D/g, '')
    if (cleanCep.length === 8) {
      setIsLoadingCep(true)

      const addressData = await fetchAddressByCepHandler(cleanCep)

      if (addressData) {
        // Preenche os campos automaticamente
        setFormData((prev) => ({
          ...prev,
          address: addressData.street || '',
          neighborhood: addressData.neighborhood || '',
          city: addressData.city || '',
          state: addressData.state || '',
        }))
        logger.authFlow('Address found for CEP', { cep: cleanCep, city: addressData.city })

        // Foca automaticamente no campo número
        setTimeout(() => {
          numberInputRef.current?.focus()
        }, 100)
      } else {
        setCepError('CEP não encontrado')
        logger.authFlow('CEP not found', { cep: cleanCep })
      }

      setIsLoadingCep(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Prevenir submissão duplicada com verificação imediata
    if (isSubmittingRef.current || isProcessing) {
      logger.authFlow('Payment submission blocked - already processing')
      return
    }
    
    // Bloquear imediatamente novas submissões
    isSubmittingRef.current = true
    setIsProcessing(true)
    setPaymentError('') // Limpar erro anterior
    
    // GA4: Evento de início do checkout
    const items = [{
      item_id: 'MEDIQUO_SUBSCRIPTION',
      item_name: 'Assinatura MediQuo',
      price: 15.90,
      quantity: 1
    }]
    gtag.beginCheckout(15.90, items)

    try {
      logger.authFlow('Processing checkout payment')

      // Preparar dados do endereço para a nova API V2
      const addressData = {
        line_1: formData.address,
        line_2: formData.number + (formData.complement ? `, ${formData.complement}` : ''),
        zip_code: formData.zipCode.replace(/\D/g, ''), // Remove máscara
        city: formData.city,
        state: formData.state,
        country: 'BR',
        neighborhood: formData.neighborhood
      }

      // Preparar dados do cartão para a nova API V2
      const [expMonth, expYear] = formData.expiryDate.split('/')
      const expYearNumber = parseInt(expYear, 10)
      const fullYear = expYearNumber < 100 ? expYearNumber + 2000 : expYearNumber // Suporte para YY e YYYY

      const cardData = {
        number: formData.cardNumber.replace(/\s/g, ''), // Remove espaços
        holder_name: formData.cardName,
        holder_document: formData.cpf.replace(/\D/g, ''), // Remove máscara
        exp_month: parseInt(expMonth, 10),
        exp_year: fullYear,
        cvv: formData.cvv
      }

      // Validar data de validade do cartão
      const expiryValidation = validateCardExpiry(parseInt(expMonth, 10), fullYear)
      if (!expiryValidation.isValid) {
        throw new Error(expiryValidation.error || 'Data de validade inválida')
      }

      // Validar dados obrigatórios do cartão
      if (!cardData.number || !cardData.holder_name || !cardData.holder_document ||
          !cardData.exp_month || !cardData.exp_year || !cardData.cvv) {
        throw new Error('Dados do cartão incompletos')
      }

      // Validar dados obrigatórios do endereço para cartão
      if (!addressData || !addressData.line_1 || !addressData.zip_code || !addressData.city || !addressData.state || !addressData.neighborhood) {
        throw new Error('Dados do endereço incompletos')
      }

      // Validar se temos o ID do usuário
      if (!signupData?.id) {
        throw new Error('ID do usuário não encontrado')
      }
      
      // GA4: Evento de adicionar informações de pagamento
      gtag.addPaymentInfo('credit_card', 15.90)

      // Process credit card payment for subscription
      const result = await processCardTransactionHandler(cardData, addressData, signupData.id.toString())

      if (result.success) {
        logger.authFlow('Payment processed successfully, starting countdown before redirect')
        setIsPaymentSuccess(true)
        
        // GA4: Evento de purchase/compra completa
        const transactionId = result.data?.id?.toString() || `TXN_${Date.now()}`
        const purchaseItems = [{
          item_id: 'MEDIQUO_SUBSCRIPTION',
          item_name: 'Assinatura MediQuo',
          price: 15.90,
          quantity: 1
        }]
        gtag.purchase(transactionId, 15.90, purchaseItems, 'credit_card')

        // Iniciar countdown de 10 segundos
        let countdown = 10
        setRedirectCountdown(countdown)

        const countdownInterval = setInterval(() => {
          countdown--
          setRedirectCountdown(countdown)

          if (countdown <= 0) {
            clearInterval(countdownInterval)
            logger.authFlow('Countdown finished, redirecting to subscription management')
            router.push('/cliente/assinatura')
          }
        }, 1000)
      } else {
        throw new Error(result.error || 'Erro no processamento do pagamento')
      }
    } catch (error) {
      logger.authError('Checkout processing failed', error)

      // Mapear erros para mensagens mais amigáveis
      let friendlyErrorMessage = 'Ops! Algo deu errado com o pagamento. Tente novamente.'

      if (error instanceof Error) {
        const errorMsg = error.message.toLowerCase()

        if (errorMsg.includes('cartão') || errorMsg.includes('card')) {
          if (errorMsg.includes('expirado') || errorMsg.includes('expired')) {
            friendlyErrorMessage = 'Seu cartão está expirado. Verifique a data de validade ou use outro cartão.'
          } else if (errorMsg.includes('inválido') || errorMsg.includes('invalid')) {
            friendlyErrorMessage = 'Os dados do cartão estão incorretos. Verifique as informações e tente novamente.'
          } else if (errorMsg.includes('negado') || errorMsg.includes('denied') || errorMsg.includes('recusado')) {
            friendlyErrorMessage = 'Seu cartão foi recusado. Entre em contato com seu banco ou use outro cartão.'
          } else if (errorMsg.includes('limite') || errorMsg.includes('limit')) {
            friendlyErrorMessage = 'Limite do cartão insuficiente. Verifique seu limite ou use outro cartão.'
          } else {
            friendlyErrorMessage = 'Problema com os dados do cartão. Verifique as informações e tente novamente.'
          }
        } else if (errorMsg.includes('endereço') || errorMsg.includes('address')) {
          friendlyErrorMessage = 'Verifique os dados do seu endereço e tente novamente.'
        } else if (errorMsg.includes('cpf') || errorMsg.includes('documento')) {
          friendlyErrorMessage = 'Problema com os dados pessoais. Verifique seu CPF e tente novamente.'
        } else if (errorMsg.includes('conexão') || errorMsg.includes('network') || errorMsg.includes('timeout')) {
          friendlyErrorMessage = 'Problema de conexão. Verifique sua internet e tente novamente.'
        } else if (errorMsg.includes('servidor') || errorMsg.includes('server') || errorMsg.includes('interno')) {
          friendlyErrorMessage = 'Estamos com instabilidade no momento. Tente novamente em alguns minutos.'
        }
      }

      setPaymentError(friendlyErrorMessage)
    } finally {
      // Liberar o botão após o processamento
      setIsProcessing(false)
      isSubmittingRef.current = false
    }
  }

  // ===================================================================
  // RENDER
  // ===================================================================

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-2 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <>

      {/* Modal de sucesso do pagamento */}
      {isPaymentSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md mx-4">
            <div className="mb-4">
              <Check className="h-16 w-16 text-green-600 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Assinatura confirmada!
            </h2>
            <p className="text-gray-600 mb-6">
              Sua assinatura mensal foi ativada com sucesso. Aguarde enquanto processamos sua solicitação...
            </p>
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <span className="text-gray-600">
                Redirecionando em {redirectCountdown}s
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50">
        <UserHeader />

        <main className="max-w-4xl mx-auto px-4 py-8 pt-28">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Assinar Plano MediQuo</h1>
            <p className="text-gray-600 mt-2">Complete seus dados para ativar sua assinatura mensal de telemedicina</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Formulário */}
            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Dados Pessoais */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      Dados pessoais
                      {isLoadingUserData && (
                        <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cpf">CPF</Label>
                        <MaskedInput
                          id="cpf"
                          name="cpf"
                          mask="999.999.999-99"
                          value={formData.cpf}
                          onChange={handleInputChange}
                          placeholder="000.000.000-00"
                          required
                          disabled={true}
                          className={formData.cpf ? "bg-gray-50 text-gray-600" : "bg-gray-50"}
                        />
                        {!formData.cpf && !isLoadingUserData && (
                          <p className="text-xs text-gray-500 mt-1">
                            CPF será preenchido automaticamente
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="phone">Telefone</Label>
                        <MaskedInput
                          id="phone"
                          name="phone"
                          mask="(99) 99999-9999"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="(11) 99999-9999"
                          required
                          disabled={true}
                          className={formData.phone ? "bg-gray-50 text-gray-600" : "bg-gray-50"}
                        />
                        {!formData.phone && !isLoadingUserData && (
                          <p className="text-xs text-gray-500 mt-1">
                            Telefone será preenchido automaticamente
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Método de Pagamento */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Pagamento por Cartão de Crédito
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Assinatura mensal recorrente:</strong> Seu cartão será cobrado mensalmente no valor de R$ 15,90. Você pode cancelar a qualquer momento.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Dados do Cartão */}
                <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <CreditCard className="h-5 w-5 mr-2" />
                        Dados do cartão
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label htmlFor="cardNumber">Número do cartão</Label>
                          <MaskedInput
                            id="cardNumber"
                            name="cardNumber"
                            mask="9999 9999 9999 9999"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            placeholder="1234 5678 9012 3456"
                            required
                            disabled={isProcessing}
                          />
                        </div>

                        <div>
                          <Label htmlFor="expiryDate">Validade</Label>
                          <MaskedInput
                            id="expiryDate"
                            name="expiryDate"
                            mask="99/99"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            placeholder="MM/AA"
                            required
                            disabled={isProcessing}
                          />
                        </div>

                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <MaskedInput
                            id="cvv"
                            name="cvv"
                            mask="999"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            placeholder="123"
                            required
                            disabled={isProcessing}
                          />
                        </div>

                        <div className="md:col-span-2">
                          <Label htmlFor="cardName">Nome no cartão</Label>
                          <Input
                            id="cardName"
                            name="cardName"
                            value={formData.cardName}
                            onChange={handleInputChange}
                            placeholder="Nome como está no cartão"
                            required
                            disabled={isProcessing}
                          />
                        </div>
                      </div>
                    </CardContent>
                </Card>

                {/* Endereço de cobrança */}
                <Card>
                    <CardHeader>
                      <CardTitle>Endereço de cobrança</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* CEP - Primeiro campo */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="zipCode" className="flex items-center">
                            CEP
                            {isLoadingCep && (
                              <Loader2 className="h-3 w-3 ml-2 animate-spin" />
                            )}
                          </Label>
                          <MaskedInput
                            id="zipCode"
                            name="zipCode"
                            mask="99999-999"
                            value={formData.zipCode}
                            onChange={handleCepChange}
                            placeholder="00000-000"
                            required
                            disabled={isProcessing}
                          />
                          {cepError && (
                            <p className="text-sm text-red-600 mt-1">{cepError}</p>
                          )}
                        </div>
                      </div>

                      {/* Logradouro e Número */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <Label htmlFor="address">Logradouro</Label>
                          <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Rua, Avenida, etc."
                            required
                            disabled={isProcessing}
                          />
                        </div>

                        <div>
                          <Label htmlFor="number">Número</Label>
                          <Input
                            ref={numberInputRef}
                            id="number"
                            name="number"
                            type="number"
                            value={formData.number}
                            onChange={handleInputChange}
                            placeholder="123"
                            required
                            disabled={isProcessing}
                          />
                        </div>
                      </div>

                      {/* Complemento */}
                      <div>
                        <Label htmlFor="complement">Complemento (opcional)</Label>
                        <Input
                          id="complement"
                          name="complement"
                          value={formData.complement}
                          onChange={handleInputChange}
                          placeholder="Apartamento, bloco, etc."
                          disabled={isProcessing}
                        />
                      </div>

                      {/* Bairro */}
                      <div>
                        <Label htmlFor="neighborhood">Bairro</Label>
                        <Input
                          id="neighborhood"
                          name="neighborhood"
                          value={formData.neighborhood}
                          onChange={handleInputChange}
                          placeholder="Bairro"
                          required
                          disabled={isProcessing}
                        />
                      </div>

                      {/* Cidade e Estado */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">Cidade</Label>
                          <Input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="Cidade"
                            required
                            disabled={isProcessing}
                          />
                        </div>

                        <div>
                          <Label htmlFor="state">Estado</Label>
                          <select
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                            disabled={isProcessing}
                          >
                            <option value="">Selecione</option>
                            <option value="AC">Acre</option>
                            <option value="AL">Alagoas</option>
                            <option value="AP">Amapá</option>
                            <option value="AM">Amazonas</option>
                            <option value="BA">Bahia</option>
                            <option value="CE">Ceará</option>
                            <option value="DF">Distrito Federal</option>
                            <option value="ES">Espírito Santo</option>
                            <option value="GO">Goiás</option>
                            <option value="MA">Maranhão</option>
                            <option value="MT">Mato Grosso</option>
                            <option value="MS">Mato Grosso do Sul</option>
                            <option value="MG">Minas Gerais</option>
                            <option value="PA">Pará</option>
                            <option value="PB">Paraíba</option>
                            <option value="PR">Paraná</option>
                            <option value="PE">Pernambuco</option>
                            <option value="PI">Piauí</option>
                            <option value="RJ">Rio de Janeiro</option>
                            <option value="RN">Rio Grande do Norte</option>
                            <option value="RS">Rio Grande do Sul</option>
                            <option value="RO">Rondônia</option>
                            <option value="RR">Roraima</option>
                            <option value="SC">Santa Catarina</option>
                            <option value="SP">São Paulo</option>
                            <option value="SE">Sergipe</option>
                            <option value="TO">Tocantins</option>
                          </select>
                        </div>
                      </div>
                    </CardContent>
                </Card>

                {/* Botão de Finalizar */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-pink-600 hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Processando assinatura...
                    </>
                  ) : (
                    <>
                      <Shield className="h-5 w-5 mr-2" />
                      Confirmar assinatura
                    </>
                  )}
                </Button>

                {/* Exibir erro de pagamento se houver */}
                {paymentError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          Problema no pagamento
                        </h3>
                        <p className="mt-1 text-sm text-red-700">{paymentError}</p>
                        <div className="mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setPaymentError('')
                              isSubmittingRef.current = false
                            }}
                            className="text-red-800 border-red-300 hover:bg-red-100"
                          >
                            Tentar novamente
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Resumo */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Resumo da assinatura</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plano Mensal MediQuo</span>
                      <span className="font-semibold whitespace-nowrap">R$ 15,90/mês</span>
                    </div>
                    <hr />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total mensal</span>
                      <span className="whitespace-nowrap">R$ 15,90</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">O que está incluso:</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-600 mr-2" />
                        Consultas ilimitadas 24h por dia
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-600 mr-2" />
                        Médicos e especialistas
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-600 mr-2" />
                        Dependentes menores incluídos
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-600 mr-2" />
                        Atendimento veterinário
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-600 mr-2" />
                        Receitas digitais quando necessário
                      </li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg mb-3">
                    <p className="text-xs text-yellow-800 font-medium">⚠️ Assinatura mensal recorrente</p>
                    <p className="text-xs text-yellow-700 mt-1">Renovação automática todo mês. Cancele quando quiser sem multas.</p>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    <p>✓ Pagamento seguro e recorrente</p>
                    <p>✓ Cancele quando quiser</p>
                    <p>✓ Suporte técnico incluído</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <footer className="bg-white border-t mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-center text-sm text-gray-600">
              © 2025 Vero + MediQuo. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
