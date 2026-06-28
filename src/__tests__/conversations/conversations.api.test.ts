import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { conversationsApi } from "@/lib/api/conversations/conversations.api";

const mockGet = vi.mocked(api.get);
const mockPost = vi.mocked(api.post);

const conversation = {
	id: "conv-1",
	professionalId: "prof-1",
	patientId: "pat-1",
	lastMessage: "Olá, como posso ajudar?",
	unreadCount: 2,
	updatedAt: "2026-06-01T10:00:00Z",
};

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

// ── list ──────────────────────────────────────────────────────────────────────

describe("conversationsApi — list", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama GET /conversations", async () => {
		mockGet.mockResolvedValueOnce({ data: [conversation] });

		await conversationsApi.list();

		expect(mockGet).toHaveBeenCalledWith("/conversations");
	});

	it("retorna lista de conversas", async () => {
		mockGet.mockResolvedValueOnce({
			data: [conversation, { ...conversation, id: "conv-2" }],
		});

		const result = await conversationsApi.list();

		expect(result).toHaveLength(2);
		expect(result[0].id).toBe("conv-1");
	});

	it("retorna array vazio quando sem conversas", async () => {
		mockGet.mockResolvedValueOnce({ data: [] });

		const result = await conversationsApi.list();

		expect(result).toEqual([]);
	});
});

// ── getOrCreate ───────────────────────────────────────────────────────────────

describe("conversationsApi — getOrCreate", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama POST /conversations/:professionalId", async () => {
		mockPost.mockResolvedValueOnce({ data: conversation });

		await conversationsApi.getOrCreate("prof-1");

		expect(mockPost).toHaveBeenCalledWith("/conversations/prof-1");
	});

	it("IDs diferentes produzem URLs diferentes", async () => {
		mockPost
			.mockResolvedValueOnce({ data: conversation })
			.mockResolvedValueOnce({ data: { ...conversation, id: "conv-2" } });

		await conversationsApi.getOrCreate("prof-1");
		await conversationsApi.getOrCreate("prof-2");

		expect(mockPost.mock.calls[0][0]).toBe("/conversations/prof-1");
		expect(mockPost.mock.calls[1][0]).toBe("/conversations/prof-2");
	});

	it("retorna conversa criada ou existente", async () => {
		mockPost.mockResolvedValueOnce({ data: conversation });

		const result = await conversationsApi.getOrCreate("prof-1");

		expect(result.id).toBe("conv-1");
		expect(result.professionalId).toBe("prof-1");
	});
});

// ── getHistory ────────────────────────────────────────────────────────────────

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

// ── markAsRead ────────────────────────────────────────────────────────────────

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
