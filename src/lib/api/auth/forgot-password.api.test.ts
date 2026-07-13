import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { forgotPasswordApi } from "./forgot-password.api";

const mockPost = vi.mocked(api.post);

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
