import { describe, expect, it } from "vitest";
import { emergencyContactSchema } from "./emergency-contact.schema";

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
