import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement, Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api/conversations/conversations.api", () => ({
	conversationsApi: {
		list: vi.fn().mockResolvedValue([]),
		getHistory: vi.fn().mockResolvedValue({ content: [], totalPages: 0 }),
		getOrCreate: vi.fn().mockResolvedValue({}),
		markAsRead: vi.fn().mockResolvedValue(undefined),
	},
}));

import { useConversationHistory } from "@/hooks/api/conversations/use-conversation-history";
import { useConversations } from "@/hooks/api/conversations/use-conversations";
import { useMarkAsRead } from "@/hooks/api/conversations/use-mark-as-read";
import { useStartConversation } from "@/hooks/api/conversations/use-start-conversation";

function makeWrapper(useSuspense = false) {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(
			QueryClientProvider,
			{ client: qc },
			useSuspense
				? createElement(Suspense, { fallback: null }, children)
				: children,
		);
}

describe("messaging hooks", () => {
	beforeEach(() => vi.clearAllMocks());

	it("useConversations resolves with data", async () => {
		const { result } = renderHook(() => useConversations(), {
			wrapper: makeWrapper(true),
		});
		await waitFor(() => expect(result.current).not.toBeNull());
		expect(result.current.data).toEqual([]);
	});

	it("useConversationHistory with id returns data and isLoading", () => {
		const { result } = renderHook(() => useConversationHistory("conv-1"), {
			wrapper: makeWrapper(),
		});
		expect(result.current).toHaveProperty("data");
		expect(result.current).toHaveProperty("isLoading");
	});

	it("useConversationHistory with null id stays disabled", () => {
		const { result } = renderHook(() => useConversationHistory(null), {
			wrapper: makeWrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("useStartConversation returns mutate and isPending", () => {
		const { result } = renderHook(() => useStartConversation(), {
			wrapper: makeWrapper(),
		});
		expect(typeof result.current.mutate).toBe("function");
		expect(result.current.isPending).toBe(false);
	});

	it("useMarkAsRead returns mutate and isPending", () => {
		const { result } = renderHook(() => useMarkAsRead(), {
			wrapper: makeWrapper(),
		});
		expect(typeof result.current.mutate).toBe("function");
		expect(result.current.isPending).toBe(false);
	});
});
