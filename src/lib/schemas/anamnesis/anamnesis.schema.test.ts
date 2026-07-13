import { describe, expect, it } from "vitest";
import { anamnesisSchema } from "./anamnesis.schema";

describe("anamnesisSchema — todos os campos são opcionais", () => {
	it("aceita objeto vazio", () => {
		expect(anamnesisSchema.safeParse({}).success).toBe(true);
	});

	it("aceita todos os campos preenchidos", () => {
		const result = anamnesisSchema.safeParse({
			chiefComplaint: "Dor no peito",
			currentMedications: "AAS",
			allergies: "Penicilina",
			medicalHistory: "HAS",
			familyHistory: "DM",
			observations: "Paciente ansioso",
		});
		expect(result.success).toBe(true);
	});

	it("aceita campos parciais", () => {
		const result = anamnesisSchema.safeParse({ chiefComplaint: "Febre" });
		expect(result.success).toBe(true);
	});
});
