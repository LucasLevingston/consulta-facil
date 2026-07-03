import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
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
vi.mock("@/lib/api/patients/patient-health.api", () => ({
	patientHealthApi: {
		getMedicalRecords: vi.fn(),
		updateMedicalRecords: vi.fn(),
	},
}));

import { usePatientProfile } from "@/hooks/api/patients/use-patient-profile";
import { useUpdateMedicalRecords } from "@/hooks/api/patients/use-update-medical-records";
import { useUpdateMyProfile } from "@/hooks/api/patients/use-update-my-profile";
import { patientHealthApi } from "@/lib/api/patients/patient-health.api";
import { patientProfileApi } from "@/lib/api/patients/patient-profile.api";

const mockGetProfile = vi.mocked(patientProfileApi.getProfile);
const mockUpdateMyProfile = vi.mocked(patientProfileApi.updateMyProfile);
const mockUpdateMedicalRecords = vi.mocked(
	patientHealthApi.updateMedicalRecords,
);

const patient = { id: "p-1", name: "João", email: "joao@test.com" };
const medicalRecords = { patientId: "p-1", bloodType: "O+", allergies: [] };

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

describe("useUpdateMyProfile", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls updateMyProfile with data", async () => {
		mockUpdateMyProfile.mockResolvedValueOnce(patient as never);
		const { result } = renderHook(() => useUpdateMyProfile(), {
			wrapper: wrapper(),
		});
		const data = { name: "João Updated" };
		await act(async () => {
			result.current.mutate(data);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockUpdateMyProfile).toHaveBeenCalledWith(data);
	});
});

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
