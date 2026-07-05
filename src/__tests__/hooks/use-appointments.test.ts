import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement, Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/appointments/appointments.api", () => ({
	appointmentsCrudApi: {
		getByPatient: vi.fn(),
		getByProfessional: vi.fn(),
		getById: vi.fn(),
		schedule: vi.fn(),
		cancel: vi.fn(),
		rate: vi.fn(),
		reschedule: vi.fn(),
	},
}));

import { useAppointment } from "@/hooks/api/appointments/use-appointment";
import { usePatientAppointments } from "@/hooks/api/appointments/use-patient-appointments";
import { useProfessionalAppointments } from "@/hooks/api/appointments/use-professional-appointments";
import { appointmentsCrudApi } from "@/lib/api/appointments/appointments.api";

const mockByPatient = vi.mocked(appointmentsCrudApi.getByPatient);
const mockByProfessional = vi.mocked(appointmentsCrudApi.getByProfessional);
const mockById = vi.mocked(appointmentsCrudApi.getById);

const appt = {
	id: "a-1",
	patientId: "p-1",
	professionalId: "d-1",
	status: "PENDING" as const,
	scheduledAt: "2026-06-01T10:00:00Z",
};
const page = { content: [appt], totalElements: 1, totalPages: 1, number: 0 };

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

describe("useProfessionalAppointments", () => {
	beforeEach(() => vi.clearAllMocks());

	it("disabled when professionalId empty", () => {
		const { result } = renderHook(() => useProfessionalAppointments(""), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("idle quando professionalProfileId ainda não carregou (perfil em loading)", () => {
		// Simula o estado inicial no appointments/page.tsx:
		// professionalProfileId = professionalProfileQuery.data?.id ?? ""
		// enquanto /professionals/me carrega, o id fica "" e useProfessionalAppointments não deve disparar
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

describe("useAppointment", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fetches when id provided", async () => {
		mockById.mockResolvedValueOnce(appt as never);
		const { result } = renderHook(() => useAppointment("a-1"), {
			wrapper: wrapper(true),
		});
		await waitFor(() => expect(result.current).not.toBeNull());
		expect(result.current.data.id).toBe("a-1");
	});
});
