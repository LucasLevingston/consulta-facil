import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/clinics/clinics.api", () => ({
	clinicsCrudApi: {
		getAll: vi.fn(),
		getMy: vi.fn(),
		getById: vi.fn(),
		getNearby: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		addMember: vi.fn(),
		removeMember: vi.fn(),
	},
}));
vi.mock("@/lib/api/clinics/clinic-staff.api", () => ({
	clinicStaffApi: {
		inviteReceptionist: vi.fn(),
		removeReceptionist: vi.fn(),
		getReceptionists: vi.fn(),
	},
}));
vi.mock("@/lib/api/clinics/clinic-queue.api", () => ({
	clinicQueueApi: {
		getQueue: vi.fn(),
	},
}));

import { useInviteReceptionist } from "@/hooks/api/clinics/use-invite-receptionist";
import { useRemoveClinicMember } from "@/hooks/api/clinics/use-remove-clinic-member";
import { clinicStaffApi } from "@/lib/api/clinics/clinic-staff.api";
import { clinicsCrudApi } from "@/lib/api/clinics/clinics.api";

const mockRemoveMember = vi.mocked(clinicsCrudApi.removeMember);
const mockInviteReceptionist = vi.mocked(clinicStaffApi.inviteReceptionist);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useRemoveClinicMember", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls removeMember with clinicId and professionalProfileId", async () => {
		mockRemoveMember.mockResolvedValueOnce(undefined as never);
		const { result } = renderHook(() => useRemoveClinicMember(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate({ clinicId: "c-1", professionalProfileId: "p-1" });
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockRemoveMember).toHaveBeenCalledWith("c-1", "p-1");
	});
});

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
