import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement, Suspense } from "react";
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
import { useClinicWorkingHours } from "./use-clinic-working-hours";

const mockGetClinicHours = vi.mocked(
	clinicWorkingHoursApi.getClinicWorkingHours,
);

const clinicHours = [{ day: "MONDAY", open: "08:00", close: "18:00" }];

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(
			QueryClientProvider,
			{ client: qc },
			createElement(Suspense, { fallback: null }, children),
		);
}

describe("useClinicWorkingHours", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fetches when clinicId provided", async () => {
		mockGetClinicHours.mockResolvedValueOnce(clinicHours as never);
		const { result } = renderHook(() => useClinicWorkingHours("c-1"), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current).not.toBeNull());
		expect(result.current.data).toEqual(clinicHours);
	});
});
