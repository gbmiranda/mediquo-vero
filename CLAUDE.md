# MediQuo Vero - Documentação do Projeto

## 📋 Visão Geral

**Projeto:** MediQuo Vero - Plataforma de Telemedicina  
**Descrição:** Sistema de telemedicina que oferece consultas médicas online 24h, integrando os serviços da MediQuo com a plataforma Vero. Permite acesso a clínicos gerais, pediatras, especialistas, veterinários, psicólogos, nutricionistas e educadores físicos.

### Stack Tecnológico

- **Framework:** Next.js 15.2.4 com App Router
- **UI:** React 18.3.1 + TypeScript 5.8.3
- **Estilização:** TailwindCSS 3.4.17 + shadcn/ui components
- **Gerenciador de Pacotes:** pnpm 9.0.0
- **Deploy:** AWS Amplify com SSR habilitado
- **Node:** >=18.0.0

## 🏗️ Arquitetura e Estrutura

### Estrutura de Diretórios

```
src/
├── app/                    # App Router do Next.js
│   ├── page.tsx           # Landing page principal
│   ├── layout.tsx         # Layout raiz da aplicação
│   ├── cliente/           # Área do cliente
│   │   ├── login/         # Página de login
│   │   ├── checkout/      # Processo de pagamento
│   │   ├── assinatura/    # Gestão de assinaturas
│   │   └── complete-profile/ # Completar perfil do usuário
│   └── auth/              # Rotas de autenticação
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes base (shadcn/ui)
│   ├── site-header.tsx   # Header do site
│   └── user-header.tsx   # Header do usuário logado
├── services/             # Camada de serviços/API
│   ├── api-config.ts     # Configuração base da API
│   ├── auth-service.ts   # Autenticação
│   ├── user-service.ts   # Gestão de usuários
│   ├── checkout-service.ts # Processamento de pagamentos
│   └── mediquo-service.ts # Integração com MediQuo
├── contexts/             # Contextos React
│   └── auth-context.tsx  # Estado global de autenticação
├── types/                # TypeScript types/interfaces
├── utils/                # Utilitários
│   ├── auth-storage.ts   # Gestão de localStorage
│   └── logger.ts         # Sistema de logging
└── styles/               # Estilos globais
```

### Componentes UI (shadcn/ui + Radix UI)

- Button, Card, Dialog, Form, Input, Select
- Toast/Toaster para notificações
- Avatar, Badge, Checkbox
- Dropdown Menu
- Input OTP, Masked Input (CPF, telefone)

## 🔄 Fluxo Principal do Sistema

### Jornada do Usuário

1. **Landing Page** (`/`)

   - Apresentação dos serviços
   - CTAs para login/cadastro
   - Informações sobre planos

2. **Autenticação** (`/cliente/login`)

   - Signup com email
   - Verificação via código OTP (6 dígitos)
   - Armazenamento de token JWT

3. **Completar Perfil** (`/cliente/complete-profile`)

   - Dados pessoais (nome, CPF, telefone)
   - Validação de campos obrigatórios
   - Atualização do perfil via API

4. **Checkout** (`/cliente/checkout`)

   - Formulário de pagamento
   - Validação de cartão de crédito
   - Endereço via CEP (integração ViaCEP)
   - Processamento da transação

5. **Assinatura** (`/cliente/assinatura`)
   - Gestão da assinatura ativa
   - Acesso ao token MediQuo
   - Redirecionamento para o app

## 🔌 APIs e Integrações

### API Principal

- **Base URL:** `https://araujo-api.mediquo.com.br`
- **Autenticação:** Bearer Token (JWT)
- **Headers padrão:**
  ```typescript
  {
    'accept': 'application/hal+json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer {token}'
  }
  ```

### Endpoints Principais

- **Auth:**

  - POST `/auth/signup` - Cadastro de usuário
  - POST `/auth/otp` - Validação de código OTP
  - POST `/auth/logout` - Logout

- **User:**

  - GET `/user` - Obter perfil
  - PUT `/user` - Atualizar perfil

- **Checkout:**

  - POST `/api-checkout/transaction/card` - Processar pagamento

- **MediQuo:**
  - GET `/patient/{cpf}/mediquo-login` - Obter token de acesso

### Integração com Serviços Externos

- **ViaCEP:** Busca de endereços por CEP
- **MediQuo App:** Redirecionamento com token de autenticação
- **Google Analytics:** Tracking de eventos (GA4)

## 🛠️ Desenvolvimento

### Comandos Principais

```bash
# Desenvolvimento local (porta 8082)
pnpm dev

# Build de produção
pnpm build

# Build para Amplify
pnpm build:amplify

# Lint
pnpm lint

# Deploy AWS (S3 + CloudFront)
pnpm deploy:aws
```

