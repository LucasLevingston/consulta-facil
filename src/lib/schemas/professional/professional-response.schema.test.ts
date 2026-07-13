import { describe, expect, it } from "vitest";
import { professionalResponseSchema } from "./professional-response.schema";

describe("professionalResponseSchema", () => {
	const valid = {
		id: "prof-1",
		userId: "user-1",
		specialty: "CARDIOLOGIA",
	};

	it("aceita objeto válido mínimo, com defaults para arrays", () => {
		const result = professionalResponseSchema.safeParse(valid);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.education).toEqual([]);
			expect(result.data.experience).toEqual([]);
			expect(result.data.certificates).toEqual([]);
			expect(result.data.acceptedPaymentMethods).toEqual([]);
		}
	});

	it("aceita education, experience e certificates preenchidos", () => {
		const result = professionalResponseSchema.safeParse({
			...valid,
			education: [
				{ degree: "Medicina", institution: "USP", graduationYear: 2010 },
			],
			experience: [
				{
					position: "Clínico Geral",
					institution: "Hospital X",
					startYear: 2011,
				},
			],
			certificates: [{ title: "Certificado ACLS" }],
		});
		expect(result.success).toBe(true);
	});

	it("rejeita sem specialty (obrigatório)", () => {
		const { specialty, ...withoutSpecialty } = valid;
		expect(professionalResponseSchema.safeParse(withoutSpecialty).success).toBe(
			false,
		);
	});

	it("rejeita status inválido", () => {
		expect(
			professionalResponseSchema.safeParse({ ...valid, status: "INVALID" })
				.success,
		).toBe(false);
	});
});
