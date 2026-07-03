import { describe, expect, it } from "vitest";

import { createExamRequestSchema } from "@/lib/schemas/examRequest/create-exam-request.schema";
import { reviewExamRequestSchema } from "@/lib/schemas/examRequest/review-exam-request.schema";

describe("createExamRequestSchema — examName obrigatório", () => {
	it("aceita examName válido", () => {
		const result = createExamRequestSchema.safeParse({
			examName: "HEMOGRAMA_COMPLETO",
		});
		expect(result.success).toBe(true);
	});

	it("rejeita examName vazio", () => {
		const result = createExamRequestSchema.safeParse({ examName: "" });
		expect(result.success).toBe(false);
	});

	it("rejeita sem examName", () => {
		const result = createExamRequestSchema.safeParse({});
		expect(result.success).toBe(false);
	});

	it("instructions é opcional", () => {
		const result = createExamRequestSchema.safeParse({
			examName: "ELETROCARDIOGRAMA",
		});
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.instructions).toBeUndefined();
	});

	it("instructions aceita até 1000 caracteres", () => {
		const longInstructions = "a".repeat(1000);
		const result = createExamRequestSchema.safeParse({
			examName: "ELETROCARDIOGRAMA",
			instructions: longInstructions,
		});
		expect(result.success).toBe(true);
	});

	it("rejeita instructions com mais de 1000 caracteres", () => {
		const tooLong = "a".repeat(1001);
		const result = createExamRequestSchema.safeParse({
			examName: "ELETROCARDIOGRAMA",
			instructions: tooLong,
		});
		expect(result.success).toBe(false);
	});
});

describe("reviewExamRequestSchema — professionalNotes obrigatório", () => {
	it("aceita notes válidas", () => {
		const result = reviewExamRequestSchema.safeParse({
			professionalNotes: "Resultado normal",
		});
		expect(result.success).toBe(true);
	});

	it("rejeita notes vazias", () => {
		const result = reviewExamRequestSchema.safeParse({ professionalNotes: "" });
		expect(result.success).toBe(false);
	});

	it("rejeita notes com mais de 2000 caracteres", () => {
		const tooLong = "a".repeat(2001);
		const result = reviewExamRequestSchema.safeParse({
			professionalNotes: tooLong,
		});
		expect(result.success).toBe(false);
	});
});