### Variáveis de Ambiente

- `NODE_ENV` - Ambiente (development/production)
- `NEXT_TELEMETRY_DISABLED` - Desabilita telemetria do Next.js
- `S3_BUCKET_NAME` - Bucket S3 para deploy
- `CLOUDFRONT_DISTRIBUTION_ID` - ID da distribuição CloudFront

### Configurações do Next.js

- **SSR habilitado** (não usa `output: 'export'`)
- **Trailing slash:** true
- **React Strict Mode:** true
- **TypeScript Build Errors:** Ignorados (temporário)
- **ESLint Build Errors:** Ignorados (temporário)
- **Console removal:** Em produção

## 🎨 Sistema de Design

### Cores Principais

```css
--primary: #D63066    /* Rosa principal */
--secondary: #8A0038  /* Vinho escuro */
--accent: #F3953F     /* Laranja */
--highlight: #FFD31B  /* Amarelo */
```

### Tipografia

- Font-family: System fonts (padrão Next.js)
- Responsivo com classes Tailwind

### Componentes Customizados

- Headers com gradientes e blur effects
- Cards com sombras customizadas
- Botões com hover states
- FAQ accordion
- Seções com imagens otimizadas (Next/Image)

## 🔐 Segurança

### Headers de Segurança (via middleware)

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

### Autenticação e Autorização

- Tokens JWT armazenados no localStorage
- Context API para estado global
- Rotas protegidas com verificação de autenticação
- Limpeza automática de dados ao fazer logout

### Validações

- Inputs com máscaras (CPF, telefone, CEP)
- Validação de formulários com react-hook-form
- Schemas de validação com Zod
- Sanitização de dados antes do envio

## 📝 Convenções de Código

### TypeScript

- **Strict mode:** Habilitado
- **Path aliases:** Configurados (@/\*)
- **Types centralizados:** Em `src/types/`

### React/Next.js

- **Client Components:** Usar `'use client'` quando necessário
- **Server Components:** Por padrão no App Router
- **Loading states:** Arquivos `loading.tsx`
- **Error boundaries:** Arquivos `error.tsx`

### Padrões de Código

- Componentes funcionais com hooks
- Async/await para operações assíncronas
- Error handling com try/catch
- Logging customizado para debug

## 🚀 Deploy e Infraestrutura

### AWS Amplify

- **Configuração:** `amplify.yml`
- **Build:** Via pnpm
- **Artifacts:** Diretório `.next`
- **Cache:** node_modules e .next/cache

### Otimizações

- Image optimization com Next/Image
- Lazy loading de componentes
- Code splitting automático
- Minificação em produção

## 🐛 Debug e Troubleshooting

### Sistema de Logging

```typescript
logger.authFlow(); // Fluxo de autenticação
logger.apiRequest(); // Requisições à API
logger.apiResponse(); // Respostas da API
logger.error(); // Erros gerais
logger.info(); // Informações gerais
```

### Tratamento de Erros

- Mensagens de erro user-friendly
- Fallbacks para erros de rede
- Retry logic para operações críticas
- Toast notifications para feedback

## 📦 Dependências Principais

### Produção

- `next`: Framework React
- `react`, `react-dom`: Biblioteca UI
- `@radix-ui/*`: Componentes headless
- `react-hook-form`: Gestão de formulários
- `zod`: Validação de schemas
- `clsx`, `tailwind-merge`: Utilities CSS
- `lucide-react`: Ícones

### Desenvolvimento

- `typescript`: Tipagem estática
- `tailwindcss`: Framework CSS
- `postcss`, `autoprefixer`: Processamento CSS

## 🔄 Atualizações e Manutenção

### Pontos de Atenção

1. **Build errors ignorados:** ESLint e TypeScript errors estão temporariamente desabilitados no build
2. **Console logs:** Removidos automaticamente em produção
3. **Cache:** Desabilitado em requisições críticas com `cache: 'no-store'`
4. **Tokens:** Verificar validade antes de requisições autenticadas

### Melhorias Futuras Sugeridas

- [ ] Habilitar verificação de TypeScript no build
- [ ] Habilitar ESLint no build
- [ ] Implementar testes automatizados
- [ ] Adicionar monitoramento de erros (Sentry)
- [ ] Implementar PWA features
- [ ] Adicionar internacionalização (i18n)

## 📞 Suporte e Contato

- **Plataforma:** MediQuo + Vero
- **Website:** https://mediquo.com.br/
- **Suporte técnico:** Via plataforma

---

_Última atualização: Janeiro 2025_
