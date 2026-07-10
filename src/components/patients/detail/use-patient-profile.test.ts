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
import { usePatientProfile } from "./use-patient-profile";

const mockGetProfile = vi.mocked(patientProfileApi.getProfile);
const patient = { id: "p-1", name: "João", email: "joao@test.com" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("usePatientProfile", () => {
	beforeEach(() => vi.clearAllMocks());

	it("disabled when userId empty", () => {
		const { result } = renderHook(() => usePatientProfile(""), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("fetches when userId provided", async () => {
		mockGetProfile.mockResolvedValueOnce(patient as never);
		const { result } = renderHook(() => usePatientProfile("p-1"), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(patient);
	});
});
