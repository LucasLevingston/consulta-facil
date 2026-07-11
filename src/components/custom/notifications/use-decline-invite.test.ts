import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api/notifications/invites.api", () => ({
	invitesApi: {
		acceptInvite: vi.fn(),
		declineInvite: vi.fn(),
		sendClinicInvite: vi.fn(),
	},
}));

import { invitesApi } from "@/lib/api/notifications/invites.api";
import { useDeclineInvite } from "./use-decline-invite";

const mockDeclineInvite = vi.mocked(invitesApi.declineInvite);

const notification = { id: "n-1", title: "Test", read: false };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

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
