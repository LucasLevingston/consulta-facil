import { afterEach, describe, expect, it } from "vitest";

describe("faroState (faro-instance)", () => {
	afterEach(async () => {
		const { faroState } = await import("./faro-instance");
		faroState.instance = null;
	});

	it("começa com instance null e é um objeto mutável", async () => {
		const { faroState } = await import("./faro-instance");
		expect(faroState).toEqual({ instance: null });

		// biome-ignore lint/suspicious/noExplicitAny: mutação proposital em teste
		faroState.instance = { fake: true } as any;
		expect(faroState.instance).toEqual({ fake: true });
	});
});
