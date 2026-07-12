import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/appointments/appointments.api", () => ({
	appointmentsCrudApi: {
		getByProfessional: vi.fn(),
	},
}));

import { appointmentsCrudApi } from "@/lib/api/appointments/appointments.api";
import { useClinicFinancialStats } from "./use-clinic-financial-stats";

const mockGetByProfessional = vi.mocked(appointmentsCrudApi.getByProfessional);

const completedAppt = {
	id: "a-1",
	status: "COMPLETED",
	professionalId: "prof-1",
};
const page = {
	content: [completedAppt],
	totalElements: 1,
	totalPages: 1,
	number: 0,
};

const member = {
	professionalProfileId: "prof-1",
	professionalName: "Dr. Test",
	specialty: "General",
	role: "PROFESSIONAL",
};

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useClinicFinancialStats", () => {
	beforeEach(() => vi.clearAllMocks());

	it("returns zero stats for empty members", () => {
		const { result } = renderHook(() => useClinicFinancialStats([]), {
			wrapper: wrapper(),
		});
		expect(result.current.totalCompleted).toBe(0);
		expect(result.current.totalFreeUsed).toBe(0);
		expect(result.current.extraProfessionals).toBe(0);
	});

	it("calculates completed and free quota from members", async () => {
		mockGetByProfessional.mockResolvedValue(page as never);
		const { result } = renderHook(() => useClinicFinancialStats([member]), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isLoading).toBe(false));
		expect(result.current.totalCompleted).toBe(1);
		expect(result.current.totalFreeQuota).toBe(5); // FREE_CONSULTS_PER_PROFESSIONAL = 5
		expect(result.current.memberStats).toHaveLength(1);
	});
});
