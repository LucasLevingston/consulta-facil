import { describe, expect, it } from "vitest";
import { professionalTypeSchema } from "@/lib/schemas/professional/professional-type.schema";
import { specialtySchema } from "@/lib/schemas/professional/specialty.schema";

describe("specialtySchema", () => {
	it("accepts CLINICA_GERAL", () => {
		expect(specialtySchema.safeParse("CLINICA_GERAL").success).toBe(true);
	});
	it("accepts CARDIOLOGIA", () => {
		expect(specialtySchema.safeParse("CARDIOLOGIA").success).toBe(true);
	});
	it("accepts ODONTOLOGIA_GERAL", () => {
		expect(specialtySchema.safeParse("ODONTOLOGIA_GERAL").success).toBe(true);
	});
	it("accepts FISIOTERAPIA_ORTOPEDICA", () => {
		expect(specialtySchema.safeParse("FISIOTERAPIA_ORTOPEDICA").success).toBe(
			true,
		);
	});
	it("accepts TCC", () => {
		expect(specialtySchema.safeParse("TCC").success).toBe(true);
	});
	it("accepts NUTRICAO_CLINICA", () => {
		expect(specialtySchema.safeParse("NUTRICAO_CLINICA").success).toBe(true);
	});
	it("rejects invalid specialty", () => {
		expect(specialtySchema.safeParse("INVALID_SPECIALTY").success).toBe(false);
	});
	it("rejects empty string", () => {
		expect(specialtySchema.safeParse("").success).toBe(false);
	});
	it("rejects lowercase value", () => {
		expect(specialtySchema.safeParse("cardiologia").success).toBe(false);
	});
});

describe("professionalTypeSchema", () => {
	it("accepts MEDICO", () => {
		expect(professionalTypeSchema.safeParse("MEDICO").success).toBe(true);
	});
	it("accepts DENTISTA", () => {
		expect(professionalTypeSchema.safeParse("DENTISTA").success).toBe(true);
	});
	it("accepts FISIOTERAPEUTA", () => {
		expect(professionalTypeSchema.safeParse("FISIOTERAPEUTA").success).toBe(
			true,
		);
	});
	it("accepts PSICOLOGO", () => {
		expect(professionalTypeSchema.safeParse("PSICOLOGO").success).toBe(true);
	});
	it("accepts BIOMEDICO", () => {
		expect(professionalTypeSchema.safeParse("BIOMEDICO").success).toBe(true);
	});
	it("rejects invalid professional type", () => {
		expect(professionalTypeSchema.safeParse("INVALID_TYPE").success).toBe(
			false,
		);
	});
	it("rejects empty string", () => {
		expect(professionalTypeSchema.safeParse("").success).toBe(false);
	});
	it("rejects lowercase value", () => {
		expect(professionalTypeSchema.safeParse("medico").success).toBe(false);
	});
});
