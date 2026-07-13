import { describe, expect, it } from "vitest";
import { updateMedicalRecordSchema } from "./update-medical-record.schema";

describe("updateMedicalRecordSchema", () => {
	it("aceita objeto vazio (todos opcionais)", () => {
		expect(updateMedicalRecordSchema.safeParse({}).success).toBe(true);
	});

	it("aceita boolean para campos de consentimento", () => {
		const result = updateMedicalRecordSchema.safeParse({
			privacyConsent: true,
			treatmentConsent: false,
			disclosureConsent: true,
		});
		expect(result.success).toBe(true);
	});

	it("rejeita boolean passado como string", () => {
		const result = updateMedicalRecordSchema.safeParse({
			privacyConsent: "true",
		});
		expect(result.success).toBe(false);
	});
});
