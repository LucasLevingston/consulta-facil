import { describe, expect, it } from "vitest";
import { anamnesisResponseSchema } from "./anamnesis-response.schema";

describe("anamnesisResponseSchema", () => {
	const valid = {
		id: "anamnesis-1",
		appointmentId: "appt-1",
		createdAt: "2026-01-01T10:00:00",
		updatedAt: "2026-01-01T10:00:00",
	};

	it("aceita objeto válido mínimo (campos herdados são opcionais)", () => {
		const result = anamnesisResponseSchema.safeParse(valid);
		expect(result.success).toBe(true);
	});

	it("aceita campos opcionais preenchidos", () => {
		const result = anamnesisResponseSchema.safeParse({
			...valid,
			chiefComplaint: "Dor no peito",
			currentMedications: "AAS",
			allergies: "Penicilina",
		});
		expect(result.success).toBe(true);
	});

	it("rejeita sem id (obrigatório)", () => {
		const { id, ...withoutId } = valid;
		const result = anamnesisResponseSchema.safeParse(withoutId);
		expect(result.success).toBe(false);
	});

	it("rejeita tipo inválido em appointmentId", () => {
		const result = anamnesisResponseSchema.safeParse({
			...valid,
			appointmentId: 123,
		});
		expect(result.success).toBe(false);
	});
});
