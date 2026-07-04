import { describe, expect, it } from "vitest";

import { clinicMemberSchema } from "@/lib/schemas/clinic/clinic-member.schema";
import { clinicResponseSchema } from "@/lib/schemas/clinic/clinic-response.schema";
import { receptionistResponseSchema } from "@/lib/schemas/clinic/receptionist-response.schema";

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

describe("receptionistResponseSchema", () => {
	const valid = {
		id: "recep-1",
		userId: "user-1",
		name: "Maria",
		email: "maria@clinica.com",
	};

	it("aceita objeto válido mínimo", () => {
		expect(receptionistResponseSchema.safeParse(valid).success).toBe(true);
	});

	it("aceita createdAt nullable ausente", () => {
		const result = receptionistResponseSchema.safeParse(valid);
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.createdAt).toBeUndefined();
	});

	it("rejeita sem email (obrigatório)", () => {
		const { email, ...withoutEmail } = valid;
		expect(receptionistResponseSchema.safeParse(withoutEmail).success).toBe(
			false,
		);
	});

	it("rejeita tipo inválido em userId", () => {
		expect(
			receptionistResponseSchema.safeParse({ ...valid, userId: 1 }).success,
		).toBe(false);
	});
});
