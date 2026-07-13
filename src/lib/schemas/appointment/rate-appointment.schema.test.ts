import { describe, expect, it } from "vitest";
import { rateAppointmentSchema } from "./rate-appointment.schema";

describe("rateAppointmentSchema", () => {
	it("aceita stars entre 1 e 5", () => {
		expect(rateAppointmentSchema.safeParse({ stars: 1 }).success).toBe(true);
		expect(rateAppointmentSchema.safeParse({ stars: 5 }).success).toBe(true);
	});

	it("rejeita stars fora do intervalo 1-5", () => {
		expect(rateAppointmentSchema.safeParse({ stars: 0 }).success).toBe(false);
		expect(rateAppointmentSchema.safeParse({ stars: 6 }).success).toBe(false);
	});

	it("aceita comment opcional ausente", () => {
		const result = rateAppointmentSchema.safeParse({ stars: 3 });
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.comment).toBeUndefined();
	});

	it("rejeita comment com mais de 500 caracteres", () => {
		const result = rateAppointmentSchema.safeParse({
			stars: 3,
			comment: "a".repeat(501),
		});
		expect(result.success).toBe(false);
	});

	it("rejeita stars não inteiro", () => {
		expect(rateAppointmentSchema.safeParse({ stars: 3.5 }).success).toBe(false);
	});
});
