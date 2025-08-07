"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { logger } from "@/utils/logger"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    logger.error("Application error", error)
  }, [error])

  const getErrorMessage = () => {
    if (error.message.includes("Network")) {
      return {
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor. Verifique sua conexão com a internet.",
        actionable: "Verifique sua conexão e tente novamente"
      }
    } else if (error.message.includes("timeout")) {
      return {
        title: "Tempo limite excedido",
        description: "A operação demorou mais que o esperado para ser concluída.",
        actionable: "Tente novamente em alguns instantes"
      }
    } else if (error.message.includes("Auth") || error.message.includes("token")) {
      return {
        title: "Erro de autenticação",
        description: "Sua sessão expirou ou há um problema com suas credenciais.",
        actionable: "Faça login novamente para continuar"
      }
    } else {
      return {
        title: "Algo deu errado!",
        description: "Ocorreu um erro inesperado na aplicação.",
        actionable: "Tente recarregar a página"
      }
    }
  }

  const errorInfo = getErrorMessage()

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f3ff] px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg text-center">
        <div className="mb-6 flex justify-center">
          <AlertTriangle className="h-12 w-12 text-red-500" />
        </div>

        <h1 className="text-2xl font-bold text-[#1e1e4b] mb-4">{errorInfo.title}</h1>
        <p className="text-[#4a4a68] mb-2">{errorInfo.description}</p>
        <p className="text-sm text-[#6b7280] mb-6">{errorInfo.actionable}</p>

        {error.digest && (
          <p className="text-xs text-[#9ca3af] mb-6 font-mono bg-gray-50 p-2 rounded">
            ID: {error.digest}
          </p>
        )}

        <div className="space-y-3">
          <Button
            onClick={reset}
            className="w-full bg-gradient-to-r from-[#6c3ce9] to-[#39c0d4] hover:from-[#5b33c5] hover:to-[#32a7b9]"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar novamente
          </Button>

          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="w-full border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            Voltar ao início
          </Button>
        </div>
      </div>
    </div>
  )
}
