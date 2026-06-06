# Consulta Fácil — Web

Frontend da plataforma de saúde para agendamento de consultas médicas. Interface adaptada por role: paciente, profissional, recepcionista e admin.

## Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| Next.js | 14 | App Router, SSR/RSC |
| TypeScript | strict | Tipagem estática |
| shadcn/ui + Tailwind | v4 | Componentes e estilos |
| TanStack Query | v5 | Cache e sincronização de dados |
| Zustand | v5 | Estado global (auth, UI) |
| React Hook Form + Zod | — | Formulários e validação |
| Vitest | v4 | Testes unitários |
| Biome | 2.x | Lint e formatação |
| Orval | 8.x | Geração de cliente API (OpenAPI) |

## Setup rápido

```bash
npm install
npm run dev
```

Frontend disponível em `http://localhost:3000`

A API precisa estar rodando em `http://localhost:8080` (ver `../api/README.md`).

## Comandos

```bash
make dev              # modo desenvolvimento
make build            # build de produção
make lint             # lint com Biome
make test             # testes (Vitest)
make test-coverage    # testes + cobertura

make api-export       # exporta openapi.json da API local
make api-generate     # gera src/lib/api/generated/ a partir do openapi.json
make api-sync         # export + generate em sequência

make up               # sobe stack completa via docker compose
make down             # para todos os containers
```

