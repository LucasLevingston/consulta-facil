import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/patients/patient-health.api", () => ({
	patientHealthApi: {
		getMedicalRecords: vi.fn(),
		updateMedicalRecords: vi.fn(),
	},
}));

import { patientHealthApi } from "@/lib/api/patients/patient-health.api";
import { useMedicalRecords } from "./use-medical-records";

const mockGetMedicalRecords = vi.mocked(patientHealthApi.getMedicalRecords);
const medicalRecords = { patientId: "p-1", bloodType: "O+", allergies: [] };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useMedicalRecords", () => {
	beforeEach(() => vi.clearAllMocks());

	it("disabled when userId empty", () => {
		const { result } = renderHook(() => useMedicalRecords(""), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("fetches when userId provided", async () => {
		mockGetMedicalRecords.mockResolvedValueOnce(medicalRecords as never);
		const { result } = renderHook(() => useMedicalRecords("u-1"), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(medicalRecords);
	});
});
