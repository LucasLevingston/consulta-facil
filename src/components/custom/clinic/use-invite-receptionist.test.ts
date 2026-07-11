import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/clinics/clinic-staff.api", () => ({
	clinicStaffApi: {
		inviteReceptionist: vi.fn(),
		removeReceptionist: vi.fn(),
		getReceptionists: vi.fn(),
	},
}));

import { clinicStaffApi } from "@/lib/api/clinics/clinic-staff.api";
import { useInviteReceptionist } from "./use-invite-receptionist";

const mockInviteReceptionist = vi.mocked(clinicStaffApi.inviteReceptionist);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useInviteReceptionist", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls inviteReceptionist with clinicId and data", async () => {
		mockInviteReceptionist.mockResolvedValueOnce(undefined as never);
		const { result } = renderHook(() => useInviteReceptionist("c-1"), {
			wrapper: wrapper(),
		});
		const data = { email: "recepcao@clinic.com" };
		await act(async () => {
			result.current.mutate(data as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockInviteReceptionist).toHaveBeenCalledWith("c-1", data);
	});
});
