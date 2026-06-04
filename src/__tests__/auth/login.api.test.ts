import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { post: vi.fn() },
}));

import { api } from "@/config/api";
import { loginApi } from "@/lib/api/auth/login.api";

const mockPost = vi.mocked(api.post);

describe("loginApi", () => {
	beforeEach(() => vi.clearAllMocks());

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
