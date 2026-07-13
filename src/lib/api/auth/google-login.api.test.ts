import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { googleLoginApi } from "./google-login.api";

const mockPost = vi.mocked(api.post);

const loginResponse = {
	token: "jwt-token-abc123",
	type: "Bearer",
	expiresIn: 86400,
	userId: "u-1",
	role: "PATIENT",
};

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
