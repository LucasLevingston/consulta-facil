import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
	useSearchParams: vi.fn(),
}));
vi.mock("./use-conversations", () => ({
	useConversations: vi.fn(),
}));

import { useSearchParams } from "next/navigation";
import { useConversations } from "./use-conversations";
import { useMessagesPage } from "./use-messages-page";

const mockUseSearchParams = vi.mocked(useSearchParams);
const mockUseConversations = vi.mocked(useConversations);

const conversations = [
	{ id: "c-1", name: "Conversa 1" },
	{ id: "c-2", name: "Conversa 2" },
];

beforeEach(() => {
	vi.clearAllMocks();
	mockUseSearchParams.mockReturnValue(new URLSearchParams() as never);
	mockUseConversations.mockReturnValue({ data: conversations } as never);
});

describe("useMessagesPage", () => {
	it("inicia sem conversa selecionada quando não há parâmetro 'c'", () => {
		const { result } = renderHook(() => useMessagesPage());
		expect(result.current.selectedId).toBeNull();
		expect(result.current.selected).toBeUndefined();
		expect(result.current.mobileShowThread).toBe(false);
	});

	it("inicia com a conversa selecionada a partir do parâmetro 'c'", () => {
		mockUseSearchParams.mockReturnValue(new URLSearchParams("c=c-2") as never);
		const { result } = renderHook(() => useMessagesPage());
		expect(result.current.selectedId).toBe("c-2");
		expect(result.current.selected).toEqual(conversations[1]);
		expect(result.current.mobileShowThread).toBe(true);
	});

	it("handleSelect atualiza selectedId e exibe a thread no mobile", () => {
		const { result } = renderHook(() => useMessagesPage());
		act(() => result.current.handleSelect("c-1"));
		expect(result.current.selectedId).toBe("c-1");
		expect(result.current.selected).toEqual(conversations[0]);
		expect(result.current.mobileShowThread).toBe(true);
	});

	it("retorna a lista de conversas do useConversations", () => {
		const { result } = renderHook(() => useMessagesPage());
		expect(result.current.conversations).toEqual(conversations);
	});
});
