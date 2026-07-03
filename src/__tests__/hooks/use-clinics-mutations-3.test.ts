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

import { useAddClinicMember } from "@/hooks/api/clinics/use-add-clinic-member";
import { useUpdateClinic } from "@/hooks/api/clinics/use-update-clinic";
import { clinicsCrudApi } from "@/lib/api/clinics/clinics.api";

const mockUpdate = vi.mocked(clinicsCrudApi.update);
const mockAddMember = vi.mocked(clinicsCrudApi.addMember);

const clinic = { id: "c-1", name: "Clínica Saúde", city: "SP" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useUpdateClinic", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls update with id and data", async () => {
		mockUpdate.mockResolvedValueOnce(clinic as never);
		const { result } = renderHook(() => useUpdateClinic(), {
			wrapper: wrapper(),
		});
		const data = { name: "Clínica Atualizada" };
		await act(async () => {
			result.current.mutate({ id: "c-1", data: data as never });
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockUpdate).toHaveBeenCalledWith("c-1", data);
	});
});

describe("useAddClinicMember", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls addMember with clinicId and professionalProfileId", async () => {
		mockAddMember.mockResolvedValueOnce(undefined as never);
		const { result } = renderHook(() => useAddClinicMember(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate({ clinicId: "c-1", professionalProfileId: "p-1" });
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockAddMember).toHaveBeenCalledWith("c-1", "p-1");
	});
});
