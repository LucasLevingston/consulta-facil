import { describe, expect, it } from "vitest";
import { clinicMemberSchema } from "./clinic-member.schema";

describe("clinicMemberSchema", () => {
	const valid = {
		professionalProfileId: "prof-1",
		specialty: "CARDIOLOGIA",
		role: "OWNER",
	};

	it("aceita objeto válido mínimo", () => {
		expect(clinicMemberSchema.safeParse(valid).success).toBe(true);
	});

	it("aceita campos opcionais/nullable ausentes", () => {
		const result = clinicMemberSchema.safeParse(valid);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.professionalName).toBeUndefined();
			expect(result.data.imageUrl).toBeUndefined();
		}
	});

	it("rejeita sem specialty (obrigatório)", () => {
		const { specialty, ...withoutSpecialty } = valid;
		expect(clinicMemberSchema.safeParse(withoutSpecialty).success).toBe(false);
	});

	it("rejeita tipo inválido em role", () => {
		expect(clinicMemberSchema.safeParse({ ...valid, role: 123 }).success).toBe(
			false,
		);
	});
});
