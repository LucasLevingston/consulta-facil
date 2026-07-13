import { describe, expect, it } from "vitest";

describe("PAYMENT_METHOD_LABELS (fee-payment-method-labels)", () => {
	it("possui labels não vazios para todos os métodos de pagamento suportados", async () => {
		const { PAYMENT_METHOD_LABELS } = await import(
			"./fee-payment-method-labels"
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
