import { describe, expect, it } from "vitest";
import { professionalTypeSchema } from "./professional-type.schema";

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
