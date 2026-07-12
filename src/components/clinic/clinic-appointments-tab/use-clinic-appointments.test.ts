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
import { useClinicAppointments } from "./use-clinic-appointments";

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

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useClinicAppointments", () => {
	beforeEach(() => vi.clearAllMocks());

	it("returns empty appointments for empty ids", () => {
		const { result } = renderHook(() => useClinicAppointments([]), {
			wrapper: wrapper(),
		});
		expect(result.current.appointments).toHaveLength(0);
		expect(result.current.isLoading).toBe(false);
	});

	it("fetches appointments for each id", async () => {
		mockGetByProfessional.mockResolvedValue(page as never);
		const { result } = renderHook(
			() => useClinicAppointments(["prof-1", "prof-2"]),
			{ wrapper: wrapper() },
		);
		await waitFor(() => expect(result.current.isLoading).toBe(false));
		expect(result.current.appointments).toHaveLength(2);
		expect(mockGetByProfessional).toHaveBeenCalledTimes(2);
	});

	it("flattens appointments from all professionals", async () => {
		mockGetByProfessional.mockResolvedValue(page as never);
		const { result } = renderHook(() => useClinicAppointments(["prof-1"]), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isLoading).toBe(false));
		expect(result.current.appointments[0]).toEqual(completedAppt);
	});
});
