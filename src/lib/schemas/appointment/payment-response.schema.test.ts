import { describe, expect, it } from "vitest";
import { paymentResponseSchema } from "./payment-response.schema";

describe("paymentResponseSchema", () => {
	const valid = {
		checkoutUrl: "https://checkout.mercadopago.com/abc",
		preferenceId: "pref-1",
		appointmentId: "appt-1",
	};

	it("aceita objeto válido mínimo", () => {
		expect(paymentResponseSchema.safeParse(valid).success).toBe(true);
	});

	it("rejeita sem checkoutUrl (obrigatório)", () => {
		const { checkoutUrl, ...withoutUrl } = valid;
		expect(paymentResponseSchema.safeParse(withoutUrl).success).toBe(false);
	});

	it("rejeita tipo inválido em preferenceId", () => {
		expect(
			paymentResponseSchema.safeParse({ ...valid, preferenceId: 123 }).success,
		).toBe(false);
	});
});
