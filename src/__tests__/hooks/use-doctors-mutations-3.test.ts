import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
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

import { useMyProfessionalProfile } from "@/hooks/api/professionals/use-my-professional-profile";
import { getMyProfessionalProfileApi } from "@/lib/api/professionals/my-professional-profile.api";

const mockGetMyProfile = vi.mocked(getMyProfessionalProfileApi);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useMyProfessionalProfile 2", () => {
	beforeEach(() => vi.clearAllMocks());

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
