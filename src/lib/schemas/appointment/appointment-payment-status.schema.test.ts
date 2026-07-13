import { describe, expect, it } from "vitest";
import { appointmentPaymentStatusSchema } from "./appointment-payment-status.schema";

describe("appointmentPaymentStatusSchema", () => {
	it("aceita valor válido", () => {
		expect(appointmentPaymentStatusSchema.safeParse("PAID").success).toBe(true);
	});

	it("rejeita valor inválido", () => {
		expect(appointmentPaymentStatusSchema.safeParse("INVALID").success).toBe(
			false,
		);
	});
});
