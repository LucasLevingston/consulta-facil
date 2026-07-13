import { describe, expect, it } from "vitest";
import { prontuarioSchema } from "./prontuario.schema";

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
