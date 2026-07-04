import { describe, expect, it } from "vitest";

import {
	DOCUMENT_TYPE_LABELS,
	RELATIONSHIP_LABELS,
} from "@/lib/schemas/patient/constants";
import {
	emergencyContactRelationshipSchema,
	emergencyContactSchema,
} from "@/lib/schemas/patient/emergency-contact.schema";
import {
	documentTypeSchema,
	patientDocumentResponseSchema,
} from "@/lib/schemas/patient/patient-document.schema";
import { patientProfileSchema } from "@/lib/schemas/patient/patient-profile.schema";
import { patientVaccineSchema } from "@/lib/schemas/patient/patient-vaccine.schema";

describe("constants (labels)", () => {
	it("DOCUMENT_TYPE_LABELS contém rótulo para cada valor de documentTypeSchema", () => {
		for (const value of documentTypeSchema.options) {
			expect(DOCUMENT_TYPE_LABELS[value]).toBeDefined();
		}
	});

	it("RELATIONSHIP_LABELS contém rótulo para cada valor de emergencyContactRelationshipSchema", () => {
		for (const value of emergencyContactRelationshipSchema.options) {
			expect(RELATIONSHIP_LABELS[value]).toBeDefined();
		}
	});
});

describe("emergencyContactSchema", () => {
	const valid = { name: "Maria Silva", phone: "11999990000" };

	it("aceita objeto válido mínimo", () => {
		expect(emergencyContactSchema.safeParse(valid).success).toBe(true);
	});

	it("aceita campos opcionais ausentes", () => {
		const result = emergencyContactSchema.safeParse(valid);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.email).toBeUndefined();
			expect(result.data.relationship).toBeUndefined();
		}
	});

	it("aceita email vazio (literal)", () => {
		expect(
			emergencyContactSchema.safeParse({ ...valid, email: "" }).success,
		).toBe(true);
	});

	it("rejeita email inválido não vazio", () => {
		expect(
			emergencyContactSchema.safeParse({ ...valid, email: "nao-e-email" })
				.success,
		).toBe(false);
	});

	it("rejeita name com menos de 2 caracteres", () => {
		expect(
			emergencyContactSchema.safeParse({ ...valid, name: "M" }).success,
		).toBe(false);
	});

	it("rejeita phone com menos de 10 caracteres", () => {
		expect(
			emergencyContactSchema.safeParse({ ...valid, phone: "123" }).success,
		).toBe(false);
	});

	it("rejeita relationship inválido", () => {
		expect(
			emergencyContactSchema.safeParse({ ...valid, relationship: "UNCLE" })
				.success,
		).toBe(false);
	});
});

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

describe("patientProfileSchema", () => {
	it("aceita objeto vazio (todos os campos são opcionais)", () => {
		expect(patientProfileSchema.safeParse({}).success).toBe(true);
	});

	it("aceita todos os campos preenchidos", () => {
		const result = patientProfileSchema.safeParse({
			id: "patient-1",
			userId: "user-1",
			name: "João",
			email: "joao@test.com",
			phone: "11999990000",
			cpf: "12345678901",
			birthDate: "1990-01-01",
			gender: "MALE",
			imageUrl: "https://img.example.com/a.png",
			occupation: "Engenheiro",
			createdAt: "2026-01-01",
			updatedAt: "2026-01-01",
		});
		expect(result.success).toBe(true);
	});

	it("aceita campos nullable como null", () => {
		expect(
			patientProfileSchema.safeParse({ name: null, gender: null }).success,
		).toBe(true);
	});

	it("rejeita gender inválido", () => {
		expect(
			patientProfileSchema.safeParse({ gender: "OTHER_INVALID" }).success,
		).toBe(false);
	});

	it("rejeita tipo inválido em name", () => {
		expect(patientProfileSchema.safeParse({ name: 123 }).success).toBe(false);
	});
});

describe("patientVaccineSchema", () => {
	it("aceita objeto válido mínimo", () => {
		expect(
			patientVaccineSchema.safeParse({ vaccineName: "Gripe" }).success,
		).toBe(true);
	});

	it("aceita campos opcionais ausentes", () => {
		const result = patientVaccineSchema.safeParse({ vaccineName: "Gripe" });
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.doseNumber).toBeUndefined();
			expect(result.data.notes).toBeUndefined();
		}
	});

	it("rejeita vaccineName com menos de 2 caracteres", () => {
		expect(patientVaccineSchema.safeParse({ vaccineName: "G" }).success).toBe(
			false,
		);
	});

	it("rejeita notes com mais de 500 caracteres", () => {
		expect(
			patientVaccineSchema.safeParse({
				vaccineName: "Gripe",
				notes: "a".repeat(501),
			}).success,
		).toBe(false);
	});
});
