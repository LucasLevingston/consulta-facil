import { describe, expect, it } from "vitest";
import { loginResponseSchema } from "./login-response.schema";

describe("loginResponseSchema", () => {
	const valid = {
		token: "jwt-token",
		type: "Bearer",
		expiresIn: 3600,
		userId: "user-1",
		email: "user@test.com",
		role: "PATIENT",
	};

	it("aceita objeto válido mínimo", () => {
		expect(loginResponseSchema.safeParse(valid).success).toBe(true);
	});

	it("aceita todos os papéis válidos", () => {
		const roles = ["PATIENT", "PROFESSIONAL", "ADMIN", "RECEPTIONIST"];
		for (const role of roles) {
			expect(loginResponseSchema.safeParse({ ...valid, role }).success).toBe(
				true,
			);
		}
	});

	it("rejeita role inválido", () => {
		expect(
			loginResponseSchema.safeParse({ ...valid, role: "SUPERUSER" }).success,
		).toBe(false);
	});

	it("rejeita expiresIn como string", () => {
		expect(
			loginResponseSchema.safeParse({ ...valid, expiresIn: "3600" }).success,
		).toBe(false);
	});

	it("rejeita sem token (obrigatório)", () => {
		const { token, ...withoutToken } = valid;
		expect(loginResponseSchema.safeParse(withoutToken).success).toBe(false);
	});
});
