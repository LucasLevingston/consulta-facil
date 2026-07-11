import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api/notifications/notifications.api", () => ({
	notificationsApi: {
		getAll: vi.fn(),
		getUnreadCount: vi.fn(),
		markAsRead: vi.fn(),
		markAllAsRead: vi.fn(),
	},
}));

import { notificationsApi } from "@/lib/api/notifications/notifications.api";
import { useUnreadCount } from "./use-unread-count";

const mockGetUnreadCount = vi.mocked(notificationsApi.getUnreadCount);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useUnreadCount", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fetches unread count", async () => {
		mockGetUnreadCount.mockResolvedValueOnce(5 as never);
		const { result } = renderHook(() => useUnreadCount(), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toBe(5);
	});
});
