import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { post: vi.fn() },
}));

import { api } from "@/config/api";
import { resetPasswordApi } from "./reset-password.api";

const mockPost = vi.mocked(api.post);

describe("resetPasswordApi", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama POST /auth/reset-password com token e nova senha", async () => {
		mockPost.mockResolvedValueOnce({ data: undefined });

		await resetPasswordApi("token-abc", "novaSenha123");

		expect(mockPost).toHaveBeenCalledWith("/auth/reset-password", {
			token: "token-abc",
			newPassword: "novaSenha123",
		});
	});

	it("propaga erro quando o token é inválido ou expirado", async () => {
		const error = Object.assign(new Error("Bad Request"), {
			response: { status: 400 },
		});
		mockPost.mockRejectedValueOnce(error);

		await expect(
			resetPasswordApi("token-expirado", "novaSenha123"),
		).rejects.toThrow("Bad Request");
	});
});
