import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement, Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/professionals/professional-schedule.api", () => ({
	professionalScheduleApi: {
		getMySchedule: vi.fn(),
		getScheduleByProfessional: vi.fn(),
		saveMySchedule: vi.fn(),
	},
}));
vi.mock("@/lib/api/clinics/clinic-working-hours.api", () => ({
	clinicWorkingHoursApi: {
		getClinicWorkingHours: vi.fn(),
		saveClinicWorkingHours: vi.fn(),
	},
}));

import { useClinicWorkingHours } from "@/features/schedule/hooks/use-clinic-working-hours";
import { useMySchedule } from "@/features/schedule/hooks/use-my-schedule";
import { useProfessionalSchedule } from "@/features/schedule/hooks/use-professional-schedule";
import { useSaveClinicWorkingHours } from "@/features/schedule/hooks/use-save-clinic-working-hours";
import { useSaveMySchedule } from "@/features/schedule/hooks/use-save-my-schedule";
import { clinicWorkingHoursApi } from "@/lib/api/clinics/clinic-working-hours.api";
import { professionalScheduleApi } from "@/lib/api/professionals/professional-schedule.api";

const mockGetMySchedule = vi.mocked(professionalScheduleApi.getMySchedule);
const mockGetByProfessional = vi.mocked(
	professionalScheduleApi.getScheduleByProfessional,
);
const mockGetClinicHours = vi.mocked(
	clinicWorkingHoursApi.getClinicWorkingHours,
);
const mockSaveMySchedule = vi.mocked(professionalScheduleApi.saveMySchedule);
const mockSaveClinicHours = vi.mocked(
	clinicWorkingHoursApi.saveClinicWorkingHours,
);

const schedule = [{ day: "MONDAY", startTime: "08:00", endTime: "17:00" }];
const clinicHours = [{ day: "MONDAY", open: "08:00", close: "18:00" }];

function wrapper(useSuspense = false) {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(
			QueryClientProvider,
			{ client: qc },
			useSuspense
				? createElement(Suspense, { fallback: null }, children)
				: children,
		);
}

describe("useMySchedule", () => {
	beforeEach(() => vi.clearAllMocks());

	it("disabled when enabled=false", () => {
		const { result } = renderHook(() => useMySchedule(false), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("fetches when enabled", async () => {
		mockGetMySchedule.mockResolvedValueOnce(schedule as never);
		const { result } = renderHook(() => useMySchedule(true), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(schedule);
	});
});

describe("useProfessionalSchedule", () => {
	beforeEach(() => vi.clearAllMocks());

	it("disabled when professionalId empty", () => {
		const { result } = renderHook(() => useProfessionalSchedule(""), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("fetches when professionalId provided", async () => {
		mockGetByProfessional.mockResolvedValueOnce(schedule as never);
		const { result } = renderHook(() => useProfessionalSchedule("prof-1"), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(schedule);
	});
});

describe("useClinicWorkingHours", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fetches when clinicId provided", async () => {
		mockGetClinicHours.mockResolvedValueOnce(clinicHours as never);
		const { result } = renderHook(() => useClinicWorkingHours("c-1"), {
			wrapper: wrapper(true),
		});
		await waitFor(() => expect(result.current).not.toBeNull());
		expect(result.current.data).toEqual(clinicHours);
	});
});

describe("useSaveMySchedule", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls saveMySchedule with items", async () => {
		mockSaveMySchedule.mockResolvedValueOnce(schedule as never);
		const { result } = renderHook(() => useSaveMySchedule(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate(schedule as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockSaveMySchedule).toHaveBeenCalledWith(schedule);
	});
});

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
