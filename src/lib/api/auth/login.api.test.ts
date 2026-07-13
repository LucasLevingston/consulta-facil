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
import { loginApi } from "./login.api";

const mockPost = vi.mocked(api.post);

const loginResponse = {
	token: "jwt-token",
	expiresIn: 86400,
	userId: "u-1",
	role: "PATIENT",
};

describe("loginApi", () => {
	beforeEach(() => vi.clearAllMocks());

	it("posts to /auth/login with credentials", async () => {
		mockPost.mockResolvedValueOnce({ data: loginResponse });
		await loginApi({ email: "j@e.com", password: "pass123" });
		expect(mockPost).toHaveBeenCalledWith("/auth/login", {
			email: "j@e.com",
			password: "pass123",
		});
	});

	it("returns LoginResponse", async () => {
		mockPost.mockResolvedValueOnce({ data: loginResponse });
		const result = await loginApi({
			email: "j@e.com",
			password: "pass123",
		});
		expect(result.token).toBe("jwt-token");
		expect(result.userId).toBe("u-1");
	});

	it("chama POST /auth/login com as credenciais e retorna o token", async () => {
		const payload = { email: "user@test.com", password: "senha123" };
		const responseData = {
			token: "jwt-abc",
			type: "Bearer",
			expiresIn: 86400,
			userId: "u-1",
			email: payload.email,
			role: "PATIENT" as const,
		};
		mockPost.mockResolvedValueOnce({ data: responseData });

		const result = await loginApi(payload);

		expect(mockPost).toHaveBeenCalledWith("/auth/login", payload);
		expect(result).toEqual(responseData);
	});

	it("propaga o erro quando as credenciais são inválidas", async () => {
		mockPost.mockRejectedValueOnce(new Error("Unauthorized"));

		await expect(
			loginApi({ email: "errado@test.com", password: "errada" }),
		).rejects.toThrow("Unauthorized");
	});
});
