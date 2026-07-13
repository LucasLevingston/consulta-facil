import { describe, expect, it } from "vitest";
import { patientDocumentResponseSchema } from "./patient-document.schema";

describe("patientDocumentResponseSchema", () => {
	const valid = {
		id: "doc-1",
		documentType: "CPF",
		fileUrl: "https://files.example.com/doc.pdf",
	};

	it("aceita objeto válido mínimo", () => {
		expect(patientDocumentResponseSchema.safeParse(valid).success).toBe(true);
	});

	it("aceita campos opcionais/nullable ausentes", () => {
		const result = patientDocumentResponseSchema.safeParse(valid);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.fileName).toBeUndefined();
		}
	});

	it("rejeita documentType inválido", () => {
		expect(
			patientDocumentResponseSchema.safeParse({
				...valid,
				documentType: "PASSPORT",
			}).success,
		).toBe(false);
	});

	it("rejeita sem fileUrl (obrigatório)", () => {
		const { fileUrl, ...withoutFileUrl } = valid;
		expect(
			patientDocumentResponseSchema.safeParse(withoutFileUrl).success,
		).toBe(false);
	});
});
