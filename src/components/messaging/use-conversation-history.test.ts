import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api/conversations/conversations.api", () => ({
	conversationsApi: {
		list: vi.fn(),
		getHistory: vi.fn().mockResolvedValue({ content: [], totalPages: 0 }),
		getOrCreate: vi.fn(),
		markAsRead: vi.fn(),
	},
}));

import { useConversationHistory } from "./use-conversation-history";

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useConversationHistory", () => {
	beforeEach(() => vi.clearAllMocks());

	it("with id returns data and isLoading", () => {
		const { result } = renderHook(() => useConversationHistory("conv-1"), {
			wrapper: wrapper(),
		});
		expect(result.current).toHaveProperty("data");
		expect(result.current).toHaveProperty("isLoading");
	});

	it("with null id stays disabled", () => {
		const { result } = renderHook(() => useConversationHistory(null), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});
});
