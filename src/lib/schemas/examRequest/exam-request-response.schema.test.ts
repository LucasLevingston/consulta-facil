import { describe, expect, it } from "vitest";
import { examRequestResponseSchema } from "./exam-request-response.schema";

describe("examRequestResponseSchema", () => {
	const valid = {
		id: "req-1",
		appointmentId: "appt-1",
		professionalId: "prof-1",
		patientId: "patient-1",
		examName: "HEMOGRAMA_COMPLETO",
		status: "PENDING",
	};

	it("aceita objeto válido mínimo", () => {
		expect(examRequestResponseSchema.safeParse(valid).success).toBe(true);
	});

	it("aceita campos opcionais/nullable ausentes", () => {
		const result = examRequestResponseSchema.safeParse(valid);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.fileUrl).toBeUndefined();
			expect(result.data.scheduledAt).toBeUndefined();
		}
	});

	it("rejeita status inválido", () => {
		expect(
			examRequestResponseSchema.safeParse({ ...valid, status: "INVALID" })
				.success,
		).toBe(false);
	});

	it("rejeita sem examName (obrigatório)", () => {
		const { examName, ...withoutExamName } = valid;
		expect(examRequestResponseSchema.safeParse(withoutExamName).success).toBe(
			false,
		);
	});
});
