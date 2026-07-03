#!/bin/sh
MAX_LINES=100
FOUND=0

staged=$(git diff --cached --name-only --diff-filter=ACM)

for file in $staged; do
  case "$file" in *.ts|*.tsx|*.js|*.jsx) ;; *) continue ;; esac

  content=$(git show ":$file" 2>/dev/null)

  # 1. Tamanho (excluir gerados, configs, testes, tipos, constants e use-toast)
  case "$file" in *generated*|*orval*|*components/ui/*|*.config.ts|*.config.js|*__tests__*|*.d.ts|*use-toast*|*/constants/*|*constants.ts|*/app/*) ;;
    *)
      lines=$(printf '%s\n' "$content" | wc -l)
      if [ "$lines" -gt "$MAX_LINES" ]; then
        echo "BLOCKED [TAMANHO] $file ($lines > $MAX_LINES linhas)"
        echo "  Divida: custom hooks, services, sub-components, utils"
        FOUND=1
      fi ;;
  esac

  # 2. Múltiplas funções exportadas por arquivo (SRP — 1 arquivo = 1 função)
  case "$file" in
    *generated*|*orval*|*/components/ui/*|*/index.ts|*.types.ts|*.props.ts|*-keys.ts|*/constants/*|*.schema.ts|*.config.ts|*.config.js)
      ;;
    *)
      n=$(printf '%s\n' "$content" | grep -E "^export (default )?(async )?function [A-Za-z]|^export const [A-Za-z][A-Za-z0-9]* = (async )?(\(|function )" | wc -l)
      if [ "$n" -gt 1 ]; then
        echo "BLOCKED [SRP-FN] $file — $n funções exportadas (máx 1 por arquivo)"
        echo "  Divida: cada função em seu próprio arquivo"
        FOUND=1
      fi
      ;;
  esac

  # 3. Constantes uppercase fora de constants/
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

  # 4. Props/types inline em arquivo TSX
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

  # 5. Funções utilitárias exportadas dentro de componente TSX
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

  # 6. Tipos/interfaces definidos diretamente em arquivos *.api.ts
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

done

if [ "$FOUND" -eq 1 ]; then
  echo ""
  echo "Commit bloqueado. Mantenha separados: 1 função/arquivo ≤100 linhas | constants/ | *.types.ts | utils/ | componentes"
  exit 1
fi

exit 0
