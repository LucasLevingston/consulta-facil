import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
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
import { useMarkAllAsRead } from "./use-mark-all-as-read";

const mockMarkAllAsRead = vi.mocked(notificationsApi.markAllAsRead);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useMarkAllAsRead", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls markAllAsRead", async () => {
		mockMarkAllAsRead.mockResolvedValueOnce(undefined as never);
		const { result } = renderHook(() => useMarkAllAsRead(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate();
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockMarkAllAsRead).toHaveBeenCalled();
	});
});
