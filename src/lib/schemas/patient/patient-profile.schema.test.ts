import { describe, expect, it } from "vitest";
import { patientProfileSchema } from "./patient-profile.schema";

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
