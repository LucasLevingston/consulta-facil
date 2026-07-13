import { describe, expect, it } from "vitest";
import { appointmentStatusSchema } from "./appointment-status.schema";

describe("appointmentStatusSchema", () => {
	it("aceita valor válido", () => {
		expect(appointmentStatusSchema.safeParse("CONFIRMED").success).toBe(true);
	});

	it("rejeita valor inválido", () => {
		expect(appointmentStatusSchema.safeParse("UNKNOWN").success).toBe(false);
	});
});
