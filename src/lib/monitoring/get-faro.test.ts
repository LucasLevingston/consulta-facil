import { afterEach, describe, expect, it } from "vitest";

describe("getFaro", () => {
	afterEach(async () => {
		const { faroState } = await import("./faro-instance");
		faroState.instance = null;
	});

	it("retorna null quando faroState.instance não foi definido", async () => {
		const { getFaro } = await import("./get-faro");
		expect(getFaro()).toBeNull();
	});

	it("retorna a instância atual armazenada em faroState", async () => {
		const { faroState } = await import("./faro-instance");
		const { getFaro } = await import("./get-faro");
		// biome-ignore lint/suspicious/noExplicitAny: mock simples de instância Faro
		const fakeInstance = { name: "fake-faro" } as any;
		faroState.instance = fakeInstance;
		expect(getFaro()).toBe(fakeInstance);
	});
});
