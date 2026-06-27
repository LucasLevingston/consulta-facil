#!/bin/sh
MAX_LINES=300
FOUND=0

staged=$(git diff --cached --name-only --diff-filter=ACM)

for file in $staged; do
  case "$file" in *.ts|*.tsx|*.js|*.jsx) ;; *) continue ;; esac

  content=$(git show ":$file" 2>/dev/null)

  # 1. Tamanho
  lines=$(printf '%s\n' "$content" | wc -l)
  if [ "$lines" -gt "$MAX_LINES" ]; then
    echo "BLOCKED [TAMANHO] $file ($lines > $MAX_LINES linhas)"
    echo "  Divida: custom hooks, services, sub-components, utils"
    FOUND=1
  fi

  # 2. Constantes uppercase fora de constants/
  case "$file" in
    *constants*|*Constants*)
      ;;
    *)
      n=$(printf '%s\n' "$content" | grep -E "^export const [A-Z][A-Z0-9_]{2,}" | wc -l)
      if [ "$n" -gt 0 ]; then
        echo "BLOCKED [CONSTANTS] $file — $n constante(s) uppercase fora de constants/"
        echo "  Mova para src/constants/ ou <feature>/constants.ts"
        FOUND=1
      fi
      ;;
  esac

  # 3. Props/types inline em arquivo TSX
  case "$file" in
    *.tsx)
      case "$file" in
        *.types.*|*.props.*|*types.ts|*props.ts|*/ui/*)
          ;;
        *)
          n=$(printf '%s\n' "$content" | grep -E "^(export )?(interface|type) [A-Za-z]+Props" | wc -l)
          if [ "$n" -gt 0 ]; then
            echo "BLOCKED [PROPS] $file — Props definidas inline"
            echo "  Extraia para ${file%.tsx}.types.ts"
            FOUND=1
          fi
          ;;
      esac
      ;;
  esac

  # 4. Funções utilitárias exportadas dentro de componente TSX
  case "$file" in
    *.tsx)
      case "$file" in
        */hooks/*|*utils*|*helpers*|*functions*)
          ;;
        *)
          n=$(printf '%s\n' "$content" | grep -E "^export (function [a-z]|const [a-z][a-zA-Z]+ = (async )?\()" | wc -l)
          if [ "$n" -gt 0 ]; then
            echo "BLOCKED [FUNCTIONS] $file — $n função(ões) utilitária(s) exportada(s) em componente"
            echo "  Mova para utils/, helpers/ ou <feature>/utils.ts"
            FOUND=1
          fi
          ;;
      esac
      ;;
  esac

  # 5. Tipos/interfaces definidos diretamente em arquivos *.api.ts
  case "$file" in
    *.api.ts)
      case "$file" in
        *generated*)
          ;;
        *)
          n=$(printf '%s\n' "$content" | grep -E "^export (interface [A-Za-z]|type [A-Za-z][A-Za-z0-9]*[ =<])" | wc -l)
          if [ "$n" -gt 0 ]; then
            echo "BLOCKED [API-TYPES] $file — $n tipo(s)/interface(s) definido(s) em .api.ts"
            echo "  Extraia para ${file%.ts}.types.ts"
            FOUND=1
          fi
          ;;
      esac
      ;;
  esac

  # [O] OCP - Sem switch statements em componentes (use Record/Map para extensibilidade)
  case "$file" in
    *.tsx)
      case "$file" in
        */hooks/*|*utils*|*helpers*|*/ui/*|*.types.*|*__tests__*|*.test.*)
          ;;
        *)
          n=$(printf '%s\n' "$content" | grep -E "[[:space:]]+switch[[:space:]]*\(" | wc -l)
          if [ "$n" -gt 0 ]; then
            echo "BLOCKED [OCP] $file — $n switch statement(s) em componente"
            echo "  Use Record/Map para selecionar variantes sem modificar o componente"
            FOUND=1
          fi
          ;;
      esac
      ;;
  esac

  # [L] LSP - Sem double casts que contornam contratos de tipo (exceto testes)
  case "$file" in
    *__tests__*|*.test.*|*.spec.*)
      ;;
    *)
      n=$(printf '%s\n' "$content" | grep -E " as unknown as " | wc -l)
      if [ "$n" -gt 0 ]; then
        echo "BLOCKED [LSP] $file — uso de 'as unknown as' contorna contrato de tipo"
        echo "  Corrija a tipagem em vez de usar double cast"
        FOUND=1
      fi
      ;;
  esac

  # [I] ISP - Props/types com mais de 10 campos opcionais indicam interface inflada
  case "$file" in
    *.types.ts|*.types.tsx)
      n=$(printf '%s\n' "$content" | grep -E "[[:space:]]+[a-zA-Z_]+[?]:" | wc -l)
      if [ "$n" -gt 10 ]; then
        echo "BLOCKED [ISP] $file — $n campos opcionais (>10) indica interface muito grande"
        echo "  Divida em interfaces menores ou use composição de tipos"
        FOUND=1
      fi
      ;;
  esac

  # [D] DIP - Componentes TSX não devem importar valores diretamente da camada de API
  case "$file" in
    *.tsx)
      case "$file" in
        */hooks/*|*.types.*)
          ;;
        *)
          n=$(printf '%s\n' "$content" | grep -E "^import .* from ['\"]@/(lib/api|config/api)" | grep -v "^import type " | wc -l)
          if [ "$n" -gt 0 ]; then
            echo "BLOCKED [DIP] $file — componente importa direto da camada de API"
            echo "  Use hook em hooks/api/ em vez de importar @/lib/api ou @/config/api"
            FOUND=1
          fi
          ;;
      esac
      ;;
  esac

done

if [ "$FOUND" -eq 1 ]; then
  echo ""
  echo "Commit bloqueado. Mantenha separados: constants/ | *.types.ts | utils/ | componentes"
  echo "SOLID: [S]RP [O]CP [L]SP [I]SP [D]IP — todos os pilares ativos"
  exit 1
fi

exit 0
