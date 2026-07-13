import { describe, expect, it } from "vitest";
import { professionalServiceSchema } from "./professional-service.schema";

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
