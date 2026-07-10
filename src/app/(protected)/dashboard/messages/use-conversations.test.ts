import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement, Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api/conversations/conversations.api", () => ({
	conversationsApi: {
		list: vi.fn().mockResolvedValue([]),
		getHistory: vi.fn(),
		getOrCreate: vi.fn(),
		markAsRead: vi.fn(),
	},
}));

import { useConversations } from "./use-conversations";

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(
			QueryClientProvider,
			{ client: qc },
			createElement(Suspense, { fallback: null }, children),
		);
}

describe("useConversations", () => {
	beforeEach(() => vi.clearAllMocks());

	it("resolves with data", async () => {
		const { result } = renderHook(() => useConversations(), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current).not.toBeNull());
		expect(result.current.data).toEqual([]);
	});
});
