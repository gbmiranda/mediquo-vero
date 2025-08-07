"use client"

import { useEffect } from "react"
import { logger } from "@/utils/logger"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    logger.error("Global error", error)
  }, [error])

  const getErrorDetails = () => {
    if (error.message.includes("ChunkLoadError") || error.message.includes("Loading chunk")) {
      return {
        title: "Erro ao carregar aplicação",
        description: "Houve uma atualização da aplicação. É necessário recarregar a página.",
        actionable: "Recarregue a página para continuar",
        showRefresh: true
      }
    } else if (error.message.includes("Network")) {
      return {
        title: "Erro de conectividade",
        description: "Não foi possível estabelecer conexão com o servidor.",
        actionable: "Verifique sua conexão com a internet",
        showRefresh: false
      }
    } else {
      return {
        title: "Erro crítico",
        description: "Ocorreu um erro crítico na aplicação que impediu seu funcionamento.",
        actionable: "Recarregue a página ou entre em contato com o suporte",
        showRefresh: true
      }
    }
  }

  const errorInfo = getErrorDetails()

  return (
    <html lang="pt-BR">
      <head>
        <title>Erro - MediQuo Consultas</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f3ff;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
          }
          .container {
            background: white;
            padding: 2rem;
            border-radius: 0.75rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 28rem;
            width: 100%;
          }
          .icon {
            width: 3rem;
            height: 3rem;
            margin: 0 auto 1.5rem;
            color: #ef4444;
          }
          h1 {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1e1e4b;
            margin-bottom: 1rem;
          }
          p {
            color: #4a4a68;
            margin-bottom: 0.5rem;
            line-height: 1.5;
          }
          .error-id {
            font-size: 0.75rem;
            color: #9ca3af;
            margin: 1rem 0;
            padding: 0.5rem;
            background: #f9fafb;
            border-radius: 0.375rem;
            font-family: monospace;
          }
          .button-group {
            margin-top: 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }
          button {
            padding: 0.75rem 1.5rem;
            border-radius: 0.375rem;
            font-weight: 500;
            cursor: pointer;
            border: none;
            transition: all 0.2s;
          }
          .primary {
            background: linear-gradient(to right, #6c3ce9, #39c0d4);
            color: white;
          }
          .primary:hover {
            background: linear-gradient(to right, #5b33c5, #32a7b9);
          }
          .secondary {
            background: white;
            color: #4a4a68;
            border: 1px solid #e5e7eb;
          }
          .secondary:hover {
            background: #f9fafb;
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          <h1>{errorInfo.title}</h1>
          <p>{errorInfo.description}</p>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{errorInfo.actionable}</p>

          {error.digest && (
            <div className="error-id">
              ID do Erro: {error.digest}
            </div>
          )}

          <div className="button-group">
            {errorInfo.showRefresh && (
              <button onClick={reset} className="primary">
                🔄 Recarregar página
              </button>
            )}

            <button
              onClick={() => window.location.href = '/'}
              className="secondary"
            >
              🏠 Ir para página inicial
            </button>

            <button
              onClick={() => window.location.href = 'mailto:suporte@mediquo.com'}
              className="secondary"
            >
              📧 Contatar suporte
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
