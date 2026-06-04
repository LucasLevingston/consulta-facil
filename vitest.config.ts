import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: "./src/__tests__/setup.ts",
		passWithNoTests: true,
		coverage: {
			provider: "v8",
			reporter: ["text", "html", "lcov"],
			reportsDirectory: "coverage",
			include: ["src/**/*.{ts,tsx}"],
			exclude: [
				"src/**/*.test.{ts,tsx}",
				"src/**/*.spec.{ts,tsx}",
				"src/components/ui/**",
				"src/__tests__/**",
				"src/app/**/layout.tsx",
				"src/app/**/page.tsx",
				"src/app/**/error.tsx",
				"src/app/**/loading.tsx",
				"src/app/**/_components/**",
				"src/app/**/_constants/**",
				"src/app/**/_utils/**",
				"src/lib/api/generated/**",
				"src/providers/**",
				"src/components/custom/map/**",
				"src/components/custom/sidebar/**",
				"src/lib/monitoring/**",
				"src/config/**",
			],
			thresholds: {
				statements: 43,
				branches: 28,
				functions: 49,
				lines: 43,
			},
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
