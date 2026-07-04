import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/auth", () => ({
	useUserStore: vi.fn(),
}));
vi.mock("@/features/messaging", () => ({
	useChat: vi.fn(),
	useConversationHistory: vi.fn(),
	useMarkAsRead: vi.fn(),
}));

import { ChatThread } from "@/components/messaging/ChatThread";
import { useUserStore } from "@/features/auth";
import {
	useChat,
	useConversationHistory,
	useMarkAsRead,
} from "@/features/messaging";

const mockUseUserStore = vi.mocked(useUserStore);
const mockUseChat = vi.mocked(useChat);
const mockUseConversationHistory = vi.mocked(useConversationHistory);
const mockUseMarkAsRead = vi.mocked(useMarkAsRead);

const conversation = {
	id: "c-1",
	otherUserId: "u-2",
	otherUserName: "Maria Souza",
	otherUserImageUrl: null,
	lastMessage: null,
	unreadCount: 0,
} as never;

describe("ChatThread", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		Element.prototype.scrollIntoView = vi.fn();
		mockUseUserStore.mockImplementation(
			(selector: (s: { user: unknown }) => unknown) =>
				selector({ user: { id: "u-1" } }),
		);
		mockUseMarkAsRead.mockReturnValue({ mutate: vi.fn() } as never);
	});

	function setupChat(overrides: Partial<ReturnType<typeof useChat>> = {}) {
		const state = {
			messages: [],
			sendMessage: vi.fn(),
			resetMessages: vi.fn(),
			...overrides,
		};
		mockUseChat.mockReturnValue(state as never);
		return state;
	}

	it("renderiza o nome do outro usuário da conversa", () => {
		setupChat();
		mockUseConversationHistory.mockReturnValue({ data: undefined } as never);
		render(<ChatThread conversation={conversation} />);
		expect(screen.getByText("Maria Souza")).toBeInTheDocument();
	});

	it("renderiza as mensagens do histórico em ordem cronológica", () => {
		setupChat();
		mockUseConversationHistory.mockReturnValue({
			data: {
				content: [
					{
						id: "m-2",
						senderId: "u-2",
						senderName: "Maria",
						content: "Segunda mensagem",
						sentAt: "2026-07-04T10:01:00Z",
						isRead: true,
					},
					{
						id: "m-1",
						senderId: "u-1",
						senderName: "Eu",
						content: "Primeira mensagem",
						sentAt: "2026-07-04T10:00:00Z",
						isRead: true,
					},
				],
			},
		} as never);
		render(<ChatThread conversation={conversation} />);
		expect(screen.getByText("Primeira mensagem")).toBeInTheDocument();
		expect(screen.getByText("Segunda mensagem")).toBeInTheDocument();
	});

	it("renderiza as mensagens ao vivo vindas do hook useChat", () => {
		setupChat({
			messages: [
				{
					id: "live-1",
					senderId: "u-2",
					senderName: "Maria",
					content: "Mensagem em tempo real",
					sentAt: "2026-07-04T10:05:00Z",
					isRead: false,
				},
			],
		});
		mockUseConversationHistory.mockReturnValue({ data: undefined } as never);
		render(<ChatThread conversation={conversation} />);
		expect(screen.getByText("Mensagem em tempo real")).toBeInTheDocument();
	});

	it("envia a mensagem digitada e limpa o campo ao clicar em Enviar", async () => {
		const state = setupChat();
		mockUseConversationHistory.mockReturnValue({ data: undefined } as never);
		render(<ChatThread conversation={conversation} />);

		const input = screen.getByPlaceholderText("Escreva uma mensagem...");
		await userEvent.type(input, "Oi, tudo bem?");
		await userEvent.click(screen.getByText("Enviar"));

		expect(state.sendMessage).toHaveBeenCalledWith("Oi, tudo bem?");
		expect(input).toHaveValue("");
	});

	it("não envia mensagem vazia", async () => {
		const state = setupChat();
		mockUseConversationHistory.mockReturnValue({ data: undefined } as never);
		render(<ChatThread conversation={conversation} />);
		expect(screen.getByText("Enviar")).toBeDisabled();
		expect(state.sendMessage).not.toHaveBeenCalled();
	});

	it("chama resetMessages e markAsRead.mutate ao montar com a conversa", () => {
		const state = setupChat();
		const markAsReadMutate = vi.fn();
		mockUseMarkAsRead.mockReturnValue({ mutate: markAsReadMutate } as never);
		mockUseConversationHistory.mockReturnValue({ data: undefined } as never);
		render(<ChatThread conversation={conversation} />);
		expect(state.resetMessages).toHaveBeenCalled();
		expect(markAsReadMutate).toHaveBeenCalledWith("c-1");
	});
});
