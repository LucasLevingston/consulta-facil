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
import { useNotifications } from "./use-notifications";

const mockGetAll = vi.mocked(notificationsApi.getAll);

const notification = { id: "n-1", title: "Test", read: false };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useNotifications", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fetches notifications", async () => {
		mockGetAll.mockResolvedValueOnce([notification] as never);
		const { result } = renderHook(() => useNotifications(), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toHaveLength(1);
	});

	it("isLoading initially", () => {
		mockGetAll.mockResolvedValueOnce([] as never);
		const { result } = renderHook(() => useNotifications(), {
			wrapper: wrapper(),
		});
		expect(result.current.isLoading).toBe(true);
	});
});
