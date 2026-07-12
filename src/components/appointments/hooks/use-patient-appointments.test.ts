import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/appointments/appointments.api", () => ({
	appointmentsCrudApi: {
		getByPatient: vi.fn(),
		getByProfessional: vi.fn(),
		getById: vi.fn(),
	},
}));

import { appointmentsCrudApi } from "@/lib/api/appointments/appointments.api";
import { usePatientAppointments } from "./use-patient-appointments";

const mockByPatient = vi.mocked(appointmentsCrudApi.getByPatient);

const appt = {
	id: "a-1",
	patientId: "p-1",
	professionalId: "d-1",
	status: "PENDING" as const,
	scheduledAt: "2026-06-01T10:00:00Z",
};
const page = { content: [appt], totalElements: 1, totalPages: 1, number: 0 };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("usePatientAppointments", () => {
	beforeEach(() => vi.clearAllMocks());

	it("disabled when userId empty", () => {
		const { result } = renderHook(() => usePatientAppointments(""), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("fetches when userId provided", async () => {
		mockByPatient.mockResolvedValueOnce(page as never);
		const { result } = renderHook(() => usePatientAppointments("u-1"), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data?.content).toHaveLength(1);
	});
});
