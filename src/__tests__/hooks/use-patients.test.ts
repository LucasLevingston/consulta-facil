import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: {
		get: vi.fn(),
		post: vi.fn(),
		put: vi.fn(),
		delete: vi.fn(),
		defaults: { headers: { common: {} } },
	},
}));
vi.mock("@/lib/api/patients/patient-profile.api", () => ({
	patientProfileApi: {
		getMyProfile: vi.fn(),
		getProfile: vi.fn(),
		getMedicalRecords: vi.fn(),
	},
}));

import { useMyProfile } from "@/features/patients/hooks/use-my-profile";
import { usePatientProfile } from "@/features/patients/hooks/use-patient-profile";
import { patientProfileApi } from "@/lib/api/patients/patient-profile.api";

const mockGetMine = vi.mocked(patientProfileApi.getMyProfile);
const mockGetProfile = vi.mocked(patientProfileApi.getProfile);

const profile = { id: "pp-1", userId: "u-1", name: "João" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useMyProfile", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fetches my profile", async () => {
		mockGetMine.mockResolvedValueOnce(profile as never);
		const { result } = renderHook(() => useMyProfile(), { wrapper: wrapper() });
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(profile);
	});

	it("disabled when enabled=false", () => {
		const { result } = renderHook(() => useMyProfile(false), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});
});

describe("usePatientProfile", () => {
	beforeEach(() => vi.clearAllMocks());

	it("disabled when userId empty", () => {
		const { result } = renderHook(() => usePatientProfile(""), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("fetches when userId provided", async () => {
		mockGetProfile.mockResolvedValueOnce(profile as never);
		const { result } = renderHook(() => usePatientProfile("u-1"), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
	});
});
