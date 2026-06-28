import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/professionals/professionals.api", () => ({
	professionalsListingApi: {
		getAll: vi.fn(),
		getById: vi.fn(),
		getNearby: vi.fn(),
		searchBySpecialty: vi.fn(),
	},
}));
vi.mock("@/lib/api/professionals/professional-applications.api", () => ({
	professionalApplicationsApi: {
		create: vi.fn(),
		approve: vi.fn(),
		reject: vi.fn(),
		getPendingApplications: vi.fn(),
		getApplicationStatus: vi.fn(),
	},
}));
vi.mock("@/lib/api/professionals/professional-profile.api", () => ({
	professionalProfileApi: {
		update: vi.fn(),
		delete: vi.fn(),
	},
}));
vi.mock("@/lib/api/professionals/my-professional-profile.api", () => ({
	getMyProfessionalProfileApi: vi.fn(),
}));

import { useApproveApplication } from "@/hooks/api/professionals/use-approve-application";
import { useCreateProfessional } from "@/hooks/api/professionals/use-create-professional";
import { useDeleteProfessional } from "@/hooks/api/professionals/use-delete-professional";
import { useMyProfessionalProfile } from "@/hooks/api/professionals/use-my-professional-profile";
import { usePendingApplications } from "@/hooks/api/professionals/use-pending-applications";
import { useRejectApplication } from "@/hooks/api/professionals/use-reject-application";
import { useSearchProfessionals } from "@/hooks/api/professionals/use-search-professionals";
import { useUpdateProfessional } from "@/hooks/api/professionals/use-update-professional";
import { getMyProfessionalProfileApi } from "@/lib/api/professionals/my-professional-profile.api";
import { professionalApplicationsApi } from "@/lib/api/professionals/professional-applications.api";
import { professionalProfileApi } from "@/lib/api/professionals/professional-profile.api";
import { professionalsListingApi } from "@/lib/api/professionals/professionals.api";

const mockApprove = vi.mocked(professionalApplicationsApi.approve);
const mockReject = vi.mocked(professionalApplicationsApi.reject);
const mockGetPending = vi.mocked(
	professionalApplicationsApi.getPendingApplications,
);
const mockCreate = vi.mocked(professionalApplicationsApi.create);
const mockDelete = vi.mocked(professionalProfileApi.delete);
const mockUpdate = vi.mocked(professionalProfileApi.update);
const mockSearchBySpecialty = vi.mocked(
	professionalsListingApi.searchBySpecialty,
);
const mockGetMyProfile = vi.mocked(getMyProfessionalProfileApi);

const professional = {
	id: "prof-1",
	name: "Dr. Silva",
	specialty: "Cardiologia",
};
const page = {
	content: [professional],
	totalElements: 1,
	totalPages: 1,
	number: 0,
};

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("usePendingApplications", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fetches pending applications", async () => {
		mockGetPending.mockResolvedValueOnce(page as never);
		const { result } = renderHook(() => usePendingApplications(), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(page);
	});
});

describe("useMyProfessionalProfile", () => {
	beforeEach(() => vi.clearAllMocks());

	it("disabled when enabled=false", () => {
		const { result } = renderHook(() => useMyProfessionalProfile(false), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("fetches when enabled", async () => {
		mockGetMyProfile.mockResolvedValueOnce(professional as never);
		const { result } = renderHook(() => useMyProfessionalProfile(true), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(professional);
	});

	it("404 → isError=true, data=undefined (profissional sem perfil cadastrado)", async () => {
		const err404 = Object.assign(new Error("Not Found"), {
			response: { status: 404 },
		});
		mockGetMyProfile.mockRejectedValueOnce(err404);

		const { result } = renderHook(() => useMyProfessionalProfile(true), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isError).toBe(true));

		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBeTruthy();
	});

	it("retry:false garante apenas 1 chamada quando 404", async () => {
		const err404 = Object.assign(new Error("Not Found"), {
			response: { status: 404 },
		});
		mockGetMyProfile.mockRejectedValue(err404);

		const { result } = renderHook(() => useMyProfessionalProfile(true), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isError).toBe(true));

		expect(mockGetMyProfile).toHaveBeenCalledTimes(1);
	});

	it("não chama a API quando enabled=false (cenário: usuário ADMIN sem perfil)", () => {
		const { result } = renderHook(() => useMyProfessionalProfile(false), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
		expect(mockGetMyProfile).not.toHaveBeenCalled();
	});
});

describe("useSearchProfessionals", () => {
	beforeEach(() => vi.clearAllMocks());

	it("disabled when specialty empty", () => {
		const { result } = renderHook(() => useSearchProfessionals(""), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("fetches when specialty provided", async () => {
		mockSearchBySpecialty.mockResolvedValueOnce([professional] as never);
		const { result } = renderHook(() => useSearchProfessionals("Cardiologia"), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toHaveLength(1);
	});
});

describe("useApproveApplication", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls approve with professionalId", async () => {
		mockApprove.mockResolvedValueOnce(professional as never);
		const { result } = renderHook(() => useApproveApplication(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("prof-1");
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockApprove).toHaveBeenCalledWith("prof-1");
	});
});

describe("useRejectApplication", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls reject with professionalId", async () => {
		mockReject.mockResolvedValueOnce(professional as never);
		const { result } = renderHook(() => useRejectApplication(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("prof-1");
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockReject).toHaveBeenCalledWith("prof-1");
	});
});

describe("useCreateProfessional", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls create with data", async () => {
		mockCreate.mockResolvedValueOnce(professional as never);
		const { result } = renderHook(() => useCreateProfessional(), {
			wrapper: wrapper(),
		});
		const data = { name: "Dr. Costa", specialty: "Ortopedia" };
		await act(async () => {
			result.current.mutate(data as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockCreate).toHaveBeenCalledWith(data);
	});
});

describe("useDeleteProfessional", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls delete with professionalId", async () => {
		mockDelete.mockResolvedValueOnce(undefined as never);
		const { result } = renderHook(() => useDeleteProfessional(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("prof-1");
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockDelete).toHaveBeenCalledWith("prof-1");
	});
});

describe("useUpdateProfessional", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls update with professionalId and data", async () => {
		mockUpdate.mockResolvedValueOnce(professional as never);
		const { result } = renderHook(() => useUpdateProfessional(), {
			wrapper: wrapper(),
		});
		const data = { name: "Dr. Silva Atualizado" };
		await act(async () => {
			result.current.mutate({ professionalId: "prof-1", data: data as never });
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockUpdate).toHaveBeenCalledWith("prof-1", data);
	});
});
