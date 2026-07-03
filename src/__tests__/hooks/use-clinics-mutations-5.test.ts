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

import { useRemoveReceptionist } from "@/hooks/api/clinics/use-remove-receptionist";
import { clinicStaffApi } from "@/lib/api/clinics/clinic-staff.api";

const mockRemoveReceptionist = vi.mocked(clinicStaffApi.removeReceptionist);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useRemoveReceptionist", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls removeReceptionist with clinicId and receptionistId", async () => {
		mockRemoveReceptionist.mockResolvedValueOnce(undefined as never);
		const { result } = renderHook(() => useRemoveReceptionist("c-1"), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("r-1");
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockRemoveReceptionist).toHaveBeenCalledWith("c-1", "r-1");
	});
});
