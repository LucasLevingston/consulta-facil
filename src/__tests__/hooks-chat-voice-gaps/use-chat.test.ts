import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
	mockClientCtor,
	mockActivate,
	mockDeactivate,
	mockSubscribe,
	mockPublish,
	mockSockJs,
	clientState,
} = vi.hoisted(() => {
	return {
		mockClientCtor: vi.fn(),
		mockActivate: vi.fn(),
		mockDeactivate: vi.fn(),
		mockSubscribe: vi.fn(),
		mockPublish: vi.fn(),
		mockSockJs: vi.fn(),
		clientState: { connected: false },
	};
});

vi.mock("@stomp/stompjs", () => ({
	Client: vi.fn().mockImplementation(function MockClient(config: unknown) {
		mockClientCtor(config);
		return {
			activate: mockActivate,
			deactivate: mockDeactivate,
			subscribe: mockSubscribe,
			publish: mockPublish,
			get connected() {
				return clientState.connected;
			},
		};
	}),
}));

vi.mock("sockjs-client", () => ({
	default: mockSockJs,
}));

vi.mock("@/store/auth.store", () => ({
	useAuthStore: vi.fn(),
}));

import { useChat } from "@/hooks/use-chat";
import { useAuthStore } from "@/store/auth.store";

const mockUseAuthStore = vi.mocked(useAuthStore);

const message = {
	id: "m-1",
	senderId: "u-1",
	senderName: "Maria",
	content: "Olá!",
	sentAt: "2026-07-04T10:00:00Z",
	isRead: false,
};

describe("useChat", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		clientState.connected = false;
		mockUseAuthStore.mockImplementation(
			(selector: (state: { token: string | null }) => unknown) =>
				selector({ token: "token-abc" }),
		);
	});

	it("não cria conexão STOMP quando conversationId é nulo", () => {
		renderHook(() => useChat(null));
		expect(mockClientCtor).not.toHaveBeenCalled();
		expect(mockActivate).not.toHaveBeenCalled();
	});

	it("não cria conexão STOMP quando não há token", () => {
		mockUseAuthStore.mockImplementation(
			(selector: (state: { token: string | null }) => unknown) =>
				selector({ token: null }),
		);
		renderHook(() => useChat("conv-1"));
		expect(mockClientCtor).not.toHaveBeenCalled();
	});

	it("ativa o cliente STOMP com header de autorização quando conversationId e token existem", () => {
		renderHook(() => useChat("conv-1"));

		expect(mockClientCtor).toHaveBeenCalledTimes(1);
		const config = mockClientCtor.mock.calls[0][0];
		expect(config.connectHeaders).toEqual({
			Authorization: "Bearer token-abc",
		});
		expect(mockActivate).toHaveBeenCalledTimes(1);
	});

	it("webSocketFactory cria uma conexão SockJS apontando para o endpoint /ws", () => {
		renderHook(() => useChat("conv-1"));

		const config = mockClientCtor.mock.calls[0][0];
		config.webSocketFactory();
		expect(mockSockJs).toHaveBeenCalledWith(expect.stringContaining("/ws"));
	});

	it("assina o tópico da conversa e acumula mensagens recebidas", () => {
		const { result } = renderHook(() => useChat("conv-1"));
		const config = mockClientCtor.mock.calls[0][0];

		act(() => {
			config.onConnect();
		});

		expect(mockSubscribe).toHaveBeenCalledWith(
			"/topic/conversation.conv-1",
			expect.any(Function),
		);

		const subscribeCallback = mockSubscribe.mock.calls[0][1];
		act(() => {
			subscribeCallback({ body: JSON.stringify(message) });
		});

		expect(result.current.messages).toEqual([message]);
	});

	it("envia mensagem via publish quando o cliente está conectado", () => {
		clientState.connected = true;
		const { result } = renderHook(() => useChat("conv-1"));

		act(() => {
			result.current.sendMessage("Oi, tudo bem?");
		});

		expect(mockPublish).toHaveBeenCalledWith({
			destination: "/app/chat/conv-1",
			body: JSON.stringify({ content: "Oi, tudo bem?" }),
		});
	});

	it("não envia mensagem quando o cliente não está conectado", () => {
		clientState.connected = false;
		const { result } = renderHook(() => useChat("conv-1"));

		act(() => {
			result.current.sendMessage("Oi");
		});

		expect(mockPublish).not.toHaveBeenCalled();
	});

	it("resetMessages limpa o histórico de mensagens", () => {
		const { result } = renderHook(() => useChat("conv-1"));
		const config = mockClientCtor.mock.calls[0][0];

		act(() => {
			config.onConnect();
		});
		const subscribeCallback = mockSubscribe.mock.calls[0][1];
		act(() => {
			subscribeCallback({ body: JSON.stringify(message) });
		});
		expect(result.current.messages).toHaveLength(1);

		act(() => {
			result.current.resetMessages();
		});
		expect(result.current.messages).toEqual([]);
	});

	it("desativa o cliente STOMP ao desmontar", () => {
		const { unmount } = renderHook(() => useChat("conv-1"));
		unmount();
		expect(mockDeactivate).toHaveBeenCalledTimes(1);
	});
});
