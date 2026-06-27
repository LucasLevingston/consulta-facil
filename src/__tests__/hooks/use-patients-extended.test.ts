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

import { useMedicalRecords } from "@/hooks/api/patients/use-medical-records";
import { useMyProfile } from "@/hooks/api/patients/use-my-profile";
import { usePatientProfile } from "@/hooks/api/patients/use-patient-profile";
import { useProfessionalPatients } from "@/hooks/api/patients/use-professional-patients";
import { useUpdateMedicalRecords } from "@/hooks/api/patients/use-update-medical-records";
import { useUpdateMyProfile } from "@/hooks/api/patients/use-update-my-profile";
import { patientHealthApi } from "@/lib/api/patients/patient-health.api";
import { patientProfileApi } from "@/lib/api/patients/patient-profile.api";

const mockGetProfessionalPatients = vi.mocked(
	patientProfileApi.getProfessionalPatients,
);
const mockGetMedicalRecords = vi.mocked(patientHealthApi.getMedicalRecords);
const mockGetMyProfile = vi.mocked(patientProfileApi.getMyProfile);
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

describe("useProfessionalPatients", () => {
	beforeEach(() => vi.clearAllMocks());

	it("disabled when professionalId empty", () => {
		const { result } = renderHook(() => useProfessionalPatients("", {}), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("fetches when professionalId provided", async () => {
		mockGetProfessionalPatients.mockResolvedValueOnce([patient] as never);
		const { result } = renderHook(() => useProfessionalPatients("prof-1", {}), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toHaveLength(1);
	});

	it("404 → isError=true, data=undefined (userId sem ProfessionalProfile no backend)", async () => {
		const err404 = Object.assign(new Error("Not Found"), {
			response: { status: 404 },
		});
		mockGetProfessionalPatients.mockRejectedValueOnce(err404);

		const { result } = renderHook(
			() => useProfessionalPatients("user-sem-perfil", { page: 0, size: 10 }),
			{ wrapper: wrapper() },
		);
		await waitFor(() => expect(result.current.isError).toBe(true));

		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBeTruthy();
	});

	it("não dispara quando professionalId não fornecido (enabled guard)", () => {
		const { result } = renderHook(
			() => useProfessionalPatients("", { page: 0 }),
			{
				wrapper: wrapper(),
			},
		);
		expect(result.current.fetchStatus).toBe("idle");
		expect(mockGetProfessionalPatients).not.toHaveBeenCalled();
	});
});

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
