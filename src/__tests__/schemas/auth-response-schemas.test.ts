import { describe, expect, it } from "vitest";

import { loginResponseSchema } from "@/lib/schemas/auth/login-response.schema";
import { resetPasswordSchema } from "@/lib/schemas/auth/reset-password.schema";
import { userResponseSchema } from "@/lib/schemas/auth/user-response.schema";

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

describe("resetPasswordSchema", () => {
	it("aceita senhas iguais e válidas", () => {
		const result = resetPasswordSchema.safeParse({
			newPassword: "senha1234",
			confirmPassword: "senha1234",
		});
		expect(result.success).toBe(true);
	});

	it("rejeita senhas diferentes", () => {
		const result = resetPasswordSchema.safeParse({
			newPassword: "senha1234",
			confirmPassword: "outrasenha",
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.flatten().fieldErrors.confirmPassword).toBeDefined();
		}
	});

	it("rejeita senha com menos de 8 caracteres", () => {
		const result = resetPasswordSchema.safeParse({
			newPassword: "1234567",
			confirmPassword: "1234567",
		});
		expect(result.success).toBe(false);
	});

	it("rejeita objeto sem campos obrigatórios", () => {
		expect(resetPasswordSchema.safeParse({}).success).toBe(false);
	});
});
