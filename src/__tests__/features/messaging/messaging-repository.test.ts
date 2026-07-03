import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api/conversations/conversations.api", () => ({
	conversationsApi: {
		list: vi.fn().mockResolvedValue([]),
		getOrCreate: vi.fn().mockResolvedValue({ id: "c1" }),
		getHistory: vi.fn().mockResolvedValue({ content: [], totalPages: 0 }),
		markAsRead: vi.fn().mockResolvedValue(undefined),
	},
}));

import { messagingRepository } from "@/features/messaging/repositories/messaging.repository";

describe("messagingRepository", () => {
	beforeEach(() => vi.clearAllMocks());

	it("list resolves with array", async () => {
		const result = await messagingRepository.list();
		expect(Array.isArray(result)).toBe(true);
	});

	it("getOrCreate resolves with conversation", async () => {
		const result = await messagingRepository.getOrCreate("prof-1");
		expect(result).toBeDefined();
	});

	it("getHistory resolves with page data", async () => {
		const result = await messagingRepository.getHistory("conv-1", 0);
		expect(result).toBeDefined();
	});

	it("markAsRead resolves without error", async () => {
		await expect(
			messagingRepository.markAsRead("conv-1"),
		).resolves.not.toThrow();
	});
});