## Variáveis de Ambiente

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/v1
NEXT_PUBLIC_GRAFANA_FARO_URL=           # opcional — RUM com Grafana Faro
```

## Funcionalidades por Role

### Paciente
- Buscar profissionais por nome, especialidade e localização
- Agendar consultas com escolha de serviço e método de pagamento
- Acompanhar consultas com status em tempo real
- Preencher anamnese pré-consulta
- Gerar QR Code para check-in na recepção
- Fazer upload de exames solicitados pelo profissional
- Avaliar consultas concluídas (1–5 estrelas + comentário)
- Remarcar e cancelar consultas
- Pagar via MercadoPago (checkout externo)
- Entrar em teleconsulta via Google Meet
- Ver prontuário clínico das próprias consultas

### Profissional
- Dashboard com agenda do dia e resumo de métricas
- Confirmar, concluir e cancelar consultas
- Gerenciar fila de pacientes (CHECKED_IN → IN_PROGRESS)
- Preencher anamnese e prontuário clínico
- Solicitar e revisar exames
- Definir modalidade (presencial / online) e gerar link Meet
- Criar e gerenciar catálogo de serviços com preços e durações
- Abrir solicitações de procedimento para pacientes
- Configurar horários de atendimento semanal
- Gerenciar clínica e equipe (recepcionistas, membros)
- Configurar preço de consulta e métodos de pagamento aceitos

### Recepcionista
- Painel de recepção com fila do dia
- Check-in de pacientes via leitura de QR Code
- Monitorar status de todas as consultas em tempo real

### Admin
- Acesso completo a todas as funcionalidades
- Aprovar e rejeitar solicitações de profissionais
- Gerenciar usuários e permissões

## Mapa de Páginas

> Use esta seção para solicitar alterações: informe a rota e o que quer mudar.

### Público (sem login)

| Rota | Arquivo | Descrição | Funcionalidades |
|---|---|---|---|
| `/` | `app/page.tsx` | Landing page | Hero, busca de profissionais por especialidade, mapa de clínicas |
| `/professionals` | `app/professionals/page.tsx` | Lista de profissionais | Filtros por nome/especialidade/cidade, paginação, avaliação por estrelas |
| `/professionals/[id]` | `app/professionals/[id]/page.tsx` | Perfil do profissional | Bio, especialidade, avaliação, botão agendar, localização no mapa |
| `/clinics` | `app/clinics/page.tsx` | Lista de clínicas | Filtros, mapa, lista de membros da clínica |
| `/clinics/[id]` | `app/clinics/[id]/page.tsx` | Perfil da clínica | Membros, horários, localização |
| `/clinics/[id]/checkin` | `app/clinics/[id]/checkin/page.tsx` | Check-in QR | Paciente lê QR Code para check-in presencial |
| `/clinics/[id]/queue` | `app/clinics/[id]/queue/page.tsx` | Fila da clínica | Fila de espera pública da clínica |

### Autenticação

| Rota | Arquivo | Descrição |
|---|---|---|
| `/auth/login` | `app/auth/login/page.tsx` | Login com e-mail + senha |
| `/auth/register` | `app/auth/register/page.tsx` | Cadastro de nova conta |
| `/auth/forgot-password` | `app/auth/forgot-password/page.tsx` | Solicitar redefinição de senha |
| `/auth/reset-password` | `app/auth/reset-password/page.tsx` | Definir nova senha (via token) |
| `/auth/magic-link` | `app/auth/magic-link/page.tsx` | Login via link mágico (e-mail) |
| `/auth/magic-link/verify` | `app/auth/magic-link/verify/page.tsx` | Verificar token do link mágico |
| `/auth/completar-cadastro` | `app/auth/completar-cadastro/page.tsx` | Completar dados após cadastro OAuth |

### Dashboard — protegido (login obrigatório)

| Rota | Arquivo | Roles | Funcionalidades |
|---|---|---|---|
| `/dashboard` | `dashboard/page.tsx` | Todos | Resumo de consultas, atalhos rápidos, agenda do dia |
| `/dashboard/appointments` | `dashboard/appointments/page.tsx` | Todos | Lista de consultas com filtros de status, paginação |
| `/dashboard/appointments/create` | `dashboard/appointments/create/page.tsx` | Todos | Agendamento: escolha profissional → serviço → data/hora → pagamento |
| `/dashboard/appointments/create/success` | `dashboard/appointments/create/success/page.tsx` | Todos | Confirmação pós-agendamento |
| `/dashboard/appointments/[id]` | `dashboard/appointments/[id]/page.tsx` | Todos | Detalhe: status, anamnese, prontuário, exames, teleconsulta, QR Code |
| `/dashboard/profile` | `dashboard/profile/page.tsx` | Todos | Editar dados pessoais, foto, dados médicos |
| `/dashboard/become-professional` | `dashboard/become-professional/page.tsx` | PATIENT | Solicitar perfil profissional (envia para revisão) |
| `/dashboard/procedure-requests` | `dashboard/procedure-requests/page.tsx` | PATIENT / PROFESSIONAL | Solicitações de procedimento em aberto |
| `/dashboard/patients` | `dashboard/patients/page.tsx` | PROFESSIONAL / RECEPTIONIST / ADMIN | Lista de pacientes com busca |
| `/dashboard/patients/[id]` | `dashboard/patients/[id]/page.tsx` | PROFESSIONAL / ADMIN | Perfil completo do paciente: histórico, prontuário, exames |
| `/dashboard/services` | `dashboard/services/page.tsx` | PROFESSIONAL / ADMIN | CRUD de serviços: nome, preço, duração |
| `/dashboard/my-clinic` | `dashboard/my-clinic/page.tsx` | PROFESSIONAL / ADMIN | Gerenciar clínica: membros, horários, financeiro |
| `/dashboard/schedule` | `dashboard/schedule/page.tsx` | PROFESSIONAL / ADMIN | Redireciona para `/settings/schedule` |
| `/dashboard/financial` | `dashboard/financial/page.tsx` | PROFESSIONAL / ADMIN | Receita, repasses, uso de cota gratuita |
| `/dashboard/reception` | `dashboard/reception/page.tsx` | RECEPTIONIST / ADMIN | Fila do dia + leitor de QR Code para check-in |

### Configurações — protegido

| Rota | Arquivo | Roles | Funcionalidades |
|---|---|---|---|
| `/settings` | `settings/page.tsx` | Todos | Menu de configurações |
| `/settings/schedule` | `settings/schedule/page.tsx` | PROFESSIONAL | Configurar dias e horários de atendimento semanal |
| `/settings/services` | `settings/services/page.tsx` | PROFESSIONAL | Gerenciar catálogo de serviços (alias de `/dashboard/services`) |
| `/settings/my-clinic` | `settings/my-clinic/page.tsx` | PROFESSIONAL / ADMIN | Dados da clínica, logo, endereço |
| `/settings/theme` | `settings/theme/page.tsx` | Todos | Alternar tema claro/escuro |
| `/settings/billing` | `settings/billing/page.tsx` | PROFESSIONAL / ADMIN | Planos individuais e de clínica, calculadora de preço |
| `/settings/billing/clinic` | `settings/billing/clinic/page.tsx` | PROFESSIONAL / ADMIN | Plano de clínica: membros, cota gratuita |
| `/settings/billing/success` | `settings/billing/success/page.tsx` | — | Confirmação de pagamento bem-sucedido |
| `/settings/billing/pending` | `settings/billing/pending/page.tsx` | — | Pagamento em processamento |
| `/settings/billing/failure` | `settings/billing/failure/page.tsx` | — | Falha no pagamento |

### Admin

| Rota | Arquivo | Roles | Funcionalidades |
|---|---|---|---|
| `/admin` | `app/admin/page.tsx` | ADMIN | Painel admin: aprovar/rejeitar profissionais, métricas da plataforma |

## Segurança

- Recursos acessíveis apenas ao paciente/profissional da consulta (ownership)
- Tokens JWT armazenados de forma segura
- Formulários validados com Zod em todas as fronteiras

## Geração automática do cliente API

O cliente HTTP é gerado pelo [Orval](https://orval.dev) a partir do `openapi.json` da API:

```bash
# 1. Com a API rodando localmente:
make api-sync

# 2. Só regenerar sem exportar:
make api-generate
```

Arquivos gerados ficam em `src/lib/api/generated/` — não editar manualmente.

## Estrutura

```
src/
├── app/
│   ├── (auth)/                 # Login, cadastro, recuperação de senha
│   └── (protected)/
│       └── dashboard/          # Todas as páginas autenticadas
├── components/
│   ├── ui/                     # shadcn/ui (não editar)
│   ├── custom/                 # Componentes reutilizáveis do projeto
│   └── table/                  # Colunas e ações das tabelas
├── hooks/
│   └── api/                    # Hooks TanStack Query por domínio
├── lib/
│   ├── api/                    # Axios instance + generated (Orval)
│   ├── schemas/                # Schemas Zod globais
│   └── utils.ts
└── store/                      # Zustand stores (auth, etc.)
```

## Deploy

### Produção (AWS ECS Fargate)

Deploy automático via GitHub Actions ao push em `main`. Infraestrutura gerenciada por Terraform (`../api/infra/`).

### Docker

```bash
docker build -t consulta-facil-web .
cd ../web && docker compose up -d
```

### Vercel

Conectar o repositório no painel da Vercel. Definir `NEXT_PUBLIC_API_URL` apontando para a API em produção.
