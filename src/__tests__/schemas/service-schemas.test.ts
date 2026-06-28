import { describe, expect, it } from "vitest";

import { createServiceSchema } from "@/lib/schemas/service/create-service.schema";

describe("createServiceSchema — validação de serviço", () => {
	const valid = {
		name: "Consulta",
		price: 200,
		durationMinutes: 30,
		requiresConsultation: false,
	};

	it("aceita dados válidos", () => {
		expect(createServiceSchema.safeParse(valid).success).toBe(true);
	});

	it("rejeita nome com menos de 2 caracteres", () => {
		expect(createServiceSchema.safeParse({ ...valid, name: "C" }).success).toBe(
			false,
		);
	});

	it("rejeita price zero", () => {
		expect(createServiceSchema.safeParse({ ...valid, price: 0 }).success).toBe(
			false,
		);
	});

	it("rejeita price negativo", () => {
		expect(
			createServiceSchema.safeParse({ ...valid, price: -50 }).success,
		).toBe(false);
	});

	it("rejeita durationMinutes zero", () => {
		expect(
			createServiceSchema.safeParse({ ...valid, durationMinutes: 0 }).success,
		).toBe(false);
	});

	it("aceita requiresConsultation true e false", () => {
		expect(
			createServiceSchema.safeParse({ ...valid, requiresConsultation: true })
				.success,
		).toBe(true);
		expect(
			createServiceSchema.safeParse({ ...valid, requiresConsultation: false })
				.success,
		).toBe(true);
	});

	it("description é opcional", () => {
		const result = createServiceSchema.safeParse(valid);
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.description).toBeUndefined();
	});
});
