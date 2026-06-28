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
import { useDeleteAppointment } from "@/hooks/api/appointments/use-delete-appointment";
import { useRescheduleAppointment } from "@/hooks/api/appointments/use-reschedule-appointment";
import { useScheduleAppointment } from "@/hooks/api/appointments/use-schedule-appointment";
import { useSetModality } from "@/hooks/api/appointments/use-set-modality";
import { appointmentLifecycleApi } from "@/lib/api/appointments/appointment-lifecycle.api";
import { appointmentsCrudApi } from "@/lib/api/appointments/appointments.api";

const mockCancel = vi.mocked(appointmentLifecycleApi.cancel);
const mockConfirm = vi.mocked(appointmentLifecycleApi.confirm);
const mockComplete = vi.mocked(appointmentLifecycleApi.complete);
const mockSetModality = vi.mocked(appointmentLifecycleApi.setModality);
const mockReschedule = vi.mocked(appointmentsCrudApi.reschedule);
const mockDelete = vi.mocked(appointmentsCrudApi.delete);
const mockSchedule = vi.mocked(appointmentsCrudApi.schedule);

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

describe("useDeleteAppointment", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls delete with id", async () => {
		mockDelete.mockResolvedValueOnce(undefined as never);
		const { result } = renderHook(() => useDeleteAppointment(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("a-1");
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockDelete).toHaveBeenCalledWith("a-1");
	});
});

describe("useRescheduleAppointment", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls reschedule with id and data", async () => {
		mockReschedule.mockResolvedValueOnce(appt as never);
		const { result } = renderHook(() => useRescheduleAppointment(), {
			wrapper: wrapper(),
		});
		const data = {
			scheduledAt: new Date("2026-07-01T10:00:00Z"),
			reason: "Reagendamento",
		};
		await act(async () => {
			result.current.mutate({ id: "a-1", data });
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockReschedule).toHaveBeenCalledWith("a-1", data);
	});
});

describe("useScheduleAppointment", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls schedule with data", async () => {
		mockSchedule.mockResolvedValueOnce(appt as never);
		const { result } = renderHook(() => useScheduleAppointment(), {
			wrapper: wrapper(),
		});
		const data = {
			professionalId: "prof-1",
			scheduledAt: "2026-07-01T10:00:00Z",
		};
		await act(async () => {
			result.current.mutate(data as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockSchedule).toHaveBeenCalledWith(data);
	});
});

describe("useSetModality", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls setModality with id and data", async () => {
		mockSetModality.mockResolvedValueOnce(appt as never);
		const { result } = renderHook(() => useSetModality(), {
			wrapper: wrapper(),
		});
		const data = { modality: "ONLINE" };
		await act(async () => {
			result.current.mutate({ id: "a-1", data: data as never });
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockSetModality).toHaveBeenCalledWith("a-1", data);
	});
});
