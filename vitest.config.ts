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
			],
			thresholds: {
				statements: 0,
				branches: 0,
				functions: 0,
				lines: 0,
			},
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
