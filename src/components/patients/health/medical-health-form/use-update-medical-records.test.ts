import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
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
import { useUpdateMedicalRecords } from "./use-update-medical-records";

const mockUpdateMedicalRecords = vi.mocked(
	patientHealthApi.updateMedicalRecords,
);
const medicalRecords = { patientId: "p-1", bloodType: "O+", allergies: [] };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useUpdateMedicalRecords", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls updateMedicalRecords with userId and data", async () => {
		mockUpdateMedicalRecords.mockResolvedValueOnce(medicalRecords as never);
		const { result } = renderHook(() => useUpdateMedicalRecords("u-1"), {
			wrapper: wrapper(),
		});
		const data = { bloodType: "A+" };
		await act(async () => {
			result.current.mutate(data as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockUpdateMedicalRecords).toHaveBeenCalledWith("u-1", data);
	});
});
