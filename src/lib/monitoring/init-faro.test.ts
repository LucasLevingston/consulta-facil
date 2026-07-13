import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("initFaro", () => {
	const originalUrl = process.env.NEXT_PUBLIC_GRAFANA_FARO_URL;

	beforeEach(() => {
		vi.resetModules();
	});

	afterEach(() => {
		vi.doUnmock("@grafana/faro-web-sdk");
		vi.doUnmock("@grafana/faro-web-tracing");
		if (originalUrl === undefined) {
			delete process.env.NEXT_PUBLIC_GRAFANA_FARO_URL;
		} else {
			process.env.NEXT_PUBLIC_GRAFANA_FARO_URL = originalUrl;
		}
	});

	it("não inicializa quando falta a env var NEXT_PUBLIC_GRAFANA_FARO_URL", async () => {
		delete process.env.NEXT_PUBLIC_GRAFANA_FARO_URL;

		const initializeFaro = vi.fn();
		vi.doMock("@grafana/faro-web-sdk", () => ({
			initializeFaro,
			getWebInstrumentations: vi.fn(() => []),
		}));
		vi.doMock("@grafana/faro-web-tracing", () => ({
			TracingInstrumentation: vi.fn(),
		}));

		const { initFaro } = await import("./init-faro");
		const { faroState } = await import("./faro-instance");

		initFaro();

		expect(initializeFaro).not.toHaveBeenCalled();
		expect(faroState.instance).toBeNull();
	});

	it("não inicializa quando já existe uma instance em faroState", async () => {
		process.env.NEXT_PUBLIC_GRAFANA_FARO_URL =
			"https://faro.example.com/collect";

		const initializeFaro = vi.fn();
		vi.doMock("@grafana/faro-web-sdk", () => ({
			initializeFaro,
			getWebInstrumentations: vi.fn(() => []),
		}));
		vi.doMock("@grafana/faro-web-tracing", () => ({
			TracingInstrumentation: vi.fn(),
		}));

		const { initFaro } = await import("./init-faro");
		const { faroState } = await import("./faro-instance");
		// biome-ignore lint/suspicious/noExplicitAny: mock simples de instância Faro já existente
		const existing = { already: true } as any;
		faroState.instance = existing;

		initFaro();

		expect(initializeFaro).not.toHaveBeenCalled();
		expect(faroState.instance).toBe(existing);
	});

	it("inicializa e armazena a instância quando a env var está presente e não há instance prévia", async () => {
		process.env.NEXT_PUBLIC_GRAFANA_FARO_URL =
			"https://faro.example.com/collect";

		const fakeInstance = { id: "faro-instance" };
		const initializeFaro = vi.fn(() => fakeInstance);
		const getWebInstrumentations = vi.fn(() => []);
		vi.doMock("@grafana/faro-web-sdk", () => ({
			initializeFaro,
			getWebInstrumentations,
		}));
		vi.doMock("@grafana/faro-web-tracing", () => ({
			TracingInstrumentation: vi.fn(),
		}));

		const { initFaro } = await import("./init-faro");
		const { faroState } = await import("./faro-instance");

		initFaro();

		expect(initializeFaro).toHaveBeenCalledTimes(1);
		expect(initializeFaro).toHaveBeenCalledWith(
			expect.objectContaining({
				url: "https://faro.example.com/collect",
				app: expect.objectContaining({ name: "consulta-facil-web" }),
			}),
		);
		expect(faroState.instance).toBe(fakeInstance);
	});

	// Caso "typeof window === 'undefined'" não é testável neste ambiente jsdom,
	// pois window sempre está definido — pulado conforme orientação da tarefa.
});
