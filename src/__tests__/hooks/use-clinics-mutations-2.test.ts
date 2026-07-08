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

import { useClinicReceptionists } from "@/features/clinics/hooks/use-clinic-receptionists";
import { useCreateClinic } from "@/features/clinics/hooks/use-create-clinic";
import { clinicStaffApi } from "@/lib/api/clinics/clinic-staff.api";
import { clinicsCrudApi } from "@/lib/api/clinics/clinics.api";

const mockGetReceptionists = vi.mocked(clinicStaffApi.getReceptionists);
const mockCreate = vi.mocked(clinicsCrudApi.create);

const clinic = { id: "c-1", name: "Clínica Saúde", city: "SP" };
const receptionist = { id: "r-1", name: "Ana" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useClinicReceptionists", () => {
	beforeEach(() => vi.clearAllMocks());

	it("disabled when clinicId empty", () => {
		const { result } = renderHook(() => useClinicReceptionists(""), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("fetches when clinicId provided", async () => {
		mockGetReceptionists.mockResolvedValueOnce([receptionist] as never);
		const { result } = renderHook(() => useClinicReceptionists("c-1"), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toHaveLength(1);
	});
});

describe("useCreateClinic", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls create with data", async () => {
		mockCreate.mockResolvedValueOnce(clinic as never);
		const { result } = renderHook(() => useCreateClinic(), {
			wrapper: wrapper(),
		});
		const data = { name: "Nova Clínica", city: "RJ" };
		await act(async () => {
			result.current.mutate(data as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockCreate).toHaveBeenCalledWith(data);
	});
});
