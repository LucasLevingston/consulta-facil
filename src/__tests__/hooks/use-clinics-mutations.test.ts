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
import { useClinicQueue } from "@/hooks/api/clinics/use-clinic-queue";
import { useClinicReceptionists } from "@/hooks/api/clinics/use-clinic-receptionists";
import { useCreateClinic } from "@/hooks/api/clinics/use-create-clinic";
import { useInviteReceptionist } from "@/hooks/api/clinics/use-invite-receptionist";
import { useRemoveClinicMember } from "@/hooks/api/clinics/use-remove-clinic-member";
import { useRemoveReceptionist } from "@/hooks/api/clinics/use-remove-receptionist";
import { useUpdateClinic } from "@/hooks/api/clinics/use-update-clinic";
import { clinicQueueApi } from "@/lib/api/clinics/clinic-queue.api";
import { clinicStaffApi } from "@/lib/api/clinics/clinic-staff.api";
import { clinicsCrudApi } from "@/lib/api/clinics/clinics.api";

const mockCreate = vi.mocked(clinicsCrudApi.create);
const mockUpdate = vi.mocked(clinicsCrudApi.update);
const mockAddMember = vi.mocked(clinicsCrudApi.addMember);
const mockRemoveMember = vi.mocked(clinicsCrudApi.removeMember);
const mockInviteReceptionist = vi.mocked(clinicStaffApi.inviteReceptionist);
const mockRemoveReceptionist = vi.mocked(clinicStaffApi.removeReceptionist);
const mockGetQueue = vi.mocked(clinicQueueApi.getQueue);
const mockGetReceptionists = vi.mocked(clinicStaffApi.getReceptionists);

const clinic = { id: "c-1", name: "Clínica Saúde", city: "SP" };
const queueItem = { id: "a-1", status: "WAITING" };
const receptionist = { id: "r-1", name: "Ana" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useClinicQueue", () => {
	beforeEach(() => vi.clearAllMocks());

	it("disabled when clinicId empty", () => {
		const { result } = renderHook(() => useClinicQueue(""), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("fetches when clinicId provided", async () => {
		mockGetQueue.mockResolvedValueOnce([queueItem] as never);
		const { result } = renderHook(() => useClinicQueue("c-1"), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toHaveLength(1);
	});
});

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
