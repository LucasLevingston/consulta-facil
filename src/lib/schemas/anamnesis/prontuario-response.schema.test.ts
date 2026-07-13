import { describe, expect, it } from "vitest";
import { prontuarioResponseSchema } from "./prontuario-response.schema";

describe("prontuarioResponseSchema", () => {
	const valid = {
		id: "prontuario-1",
		appointmentId: "appt-1",
		createdAt: "2026-01-01T10:00:00",
		updatedAt: "2026-01-01T10:00:00",
	};

	it("aceita objeto válido mínimo (campos herdados são opcionais)", () => {
		const result = prontuarioResponseSchema.safeParse(valid);
		expect(result.success).toBe(true);
	});

	it("aceita prontuário completo", () => {
		const result = prontuarioResponseSchema.safeParse({
			...valid,
			clinicalNotes: "Notas",
			diagnosis: "Angina",
			diagnosisCid: "I20",
			prescription: "AAS 100mg",
			examRequests: "ECG",
			treatmentPlan: "Otimização",
			followUpInstructions: "Retorno 30 dias",
		});
		expect(result.success).toBe(true);
	});

	it("rejeita sem createdAt (obrigatório)", () => {
		const { createdAt, ...withoutCreatedAt } = valid;
		const result = prontuarioResponseSchema.safeParse(withoutCreatedAt);
		expect(result.success).toBe(false);
	});

	it("rejeita tipo inválido em id", () => {
		const result = prontuarioResponseSchema.safeParse({ ...valid, id: 1 });
		expect(result.success).toBe(false);
	});
});
