import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: "./src/__tests__/setup.ts",
		passWithNoTests: true,
		exclude: ["node_modules/**", ".claude/**", "dist/**"],
		coverage: {
			provider: "v8",
			reporter: ["text", "html", "lcov"],
			reportsDirectory: "coverage",
			include: ["src/**/*.{ts,tsx}"],
			exclude: [
				"src/**/*.test.{ts,tsx}",
				"src/**/*.spec.{ts,tsx}",
				"src/__tests__/**",
				"src/components/ui/**",
				"src/lib/api/generated/**",
				"src/lib/api/billing/**",
				"src/lib/api/analytics/**",
			],
			thresholds: {
				statements: 38,
				branches: 19,
				functions: 38,
				lines: 38,
			},
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
