import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { conversationsApi } from "@/lib/api/conversations/conversations.api";

const mockGet = vi.mocked(api.get);
const _mockPost = vi.mocked(api.post);

const message = {
	id: "msg-1",
	conversationId: "conv-1",
	senderId: "prof-1",
	content: "Olá, como posso ajudar?",
	sentAt: "2026-06-01T10:00:00Z",
	read: false,
};

const messagesPage = {
	content: [message],
	totalPages: 1,
	totalElements: 1,
	number: 0,
};

describe("conversationsApi — getHistory", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama GET com page 0 por padrão e tamanho 30", async () => {
		mockGet.mockResolvedValueOnce({ data: messagesPage });

		await conversationsApi.getHistory("conv-1");

		expect(mockGet).toHaveBeenCalledWith("/conversations/conv-1/messages", {
			params: { page: 0, size: 30, sort: "sentAt,desc" },
		});
	});

	it("passa page customizado corretamente", async () => {
		mockGet.mockResolvedValueOnce({ data: messagesPage });

		await conversationsApi.getHistory("conv-1", 2);

		expect(mockGet).toHaveBeenCalledWith("/conversations/conv-1/messages", {
			params: { page: 2, size: 30, sort: "sentAt,desc" },
		});
	});

	it("IDs diferentes produzem URLs diferentes", async () => {
		mockGet
			.mockResolvedValueOnce({ data: messagesPage })
			.mockResolvedValueOnce({ data: messagesPage });

		await conversationsApi.getHistory("conv-1");
		await conversationsApi.getHistory("conv-2");

		expect(mockGet.mock.calls[0][0]).toBe("/conversations/conv-1/messages");
		expect(mockGet.mock.calls[1][0]).toBe("/conversations/conv-2/messages");
	});

	it("retorna página de mensagens em ordem desc", async () => {
		mockGet.mockResolvedValueOnce({ data: messagesPage });

		const result = await conversationsApi.getHistory("conv-1");

		expect(result.content).toHaveLength(1);
		expect(result.content[0].id).toBe("msg-1");
		expect(result.totalElements).toBe(1);
	});

	it("retorna página vazia quando sem mensagens", async () => {
		mockGet.mockResolvedValueOnce({
			data: { content: [], totalPages: 0, totalElements: 0, number: 0 },
		});

		const result = await conversationsApi.getHistory("conv-1");

		expect(result.content).toEqual([]);
	});
});
