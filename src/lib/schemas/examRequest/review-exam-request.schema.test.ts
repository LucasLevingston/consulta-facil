import { describe, expect, it } from "vitest";
import { reviewExamRequestSchema } from "./review-exam-request.schema";

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
