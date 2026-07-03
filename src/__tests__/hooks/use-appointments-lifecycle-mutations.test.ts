import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/appointments/appointments.api", () => ({
	appointmentsCrudApi: {
		schedule: vi.fn(),
		reschedule: vi.fn(),
		delete: vi.fn(),
	},
}));
vi.mock("@/lib/api/appointments/appointment-lifecycle.api", () => ({
	appointmentLifecycleApi: {
		cancel: vi.fn(),
		confirm: vi.fn(),
		complete: vi.fn(),
		setModality: vi.fn(),
	},
}));

import { useCancelAppointment } from "@/hooks/api/appointments/use-cancel-appointment";
import { useCompleteAppointment } from "@/hooks/api/appointments/use-complete-appointment";
import { useConfirmAppointment } from "@/hooks/api/appointments/use-confirm-appointment";
import { appointmentLifecycleApi } from "@/lib/api/appointments/appointment-lifecycle.api";

const mockCancel = vi.mocked(appointmentLifecycleApi.cancel);
const mockConfirm = vi.mocked(appointmentLifecycleApi.confirm);
const mockComplete = vi.mocked(appointmentLifecycleApi.complete);

const appt = { id: "a-1", status: "PENDING" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useCancelAppointment", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls cancel with id and data", async () => {
		mockCancel.mockResolvedValueOnce(appt as never);
		const { result } = renderHook(() => useCancelAppointment(), {
			wrapper: wrapper(),
		});
		const data = { reason: "Paciente cancelou" };
		await act(async () => {
			result.current.mutate({ id: "a-1", data: data as never });
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockCancel).toHaveBeenCalledWith("a-1", data);
	});
});

describe("useConfirmAppointment", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls confirm with id", async () => {
		mockConfirm.mockResolvedValueOnce(appt as never);
		const { result } = renderHook(() => useConfirmAppointment(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("a-1");
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockConfirm).toHaveBeenCalledWith("a-1");
	});
});

describe("useCompleteAppointment", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls complete with id", async () => {
		mockComplete.mockResolvedValueOnce(appt as never);
		const { result } = renderHook(() => useCompleteAppointment(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("a-1");
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockComplete).toHaveBeenCalledWith("a-1");
	});
});
