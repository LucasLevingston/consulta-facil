import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { magicLinkVerifyApi } from "./magic-link-verify.api";

const mockGet = vi.mocked(api.get);

const loginResponse = {
	token: "jwt-token-abc123",
	type: "Bearer",
	expiresIn: 86400,
	userId: "u-1",
	role: "PATIENT",
};

describe("magicLinkVerifyApi", () => {
	beforeEach(() => vi.clearAllMocks());

	it("gets /auth/magic-link/verify with token param", async () => {
		mockGet.mockResolvedValueOnce({ data: loginResponse });
		await magicLinkVerifyApi("verify-token-123");
		expect(mockGet).toHaveBeenCalledWith("/auth/magic-link/verify", {
			params: { token: "verify-token-123" },
		});
	});

	it("returns LoginResponse", async () => {
		mockGet.mockResolvedValueOnce({ data: loginResponse });
		const result = await magicLinkVerifyApi("verify-token-123");
		expect(result.token).toBe("jwt-token-abc123");
	});
});
