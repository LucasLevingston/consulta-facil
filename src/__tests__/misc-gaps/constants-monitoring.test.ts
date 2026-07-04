import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("EXAM_STATUS_CONFIG", () => {
	it("possui as chaves esperadas com label e variant válidos", async () => {
		const { EXAM_STATUS_CONFIG } = await import(
			"@/lib/constants/exam-status-config"
		);
		const expectedKeys = ["PENDING", "SCHEDULED", "UPLOADED", "REVIEWED"];
		expect(Object.keys(EXAM_STATUS_CONFIG).sort()).toEqual(expectedKeys.sort());

		const allowedVariants = ["default", "secondary", "outline"];
		for (const key of expectedKeys) {
			const entry = EXAM_STATUS_CONFIG[key as keyof typeof EXAM_STATUS_CONFIG];
			expect(typeof entry.label).toBe("string");
			expect(entry.label.length).toBeGreaterThan(0);
			expect(allowedVariants).toContain(entry.variant);
		}
	});
});

describe("PAYMENT_METHOD_LABELS (fee-payment-method-labels)", () => {
	it("possui labels não vazios para todos os métodos de pagamento suportados", async () => {
		const { PAYMENT_METHOD_LABELS } = await import(
			"@/lib/constants/fee-payment-method-labels"
		);
		const expectedKeys = [
			"PIX",
			"CREDIT_CARD",
			"DEBIT_CARD",
			"CASH",
			"MERCADOPAGO",
		];
		expect(Object.keys(PAYMENT_METHOD_LABELS).sort()).toEqual(
			expectedKeys.sort(),
		);

		for (const key of expectedKeys) {
			const label =
				PAYMENT_METHOD_LABELS[key as keyof typeof PAYMENT_METHOD_LABELS];
			expect(typeof label).toBe("string");
			expect(label.length).toBeGreaterThan(0);
		}
	});
});

describe("MODALITY_OPTIONS", () => {
	it("contém as opções IN_PERSON e ONLINE com label e desc não vazios", async () => {
		const { MODALITY_OPTIONS } = await import(
			"@/lib/constants/modality-options"
		);
		expect(MODALITY_OPTIONS).toHaveLength(2);

		const values = MODALITY_OPTIONS.map((o) => o.value).sort();
		expect(values).toEqual(["IN_PERSON", "ONLINE"].sort());

		for (const option of MODALITY_OPTIONS) {
			expect(option.label.length).toBeGreaterThan(0);
			expect(option.desc.length).toBeGreaterThan(0);
		}
	});
});

describe("STAR_RATING_LABELS", () => {
	it("possui labels para as notas de 1 a 5", async () => {
		const { STAR_RATING_LABELS } = await import(
			"@/lib/constants/star-rating-labels"
		);
		for (let i = 1; i <= 5; i++) {
			expect(typeof STAR_RATING_LABELS[i]).toBe("string");
			expect(STAR_RATING_LABELS[i].length).toBeGreaterThan(0);
		}
		expect(Object.keys(STAR_RATING_LABELS)).toHaveLength(5);
	});
});

describe("faroState (faro-instance)", () => {
	afterEach(async () => {
		const { faroState } = await import("@/lib/monitoring/faro-instance");
		faroState.instance = null;
	});

	it("começa com instance null e é um objeto mutável", async () => {
		const { faroState } = await import("@/lib/monitoring/faro-instance");
		expect(faroState).toEqual({ instance: null });

		// biome-ignore lint/suspicious/noExplicitAny: mutação proposital em teste
		faroState.instance = { fake: true } as any;
		expect(faroState.instance).toEqual({ fake: true });
	});
});

describe("getFaro", () => {
	afterEach(async () => {
		const { faroState } = await import("@/lib/monitoring/faro-instance");
		faroState.instance = null;
	});

	it("retorna null quando faroState.instance não foi definido", async () => {
		const { getFaro } = await import("@/lib/monitoring/get-faro");
		expect(getFaro()).toBeNull();
	});

	it("retorna a instância atual armazenada em faroState", async () => {
		const { faroState } = await import("@/lib/monitoring/faro-instance");
		const { getFaro } = await import("@/lib/monitoring/get-faro");
		// biome-ignore lint/suspicious/noExplicitAny: mock simples de instância Faro
		const fakeInstance = { name: "fake-faro" } as any;
		faroState.instance = fakeInstance;
		expect(getFaro()).toBe(fakeInstance);
	});
});

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

		const { initFaro } = await import("@/lib/monitoring/init-faro");
		const { faroState } = await import("@/lib/monitoring/faro-instance");

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

		const { initFaro } = await import("@/lib/monitoring/init-faro");
		const { faroState } = await import("@/lib/monitoring/faro-instance");
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

		const { initFaro } = await import("@/lib/monitoring/init-faro");
		const { faroState } = await import("@/lib/monitoring/faro-instance");

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
