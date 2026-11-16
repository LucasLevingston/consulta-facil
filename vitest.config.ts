import path from "node:path";
import { defineConfig } from "vitest/config";

// Node >= 25 ships a native `localStorage` global (Web Storage API) that stays
// `undefined` unless --localstorage-file is set. Vitest's jsdom environment does
// not override globals that already exist, so jsdom's storage gets shadowed and
// anything touching localStorage (zustand persist stores, etc.) crashes.
// Disable Node's implementation in the workers when the runtime has it.
const nodeHasWebStorage = "localStorage" in globalThis;

export default defineConfig({
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: "./src/__tests__/setup.ts",
		execArgv: nodeHasWebStorage ? ["--no-experimental-webstorage"] : [],
		// Dialog/form tests driven by userEvent take several seconds once v8
		// coverage instrumentation is on and the machine is busy (pre-push, CI);
		// the 5s default made them flaky.
		testTimeout: 15_000,
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
