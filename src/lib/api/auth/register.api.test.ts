import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: {
		get: vi.fn(),
		post: vi.fn(),
		put: vi.fn(),
		delete: vi.fn(),
		defaults: { headers: { common: {} } },
	},
}));

import { api } from "@/config/api";
import { registerApi } from "./register.api";

const mockPost = vi.mocked(api.post);

const userResponse = {
	id: "u-1",
	name: "João",
	email: "j@e.com",
	role: "PATIENT",
};

const baseInput = {
	name: "João Silva",
	email: "joao@test.com",
	password: "Senha@123",
	confirmPassword: "Senha@123",
	cpf: "12345678901",
};

describe("registerApi", () => {
	beforeEach(() => vi.clearAllMocks());

	it("posts to /auth/register with user data", async () => {
		mockPost.mockResolvedValueOnce({ data: userResponse });
		await registerApi({
			name: "João",
			email: "j@e.com",
			password: "pass123",
			cpf: "12345678901",
			phone: "11999999999",
			birthDate: "1990-01-01",
			gender: "MALE",
		});
		expect(mockPost).toHaveBeenCalledWith(
			"/auth/register",
			expect.objectContaining({ email: "j@e.com" }),
		);
	});

	it("returns UserResponse", async () => {
		mockPost.mockResolvedValueOnce({ data: userResponse });
		const result = await registerApi({
			name: "João",
			email: "j@e.com",
			password: "pass123",
			cpf: "12345678901",
			phone: "11999999999",
			birthDate: "1990-01-01",
			gender: "MALE",
		});
		expect(result.id).toBe("u-1");
	});

	it("chama POST /auth/register e retorna os dados do usuário criado", async () => {
		const responseData = {
			id: "u-1",
			name: baseInput.name,
			email: baseInput.email,
			role: "PATIENT" as const,
		};
		mockPost.mockResolvedValueOnce({ data: responseData });

		const result = await registerApi(baseInput);

		expect(mockPost).toHaveBeenCalledWith("/auth/register", baseInput);
		expect(result).toEqual(responseData);
	});

	it("propaga o erro quando o e-mail já está em uso", async () => {
		mockPost.mockRejectedValueOnce(new Error("Conflict"));

		await expect(registerApi(baseInput)).rejects.toThrow("Conflict");
	});
});
