import { describe, expect, it } from "vitest";

import { professionalServiceSchema } from "@/lib/schemas/service/professional-service.schema";
import { updateServiceSchema } from "@/lib/schemas/service/update-service.schema";

describe("professionalServiceSchema", () => {
	const valid = {
		id: "svc-1",
		professionalId: "prof-1",
		name: "Consulta",
		price: 200,
		durationMinutes: 30,
		requiresConsultation: false,
		active: true,
	};

	it("aceita objeto válido mínimo", () => {
		expect(professionalServiceSchema.safeParse(valid).success).toBe(true);
	});

	it("aceita campos opcionais/nullable ausentes", () => {
		const result = professionalServiceSchema.safeParse(valid);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.description).toBeUndefined();
			expect(result.data.professionalName).toBeUndefined();
		}
	});

	it("rejeita sem price (obrigatório)", () => {
		const { price, ...withoutPrice } = valid;
		expect(professionalServiceSchema.safeParse(withoutPrice).success).toBe(
			false,
		);
	});

	it("rejeita durationMinutes não inteiro", () => {
		expect(
			professionalServiceSchema.safeParse({ ...valid, durationMinutes: 30.5 })
				.success,
		).toBe(false);
	});

	it("rejeita tipo inválido em active", () => {
		expect(
			professionalServiceSchema.safeParse({ ...valid, active: "true" }).success,
		).toBe(false);
	});
});

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
