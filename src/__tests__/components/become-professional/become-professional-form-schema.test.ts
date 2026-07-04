import { describe, expect, it } from "vitest";

import { becomeProfessionalSchema } from "@/components/become-professional/BecomeProfessionalForm.schema";

const validData = {
	profession: "MEDICO",
	specialty: "CARDIOLOGIA",
	licenseNumber: "CRM/SP 123456",
};

describe("becomeProfessionalSchema", () => {
	it("aceita dados válidos", () => {
		const result = becomeProfessionalSchema.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it("rejeita quando profession é inválida", () => {
		const result = becomeProfessionalSchema.safeParse({
			...validData,
			profession: "INVALIDO",
		});
		expect(result.success).toBe(false);
	});

	it("rejeita quando profession está ausente", () => {
		const { profession: _profession, ...rest } = validData;
		const result = becomeProfessionalSchema.safeParse(rest);
		expect(result.success).toBe(false);
	});

	it("rejeita quando specialty é inválida", () => {
		const result = becomeProfessionalSchema.safeParse({
			...validData,
			specialty: "INVALIDO",
		});
		expect(result.success).toBe(false);
	});

	it("rejeita quando specialty está ausente", () => {
		const { specialty: _specialty, ...rest } = validData;
		const result = becomeProfessionalSchema.safeParse(rest);
		expect(result.success).toBe(false);
	});

	it("rejeita licenseNumber com menos de 5 caracteres", () => {
		const result = becomeProfessionalSchema.safeParse({
			...validData,
			licenseNumber: "1234",
		});
		expect(result.success).toBe(false);
	});

	it("rejeita licenseNumber com mais de 50 caracteres", () => {
		const result = becomeProfessionalSchema.safeParse({
			...validData,
			licenseNumber: "A".repeat(51),
		});
		expect(result.success).toBe(false);
	});

	it("aceita licenseNumber no limite de 5 caracteres", () => {
		const result = becomeProfessionalSchema.safeParse({
			...validData,
			licenseNumber: "ABCDE",
		});
		expect(result.success).toBe(true);
	});

	it("aceita licenseNumber no limite de 50 caracteres", () => {
		const result = becomeProfessionalSchema.safeParse({
			...validData,
			licenseNumber: "A".repeat(50),
		});
		expect(result.success).toBe(true);
	});
});
