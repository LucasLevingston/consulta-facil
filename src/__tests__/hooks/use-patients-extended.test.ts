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
vi.mock("@/lib/api/patients/patient-health.api", () => ({
	patientHealthApi: {
		getMedicalRecords: vi.fn(),
		updateMedicalRecords: vi.fn(),
	},
}));

import { useProfessionalPatients } from "@/hooks/api/patients/use-professional-patients";
import { patientProfileApi } from "@/lib/api/patients/patient-profile.api";

const mockGetProfessionalPatients = vi.mocked(
	patientProfileApi.getProfessionalPatients,
);

const patient = { id: "p-1", name: "João", email: "joao@test.com" };

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
