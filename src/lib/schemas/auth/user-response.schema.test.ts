import { describe, expect, it } from "vitest";
import { userResponseSchema } from "./user-response.schema";

describe("userResponseSchema (auth)", () => {
	const valid = {
		id: "user-1",
		name: "João Silva",
		email: "joao@test.com",
		role: "PATIENT",
	};

	it("aceita objeto válido mínimo", () => {
		expect(userResponseSchema.safeParse(valid).success).toBe(true);
	});

	it("aceita campos opcionais/nullable ausentes", () => {
		const result = userResponseSchema.safeParse(valid);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.phone).toBeUndefined();
			expect(result.data.gender).toBeUndefined();
		}
	});

	it("aceita campos nullable como null", () => {
		const result = userResponseSchema.safeParse({
			...valid,
			phone: null,
			cpf: null,
			gender: null,
		});
		expect(result.success).toBe(true);
	});

	it("rejeita role inválido", () => {
		expect(
			userResponseSchema.safeParse({ ...valid, role: "INVALID" }).success,
		).toBe(false);
	});

	it("rejeita tipo inválido em name", () => {
		expect(userResponseSchema.safeParse({ ...valid, name: 123 }).success).toBe(
			false,
		);
	});
});
