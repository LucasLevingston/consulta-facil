import { describe, expect, it } from "vitest";

import { anamnesisSchema } from "@/lib/schemas/anamnesis/anamnesis.schema";
import { prontuarioSchema } from "@/lib/schemas/anamnesis/prontuario.schema";

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

describe("prontuarioSchema — todos os campos são opcionais", () => {
	it("aceita objeto vazio", () => {
		expect(prontuarioSchema.safeParse({}).success).toBe(true);
	});

	it("aceita prontuário completo", () => {
		const result = prontuarioSchema.safeParse({
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
});
