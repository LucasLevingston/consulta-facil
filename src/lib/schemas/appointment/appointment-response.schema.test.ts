import { describe, expect, it } from "vitest";
import { appointmentResponseSchema } from "./appointment-response.schema";

describe("appointmentResponseSchema", () => {
	const valid = {
		id: "appt-1",
		patientId: "patient-1",
		professionalId: "professional-1",
		scheduledAt: "2026-07-10T10:00:00",
		status: "PENDING",
	};

	it("aceita objeto válido mínimo", () => {
		const result = appointmentResponseSchema.safeParse(valid);
		expect(result.success).toBe(true);
	});

	it("aceita campos opcionais/nullable ausentes", () => {
		const result = appointmentResponseSchema.safeParse(valid);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.reason).toBeUndefined();
			expect(result.data.rating).toBeUndefined();
		}
	});

	it("rejeita sem status (obrigatório)", () => {
		const { status, ...withoutStatus } = valid;
		const result = appointmentResponseSchema.safeParse(withoutStatus);
		expect(result.success).toBe(false);
	});

	it("rejeita tipo inválido em scheduledAt", () => {
		const result = appointmentResponseSchema.safeParse({
			...valid,
			scheduledAt: 12345,
		});
		expect(result.success).toBe(false);
	});

	it("aceita rating entre 1 e 5", () => {
		expect(
			appointmentResponseSchema.safeParse({ ...valid, rating: 1 }).success,
		).toBe(true);
		expect(
			appointmentResponseSchema.safeParse({ ...valid, rating: 5 }).success,
		).toBe(true);
	});

	it("rejeita rating fora do intervalo 1-5", () => {
		expect(
			appointmentResponseSchema.safeParse({ ...valid, rating: 0 }).success,
		).toBe(false);
		expect(
			appointmentResponseSchema.safeParse({ ...valid, rating: 6 }).success,
		).toBe(false);
	});
});
