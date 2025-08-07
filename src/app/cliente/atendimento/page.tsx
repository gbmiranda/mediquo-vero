"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { getUserProfile } from "@/services/user-service"
import { getMediquoToken } from "@/services/mediquo-service"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertTriangle, Loader2, CreditCard } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { logger } from "@/utils/logger"
import { getUserIdFromToken } from "@/utils/auth-storage"
import { UserHeader } from "@/components/user-header"
import {
  BUSINESS_ERRORS,
  NETWORK_ERRORS,
  formatErrorForToast,
  formatSuccessForToast
} from "@/config/error-messages"

// Declaração do tipo para o SDK MediQuo
declare global {
  interface Window {
    MediquoWidget?: {
      init: (config: any) => void
      open: () => void
      close?: () => void
      destroy?: () => void // Adicionando o método destroy à declaração de tipo
    }
  }
}

export default function Atendimento() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { userData, token: authToken, isAuthenticated } = useAuth()

  // Log inicial para debug
  useEffect(() => {
    logger.authFlow('Atendimento: componente carregado', {
      isAuthenticated,
      hasUserData: !!userData,
      hasAuthToken: !!authToken,
      documentNumber: userData?.documentNumber ? userData.documentNumber.substring(0, 3) + '***' : 'N/A'
    })
  }, [isAuthenticated, userData, authToken])

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Estados para o token do Mediquo
  const [mediquoToken, setMediquoToken] = useState<string | null>(null)
  const [isLoadingToken, setIsLoadingToken] = useState(true)
  const [hasValidToken, setHasValidToken] = useState(false)

  // Estado para controle de Broadcast Channel
  const [broadcastChannel, setBroadcastChannel] = useState<BroadcastChannel | null>(null)

  // Referência para a aba do MediQuo aberta
  const [mediquoTabRef, setMediquoTabRef] = useState<Window | null>(null)

  // Obter o token do usuário da URL como fallback
  const urlToken = searchParams.get("token") || "demo-token"

  // Usar o token da API ou da URL como fallback
  const getActiveToken = () => mediquoToken || urlToken

  // Helper function to get MediQuo token from user CPF
  const getMediquoTokenForUser = async (cpf: string): Promise<string | null> => {
    logger.authFlow('Fetching MediQuo token for user', {
      cpfPreview: cpf.substring(0, 3) + '***'
    })

    try {
      const response = await getMediquoToken(cpf)

      if (response.success && response.data?.access_token) {
        logger.authFlow('MediQuo token obtained successfully')
        return response.data.access_token
      } else {
        logger.authError('MediQuo token not found in API response', response.error)
        return null
      }
    } catch (error) {
      logger.authError('Error fetching MediQuo token', error)
      return null
    }
  }

  // useEffect para buscar token do Mediquo ao carregar a página
  useEffect(() => {
    const loadMediquoToken = async () => {
      logger.authFlow('useEffect loadMediquoToken iniciado', {
        isAuthenticated,
        hasUserData: !!userData
      })

      if (!isAuthenticated) {
        logger.authFlow('Usuário não autenticado')
        setIsLoadingToken(false)
        return
      }

      // Extrair userId do token JWT
      const userId = getUserIdFromToken()
      if (!userId) {
        logger.authFlow('UserId não encontrado no token JWT')
        setIsLoadingToken(false)
        setHasValidToken(false)
        return
      }

      setIsLoadingToken(true)

      try {
        // SEMPRE buscar dados atualizados do usuário da API primeiro
        logger.authFlow('Buscando dados do usuário da API...', { userId })

        const userProfileResponse = await getUserProfile(userId)

        if (userProfileResponse.success && userProfileResponse.data?.documentNumber) {
          logger.authFlow('Dados do usuário carregados da API', {
            hasDocumentNumber: !!userProfileResponse.data.documentNumber,
            documentNumber: userProfileResponse.data.documentNumber.substring(0, 3) + '***'
          })

          // Agora buscar o token MediQuo usando os dados da API
          const token = await getMediquoTokenForUser(userProfileResponse.data.documentNumber)

          if (token) {
            setMediquoToken(token)
            setHasValidToken(true)
            logger.authFlow('MediQuo token carregado com sucesso')
          } else {
            setHasValidToken(false)
            logger.authFlow('Token MediQuo não encontrado - usuário precisa completar checkout')
          }
        } else {
          logger.authError('Falha ao carregar dados do usuário da API', userProfileResponse.error)
          setHasValidToken(false)
        }
      } catch (error) {
        logger.authError('Erro ao carregar token Mediquo', error)
        setHasValidToken(false)
      }

      setIsLoadingToken(false)
    }

    loadMediquoToken()
  }, [isAuthenticated]) // Agora depende apenas de isAuthenticated, pois userId vem do token

  // useEffect para configurar Broadcast Channel
  useEffect(() => {
    // Verificar se BroadcastChannel está disponível
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('mediquo-tab-control')
      setBroadcastChannel(channel)

      // Escutar mensagens de outras abas
      channel.addEventListener('message', (event) => {
        if (event.data.type === 'NEW_TAB_OPENED') {
          logger.info('Nova aba MediQuo detectada, mostrando aviso')

          toast(formatSuccessForToast({
            title: "Nova consulta iniciada",
            description: "Uma nova consulta foi aberta em outra aba.",
          }))
        }
      })

      // Cleanup quando o componente for desmontado
      return () => {
        channel.close()
      }
    } else {
      logger.warn('BroadcastChannel não está disponível neste navegador')
    }
  }, [])

  // Detectar se é dispositivo móvel
  const isMobile = () => {
    if (typeof window !== "undefined") {
      return window.innerWidth <= 768
    }
    return false
  }

  // Função para lidar com o clique no botão "Acessar Telemedicina Mediquo" abrindo em nova aba
  const handleAccessMediquo = async () => {
    try {
      // Limpar qualquer erro anterior
      setError(null)
      setIsLoading(true)

      // Verificar se já existe uma aba aberta e ativa
      if (mediquoTabRef && !mediquoTabRef.closed) {
        // Focar na aba existente
        mediquoTabRef.focus()

        logger.info("Redirecionando para aba MediQuo existente")

        toast(formatSuccessForToast({
          title: "Consulta retomada",
          description: "Direcionando para sua consulta já iniciada."
        }))

        setIsLoading(false)
        return
      }

      // Avisar outras abas que uma nova está sendo aberta
      if (broadcastChannel) {
        broadcastChannel.postMessage({
          type: 'NEW_TAB_OPENED',
          timestamp: Date.now()
        })
      }

      logger.info("Iniciando processo de acesso ao Mediquo em nova aba...")

      // Criar HTML para a nova aba com o widget MediQuo
      const createMediquoHTML = () => {
        const token = getActiveToken()

        return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Consulta Médica - MediQuo</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #6c3ce9 0%, #39c0d4 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }

        .loading-container {
            text-align: center;
            padding: 2rem;
        }

        .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .error-container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 2rem;
            border-radius: 12px;
            max-width: 400px;
            margin: 2rem;
            text-align: center;
            display: none;
        }

        .error-title {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: #ff6b6b;
        }

        .retry-btn {
            background: white;
            color: #6c3ce9;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 1rem;
            transition: transform 0.2s;
        }

        .retry-btn:hover {
            transform: translateY(-2px);
        }

        .close-btn {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            margin-left: 1rem;
        }
    </style>
</head>
<body>
    <div class="loading-container" id="loadingContainer">
        <div class="spinner"></div>
        <h2>Carregando consulta médica...</h2>
        <p>Aguarde enquanto conectamos você com nossos profissionais</p>
    </div>

    <div class="error-container" id="errorContainer">
        <div class="error-title">Erro ao carregar</div>
        <p id="errorMessage">Não foi possível conectar com o serviço de telemedicina.</p>
        <div>
            <button class="retry-btn" onclick="initializeWidget()">Tentar novamente</button>
            <button class="close-btn" onclick="window.close()">Fechar</button>
        </div>
    </div>

    <script>
        let widgetInitialized = false;
        let tabChannel = null;
        let wakeLock = null; // Controle do wake lock para impedir bloqueio da tela
        const tabId = 'mediquo-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

        // Função para ativar o wake lock (impedir bloqueio da tela)
        async function requestWakeLock() {
            try {
                if ('wakeLock' in navigator) {
                    wakeLock = await navigator.wakeLock.request('screen');
                    console.log('Wake lock ativado - tela não será bloqueada durante a consulta');

                    wakeLock.addEventListener('release', () => {
                        console.log('Wake lock liberado');
                    });
                } else {
                    console.log('Wake Lock API não suportada neste dispositivo');
                }
            } catch (err) {
                console.error('Erro ao solicitar wake lock:', err);
            }
        }

        // Função para liberar o wake lock
        function releaseWakeLock() {
            if (wakeLock) {
                wakeLock.release();
                wakeLock = null;
                console.log('Wake lock liberado manualmente');
            }
        }

        // Reativar wake lock quando a aba volta ao foco (caso tenha sido liberado)
        document.addEventListener('visibilitychange', async () => {
            if (wakeLock !== null && document.visibilityState === 'visible') {
                try {
                    wakeLock = await navigator.wakeLock.request('screen');
                    console.log('Wake lock reativado após voltar ao foco');
                } catch (err) {
                    console.error('Erro ao reativar wake lock:', err);
                }
            }
        });

        // Configurar Broadcast Channel para controle de abas
        function setupTabControl() {
            // Verificar se BroadcastChannel está disponível
            if ('BroadcastChannel' in window) {
                tabChannel = new BroadcastChannel('mediquo-tab-control');

                // Escutar mensagens de outras abas
                tabChannel.addEventListener('message', (event) => {
                    if (event.data.type === 'NEW_TAB_OPENED' && event.data.timestamp > Date.now() - 1000) {
                        // Outra aba foi aberta recentemente, fechar esta
                        console.log('Nova aba MediQuo detectada, fechando esta aba');

                        // Mostrar aviso antes de fechar
                        if (confirm('Uma nova consulta foi iniciada em outra aba. Esta aba será fechada.')) {
                            window.close();
                        } else {
                            // Se o usuário cancelar, enviar mensagem para fechar a outra aba
                            tabChannel.postMessage({
                                type: 'KEEP_THIS_TAB',
                                tabId: tabId,
                                timestamp: Date.now()
                            });
                        }
                    } else if (event.data.type === 'KEEP_THIS_TAB' && event.data.tabId !== tabId) {
                        // Outra aba quer manter-se ativa, fechar esta
                        console.log('Outra aba será mantida ativa, fechando esta');
                        window.close();
                    }
                });

                // Avisar que esta aba foi aberta
                setTimeout(() => {
                    tabChannel.postMessage({
                        type: 'NEW_TAB_OPENED',
                        tabId: tabId,
                        timestamp: Date.now()
                    });
                }, 100);
            }
        }

        function showError(message) {
            document.getElementById('loadingContainer').style.display = 'none';
            document.getElementById('errorContainer').style.display = 'block';
            document.getElementById('errorMessage').textContent = message;
        }

        function initializeWidget() {
            if (widgetInitialized) return;

            // Configurar controle de abas
            setupTabControl();

            document.getElementById('errorContainer').style.display = 'none';
            document.getElementById('loadingContainer').style.display = 'block';

            // Limpar qualquer script anterior
            const existingScripts = document.querySelectorAll('script[src*="mediquo"]');
            existingScripts.forEach(script => script.remove());

            // Carregar script do MediQuo
            const script = document.createElement('script');
            script.src = 'https://widget.mediquo.com/js/1.0.0/mediquo.js?t=' + Date.now();
            script.async = true;

            script.onload = function() {
                console.log('Script MediQuo carregado');

                setTimeout(() => {
                    if (window.MediquoWidget) {
                        try {
                            const config = {
                                apiKey: "JKqfosDCf9WW2t6U",
                                accessToken: "${token}",
                                isMobileView: true,
                                theme: {
                                    position: "center",
                                    locale: "pt",
                                    fullscreen: true,
                                    hideFloatingButton: true,
                                    colors: {
                                        primary: "#6c3ce9",
                                        primaryContrast: "#FFFFFF",
                                        secondary: "#6c3ce9",
                                        accent: "#6c3ce9",
                                        messageTextSystem: "#6c3ce9",
                                        messageTextOutgoing: "#6c3ce9",
                                        messageTextIncoming: "#6c3ce9",
                                        bubbleBackgroundSystem: "#f7f8fa",
                                        bubbleBackgroundOutgoing: "#f7f8fa",
                                        bubbleBackgroundIncoming: "#f7f8fa",
                                        alertText: "#6c3ce9",
                                        alertBackground: "#f7f8fa",
                                    },
                                    hideCloseButton: "true",
                                    text: {
                                        launcher: "Iniciar Consulta",
                                        terms: "Li e aceito os termos de utilização",
                                        welcome_title: "Bem-vindo",
                                        medical_consent_disclaimer: "Consentimento para atendimento",
                                    },
                                },
                                onClose: () => {
                                    console.log('Widget fechado, fechando aba');
                                    window.close();
                                },
                                onError: (err) => {
                                    console.error('Erro no widget:', err);
                                    showError('Erro na conexão com o serviço médico.');
                                },
                                onOpen: () => {
                                    console.log('Widget aberto');
                                    document.getElementById('loadingContainer').style.display = 'none';
                                    widgetInitialized = true;
                                    // Ativar wake lock quando o widget for aberto
                                    requestWakeLock();
                                }
                            };

                            window.MediquoWidget.init(config);

                            setTimeout(() => {
                                if (window.MediquoWidget) {
                                    window.MediquoWidget.open();
                                } else {
                                    showError('Widget não disponível após inicialização.');
                                }
                            }, 1000);

                        } catch (error) {
                            console.error('Erro ao inicializar widget:', error);
                            showError('Erro ao inicializar o serviço médico.');
                        }
                    } else {
                        showError('Serviço médico não disponível.');
                    }
                }, 500);
            };

            script.onerror = function(error) {
                console.error('Erro ao carregar script:', error);
                showError('Erro ao carregar o serviço médico.');
            };

            document.head.appendChild(script);
        }

        // Inicializar automaticamente quando a página carregar
        document.addEventListener('DOMContentLoaded', initializeWidget);

        // Limpar recursos quando a aba for fechada
        window.addEventListener('beforeunload', () => {
            // Liberar wake lock antes de fechar a aba
            releaseWakeLock();

            if (tabChannel) {
                tabChannel.close();
            }

            if (window.MediquoWidget) {
                try {
                    if (window.MediquoWidget.destroy) {
                        window.MediquoWidget.destroy();
                    } else if (window.MediquoWidget.close) {
                        window.MediquoWidget.close();
                    }
                } catch (e) {
                    console.error('Erro ao limpar widget:', e);
                }
            }
        });
    </script>
</body>
</html>
        `
      }      // Abrir nova aba com o HTML do MediQuo
      const newTab = window.open('', '_blank')

      if (!newTab) {
        throw new Error('Popup blocked - unable to open new tab')
      }

      // Armazenar referência da aba aberta
      setMediquoTabRef(newTab)

      // Escrever o HTML na nova aba
      newTab.document.write(createMediquoHTML())
      newTab.document.close()

      // Definir título da aba
      newTab.document.title = 'Consulta Médica - MediQuo'

      logger.info("Nova aba aberta com sucesso para o MediQuo")

      // Mostrar toast de sucesso
      toast(formatSuccessForToast({
        title: "Consulta iniciada",
        description: "Uma nova aba foi aberta para sua consulta médica."
      }))

      setIsLoading(false)

    } catch (err) {
      logger.error("Erro ao abrir consulta em nova aba", err)
      const error = err as Error

      if (error.message.includes('Popup blocked')) {
        toast(formatErrorForToast({
          title: "Popup bloqueado",
          description: "Seu navegador bloqueou a abertura da nova aba. Por favor, permita popups para este site e tente novamente.",
          actionable: "Verifique as configurações de popup do seu navegador."
        }))
      } else {
        toast(formatErrorForToast({
          title: "Erro ao abrir consulta",
          description: "Não foi possível abrir a consulta médica em uma nova aba.",
          actionable: "Verifique sua conexão com a internet e tente novamente."
        }))
      }

      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f3ff]">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center">
              <img src="/logo.svg" alt="MediQuo" className="h-8" />
            </Link>
            <UserHeader />
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg text-center">
          <div className="space-y-6 py-4">
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <h1 className="text-2xl font-bold text-[#1e1e4b]">
                {isLoadingToken ? 'Verificando acesso...' :
                 hasValidToken ? 'Pronto para consulta!' :
                 'Contrate sua consulta'}
              </h1>
            </div>

            <p className="text-[#4a4a68]">
              {isLoadingToken ? 'Estamos verificando seu acesso aos serviços de telemedicina...' :
               hasValidToken ? 'Seu acesso está ativo! Você já pode iniciar uma consulta médica através da telemedicina Mediquo.' :
               'Para acessar nossos serviços de telemedicina, você precisa contratar uma consulta. Clique no botão abaixo para ir ao checkout.'}
            </p>

            {/* Renderização condicional dos botões */}
            <div className="pt-4">
              {isLoadingToken ? (
                // Estado de loading
                <Button
                  className="w-full bg-gradient-to-r from-[#6c3ce9] to-[#39c0d4] py-6 text-lg"
                  disabled
                >
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verificando acesso...
                </Button>
              ) : hasValidToken ? (
                // Usuário tem token válido - mostrar botão de iniciar atendimento
                <Button
                  onClick={handleAccessMediquo}
                  className="w-full bg-gradient-to-r from-[#6c3ce9] to-[#39c0d4] hover:from-[#5b33c5] hover:to-[#32a7b9] py-6 text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Carregando...
                    </span>
                  ) : (
                    "Iniciar Consulta Médica"
                  )}
                </Button>
              ) : (
                // Usuário não tem token válido - mostrar botão de checkout
                <Button
                  onClick={() => router.push('/cliente/checkout')}
                  className="w-full bg-gradient-to-r from-[#6c3ce9] to-[#39c0d4] hover:from-[#5b33c5] hover:to-[#32a7b9] py-6 text-lg"
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Contratar Consulta
                </Button>
              )}
            </div>

            {error && (
              <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                <div className="flex items-start">
                  <AlertTriangle className="mr-2 h-5 w-5 flex-shrink-0" />
                  <div className="flex-1 text-left">
                    <p className="font-medium">{error}</p>
                    <p className="mt-2">
                      Ocorreu um problema ao tentar acessar o serviço de telemedicina. Você pode tentar novamente ou
                      entrar em contato com nosso suporte.
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <Button
                    onClick={() => router.push("/")}
                    className="w-full bg-gradient-to-r from-[#6c3ce9] to-[#39c0d4] hover:from-[#5b33c5] hover:to-[#32a7b9]"
                  >
                    Voltar para a página inicial
                  </Button>
                </div>
              </div>
            )}


          </div>
        </div>
      </main>

      <footer className="bg-white py-4">
        <div className="container mx-auto px-4 text-center text-sm text-[#4a4a68]">
          © 2024 Mediquo. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  )
}
