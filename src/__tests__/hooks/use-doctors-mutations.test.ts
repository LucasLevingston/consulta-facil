import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement, Suspense } from "react";
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

import { usePendingApplications } from "@/hooks/api/professionals/use-pending-applications";
import { professionalApplicationsApi } from "@/lib/api/professionals/professional-applications.api";

const mockGetPending = vi.mocked(
	professionalApplicationsApi.getPendingApplications,
);

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

function suspenseWrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(
			QueryClientProvider,
			{ client: qc },
			createElement(Suspense, { fallback: null }, children),
		);
}

describe("usePendingApplications", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fetches pending applications", async () => {
		mockGetPending.mockResolvedValueOnce(page as never);
		const { result } = renderHook(() => usePendingApplications(), {
			wrapper: suspenseWrapper(),
		});
		await waitFor(() => expect(result.current).not.toBeNull());
		expect(result.current.data).toEqual(page);
	});
});
