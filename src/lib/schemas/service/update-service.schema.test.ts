import { describe, expect, it } from "vitest";
import { updateServiceSchema } from "./update-service.schema";

describe("updateServiceSchema", () => {
	it("aceita objeto vazio (todos os campos são opcionais)", () => {
		expect(updateServiceSchema.safeParse({}).success).toBe(true);
	});

	it("aceita todos os campos preenchidos", () => {
		const result = updateServiceSchema.safeParse({
			name: "Consulta",
			description: "Consulta de rotina",
			price: 250,
			durationMinutes: 45,
			requiresConsultation: true,
		});
		expect(result.success).toBe(true);
	});

	it("rejeita name com menos de 2 caracteres", () => {
		expect(updateServiceSchema.safeParse({ name: "C" }).success).toBe(false);
	});

	it("rejeita price zero ou negativo", () => {
		expect(updateServiceSchema.safeParse({ price: 0 }).success).toBe(false);
		expect(updateServiceSchema.safeParse({ price: -10 }).success).toBe(false);
	});

	it("rejeita durationMinutes menor que 1", () => {
		expect(updateServiceSchema.safeParse({ durationMinutes: 0 }).success).toBe(
			false,
		);
	});

	it("rejeita durationMinutes não inteiro", () => {
		expect(
			updateServiceSchema.safeParse({ durationMinutes: 1.5 }).success,
		).toBe(false);
	});
});
