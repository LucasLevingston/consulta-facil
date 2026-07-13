import { describe, expect, it } from "vitest";
import { loginSchema } from "./login.schema";

describe("loginSchema", () => {
	it("aceita credenciais válidas", () => {
		const result = loginSchema.safeParse({
			email: "user@test.com",
			password: "senha123",
		});
		expect(result.success).toBe(true);
	});

	it("rejeita e-mail inválido", () => {
		const result = loginSchema.safeParse({
			email: "nao-e-email",
			password: "senha123",
		});
		expect(result.success).toBe(false);
		expect(result.error?.flatten().fieldErrors.email).toBeDefined();
	});

	it("rejeita senha vazia", () => {
		const result = loginSchema.safeParse({
			email: "user@test.com",
			password: "",
		});
		expect(result.success).toBe(false);
		expect(result.error?.flatten().fieldErrors.password).toBeDefined();
	});

	it("rejeita objeto sem campos obrigatórios", () => {
		const result = loginSchema.safeParse({});
		expect(result.success).toBe(false);
	});
});
