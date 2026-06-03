import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { forgotPasswordApi } from "@/lib/api/auth/forgot-password.api";
import { googleLoginApi } from "@/lib/api/auth/google-login.api";
import { magicLinkRequestApi } from "@/lib/api/auth/magic-link-request.api";
import { magicLinkVerifyApi } from "@/lib/api/auth/magic-link-verify.api";

const mockPost = vi.mocked(api.post);
const mockGet = vi.mocked(api.get);

const loginResponse = {
	token: "jwt-token-abc123",
	type: "Bearer",
	expiresIn: 86400,
	userId: "u-1",
	role: "PATIENT",
};

describe("forgotPasswordApi", () => {
	beforeEach(() => vi.clearAllMocks());

	it("posts to /auth/forgot-password with email", async () => {
		mockPost.mockResolvedValueOnce({ data: undefined });
		await forgotPasswordApi("user@email.com");
		expect(mockPost).toHaveBeenCalledWith("/auth/forgot-password", {
			email: "user@email.com",
		});
	});

	it("returns void on success", async () => {
		mockPost.mockResolvedValueOnce({ data: undefined });
		const result = await forgotPasswordApi("user@email.com");
		expect(result).toBeUndefined();
	});
});

describe("googleLoginApi", () => {
	beforeEach(() => vi.clearAllMocks());

	it("posts to /auth/google with idToken", async () => {
		mockPost.mockResolvedValueOnce({ data: loginResponse });
		await googleLoginApi("google-id-token");
		expect(mockPost).toHaveBeenCalledWith("/auth/google", {
			idToken: "google-id-token",
		});
	});

	it("returns LoginResponse", async () => {
		mockPost.mockResolvedValueOnce({ data: loginResponse });
		const result = await googleLoginApi("google-id-token");
		expect(result.token).toBe("jwt-token-abc123");
	});
});

describe("magicLinkRequestApi", () => {
	beforeEach(() => vi.clearAllMocks());

	it("posts to /auth/magic-link with email", async () => {
		mockPost.mockResolvedValueOnce({ data: undefined });
		await magicLinkRequestApi("user@email.com");
		expect(mockPost).toHaveBeenCalledWith("/auth/magic-link", {
			email: "user@email.com",
		});
	});
});

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
