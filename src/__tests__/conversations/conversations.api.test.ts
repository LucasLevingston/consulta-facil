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
