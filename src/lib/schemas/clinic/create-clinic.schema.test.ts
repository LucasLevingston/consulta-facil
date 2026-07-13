import { describe, expect, it } from "vitest";
import { createClinicSchema } from "./create-clinic.schema";

describe("createClinicSchema — validação de clínica", () => {
	it("aceita dados mínimos válidos", () => {
		const result = createClinicSchema.safeParse({ name: "Clínica Saúde" });
		expect(result.success).toBe(true);
	});

	it("rejeita nome com menos de 2 caracteres", () => {
		const result = createClinicSchema.safeParse({ name: "C" });
		expect(result.success).toBe(false);
	});

	it("rejeita nome vazio", () => {
		const result = createClinicSchema.safeParse({ name: "" });
		expect(result.success).toBe(false);
	});

	it("aceita todos os campos opcionais", () => {
		const result = createClinicSchema.safeParse({
			name: "Clínica Saúde",
			description: "Clínica geral",
			phone: "(11) 99999-9999",
			address: "Rua X, 123",
			city: "São Paulo",
			state: "SP",
			zipCode: "01310-100",
			latitude: -23.55,
			longitude: -46.63,
		});
		expect(result.success).toBe(true);
	});

	it("campos opcionais podem ser omitidos", () => {
		const result = createClinicSchema.safeParse({ name: "Clínica Mínima" });
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.description).toBeUndefined();
		}
	});
});
