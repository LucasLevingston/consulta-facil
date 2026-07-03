import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { conversationsApi } from "@/lib/api/conversations/conversations.api";

const _mockGet = vi.mocked(api.get);
const mockPost = vi.mocked(api.post);

describe("conversationsApi — markAsRead", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama POST /conversations/:id/read", async () => {
		mockPost.mockResolvedValueOnce({ data: undefined });

		await conversationsApi.markAsRead("conv-1");

		expect(mockPost).toHaveBeenCalledWith("/conversations/conv-1/read");
	});

	it("IDs diferentes produzem URLs diferentes", async () => {
		mockPost
			.mockResolvedValueOnce({ data: undefined })
			.mockResolvedValueOnce({ data: undefined });

		await conversationsApi.markAsRead("conv-1");
		await conversationsApi.markAsRead("conv-2");

		expect(mockPost.mock.calls[0][0]).toBe("/conversations/conv-1/read");
		expect(mockPost.mock.calls[1][0]).toBe("/conversations/conv-2/read");
	});

	it("não retorna dado (void)", async () => {
		mockPost.mockResolvedValueOnce({ data: undefined });

		const result = await conversationsApi.markAsRead("conv-1");

		expect(result).toBeUndefined();
	});
});
