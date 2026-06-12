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
				"src/components/auth/**",
				"src/components/clinic/**",
				"src/components/financial/**",
				"src/components/forms/**",
				"src/components/procedure-requests/**",
				"src/components/reception/**",
				"src/components/services/**",
				"src/lib/api/generated/**",
				"src/lib/api/billing/**",
				"src/components/billing/**",
				"src/providers/**",
				"src/components/custom/map/**",
				"src/components/custom/sidebar/**",
				"src/lib/monitoring/**",
				"src/config/**",
			],
			thresholds: {
				statements: 39,
				branches: 28,
				functions: 44,
				lines: 40,
			},
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
