import { describe, expect, it } from "vitest";
import { clinicResponseSchema } from "./clinic-response.schema";

describe("clinicResponseSchema", () => {
	const valid = {
		id: "clinic-1",
		name: "Clínica Saúde",
		status: "ACTIVE",
		ownerId: "owner-1",
	};

	it("aceita objeto válido mínimo", () => {
		expect(clinicResponseSchema.safeParse(valid).success).toBe(true);
	});

	it("aceita campos opcionais/nullable ausentes", () => {
		const result = clinicResponseSchema.safeParse(valid);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.description).toBeUndefined();
			expect(result.data.members).toBeUndefined();
		}
	});

	it("aceita members como lista de clinicMemberSchema", () => {
		const result = clinicResponseSchema.safeParse({
			...valid,
			members: [
				{
					professionalProfileId: "prof-1",
					specialty: "CARDIOLOGIA",
					role: "MEMBER",
				},
			],
		});
		expect(result.success).toBe(true);
	});

	it("rejeita sem name (obrigatório)", () => {
		const { name, ...withoutName } = valid;
		expect(clinicResponseSchema.safeParse(withoutName).success).toBe(false);
	});

	it("rejeita tipo inválido em latitude", () => {
		expect(
			clinicResponseSchema.safeParse({ ...valid, latitude: "invalid" }).success,
		).toBe(false);
	});
});
