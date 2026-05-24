# Consulta Fácil — Web

Frontend para a plataforma de agendamento de consultas médicas. Interface adaptada por role: paciente, profissional, recepcionista e admin.

## Stack

| Tecnologia | Versão |
|---|---|
| Next.js | 16 |
| TypeScript | strict |
| shadcn/ui + Tailwind | v4 |
| TanStack Query | v5 |
| Zustand | v5 |
| React Hook Form + Zod | — |
| Vitest | v4 |
| Biome (lint/format) | 2.x |
| Orval (API client) | 8.x |

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
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Funcionalidades por Role

### Paciente (PATIENT)
- Agendar consulta com filtro por profissional, especialidade e data
- Acompanhar lista de consultas com status em tempo real
- Ver detalhe da consulta: informações, anamnese, prontuário, exames
- Preencher anamnese pré-consulta
- Gerar QR Code para check-in na recepção
- Fazer upload de exames solicitados pelo profissional
- Avaliar consultas concluídas (1–5 estrelas + comentário)
- Remarcar consultas pendentes ou confirmadas
- Cancelar consultas
- Pagar consulta online via MercadoPago (checkout externo)
- Entrar em teleconsulta via link Google Meet
- Tornar-se profissional (fluxo de solicitação)

### Profissional (PROFESSIONAL)
- Dashboard com resumo do dia (próximas consultas, fila)
- Confirmar, concluir ou cancelar consultas
- Remarcar consultas
- Ver fila de pacientes do dia com status CHECKED_IN / IN_PROGRESS
- Chamar próximo paciente (muda status para IN_PROGRESS)
- Definir modalidade da consulta: presencial ou online
- Gerar link Google Meet para teleconsultas
- Criar e revisar anamnese e prontuário
- Solicitar exames para o paciente
- Revisar exames enviados pelo paciente
- Ver lista de pacientes atendidos
- Ver detalhe de cada paciente
- Gerenciar horários de atendimento semanal
- Criar e gerenciar clínica
- Convidar recepcionistas para a clínica
- Configurar horário de funcionamento da clínica

### Recepcionista (RECEPTIONIST)
- Dashboard de recepção com fila do dia (todos os profissionais)
- Fazer check-in de pacientes via leitura de QR Code
- Ver status de cada consulta em tempo real

### Admin (ADMIN)
- Acesso a todas as funcionalidades acima
- Aprovar ou rejeitar solicitações de profissionais
- Gerenciar usuários
- Excluir consultas

## Páginas

| Rota | Descrição | Roles |
|---|---|---|
| `/dashboard` | Visão geral do dia | Todos |
| `/dashboard/appointments` | Lista de consultas | Todos |
| `/dashboard/appointments/create` | Agendar nova consulta | PATIENT |
| `/dashboard/appointments/[id]` | Detalhe da consulta | Todos |
| `/dashboard/patients` | Lista de pacientes | PROFESSIONAL / ADMIN |
| `/dashboard/patients/[id]` | Detalhe do paciente | PROFESSIONAL / ADMIN |
| `/dashboard/schedule` | Horários de atendimento | PROFESSIONAL / ADMIN |
| `/dashboard/my-clinic` | Gerenciar clínica | PROFESSIONAL / ADMIN |
| `/dashboard/reception` | Fila + check-in QR | RECEPTIONIST / ADMIN |
| `/dashboard/become-professional` | Solicitar perfil profissional | PATIENT |
| `/dashboard/profile` | Editar perfil | Todos |

## Estrutura

```
src/
├── app/
│   ├── (auth)/            # Login, cadastro
│   └── (protected)/
│       └── dashboard/     # Todas as páginas autenticadas
├── components/
│   ├── ui/                # shadcn/ui (não editar)
│   ├── custom/            # Componentes reutilizáveis do projeto
│   └── table/             # Colunas e ações da tabela de consultas
├── hooks/
│   └── api/               # Hooks TanStack Query (use-appointments, etc.)
├── lib/
│   ├── api/               # Chamadas axios + generated (orval)
│   ├── schemas/           # Schemas Zod globais
│   └── utils.ts
└── store/                 # Zustand stores (auth, etc.)
```

## Geração automática do cliente API

O cliente HTTP é gerado pelo [Orval](https://orval.dev) a partir do `openapi.json` da API:

```bash
# 1. Com a API rodando localmente:
make api-sync

# 2. Só regenerar sem exportar:
make api-generate
```

Os arquivos gerados ficam em `src/lib/api/generated/` e são re-gerados automaticamente no pre-commit hook (`.husky/pre-commit`).

## Roadmap — Possíveis próximas funcionalidades

Abaixo estão funcionalidades planejadas ou em discussão. Validar quais avançar.

### Navegação e UX
- **Substituição da sidebar** por bottom-nav no mobile e mega-menu/topbar no desktop — melhora ergonomia em dispositivos menores
- **Melhoria da página inicial e dashboard** — redesign com métricas em destaque, cards de próximas consultas e CTAs contextuais por role
- **Busca com querystring + paginação** em todos os componentes de listagem — permite compartilhar links filtrados e melhora performance com lazy loading

### Agendamento
- **Agendamento por fila ou por horário** — ao selecionar o profissional, verificar se ele atende via fila de espera (check-in no dia) ou por horário marcado; exibir interface diferente para cada modelo
- **Preenchimento automático de horários vagos** — sugestão de horários disponíveis com base na agenda do profissional; reduz fricção no agendamento
- **Agendamento por voz** — integração com reconhecimento de fala para agendar consultas por comando de voz no mobile

### Fila de espera
- **QR Code estático na clínica** — gerar um QR único por clínica que é renovado diariamente; o paciente escaneia ao chegar e entra automaticamente na fila (sem precisar abrir o app e navegar até a consulta)

### Financeiro
- **Dashboard financeiro para profissionais** — painel com receita mensal, consultas pagas/pendentes, ticket médio, evolução por período e ranking de convênios/formas de pagamento

### Inteligência artificial e automação
- **Score de paciente** — pontuação calculada com base em histórico (faltas, cancelamentos de última hora, pagamentos em dia); auxilia profissionais na triagem e priorização
- **Confirmação por WhatsApp** — enviar lembretes automáticos de consulta via WhatsApp (ex: 24h antes) com link de confirmação ou cancelamento; integração via Twilio ou Meta Cloud API
- **Agente de IA no WhatsApp** — bot conversacional para agendar consultas, tirar dúvidas e enviar resultados de exames diretamente no WhatsApp do paciente

### Performance
- **Otimizações de carregamento** — lazy loading de imagens, virtualização de listas longas, cache de queries TanStack com staleTime ajustado, prefetch de dados ao hover em links

## Deploy

### Vercel (recomendado para frontend)
Conectar o repositório no painel da Vercel. Definir `NEXT_PUBLIC_API_URL` apontando para a API em produção.

### Docker / Render
```bash
# Build da imagem standalone
docker build -t consulta-facil-web .

# Stack completa (db + api + web)
docker compose up -d
```
