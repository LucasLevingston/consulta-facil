import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/appointments/appointments.api", () => ({
	appointmentsCrudApi: {
		getAll: vi.fn(),
		getByPatient: vi.fn(),
		getByProfessional: vi.fn(),
		getById: vi.fn(),
	},
}));

import { appointmentKeys } from "@/features/appointments/hooks/appointment-keys";
import { useAllAdminAppointments } from "@/features/appointments/hooks/use-all-admin-appointments";
import { appointmentsCrudApi } from "@/lib/api/appointments/appointments.api";

const mockGetAll = vi.mocked(appointmentsCrudApi.getAll);

const appt = {
	id: "a-1",
	patientId: "p-1",
	professionalId: "d-1",
	patientName: "João Silva",
	professionalName: "Dra. Ana",
	status: "COMPLETED" as const,
	paymentStatus: "PAID" as const,
	paymentAmount: 200,
	scheduledAt: "2026-06-01T10:00:00Z",
	serviceName: "Consulta",
};

const page = { content: [appt], totalElements: 1, totalPages: 1, number: 0 };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useAllAdminAppointments", () => {
	beforeEach(() => vi.clearAllMocks());

	it("busca com valores padrão page=0 size=100", async () => {
		mockGetAll.mockResolvedValueOnce(page as never);

		const { result } = renderHook(() => useAllAdminAppointments(), {
			wrapper: wrapper(),
		});

		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockGetAll).toHaveBeenCalledWith(0, 100);
		expect(result.current.data?.content).toHaveLength(1);
	});

	it("busca com page e size customizados", async () => {
		mockGetAll.mockResolvedValueOnce(page as never);

		const { result } = renderHook(() => useAllAdminAppointments(2, 50), {
			wrapper: wrapper(),
		});

		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockGetAll).toHaveBeenCalledWith(2, 50);
	});

	it("expõe totalElements corretamente", async () => {
		const bigPage = { ...page, totalElements: 42 };
		mockGetAll.mockResolvedValueOnce(bigPage as never);

		const { result } = renderHook(() => useAllAdminAppointments(0, 50), {
			wrapper: wrapper(),
		});

		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data?.totalElements).toBe(42);
	});

	it("usa queryKey adminAll com page e size", async () => {
		const key = appointmentKeys.adminAll(1, 25);
		expect(key).toEqual(["appointments", "admin", 1, 25]);
	});

	it("propaga erro da API", async () => {
		mockGetAll.mockRejectedValueOnce(new Error("Unauthorized"));

		const { result } = renderHook(() => useAllAdminAppointments(), {
			wrapper: wrapper(),
		});

		await waitFor(() => expect(result.current.isError).toBe(true));
		expect(result.current.error).toBeInstanceOf(Error);
	});
});

describe("appointmentKeys.adminAll", () => {
	it("gera key correta", () => {
		expect(appointmentKeys.adminAll(0, 100)).toEqual([
			"appointments",
			"admin",
			0,
			100,
		]);
	});

	it("page e size diferentes geram keys diferentes", () => {
		const k1 = appointmentKeys.adminAll(0, 10);
		const k2 = appointmentKeys.adminAll(1, 10);
		expect(k1).not.toEqual(k2);
	});
});
