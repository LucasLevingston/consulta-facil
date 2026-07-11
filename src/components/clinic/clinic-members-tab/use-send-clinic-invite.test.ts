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
import { useSendClinicInvite } from "./use-send-clinic-invite";

const mockSendClinicInvite = vi.mocked(invitesApi.sendClinicInvite);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

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
