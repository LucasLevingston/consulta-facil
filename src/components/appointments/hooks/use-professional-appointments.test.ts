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
import { useProfessionalAppointments } from "./use-professional-appointments";

const mockByProfessional = vi.mocked(appointmentsCrudApi.getByProfessional);

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

describe("useProfessionalAppointments", () => {
	beforeEach(() => vi.clearAllMocks());

	it("disabled when professionalId empty", () => {
		const { result } = renderHook(() => useProfessionalAppointments(""), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("idle quando professionalProfileId ainda não carregou (perfil em loading)", () => {
		const { result } = renderHook(() => useProfessionalAppointments(""), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
		expect(mockByProfessional).not.toHaveBeenCalled();
	});

	it("fetches when professionalId provided", async () => {
		mockByProfessional.mockResolvedValueOnce(page as never);
		const { result } = renderHook(() => useProfessionalAppointments("prof-1"), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
	});
});
