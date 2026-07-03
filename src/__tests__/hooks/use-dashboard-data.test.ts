import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/appointments", () => ({
	usePatientAppointments: vi.fn(() => ({ data: undefined })),
	useProfessionalAppointments: vi.fn(() => ({ data: undefined })),
	useConfirmAppointment: vi.fn(() => ({ mutateAsync: vi.fn() })),
	useCompleteAppointment: vi.fn(() => ({ mutateAsync: vi.fn() })),
}));
vi.mock("@/features/auth", () => ({
	useUserStore: vi.fn(() => ({ user: { id: "u-1", name: "Test" } })),
}));
vi.mock("@/features/professionals", () => ({
	useMyProfessionalProfile: vi.fn(() => ({ data: undefined })),
}));

import { useDashboardData } from "@/components/custom/dashboard/useDashboardData";
import {
	usePatientAppointments,
	useProfessionalAppointments,
} from "@/features/appointments";

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

describe("useDashboardData basics", () => {
	it("returns user, stats, upcoming, confirm, complete", () => {
		const { result } = renderHook(() => useDashboardData(false, true), {
			wrapper: wrapper(),
		});
		expect(result.current.user).toBeDefined();
		expect(result.current.stats).toBeDefined();
		expect(Array.isArray(result.current.upcoming)).toBe(true);
		expect(typeof result.current.confirm).toBe("function");
		expect(typeof result.current.complete).toBe("function");
	});

	it("uses patient appointments when isPatient=true", () => {
		const content = mkAppts(["CONFIRMED", "PENDING", "COMPLETED"]);
		mockPatient.mockReturnValue({ data: { content } } as never);
		const { result } = renderHook(() => useDashboardData(false, true), {
			wrapper: wrapper(),
		});
		expect(result.current.stats.total).toBe(3);
		expect(result.current.stats.confirmed).toBe(1);
		expect(result.current.stats.pending).toBe(1);
		expect(result.current.stats.completed).toBe(1);
	});

	it("uses professional appointments when isProfessional=true", () => {
		const content = mkAppts(["CONFIRMED", "CANCELED"]);
		mockProfessional.mockReturnValue({ data: { content } } as never);
		const { result } = renderHook(() => useDashboardData(true, false), {
			wrapper: wrapper(),
		});
		expect(result.current.stats.total).toBe(2);
		expect(result.current.stats.canceled).toBe(1);
	});
});
