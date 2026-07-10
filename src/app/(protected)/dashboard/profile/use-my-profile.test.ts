import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/patients/patient-profile.api", () => ({
	patientProfileApi: {
		getProfessionalPatients: vi.fn(),
		getMyProfile: vi.fn(),
		getProfile: vi.fn(),
		updateMyProfile: vi.fn(),
	},
}));

import { patientProfileApi } from "@/lib/api/patients/patient-profile.api";
import { useMyProfile } from "./use-my-profile";

const mockGetMyProfile = vi.mocked(patientProfileApi.getMyProfile);
const patient = { id: "p-1", name: "João", email: "joao@test.com" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useMyProfile", () => {
	beforeEach(() => vi.clearAllMocks());

	it("disabled when enabled=false", () => {
		const { result } = renderHook(() => useMyProfile(false), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("fetches when enabled", async () => {
		mockGetMyProfile.mockResolvedValueOnce(patient as never);
		const { result } = renderHook(() => useMyProfile(true), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(patient);
	});
});
