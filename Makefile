.PHONY: help dev build lint test api-export api-generate docker-build docker-run

help:
	@echo ""
	@echo "  Consulta Fácil — Web (Next.js 16 / TypeScript / shadcn/ui)"
	@echo ""
	@echo "  Desenvolvimento"
	@echo "    make dev            Sobe o frontend em modo dev (porta 3000)"
	@echo "    make build          Build de produção"
	@echo "    make lint           Lint com Biome"
	@echo ""
	@echo "  Testes"
	@echo "    make test           Executa testes (Vitest)"
	@echo "    make test-coverage  Testes com relatório de cobertura"
	@echo ""
	@echo "  API Client"
	@echo "    make api-export     Exporta openapi.json da API local (porta 8080)"
	@echo "    make api-generate   Gera hooks/tipos a partir do openapi.json"
	@echo "    make api-sync       Export + generate em sequência"
	@echo ""
	@echo "  Docker"
	@echo "    make docker-build   Build da imagem Docker do frontend"
	@echo "    make docker-run     Sobe frontend em container (porta 3000)"
	@echo "    make up             Stack completo: db + api + web"
	@echo "    make down           Para todos os containers"
	@echo ""

# ── Desenvolvimento ───────────────────────────────────────────────────────────

dev:
	npm run dev

build:
	npm run build

lint:
	npm run lint

# ── Testes ────────────────────────────────────────────────────────────────────

test:
	npm run test

test-coverage:
	npm run test:coverage

# ── API Client ────────────────────────────────────────────────────────────────

api-export:
	npm run api:export

api-generate:
	npm run api:generate

api-sync: api-export api-generate

# ── Docker ────────────────────────────────────────────────────────────────────

docker-build:
	docker build -t consulta-facil-web .

docker-run:
	docker run -p 3000:3000 --env-file .env consulta-facil-web

up:
	docker compose up -d

down:
	docker compose down
