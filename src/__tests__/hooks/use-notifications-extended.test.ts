import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/notifications/notifications.api", () => ({
	notificationsApi: {
		getAll: vi.fn(),
		getUnreadCount: vi.fn(),
		markAsRead: vi.fn(),
		markAllAsRead: vi.fn(),
	},
}));
vi.mock("@/lib/api/notifications/invites.api", () => ({
	invitesApi: {
		acceptInvite: vi.fn(),
		declineInvite: vi.fn(),
		sendClinicInvite: vi.fn(),
	},
}));

import { useAcceptInvite } from "@/hooks/api/notifications/use-accept-invite";
import { useDeclineInvite } from "@/hooks/api/notifications/use-decline-invite";
import { useMarkAllAsRead } from "@/hooks/api/notifications/use-mark-all-as-read";
import { useMarkAsRead } from "@/hooks/api/notifications/use-mark-as-read";
import { useNotifications } from "@/hooks/api/notifications/use-notifications";
import { useSendClinicInvite } from "@/hooks/api/notifications/use-send-clinic-invite";
import { useUnreadCount } from "@/hooks/api/notifications/use-unread-count";
import { invitesApi } from "@/lib/api/notifications/invites.api";
import { notificationsApi } from "@/lib/api/notifications/notifications.api";

const mockGetAll = vi.mocked(notificationsApi.getAll);
const mockGetUnreadCount = vi.mocked(notificationsApi.getUnreadCount);
const mockMarkAsRead = vi.mocked(notificationsApi.markAsRead);
const mockMarkAllAsRead = vi.mocked(notificationsApi.markAllAsRead);
const mockAcceptInvite = vi.mocked(invitesApi.acceptInvite);
const mockDeclineInvite = vi.mocked(invitesApi.declineInvite);
const mockSendClinicInvite = vi.mocked(invitesApi.sendClinicInvite);

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

describe("useAcceptInvite", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls acceptInvite with id", async () => {
		mockAcceptInvite.mockResolvedValueOnce(notification as never);
		const { result } = renderHook(() => useAcceptInvite(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("n-1");
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockAcceptInvite).toHaveBeenCalledWith("n-1");
	});
});

describe("useDeclineInvite", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls declineInvite with id", async () => {
		mockDeclineInvite.mockResolvedValueOnce(notification as never);
		const { result } = renderHook(() => useDeclineInvite(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("n-1");
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockDeclineInvite).toHaveBeenCalledWith("n-1");
	});
});

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

describe("useSendClinicInvite", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls sendClinicInvite with clinicId and professionalProfileId", async () => {
		mockSendClinicInvite.mockResolvedValueOnce(undefined as never);
		const { result } = renderHook(() => useSendClinicInvite(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate({
				clinicId: "c-1",
				professionalProfileId: "p-1",
			});
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockSendClinicInvite).toHaveBeenCalledWith("c-1", "p-1");
	});
});
