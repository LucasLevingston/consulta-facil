import { describe, expect, it } from "vitest";

import { updateMedicalRecordSchema } from "@/lib/schemas/patient/update-medical-record.schema";
import { updatePatientSchema } from "@/lib/schemas/patient/update-patient.schema";

describe("updatePatientSchema", () => {
	it("aceita objeto vazio (occupation opcional)", () => {
		expect(updatePatientSchema.safeParse({}).success).toBe(true);
	});

	it("aceita occupation válida", () => {
		const result = updatePatientSchema.safeParse({ occupation: "Engenheiro" });
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.occupation).toBe("Engenheiro");
	});
});

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
