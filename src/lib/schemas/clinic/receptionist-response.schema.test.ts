import { describe, expect, it } from "vitest";
import { receptionistResponseSchema } from "./receptionist-response.schema";

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
