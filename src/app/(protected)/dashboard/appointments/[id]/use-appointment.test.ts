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
	},
}));

import { appointmentsCrudApi } from "@/lib/api/appointments/appointments.api";
import { useAppointment } from "./use-appointment";

const mockById = vi.mocked(appointmentsCrudApi.getById);

const appt = {
	id: "a-1",
	patientId: "p-1",
	professionalId: "d-1",
	status: "PENDING" as const,
	scheduledAt: "2026-06-01T10:00:00Z",
};

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(
			QueryClientProvider,
			{ client: qc },
			createElement(Suspense, { fallback: null }, children),
		);
}

describe("useAppointment", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fetches when id provided", async () => {
		mockById.mockResolvedValueOnce(appt as never);
		const { result } = renderHook(() => useAppointment("a-1"), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current).not.toBeNull());
		expect(result.current.data.id).toBe("a-1");
	});
});
