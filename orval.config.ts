import { defineConfig } from "orval";

/**
 * Para gerar/atualizar o spec:
 *   cd ../api && ./gradlew generateOpenApiDocs
 *
 * Para gerar os hooks/tipos:
 *   npm run api:generate
 */
export default defineConfig({
  consultaFacil: {
    input: {
      // Arquivo gerado pelo springdoc-openapi-gradle-plugin
      // Para regenerar: cd ../api && ./gradlew generateOpenApiDocs
      target: "./openapi.json",
    },
    output: {
      // Um arquivo por tag do Swagger (Appointments, Doctors, etc.)
      mode: "tags-split",
      target: "src/lib/api/generated",
      schemas: "src/lib/api/generated/model",
      client: "react-query",
      // Usa a instância axios do projeto (com JWT interceptor)
      override: {
        mutator: {
          path: "src/lib/api/mutator.ts",
          name: "customInstance",
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true,
        },
      },
    },
    hooks: {
      afterAllFilesWrite: "npx @biomejs/biome format --write src/lib/api/generated",
    },
  },
});
