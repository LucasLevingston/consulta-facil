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
import { useMarkAsRead } from "./use-mark-as-read";

const mockMarkAsRead = vi.mocked(notificationsApi.markAsRead);

const notification = { id: "n-1", title: "Test", read: false };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useMarkAsRead", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls markAsRead with id", async () => {
		mockMarkAsRead.mockResolvedValueOnce(notification as never);
		const { result } = renderHook(() => useMarkAsRead(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("n-1");
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockMarkAsRead).toHaveBeenCalledWith("n-1");
	});
});
