import { describe, expect, it } from "vitest";

import { loginSchema, registerSchema } from "@/lib/schemas/auth.schema";

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

describe("registerSchema", () => {
	const valid = {
		name: "João Silva",
		email: "joao@test.com",
		password: "Senha@123",
		confirmPassword: "Senha@123",
		cpf: "12345678901",
	};

	it("aceita dados válidos completos", () => {
		expect(registerSchema.safeParse(valid).success).toBe(true);
	});

	it("aceita dados sem campos opcionais", () => {
		const { cpf, ...withoutCpf } = valid;
		const result = registerSchema.safeParse({ ...withoutCpf, cpf: "" });
		expect(result.success).toBe(true);
	});

	it("rejeita nome com menos de 3 caracteres", () => {
		const result = registerSchema.safeParse({ ...valid, name: "Jo" });
		expect(result.success).toBe(false);
		expect(result.error?.flatten().fieldErrors.name).toBeDefined();
	});

	it("rejeita e-mail inválido", () => {
		const result = registerSchema.safeParse({ ...valid, email: "invalido" });
		expect(result.success).toBe(false);
		expect(result.error?.flatten().fieldErrors.email).toBeDefined();
	});

	it("rejeita senha com menos de 8 caracteres", () => {
		const result = registerSchema.safeParse({
			...valid,
			password: "1234567",
			confirmPassword: "1234567",
		});
		expect(result.success).toBe(false);
		expect(result.error?.flatten().fieldErrors.password).toBeDefined();
	});

	it("rejeita CPF com menos de 11 dígitos", () => {
		const result = registerSchema.safeParse({ ...valid, cpf: "1234567890" });
		expect(result.success).toBe(false);
		expect(result.error?.flatten().fieldErrors.cpf).toBeDefined();
	});

	it("rejeita CPF com letras", () => {
		const result = registerSchema.safeParse({ ...valid, cpf: "1234567890a" });
		expect(result.success).toBe(false);
		expect(result.error?.flatten().fieldErrors.cpf).toBeDefined();
	});

	it("aceita phone, birthDate e gender como opcionais", () => {
		const result = registerSchema.safeParse({
			...valid,
			phone: "11999990000",
			birthDate: "1990-01-01",
			gender: "MALE",
		});
		expect(result.success).toBe(true);
	});
});
