import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api/conversations/conversations.api", () => ({
	conversationsApi: {
		list: vi.fn(),
		getHistory: vi.fn(),
		getOrCreate: vi.fn(),
		markAsRead: vi.fn().mockResolvedValue(undefined),
	},
}));

import { useMarkAsRead } from "./use-mark-as-read";

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useMarkAsRead", () => {
	beforeEach(() => vi.clearAllMocks());

	it("returns mutate and isPending", () => {
		const { result } = renderHook(() => useMarkAsRead(), {
			wrapper: wrapper(),
		});
		expect(typeof result.current.mutate).toBe("function");
		expect(result.current.isPending).toBe(false);
	});
});
