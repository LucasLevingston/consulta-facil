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

## Páginas

| Rota | Descrição | Roles |
|---|---|---|
| `/dashboard` | Visão geral do dia | Todos |
| `/dashboard/appointments` | Lista de consultas | Todos |
| `/dashboard/appointments/create` | Agendar nova consulta | PATIENT |
| `/dashboard/appointments/[id]` | Detalhe da consulta | Todos |
| `/dashboard/services` | Catálogo de serviços | PROFESSIONAL |
| `/dashboard/procedure-requests` | Solicitações de procedimento | PATIENT / PROFESSIONAL |
| `/dashboard/patients` | Lista de pacientes | PROFESSIONAL / ADMIN |
| `/dashboard/patients/[id]` | Detalhe do paciente | PROFESSIONAL / ADMIN |
| `/dashboard/schedule` | Horários de atendimento | PROFESSIONAL / ADMIN |
| `/dashboard/my-clinic` | Gerenciar clínica | PROFESSIONAL / ADMIN |
| `/dashboard/reception` | Fila + check-in QR | RECEPTIONIST / ADMIN |
| `/dashboard/settings/billing` | Assinatura e pagamentos | PROFESSIONAL |
| `/dashboard/become-professional` | Solicitar perfil profissional | PATIENT |
| `/dashboard/profile` | Editar perfil | Todos |

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
