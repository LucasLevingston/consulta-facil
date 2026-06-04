import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/appointments.api", () => ({
	appointmentsApi: {
		getByPatient: vi.fn(),
		getByProfessional: vi.fn(),
		getById: vi.fn(),
		schedule: vi.fn(),
		cancel: vi.fn(),
		confirm: vi.fn(),
		complete: vi.fn(),
		rate: vi.fn(),
		reschedule: vi.fn(),
		delete: vi.fn(),
		getCheckInToken: vi.fn(),
		checkInByQr: vi.fn(),
		getQueue: vi.fn(),
		callPatient: vi.fn(),
		setModality: vi.fn(),
		generateMeetLink: vi.fn(),
		createPayment: vi.fn(),
	},
}));

import { useCallPatient } from "@/hooks/api/appointments/use-call-patient";
import { useCancelAppointment } from "@/hooks/api/appointments/use-cancel-appointment";
import { useCheckInByQr } from "@/hooks/api/appointments/use-check-in-by-qr";
import { useCheckInToken } from "@/hooks/api/appointments/use-check-in-token";
import { useCompleteAppointment } from "@/hooks/api/appointments/use-complete-appointment";
import { useConfirmAppointment } from "@/hooks/api/appointments/use-confirm-appointment";
import { useCreatePayment } from "@/hooks/api/appointments/use-create-payment";
import { useDeleteAppointment } from "@/hooks/api/appointments/use-delete-appointment";
import { useGenerateMeetLink } from "@/hooks/api/appointments/use-generate-meet-link";
import { useQueue } from "@/hooks/api/appointments/use-queue";
import { useRateAppointment } from "@/hooks/api/appointments/use-rate-appointment";
import { useRescheduleAppointment } from "@/hooks/api/appointments/use-reschedule-appointment";
import { useScheduleAppointment } from "@/hooks/api/appointments/use-schedule-appointment";
import { useSetModality } from "@/hooks/api/appointments/use-set-modality";
import { appointmentsApi } from "@/lib/api/appointments.api";

const mockCancel = vi.mocked(appointmentsApi.cancel);
const mockConfirm = vi.mocked(appointmentsApi.confirm);
const mockComplete = vi.mocked(appointmentsApi.complete);
const mockRate = vi.mocked(appointmentsApi.rate);
const mockReschedule = vi.mocked(appointmentsApi.reschedule);
const mockDelete = vi.mocked(appointmentsApi.delete);
const mockGetCheckInToken = vi.mocked(appointmentsApi.getCheckInToken);
const mockCheckInByQr = vi.mocked(appointmentsApi.checkInByQr);
const mockGetQueue = vi.mocked(appointmentsApi.getQueue);
const mockCallPatient = vi.mocked(appointmentsApi.callPatient);
const mockSetModality = vi.mocked(appointmentsApi.setModality);
const mockGenerateMeetLink = vi.mocked(appointmentsApi.generateMeetLink);
const mockCreatePayment = vi.mocked(appointmentsApi.createPayment);
const mockSchedule = vi.mocked(appointmentsApi.schedule);

const appt = { id: "a-1", status: "PENDING" };
const token = { token: "qr-abc123" };
const payment = { id: "pay-1", checkoutUrl: "https://pay.example.com" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useQueue", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fetches queue", async () => {
		mockGetQueue.mockResolvedValueOnce([appt] as never);
		const { result } = renderHook(() => useQueue(), { wrapper: wrapper() });
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toHaveLength(1);
	});
});

describe("useCheckInToken", () => {
	beforeEach(() => vi.clearAllMocks());

	it("disabled when appointmentId empty", () => {
		const { result } = renderHook(() => useCheckInToken(""), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("fetches token when appointmentId provided", async () => {
		mockGetCheckInToken.mockResolvedValueOnce(token as never);
		const { result } = renderHook(() => useCheckInToken("a-1"), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(token);
	});
});

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

describe("useRateAppointment", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls rate with id and data", async () => {
		mockRate.mockResolvedValueOnce(appt as never);
		const { result } = renderHook(() => useRateAppointment(), {
			wrapper: wrapper(),
		});
		const data = { rating: 5, comment: "Ótimo!" };
		await act(async () => {
			result.current.mutate({ id: "a-1", data: data as never });
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockRate).toHaveBeenCalledWith("a-1", data);
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

describe("useGenerateMeetLink", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls generateMeetLink with id", async () => {
		mockGenerateMeetLink.mockResolvedValueOnce(appt as never);
		const { result } = renderHook(() => useGenerateMeetLink(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("a-1");
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockGenerateMeetLink).toHaveBeenCalledWith("a-1");
	});
});

describe("useCreatePayment", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls createPayment with appointmentId", async () => {
		mockCreatePayment.mockResolvedValueOnce(payment as never);
		const { result } = renderHook(() => useCreatePayment(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate({ appointmentId: "a-1" });
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockCreatePayment).toHaveBeenCalledWith("a-1", undefined);
	});
});

describe("useCallPatient", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls callPatient with appointmentId", async () => {
		mockCallPatient.mockResolvedValueOnce(appt as never);
		const { result } = renderHook(() => useCallPatient(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("a-1");
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockCallPatient).toHaveBeenCalledWith("a-1");
	});
});

describe("useCheckInByQr", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls checkInByQr with token", async () => {
		mockCheckInByQr.mockResolvedValueOnce(appt as never);
		const { result } = renderHook(() => useCheckInByQr(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("qr-abc123");
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockCheckInByQr).toHaveBeenCalledWith("qr-abc123");
	});
});
