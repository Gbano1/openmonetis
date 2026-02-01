<p align="center">
  <img src="./public/logo_small.png" alt="Opensheets Logo" height="80" />
</p>

<p align="center">
  Projeto pessoal de gestão financeira. Self-hosted, manual e open source.
</p>

> **⚠️ Não há versão online hospedada.** Você precisa clonar o repositório e rodar localmente ou no seu próprio servidor ou computador.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-blue?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue?style=flat-square&logo=docker)](https://www.docker.com/)
[![Android Companion](https://img.shields.io/badge/Companion-Android-3DDC84?style=flat-square&logo=android)](https://github.com/felipegcoutinho/opensheets-companion)
[![License](https://img.shields.io/badge/License-CC_BY--NC--SA_4.0-orange?style=flat-square&logo=creative-commons)](LICENSE)
[![Sponsor](https://img.shields.io/badge/Sponsor-❤️-ea4aaa?style=flat-square&logo=github-sponsors)](https://github.com/sponsors/felipegcoutinho)

---

<p align="center">
  <img src="./public/dashboard-preview-light.png" alt="Dashboard Preview" width="800" />
</p>

---

## 📖 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Início Rápido](#-início-rápido)
  - [Opção 1: Desenvolvimento Local (Recomendado para Devs)](#opção-1-desenvolvimento-local-recomendado-para-devs)
  - [Opção 2: Docker Completo (Usuários Finais)](#opção-2-docker-completo-usuários-finais)
  - [Opção 3: Docker + Banco Remoto](#opção-3-docker--banco-remoto)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Docker - Guia Detalhado](#-docker---guia-detalhado)
- [Configuração de Variáveis de Ambiente](#-configuração-de-variáveis-de-ambiente)
- [Banco de Dados](#-banco-de-dados)
- [Arquitetura](#-arquitetura)
- [Destaques e Funcionalidades Recentes](#-destaques-e-funcionalidades-recentes)
- [Contribuindo](#-contribuindo)
- [Apoie o Projeto](#-apoie-o-projeto)

---

## 🎯 Sobre o Projeto

**Opensheets** é um projeto pessoal de gestão financeira que criei para organizar minhas próprias finanças. Cansei de usar planilhas desorganizadas e aplicativos que não fazem exatamente o que preciso, então decidi construir algo do jeito que funciona pra mim.

A ideia é simples: ter um lugar onde consigo ver todas as minhas contas, cartões, gastos e receitas de forma clara. Se isso for útil pra você também, fique à vontade para usar e contribuir.

### 📊 Estatísticas do Projeto

- **~200 componentes React** organizados por feature
- **17+ tabelas de banco de dados** com relações complexas
- **20+ widgets** no dashboard principal
- **18+ queries paralelas** otimizadas para performance
- **~820 linhas** de schema Drizzle ORM
- **Docker multi-stage** com imagem final de ~200MB
- **100% TypeScript** com strict mode
- **Self-hosted** - seus dados, seu controle
- **App Companion Android** - captura automática de notificações bancárias

> 💡 **Licença Não-Comercial:** Este projeto é gratuito para uso pessoal, mas não pode ser usado comercialmente. Veja mais detalhes na seção [Licença](#-licença).

### ⚠️ Avisos importantes

**1. Não há versão hospedada online**

Este projeto é self-hosted. Você precisa rodar no seu próprio computador ou servidor. Não existe uma versão pública online onde você pode simplesmente criar uma conta.

**2. Não há Open Finance**

Você precisa registrar manualmente suas transações. Se você procura algo que sincroniza automaticamente com seu banco, este projeto não é pra você.

**3. 🤖 OpenSheets Companion (Android)**

Existe um app Android complementar que captura notificações de transações dos seus apps de banco (Nubank, Itaú, Bradesco, Inter, C6 e outros) e envia automaticamente para sua caixa de entrada no OpenSheets. As notificações ficam como "pré-lançamentos" para você revisar e aprovar.

- **Repositório:** [github.com/felipegcoutinho/opensheets-companion](https://github.com/felipegcoutinho/opensheets-companion)
- **Configuração:** Ajustes → OpenSheets Companion → Gere um token de API

**4. Requer disciplina**

O Opensheets funciona melhor para quem:

- Tem disciplina de registrar os gastos regularmente
- Quer controle total sobre seus dados
- Gosta de entender exatamente onde o dinheiro está indo
- Sabe rodar projetos localmente ou tem vontade de aprender

Se você não se importa em dedicar alguns minutos por dia (ou semana) para manter tudo atualizado, vai funcionar bem. Caso contrário, provavelmente vai abandonar depois de uma semana.

### O que tem aqui

💰 **Controle de contas e transações**

- Registre suas contas bancárias, cartões e dinheiro em espécie
- Adicione receitas, despesas e transferências entre contas
- Organize tudo por categorias (moradia, alimentação, transporte, etc.)
- Veja o saldo atual de cada conta e extratos detalhados
- Importação em massa de lançamentos via texto

📊 **Relatórios e gráficos**

- Dashboard com resumo mensal das suas finanças
- Gráficos de evolução do patrimônio
- Comparação de gastos por categoria
- Relatórios detalhados de categorias com histórico
- Entenda pra onde seu dinheiro está indo

💳 **Faturas de cartão de crédito**

- Cadastre seus cartões e acompanhe as faturas
- Veja o que ainda não foi fechado na fatura atual
- Controle de limites e vencimentos
- Visualização de faturas por período

🎯 **Orçamentos**

- Defina quanto quer gastar por categoria no mês
- Acompanhe se está dentro do planejado
- Indicadores visuais de progresso do orçamento

💸 **Parcelamentos avançados**

- Controle completo de compras parceladas
- Antecipação de parcelas com cálculo de desconto
- Análise consolidada de parcelas em aberto
- Rastreamento de séries de parcelas

🤖 **Insights com IA**

- Análises financeiras geradas por IA (Claude, GPT, Gemini)
- Insights personalizados sobre seus gastos
- Recomendações e alertas inteligentes
- Histórico de insights salvos por período

👥 **Gestão colaborativa**

- Cadastro de pagadores/recebedores
- Sistema de compartilhamento com permissões (admin/viewer)
- Notificações automáticas por e-mail
- Colaboração em lançamentos compartilhados

📝 **Anotações e tarefas**

- Notas de texto para organização
- Listas de tarefas com checkboxes
- Sistema de arquivamento
- Anexação de anotações a lançamentos

📅 **Visualização em calendário**

- Visão mensal de todos os lançamentos
- Navegação intuitiva por data
- Filtros e organização temporal

📲 **OpenSheets Companion (Android)**

- App Android que captura notificações bancárias
- Suporte a Nubank, Itaú, Bradesco, Inter, C6 e outros
- Pré-lançamentos para revisão antes de aprovar
- Autenticação via tokens de API seguros
- Sincronização automática em segundo plano

📊 **Relatórios avançados**

- Tendências de categorias ao longo do tempo
- Análise de uso de cartões de crédito
- Top estabelecimentos mais frequentes
- Filtros por período personalizáveis

⚙️ **Preferências e personalização**

- Tema claro/escuro
- Modo privacidade (oculta valores)
- Customização de comportamento (magnetlines, etc.)
- Configurações de usuário personalizadas

### Stack técnica

Construído com tecnologias modernas que facilitam o desenvolvimento:

- **Next.js 16** com App Router e Turbopack
- **TypeScript** em tudo
- **PostgreSQL 18** como banco de dados
- **Drizzle ORM** para trabalhar com o banco
- **Better Auth** para login (email + OAuth)
- **shadcn/ui** para os componentes da interface
- **Docker** para facilitar deploy e desenvolvimento
- **Tailwind CSS** para estilização

O projeto é open source, seus dados ficam no seu controle (pode rodar localmente ou no seu próprio servidor), e você pode customizar o que quiser.

---

## ✨ Features

### 🔐 Autenticação

- Better Auth 1.4.18 integrado
- OAuth (Google)
- Autenticação por email/senha
- Session management com tokens
- Protected routes via middleware
- Verificação de email
- Tokens de API para integrações externas

### 🗄️ Banco de Dados

- PostgreSQL 18 (última versão estável)
- Drizzle ORM 0.45 com TypeScript
- Migrations automáticas
- Drizzle Studio (UI visual para DB)
- Suporte para banco local (Docker) ou remoto (Supabase, Neon, etc)
- Índices otimizados para performance
- Relações complexas e integridade referencial

### 💼 Gestão Financeira

- Controle completo de contas bancárias
- Gerenciamento de cartões de crédito
- Lançamentos com suporte a:
  - Receitas e despesas
  - Transferências entre contas
  - Parcelamentos com séries
  - Antecipação de parcelas
  - Recorrências
- Categorização flexível
- Orçamentos mensais por categoria
- Faturas de cartão de crédito

### 🤖 Inteligência Artificial

- Integração com múltiplos providers:
  - Anthropic Claude
  - OpenAI GPT
  - Google Gemini
  - OpenRouter
- Análises financeiras personalizadas
- Insights salvos e histórico

### 👥 Colaboração

- Sistema de pagadores/recebedores
- Compartilhamento com permissões granulares
- Notificações por email (Resend)
- Códigos de compartilhamento únicos
- Multi-usuário com isolamento de dados

### 📊 Relatórios e Analytics

- Dashboard interativo com 20+ widgets
- Relatórios detalhados de categorias
- Histórico de transações
- Análise de parcelas consolidada
- Gráficos com Recharts
- Exportação de dados (PDF, Excel)

### 🎨 Interface

- shadcn/ui components (Radix UI)
- Tailwind CSS v4
- Dark mode com next-themes
- Drag-and-drop com dnd-kit
- Responsive design
- Modo privacidade (oculta valores)
- Componentes acessíveis (ARIA)

### 📲 OpenSheets Companion

- App Android para captura de notificações bancárias
- Suporte a múltiplos bancos (Nubank, Itaú, Bradesco, Inter, C6, etc.)
- Caixa de entrada (pré-lançamentos) para revisão
- Tokens de API com hash SHA-256 (nunca armazenados em texto)
- Rate limiting (100 requests/min por usuário)
- API batch para envio de múltiplas notificações
- Endpoint de health check para validação

### 📝 Produtividade

- Sistema de anotações e tarefas
- Calendário de transações
- Importação em massa
- Calculadora integrada
- Preferências personalizáveis
- Changelog integrado

### 🐳 Docker

- Multi-stage build otimizado
- Health checks para app e banco
- Volumes persistentes
- Network isolada
- Scripts npm facilitados
- Imagem final ~200MB

### 🧪 Desenvolvimento

- Next.js 16.1.6 com App Router
- Turbopack (fast refresh)
- TypeScript 5.9.3 (strict mode)
- Biome 2.x (linting + formatting + import organization)
- React 19.2.4 (com Compiler)
- Server Actions
- Parallel data fetching
- Streaming SSR

---

## 🛠️ Tech Stack

### Frontend

- **Framework:** Next.js 16.1.6 (App Router)
- **Linguagem:** TypeScript 5.9.3
- **UI Library:** React 19.2.4
- **Styling:** Tailwind CSS 4.1.18
- **Components:** shadcn/ui (Radix UI)
- **Icons:** Remixicon 4.9.0
- **Drag & Drop:** dnd-kit
- **Tables:** TanStack React Table 8.21.3
- **Charts:** Recharts 3.7.0
- **Validation:** Zod 4.3.6
- **Theme:** next-themes 0.4.6

### Backend

- **Runtime:** Node.js 22
- **Database:** PostgreSQL 18
- **ORM:** Drizzle ORM 0.45.1
- **Database Driver:** pg 8.18.0
- **Auth:** Better Auth 1.4.18
- **Email:** Resend 6.9.1
- **Validation:** Zod 4.3.6

### AI Integration (Opcional)

- **AI SDK:** Vercel AI SDK 6.0.67
- **Anthropic:** Claude (via @ai-sdk/anthropic 3.0.35)
- **OpenAI:** GPT (via @ai-sdk/openai 3.0.25)
- **Google:** Gemini (via @ai-sdk/google 3.0.20)
- **OpenRouter:** via @openrouter/ai-sdk-provider 2.1.1

### Utilities

- **Date Handling:** date-fns 4.1.0
- **Class Management:** clsx 2.1.1 + tailwind-merge 3.4.0
- **PDF Export:** jspdf 4.0.0 + jspdf-autotable 5.0.2
- **Excel Export:** xlsx 0.18.5
- **Toast Notifications:** sonner 2.0.7
- **Command Palette:** cmdk 1.1.1

### DevOps

- **Containerization:** Docker + Docker Compose
- **Package Manager:** pnpm
- **Build Tool:** Turbopack
- **Linting & Formatting:** Biome 2.3.13
- **Database Tools:** Drizzle Kit 0.31.8
- **Analytics:** Vercel Analytics + Speed Insights

---

## 🚀 Início Rápido

Escolha a opção que melhor se adequa ao seu caso:

| Cenário     | Quando usar                               | Comando principal                      |
| ----------- | ----------------------------------------- | -------------------------------------- |
| **Opção 1** | Você vai **desenvolver** e alterar código | `docker compose up db -d` + `pnpm dev` |
| **Opção 2** | Você só quer **usar** a aplicação         | `pnpm docker:up`                       |
| **Opção 3** | Você já tem um **banco remoto**           | `docker compose up app --build`        |

---

### Opção 1: Desenvolvimento Local (Recomendado para Devs)

Esta é a **melhor opção para desenvolvedores** que vão modificar o código.

#### Pré-requisitos

- Node.js 22+ instalado (se usar nvm, execute `nvm install` ou `nvm use`)
- pnpm instalado (ou npm/yarn)
- Docker e Docker Compose instalados

#### Passo a Passo

1. **Clone o repositório**

   ```bash
   git clone https://github.com/felipegcoutinho/opensheets-app.git
   cd opensheets-app
   ```

2. **Instale as dependências**

   ```bash
   pnpm install
   ```

3. **Configure as variáveis de ambiente**

   ```bash
   cp .env.example .env
   ```

   Edite o `.env` e configure:

   ```env
   # Banco de dados (usando Docker)
   DATABASE_URL=postgresql://opensheets:opensheets_dev_password@localhost:5432/opensheets_db

   # Better Auth (gere com: openssl rand -base64 32)
   BETTER_AUTH_SECRET=seu-secret-aqui
   BETTER_AUTH_URL=http://localhost:3000
   ```

4. **Suba apenas o PostgreSQL em Docker**

   ```bash
   docker compose up db -d
   ```

   Isso sobe **apenas o banco de dados** em container. A aplicação roda localmente.

5. **Ative as extensões necessárias no PostgreSQL**

   ```bash
   pnpm db:enableExtensions
   ```

   Ou você pode importar o script diretamente no banco de dados: `scripts/postgres/init.sql`

6. **Execute as migrations**

   ```bash
   pnpm db:push
   ```

7. **Inicie o servidor de desenvolvimento**

   ```bash
   pnpm dev
   ```

8. **Acesse a aplicação**
   ```
   http://localhost:3000
   ```

#### Por que esta opção?

- ✅ **Hot reload perfeito** - Mudanças no código refletem instantaneamente
- ✅ **Debugger funciona** - Use breakpoints normalmente
- ✅ **Menos recursos** - Só o banco roda em Docker
- ✅ **Drizzle Studio** - Acesse com `pnpm db:studio`
- ✅ **Melhor DX** - Developer Experience otimizada

---

### Opção 2: Docker Completo (Usuários Finais)

Ideal para quem quer apenas **usar a aplicação** sem mexer no código.

#### Pré-requisitos

- Docker e Docker Compose instalados

#### Passo a Passo

1. **Clone o repositório**

   ```bash
   git clone https://github.com/felipegcoutinho/opensheets-app.git
   cd opensheets-app
   ```

2. **Configure as variáveis de ambiente**

   ```bash
   cp .env.example .env
   ```

   Edite o `.env`:

   ```env
   # Use o host "db" (nome do serviço Docker)
   DATABASE_URL=postgresql://opensheets:opensheets_dev_password@db:5432/opensheets_db

   # Better Auth
   BETTER_AUTH_SECRET=seu-secret-aqui
   BETTER_AUTH_URL=http://localhost:3000
   ```

3. **Suba tudo em Docker**

   ```bash
   pnpm docker:up
   # ou: docker compose up --build
   ```

   Isso sobe **aplicação + banco de dados** em containers.

4. **Acesse a aplicação**

   ```
   http://localhost:3000
   ```

5. **Para parar**
   ```bash
   pnpm docker:down
   # ou: docker compose down
   ```

#### Dicas

- Use `pnpm docker:up:detached` para rodar em background
- Veja logs com `pnpm docker:logs`
- Reinicie com `pnpm docker:restart`

---

### Opção 3: Docker + Banco Remoto

Se você já tem PostgreSQL no **Supabase**, **Neon**, **Railway**, etc.

#### Passo a Passo

1. **Configure o `.env` com banco remoto**

   ```env
   DATABASE_URL=postgresql://user:password@host.region.provider.com:5432/database?sslmode=require

   BETTER_AUTH_SECRET=seu-secret-aqui
   BETTER_AUTH_URL=http://localhost:3000
   ```

2. **Suba apenas a aplicação**

   ```bash
   docker compose up app --build
   ```

3. **Acesse a aplicação**
   ```
   http://localhost:3000
   ```

---

## 📜 Scripts Disponíveis

### Desenvolvimento

```bash
# Servidor de desenvolvimento (com Turbopack)
pnpm dev

# Build de produção
pnpm build

# Servidor de produção
pnpm start

# Linter
pnpm lint
```

### Banco de Dados (Drizzle)

```bash
# Gerar migrations a partir do schema
pnpm db:generate

# Executar migrations
pnpm db:migrate

# Push schema direto para o banco (dev only)
pnpm db:push

# Abrir Drizzle Studio (UI visual do banco)
pnpm db:studio
```

### Docker

```bash
# Subir todos os containers (app + banco)
pnpm docker:up

# Subir em background (detached mode)
pnpm docker:up:detached

# Parar todos os containers
pnpm docker:down

# Parar e REMOVER volumes (⚠️ apaga dados do banco!)
pnpm docker:down:volumes

# Ver logs em tempo real
pnpm docker:logs

# Logs apenas da aplicação
pnpm docker:logs:app

# Logs apenas do banco de dados
pnpm docker:logs:db

# Reiniciar containers
pnpm docker:restart

# Rebuild completo (força reconstrução)
pnpm docker:rebuild
```

### Utilitários

```bash
# Setup automático de variáveis de ambiente
pnpm env:setup
```

---

## 🐳 Docker - Guia Detalhado

### Arquitetura Docker

```
┌─────────────────────────────────────────────────┐
│              docker-compose.yml                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────────┐      ┌─────────────────┐ │
│  │   app            │      │      db         │ │
│  │   (Next.js 16)   │◄─────┤  (PostgreSQL 18)│ │
│  │   Port: 3000     │      │  Port: 5432     │ │
│  │   Node.js 22     │      │  Alpine Linux   │ │
│  └──────────────────┘      └─────────────────┘ │
│                                                 │
│  Network: opensheets_network (bridge)                │
│  Volume: opensheets_postgres_data (persistent)       │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Multi-Stage Build

O `Dockerfile` usa **3 stages** para otimização:

1. **deps** - Instala dependências
2. **builder** - Builda a aplicação (Next.js standalone)
3. **runner** - Imagem final mínima (apenas produção)

**Benefícios:**

- Imagem final **muito menor** (~200MB vs ~1GB)
- Build cache eficiente
- Apenas dependências de produção no final
- Security: roda como usuário não-root

### Health Checks

Ambos os serviços têm health checks:

**PostgreSQL:**

- Comando: `pg_isready`
- Intervalo: 10s
- Timeout: 5s

**Next.js App:**

- Endpoint: `http://localhost:3000/api/health`
- Intervalo: 30s
- Start period: 40s (aguarda build)

### Volumes e Persistência

```yaml
volumes:
  postgres_data:
    name: opensheets_postgres_data
    driver: local
```

- Os dados do PostgreSQL **persistem** entre restarts
- Para **apagar dados**: `pnpm docker:down:volumes`
- Para **backup**: `docker compose exec db pg_dump...`

### Network Isolada

```yaml
networks:
  opensheets_network:
    name: opensheets_network
    driver: bridge
```

- App e banco se comunicam via network interna
- Isolamento de segurança
- DNS automático (app acessa `db:5432`)

### Comandos Docker Avançados

```bash
# Entrar no container da aplicação
docker compose exec app sh

# Entrar no container do banco
docker compose exec db psql -U opensheets -d opensheets_db

# Ver status dos containers
docker compose ps

# Ver uso de recursos
docker stats opensheets_app opensheets_postgres

# Backup do banco
docker compose exec db pg_dump -U opensheets opensheets_db > backup.sql

# Restaurar backup
docker compose exec -T db psql -U opensheets -d opensheets_db < backup.sql

# Limpar tudo (containers, volumes, images)
docker compose down -v
docker system prune -a
```

### Customizando Portas

No arquivo `.env`:

```env
# Porta da aplicação (padrão: 3000)
APP_PORT=3001

# Porta do banco de dados (padrão: 5432)
DB_PORT=5433
```

---

## 🔐 Configuração de Variáveis de Ambiente

Copie o `.env.example` para `.env` e configure:

### Variáveis Obrigatórias

```env
# === Database ===
DATABASE_URL=postgresql://opensheets:opensheets_dev_password@localhost:5432/opensheets_db

# === Better Auth ===
# Gere com: openssl rand -base64 32
BETTER_AUTH_SECRET=seu-secret-super-secreto-aqui
BETTER_AUTH_URL=http://localhost:3000
```

### Variáveis Opcionais

#### PostgreSQL (customização)

```env
POSTGRES_USER=opensheets
POSTGRES_PASSWORD=opensheets_dev_password
POSTGRES_DB=opensheets_db
```

#### Portas (customização)

```env
APP_PORT=3000
DB_PORT=5432
```

#### OAuth Providers

```env
GOOGLE_CLIENT_ID=seu-google-client-id
GOOGLE_CLIENT_SECRET=seu-google-client-secret

GITHUB_CLIENT_ID=seu-github-client-id
GITHUB_CLIENT_SECRET=seu-github-client-secret
```

#### Email (Resend)

```env
RESEND_API_KEY=re_seu_api_key
EMAIL_FROM=noreply@seudominio.com
```

#### AI Providers

```env
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GOOGLE_GENERATIVE_AI_API_KEY=...
OPENROUTER_API_KEY=sk-or-...
```

### Gerando Secrets

```bash
# BETTER_AUTH_SECRET
openssl rand -base64 32

# Ou use o script automático
pnpm env:setup
```

---

## 🗄️ Banco de Dados

### Escolhendo entre Local e Remoto

| Modo       | Quando usar                           | Como configurar                             |
| ---------- | ------------------------------------- | ------------------------------------------- |
| **Local**  | Desenvolvimento, testes, prototipagem | `DATABASE_URL` com host "db" ou "localhost" |
| **Remoto** | Produção, deploy, banco gerenciado    | `DATABASE_URL` com URL completa do provider |

### Drizzle ORM

#### Schema Definition

Os schemas ficam em `/db/schema.ts`:

```typescript
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow(),
});
```

#### Gerando Migrations

```bash
# Após alterar /db/schema.ts
pnpm db:generate

# Aplica migrations
pnpm db:migrate

# Ou push direto (dev only)
pnpm db:push
```

#### Drizzle Studio

Interface visual para explorar e editar dados:

```bash
pnpm db:studio
```

Abre em: `https://local.drizzle.studio`

### Migrations Automáticas (Docker)

No `docker-compose.yml`, migrations rodam automaticamente:

```yaml
command:
  - |
    echo "📦 Rodando migrations..."
    pnpm db:push

    echo "✅ Iniciando aplicação..."
    node server.js
```

### Backup e Restore

```bash
# Backup (banco local Docker)
docker compose exec db pg_dump -U opensheets opensheets_db > backup_$(date +%Y%m%d).sql

# Backup (banco remoto)
pg_dump $DATABASE_URL > backup.sql

# Restore (Docker)
docker compose exec -T db psql -U opensheets -d opensheets_db < backup.sql

# Restore (remoto)
psql $DATABASE_URL < backup.sql
```

---

## 🏗️ Arquitetura

### Estrutura de Pastas

```
opensheets/
├── app/                           # Next.js App Router
│   ├── api/                       # API Routes
│   │   ├── auth/[...all]/        # Better Auth endpoints
│   │   ├── health/               # Health check (Companion validation)
│   │   └── inbox/                # API para Companion App
│   │       ├── route.ts          # POST - Enviar notificação única
│   │       └── batch/route.ts    # POST - Enviar múltiplas notificações
│   ├── (auth)/                   # Rotas públicas de autenticação
│   │   ├── login/                # Página de login
│   │   └── signup/               # Página de cadastro
│   ├── (dashboard)/              # Rotas protegidas (requer auth)
│   │   ├── dashboard/            # Dashboard principal
│   │   │   └── analise-parcelas/ # Análise de parcelas
│   │   ├── lancamentos/          # Lançamentos/transações
│   │   ├── pre-lancamentos/      # Caixa de entrada (Companion)
│   │   ├── contas/               # Contas bancárias
│   │   │   └── [contaId]/extrato # Extrato da conta
│   │   ├── cartoes/              # Cartões de crédito
│   │   │   └── [cartaoId]/fatura # Fatura do cartão
│   │   ├── categorias/           # Categorias
│   │   │   ├── historico/        # Histórico de categorias
│   │   │   └── [categoryId]/     # Detalhes da categoria
│   │   ├── pagadores/            # Pagadores/recebedores
│   │   │   └── [pagadorId]/      # Detalhes do pagador
│   │   ├── orcamentos/           # Orçamentos mensais
│   │   ├── anotacoes/            # Anotações e tarefas
│   │   │   └── arquivadas/       # Anotações arquivadas
│   │   ├── insights/             # Insights de IA
│   │   ├── relatorios/           # Relatórios
│   │   │   ├── tendencias/       # Tendências de categorias
│   │   │   └── uso-cartoes/      # Análise de cartões
│   │   ├── top-estabelecimentos/ # Top estabelecimentos
│   │   ├── calendario/           # Visão de calendário
│   │   ├── changelog/            # Histórico de mudanças
│   │   └── ajustes/              # Configurações
│   ├── (landing-page)/           # Página inicial pública
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Estilos globais (Tailwind)
│
├── components/                    # React Components (~200 arquivos)
│   ├── ui/                       # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── table.tsx
│   │   └── ... (40+ componentes)
│   ├── lancamentos/              # Componentes de lançamentos
│   │   ├── dialogs/             # Diálogos (criar, editar, detalhes)
│   │   ├── table/               # Tabela com filtros avançados
│   │   ├── shared/              # Componentes compartilhados
│   │   └── page/                # Página completa
│   ├── dashboard/                # Widgets do dashboard (20+ widgets)
│   │   ├── accounts-summary.tsx
│   │   ├── income-expense-chart.tsx
│   │   ├── category-breakdown.tsx
│   │   └── ...
│   ├── cartoes/                  # Componentes de cartões
│   ├── contas/                   # Componentes de contas
│   ├── categorias/               # Componentes de categorias
│   ├── pagadores/                # Componentes de pagadores
│   ├── orcamentos/               # Componentes de orçamentos
│   ├── anotacoes/                # Componentes de anotações
│   ├── insights/                 # Componentes de insights IA
│   ├── relatorios/               # Componentes de relatórios
│   ├── pre-lancamentos/          # Componentes da caixa de entrada
│   ├── top-estabelecimentos/     # Top estabelecimentos
│   ├── calendario/               # Componentes de calendário
│   ├── calculadora/              # Calculadora integrada
│   ├── ajustes/                  # Configurações e Companion
│   ├── sidebar/                  # Sidebar de navegação
│   ├── skeletons/                # Estados de loading
│   └── month-picker/             # Seletor de mês/período
│
├── lib/                          # Lógica de negócio e utilitários
│   ├── auth/
│   │   ├── config.ts            # Configuração Better Auth
│   │   ├── server.ts            # Auth helpers (servidor)
│   │   └── client.ts            # Auth client
│   ├── db.ts                    # Conexão Drizzle ORM
│   ├── dashboard/               # Fetchers do dashboard
│   │   ├── fetch-dashboard-data.ts  # Fetcher principal (18+ queries paralelas)
│   │   ├── accounts.ts
│   │   ├── metrics.ts
│   │   └── ... (15+ fetchers especializados)
│   ├── lancamentos/             # Lógica de lançamentos
│   │   ├── constants.ts
│   │   ├── form-helpers.ts
│   │   ├── categoria-helpers.ts
│   │   └── formatting-helpers.ts
│   ├── actions/                 # Helpers de Server Actions
│   │   ├── helpers.ts           # Error handling, revalidation
│   │   └── types.ts             # ActionResult types
│   ├── schemas/                 # Zod validation schemas
│   ├── utils/                   # Utilitários gerais
│   │   ├── currency.ts          # Formatação de moeda
│   │   ├── date.ts              # Manipulação de datas
│   │   ├── period/              # Utilitários de período (YYYY-MM)
│   │   └── calculator.ts        # Lógica da calculadora
│   └── ...                      # Outros helpers
│
├── db/                           # Banco de dados
│   └── schema.ts                # Schema Drizzle (736 linhas)
│                                 # 15+ tabelas com relações complexas
│
├── drizzle/                      # Migrations geradas
│   ├── migrations/
│   └── meta/
│
├── hooks/                        # React Hooks customizados
│   ├── use-month-period.ts      # Gerenciamento de período
│   ├── use-form-state.ts        # Estado de formulários
│   ├── use-calculator-state.ts  # Estado da calculadora
│   └── use-mobile.ts            # Detecção mobile
│
├── public/                       # Assets estáticos
│   ├── logos/                   # Logos de bancos
│   ├── bandeiras/               # Bandeiras de cartões
│   ├── icones/                  # Ícones de categorias
│   ├── avatares/                # Avatares de usuários
│   ├── providers/               # Logos de providers
│   └── fonts/                   # Fontes customizadas
│
├── scripts/                      # Scripts utilitários
│   ├── setup-env.sh             # Setup de variáveis de ambiente
│   └── postgres/
│       ├── init.sql             # Script de inicialização do PostgreSQL
│       └── enable-extensions.ts # Habilita extensões do PostgreSQL
│
├── Dockerfile                    # Multi-stage build otimizado
├── docker-compose.yml            # Orquestração Docker
├── next.config.ts                # Configuração Next.js
├── drizzle.config.ts             # Configuração Drizzle ORM
├── tailwind.config.ts            # Configuração Tailwind CSS
├── postcss.config.mjs            # PostCSS config
├── components.json               # shadcn/ui config
├── biome.json                    # Biome config (linting + formatting)
├── tsconfig.json                 # TypeScript config
├── package.json                  # Dependências e scripts
├── .env.example                  # Template de variáveis de ambiente
├── CLAUDE.md                     # Guia completo para IA
└── README.md                     # Este arquivo
```

### Principais Diretórios

| Diretório          | Descrição                                   | Arquivos |
| ------------------ | ------------------------------------------- | -------- |
| `app/(dashboard)/` | Páginas protegidas da aplicação             | ~60      |
| `app/api/`         | Endpoints da API (auth, inbox, health)      | ~5       |
| `components/`      | Componentes React reutilizáveis             | ~200     |
| `lib/`             | Lógica de negócio, helpers e utilitários    | ~80      |
| `db/`              | Schema do banco de dados                    | 1        |
| `hooks/`           | React hooks customizados                    | ~10      |
| `public/`          | Assets estáticos (imagens, ícones, logos)   | ~100     |
| `scripts/`         | Scripts de automação                        | ~5       |

### Estrutura do Banco de Dados

O OpenSheets possui um schema robusto com 17+ tabelas e relações complexas:

```
┌─────────────────────────────────────────────────────────────────┐
│                    TABELAS PRINCIPAIS                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  user                      preferenciasUsuario                   │
│  ├── id                   ├── id                                │
│  ├── name                 ├── userId → user.id                  │
│  ├── email                ├── disableMagnetlines                │
│  └── ...                  ├── dashboardWidgets (JSON)           │
│                           └── ...                                │
│                                                                  │
│  contas                    cartoes                              │
│  ├── id                   ├── id                                │
│  ├── userId → user.id     ├── userId → user.id                  │
│  ├── nome                 ├── contaId → contas.id               │
│  ├── tipoConta            ├── nome                              │
│  ├── saldoInicial         ├── bandeira                          │
│  └── ...                  ├── dtFechamento                      │
│                           ├── dtVencimento                       │
│                           └── ...                                │
│                                                                  │
│  categorias                pagadores                            │
│  ├── id                   ├── id                                │
│  ├── userId → user.id     ├── userId → user.id                  │
│  ├── nome                 ├── nome                              │
│  ├── tipo                 ├── email                             │
│  ├── icone                ├── shareCode (único)                 │
│  └── ...                  ├── isAutoSend                        │
│                           └── ...                                │
│                                                                  │
│  compartilhamentosPagador                                       │
│  ├── id                                                         │
│  ├── pagadorId → pagadores.id                                   │
│  ├── sharedWithUserId → user.id                                │
│  ├── createdByUserId → user.id                                 │
│  ├── permission (read/write)                                    │
│  └── ...                                                         │
│                                                                  │
│  lancamentos (TABELA PRINCIPAL)                                │
│  ├── id                                                         │
│  ├── userId → user.id                                           │
│  ├── contaId → contas.id                                        │
│  ├── cartaoId → cartoes.id                                      │
│  ├── categoriaId → categorias.id                               │
│  ├── pagadorId → pagadores.id                                   │
│  ├── nome                                                        │
│  ├── valor                                                       │
│  ├── tipoTransacao (receita/despesa/transferencia)             │
│  ├── formaPagamento                                             │
│  ├── condicao (aberto/realizado/cancelado)                     │
│  ├── dataCompra                                                 │
│  ├── periodo (YYYY-MM)                                          │
│  ├── qtdeParcela                                                │
│  ├── parcelaAtual                                               │
│  ├── seriesId (agrupa parcelas)                                │
│  ├── transferId (agrupa transferências)                        │
│  ├── antecipado (boolean)                                       │
│  ├── antecipacaoId → antecipacoesParcelas.id                  │
│  └── ...                                                         │
│                                                                  │
│  antecipacoesParcelas                                          │
│  ├── id                                                         │
│  ├── userId → user.id                                           │
│  ├── seriesId                                                   │
│  ├── lancamentoId → lancamentos.id                             │
│  ├── periodoAntecipacao                                         │
│  ├── parcelasAntecipadas (JSONB array)                         │
│  ├── valorTotal                                                 │
│  ├── desconto                                                   │
│  └── ...                                                         │
│                                                                  │
│  faturas                   orcamentos                           │
│  ├── id                   ├── id                                │
│  ├── userId → user.id     ├── userId → user.id                  │
│  ├── cartaoId → cartoes   ├── categoriaId → categorias.id       │
│  ├── periodo              ├── valor                             │
│  ├── statusPagamento      ├── periodo                           │
│  └── ...                  └── ...                                │
│                                                                  │
│  anotacoes                 insightsSalvos                       │
│  ├── id                   ├── id                                │
│  ├── userId → user.id     ├── userId → user.id                  │
│  ├── titulo               ├── period                            │
│  ├── descricao            ├── modelId                           │
│  ├── tipo (nota/tarefa)   ├── data (JSON)                       │
│  ├── tasks (JSON)         └── createdAt                         │
│  ├── arquivada                                                  │
│  └── ...                                                         │
│                                                                  │
│  ══════════════════ COMPANION APP ══════════════════           │
│                                                                  │
│  tokensApi                 preLancamentos                       │
│  ├── id                   ├── id                                │
│  ├── userId → user.id     ├── userId → user.id                  │
│  ├── name                 ├── sourceApp                         │
│  ├── tokenHash (SHA-256)  ├── sourceAppName                     │
│  ├── tokenPrefix          ├── originalTitle                     │
│  ├── lastUsedAt           ├── originalText                      │
│  ├── lastUsedIp           ├── parsedName                        │
│  ├── expiresAt            ├── parsedAmount                      │
│  ├── revokedAt            ├── status (pending/processed)        │
│  └── createdAt            ├── lancamentoId → lancamentos.id     │
│                           └── ...                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

ÍNDICES OTIMIZADOS:
• userId + periodo (queries do dashboard)
• userId + dataCompra (ordenação por data)
• seriesId (agrupamento de parcelas)
• cartaoId + periodo (faturas)
• userId + condicao (filtros de condição)
• shareCode (compartilhamento)
• tokenHash (autenticação API)
• userId + status (inbox filtering)
```

### Fluxo de Autenticação

```
1. Usuário acessa rota protegida
   ↓
2. middleware.ts verifica sessão (Better Auth)
   ↓
3. Se não autenticado → redirect /login
   ↓
4. Usuário faz login (OAuth Google ou email/senha)
   ↓
5. Better Auth valida credenciais e cria sessão
   ↓
6. Cookie de sessão é salvo no navegador
   ↓
7. Inicialização automática de dados do usuário:
   - Categorias padrão criadas
   - Preferências inicializadas
   ↓
8. Usuário acessa dashboard ✅
```

### Fluxo de Dados (Dashboard)

```
1. Usuário acessa /dashboard
   ↓
2. Server Component busca userId da sessão
   ↓
3. fetchDashboardData() executa 18+ queries em paralelo:
   - Métricas (receitas, despesas, saldo)
   - Contas e seus saldos
   - Cartões e faturas
   - Lançamentos recentes
   - Gráficos de categorias
   - Parcelas em aberto
   - Orçamentos vs. realizado
   - ... e mais 10+ datasets
   ↓
4. Dados retornados em ~200-500ms (otimizado)
   ↓
5. Server Component renderiza com dados
   ↓
6. Client Components hidratam com interatividade
   ↓
7. Dashboard totalmente funcional ✅
```

### Fluxo de Build (Docker)

```
1. Stage deps: Instala dependências
   ↓
2. Stage builder: Builda Next.js (standalone)
   ↓
3. Stage runner: Copia apenas build + deps prod
   ↓
4. Container final: ~200MB (otimizado)
```

---

## 🆕 Destaques e Funcionalidades Recentes

O OpenSheets está em desenvolvimento ativo. Aqui estão algumas das funcionalidades mais interessantes já implementadas:

### 📲 OpenSheets Companion

Integração completa com app Android para captura automática de notificações bancárias:

- **Captura automática:** Nubank, Itaú, Bradesco, Inter, C6 e outros bancos
- **Caixa de entrada:** Notificações chegam como pré-lançamentos para revisão
- **Edição inline:** Ajuste valores e descrições antes de aprovar
- **Tokens seguros:** Autenticação via tokens com hash SHA-256
- **Rate limiting:** Proteção contra abuso (100 req/min)
- **API batch:** Envio de múltiplas notificações de uma vez
- **Health check:** Endpoint para validação de conectividade

O app Companion está disponível em: [github.com/felipegcoutinho/opensheets-companion](https://github.com/felipegcoutinho/opensheets-companion)

### 💸 Sistema Avançado de Parcelamentos

O controle de parcelamentos vai além do básico:

- **Séries de parcelas:** Agrupa todas as parcelas de uma compra
- **Antecipação inteligente:** Antecipe parcelas com cálculo automático de desconto
- **Análise consolidada:** Veja todas as parcelas em aberto e o impacto nos próximos meses
- **Rastreamento completo:** Histórico de todas as operações de antecipação

### 🤖 Insights Financeiros com IA

Integração robusta com múltiplos providers de IA:

- **Multi-provider:** Escolha entre Claude, GPT, Gemini ou OpenRouter
- **Análises personalizadas:** IA analisa seus padrões de gastos e sugere melhorias
- **Histórico persistente:** Insights salvos por período para acompanhamento
- **Contextual:** A IA tem acesso aos seus dados financeiros para análises precisas

### 👥 Colaboração e Compartilhamento

Sistema completo para gestão colaborativa de finanças:

- **Pagadores compartilhados:** Compartilhe acesso a pagadores específicos
- **Permissões granulares:** Defina quem pode visualizar ou editar
- **Códigos únicos:** Cada pagador tem um código de compartilhamento exclusivo
- **Notificações automáticas:** E-mails enviados automaticamente via Resend
- **Multi-usuário seguro:** Isolamento completo de dados entre usuários

### 📊 Relatórios Detalhados

Analytics poderosos para entender suas finanças:

- **Dashboard interativo:** 20+ widgets com diferentes visualizações
- **Relatórios de categorias:** Análise profunda por categoria com histórico
- **Tendências:** Visualize a evolução de categorias ao longo de 3, 6 ou 12 meses
- **Uso de cartões:** Análise detalhada de gastos por cartão de crédito
- **Top estabelecimentos:** Veja onde você mais gasta
- **Comparativos mensais:** Evolução dos seus gastos ao longo do tempo
- **Exportações:** PDF e Excel para análise externa
- **Gráficos interativos:** Recharts com dados em tempo real

### 📝 Produtividade Integrada

Ferramentas para manter tudo organizado:

- **Anotações:** Notas de texto para lembretes e planejamentos
- **Tarefas:** Listas com checkboxes para acompanhamento
- **Arquivamento:** Mantenha o histórico sem poluir a interface
- **Calendário:** Visualize todos os lançamentos em um calendário mensal
- **Calculadora:** Calculadora integrada para planejamento rápido

### 🎨 Experiência do Usuário

Atenção aos detalhes que fazem diferença:

- **Modo privacidade:** Oculte valores sensíveis com um clique
- **Tema adaptável:** Dark/light mode com persistência
- **Preferências:** Customize o comportamento da aplicação
- **Importação em massa:** Cole múltiplos lançamentos de uma vez
- **Responsivo:** Funciona perfeitamente em desktop e mobile

### 🔒 Segurança e Performance

Construído com as melhores práticas:

- **Isolamento de dados:** Cada usuário vê apenas seus próprios dados
- **Índices otimizados:** Queries rápidas mesmo com milhares de registros
- **Server Actions:** Mutações seguras no servidor
- **Type-safety:** TypeScript strict em toda a codebase
- **Validação robusta:** Zod schemas para todos os inputs

### 📦 Developer Experience

Feito por desenvolvedores, para desenvolvedores:

- **Hot reload instantâneo:** Turbopack para desenvolvimento rápido
- **Type inference:** Drizzle ORM com tipos automáticos
- **Migrations automáticas:** Schema sync simplificado
- **Docker completo:** Ambiente reproduzível em qualquer lugar
- **Scripts facilitados:** Comandos npm para tudo
- **Biome:** Linting e formatting unificados em uma ferramenta

---

## 🤝 Contribuindo

Contribuições são muito bem-vindas!

### Como contribuir

1. **Fork** o projeto
2. **Clone** seu fork
   ```bash
   git clone https://github.com/seu-usuario/opensheets-app.git
   ```
3. **Crie uma branch** para sua feature
   ```bash
   git checkout -b feature/minha-feature
   ```
4. **Commit** suas mudanças
   ```bash
   git commit -m 'feat: adiciona minha feature'
   ```
5. **Push** para a branch
   ```bash
   git push origin feature/minha-feature
   ```
6. Abra um **Pull Request**

### Padrões

- Use **TypeScript**
- Documente **features novas**
- Use **commits semânticos** (feat, fix, docs, etc)

---

## 💖 Apoie o Projeto

Se o **Opensheets** está sendo útil para você e você quer apoiar o desenvolvimento contínuo do projeto, considere se tornar um sponsor!

[![Sponsor no GitHub](https://img.shields.io/badge/Sponsor_no_GitHub-❤️-ea4aaa?style=for-the-badge&logo=github-sponsors)](https://github.com/sponsors/felipegcoutinho)

### Por que apoiar?

- 🚀 **Desenvolvimento contínuo** - Novas features e melhorias regulares
- 🐛 **Correções de bugs** - Manutenção ativa e suporte
- 📚 **Documentação** - Guias e tutoriais detalhados
- 💡 **Novas ideias** - Implementação de sugestões da comunidade

### Outras formas de contribuir

Além do suporte financeiro, você pode contribuir:

- ⭐ Dando uma **estrela** no repositório
- 🐛 Reportando **bugs** e sugerindo melhorias
- 📖 Melhorando a **documentação**
- 💻 Submetendo **pull requests**
- 💬 Compartilhando o projeto com outras pessoas

---

## 📄 Licença

Este projeto está licenciado sob a **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International** (CC BY-NC-SA 4.0).

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC_BY--NC--SA_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

### ✅ Você PODE:

- **Usar** o projeto para fins pessoais
- **Modificar** o código-fonte
- **Distribuir** e compartilhar o projeto
- **Fazer fork** e criar versões modificadas

### ❌ Você NÃO PODE:

- **Uso comercial** - Ganhar dinheiro com o projeto (vender, SaaS, consultoria baseada nele)
- **Remover créditos** - Você deve manter a atribuição ao autor original
- **Mudar a licença** - Suas modificações devem usar a mesma licença

### 📋 Requisitos:

- Dar **crédito** ao autor original (Felipe Coutinho)
- Indicar se **modificações** foram feitas
- Distribuir sob a **mesma licença** (CC BY-NC-SA 4.0)

**Resumo:** Use livremente para projetos pessoais, contribua, modifique - mas não ganhe dinheiro com isso.

Para o texto legal completo, consulte o arquivo [LICENSE](LICENSE) ou visite [creativecommons.org](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.pt).

---

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/)
- [Better Auth](https://better-auth.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Biome](https://biomejs.dev/)
- [Vercel](https://vercel.com/)

---

## 📞 Contato

**Desenvolvido por:** Felipe Coutinho
**GitHub:** [@felipegcoutinho](https://github.com/felipegcoutinho)
**Repositório:** [opensheets](https://github.com/felipegcoutinho/opensheets-app)

---

<div align="center">

**⭐ Se este projeto foi útil pra você:**

- Dê uma estrela no repositório
- [Apoie o projeto como sponsor](https://github.com/sponsors/felipegcoutinho)
- Compartilhe com outras pessoas

Desenvolvido com ❤️ para a comunidade open source

</div>
