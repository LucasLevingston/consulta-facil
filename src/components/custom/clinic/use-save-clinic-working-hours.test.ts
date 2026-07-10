import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/clinics/clinic-working-hours.api", () => ({
	clinicWorkingHoursApi: {
		getClinicWorkingHours: vi.fn(),
		saveClinicWorkingHours: vi.fn(),
	},
}));

import { clinicWorkingHoursApi } from "@/lib/api/clinics/clinic-working-hours.api";
import { useSaveClinicWorkingHours } from "./use-save-clinic-working-hours";

const mockSaveClinicHours = vi.mocked(
	clinicWorkingHoursApi.saveClinicWorkingHours,
);

const clinicHours = [{ day: "MONDAY", open: "08:00", close: "18:00" }];

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useSaveClinicWorkingHours", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls saveClinicWorkingHours with clinicId and items", async () => {
		mockSaveClinicHours.mockResolvedValueOnce(clinicHours as never);
		const { result } = renderHook(() => useSaveClinicWorkingHours("c-1"), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate(clinicHours as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockSaveClinicHours).toHaveBeenCalledWith("c-1", clinicHours);
	});
});
