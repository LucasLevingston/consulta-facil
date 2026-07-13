import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { magicLinkRequestApi } from "./magic-link-request.api";

const mockPost = vi.mocked(api.post);

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
