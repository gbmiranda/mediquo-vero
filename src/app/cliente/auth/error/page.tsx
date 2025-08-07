"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Home, HelpCircle } from "lucide-react"
import { AUTH_ERRORS } from "@/config/error-messages"

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const getErrorDetails = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return {
          title: "Erro de configuração",
          description: "Há um problema na configuração do servidor de autenticação.",
          actionable: "Entre em contato com o suporte técnico para resolver este problema.",
          canRetry: false
        }
      case "AccessDenied":
        return {
          title: "Acesso negado",
          description: "Você cancelou a autenticação ou não tem permissão para acessar.",
          actionable: "Tente fazer login novamente e aceite as permissões necessárias.",
          canRetry: true
        }
      case "Verification":
        return {
          title: "Token inválido",
          description: "O token de verificação é inválido ou expirou.",
          actionable: "Solicite um novo link de verificação ou tente fazer login novamente.",
          canRetry: true
        }
      case "EmailCreateAccount":
        return {
          title: "Erro no cadastro por email",
          description: "Não foi possível criar conta com o email fornecido.",
          actionable: "Verifique se o email está correto e tente novamente.",
          canRetry: true
        }
      case "Signin":
        return {
          title: "Erro no login",
          description: "Não foi possível fazer login com as credenciais fornecidas.",
          actionable: "Verifique suas credenciais e tente novamente.",
          canRetry: true
        }
      case "SessionRequired":
        return {
          title: "Sessão necessária",
          description: "Você precisa estar logado para acessar esta página.",
          actionable: "Faça login para continuar.",
          canRetry: true
        }
      case "Default":
      default:
        return {
          title: "Erro de autenticação",
          description: "Ocorreu um erro inesperado durante a autenticação.",
          actionable: "Tente fazer login novamente. Se o problema persistir, contate o suporte.",
          canRetry: true
        }
    }
  }

  const errorInfo = getErrorDetails(error)

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f3ff]">
      <header className="bg-white py-4 shadow-sm">
        <div className="container mx-auto flex justify-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center">
            <img src="/logo.svg" alt="MediQuo" className="h-8" />
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg text-center">
          <div className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="rounded-full bg-red-50 p-3">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-[#1e1e4b]">{errorInfo.title}</h1>
            </div>

            <div className="space-y-3 text-center">
              <p className="text-[#4a4a68]">{errorInfo.description}</p>
              <p className="text-sm text-[#6b7280]">{errorInfo.actionable}</p>
            </div>

            <div className="space-y-3">
              {errorInfo.canRetry && (
                <Button
                  onClick={() => (window.location.href = "/cliente/login")}
                  className="w-full bg-gradient-to-r from-[#6c3ce9] to-[#39c0d4] hover:from-[#5b33c5] hover:to-[#32a7b9]"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Tentar Fazer Login Novamente
                </Button>
              )}

              <Link href="/" className="block">
                <Button variant="outline" className="w-full border-gray-300 text-gray-600 hover:bg-gray-50">
                  <Home className="mr-2 h-4 w-4" />
                  Voltar para a Página Inicial
                </Button>
              </Link>

              {!errorInfo.canRetry && (
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = "mailto:suporte@mediquo.com?subject=Erro de Autenticação&body=Código do erro: " + error)}
                  className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
                >
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Contatar Suporte
                </Button>
              )}
            </div>

            {error && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md border">
                <p className="text-xs text-gray-600 font-mono">
                  <span className="font-medium">Código do erro:</span> {error}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Inclua este código ao entrar em contato com o suporte.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white py-4 border-t border-gray-100">
        <div className="container mx-auto px-4 text-center text-sm text-[#4a4a68]">
          © 2024 Mediquo. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  )
}
