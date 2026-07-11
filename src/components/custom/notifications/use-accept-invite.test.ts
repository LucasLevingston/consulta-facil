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
import { useAcceptInvite } from "./use-accept-invite";

const mockAcceptInvite = vi.mocked(invitesApi.acceptInvite);

const notification = { id: "n-1", title: "Test", read: false };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

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
