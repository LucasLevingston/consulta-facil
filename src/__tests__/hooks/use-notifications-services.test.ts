import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), defaults: { headers: { common: {} } } },
}));
vi.mock("@/lib/api/notifications/notifications.api", () => ({
	notificationsApi: {
		getAll: vi.fn(),
		getUnreadCount: vi.fn(),
		markAllRead: vi.fn(),
	},
}));
vi.mock("@/lib/api/services/professional-services.api", () => ({
	professionalServicesApi: { getByProfessional: vi.fn(), create: vi.fn() },
}));

import { useGetProfessionalServices } from "@/components/services/services-card/use-get-professional-services";
import { useNotifications } from "@/features/notifications/hooks/use-notifications";
import { useUnreadCount } from "@/features/notifications/hooks/use-unread-count";
import { notificationsApi } from "@/lib/api/notifications/notifications.api";
import { professionalServicesApi } from "@/lib/api/services/professional-services.api";

const mockGetAll = vi.mocked(notificationsApi.getAll);
const mockUnread = vi.mocked(notificationsApi.getUnreadCount);
const mockGetServices = vi.mocked(professionalServicesApi.getByProfessional);

function wrapper() {
	const qc = new QueryClient({
		defaultOptions: { queries: { retry: false, refetchInterval: false } },
	});
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useNotifications", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fetches notification list", async () => {
		mockGetAll.mockResolvedValueOnce([] as never);
		const { result } = renderHook(() => useNotifications(), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
	});

	it("is loading initially", () => {
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
		mockUnread.mockResolvedValueOnce(3 as never);
		const { result } = renderHook(() => useUnreadCount(), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toBe(3);
	});
});

describe("useGetProfessionalServices", () => {
	beforeEach(() => vi.clearAllMocks());

	it("disabled when professionalId empty", () => {
		const { result } = renderHook(() => useGetProfessionalServices(""), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("fetches when professionalId provided", async () => {
		mockGetServices.mockResolvedValueOnce([] as never);
		const { result } = renderHook(() => useGetProfessionalServices("prof-1"), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
	});
});
