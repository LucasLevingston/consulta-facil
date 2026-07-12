import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/components/appointments/hooks", () => ({
	usePatientAppointments: vi.fn(() => ({ data: undefined })),
	useProfessionalAppointments: vi.fn(() => ({ data: undefined })),
	useConfirmAppointment: vi.fn(() => ({ mutateAsync: vi.fn() })),
	useCompleteAppointment: vi.fn(() => ({ mutateAsync: vi.fn() })),
}));
vi.mock("@/features/auth", () => ({
	useUserStore: vi.fn(() => ({ user: { id: "u-1", name: "Test" } })),
}));
vi.mock("@/components/professionals/hooks", () => ({
	useMyProfessionalProfile: vi.fn(() => ({ data: undefined })),
}));

import {
	usePatientAppointments,
	useProfessionalAppointments,
} from "@/components/appointments/hooks";
import { useDashboardData } from "@/components/custom/dashboard/useDashboardData";

const mockPatient = vi.mocked(usePatientAppointments);
const mockProfessional = vi.mocked(useProfessionalAppointments);

function wrapper() {
	const qc = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
	});
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

beforeEach(() => {
	vi.clearAllMocks();
	mockPatient.mockReturnValue({ data: undefined } as never);
	mockProfessional.mockReturnValue({ data: undefined } as never);
});

const mkAppts = (statuses: string[]) =>
	statuses.map((status, i) => ({
		id: `a-${i}`,
		status,
		scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * (i + 1)).toISOString(),
	}));

describe("useDashboardData upcoming/stats", () => {
	it("limits upcoming to 3 for patients", () => {
		const content = mkAppts([
			"CONFIRMED",
			"CONFIRMED",
			"CONFIRMED",
			"CONFIRMED",
		]);
		mockPatient.mockReturnValue({ data: { content } } as never);
		const { result } = renderHook(() => useDashboardData(false, true), {
			wrapper: wrapper(),
		});
		expect(result.current.upcoming.length).toBeLessThanOrEqual(3);
	});

	it("limits upcoming to 5 for professionals", () => {
		const content = mkAppts([
			"CONFIRMED",
			"CONFIRMED",
			"CONFIRMED",
			"CONFIRMED",
			"CONFIRMED",
			"CONFIRMED",
		]);
		mockProfessional.mockReturnValue({ data: { content } } as never);
		const { result } = renderHook(() => useDashboardData(true, false), {
			wrapper: wrapper(),
		});
		expect(result.current.upcoming.length).toBeLessThanOrEqual(5);
	});

	it("returns zero stats when no appointments", () => {
		const { result } = renderHook(() => useDashboardData(false, true), {
			wrapper: wrapper(),
		});
		expect(result.current.stats).toEqual({
			total: 0,
			confirmed: 0,
			pending: 0,
			completed: 0,
			canceled: 0,
		});
	});
});
