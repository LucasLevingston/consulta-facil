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

import { patientProfileApi } from "@/lib/api/patients/patient-profile.api";
import { useUpdateMyProfile } from "./use-update-my-profile";

const mockUpdateMyProfile = vi.mocked(patientProfileApi.updateMyProfile);
const patient = { id: "p-1", name: "João", email: "joao@test.com" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

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
