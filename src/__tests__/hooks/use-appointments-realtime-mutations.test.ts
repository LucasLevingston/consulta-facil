import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/appointments/appointment-checkin.api", () => ({
	appointmentCheckinApi: {
		getCheckInToken: vi.fn(),
		checkInByQr: vi.fn(),
		getQueue: vi.fn(),
		callPatient: vi.fn(),
	},
}));
vi.mock("@/lib/api/appointments/appointment-payment.api", () => ({
	appointmentPaymentApi: { createPayment: vi.fn() },
}));
vi.mock("@/lib/api/appointments/appointment-video.api", () => ({
	appointmentVideoApi: { generateMeetLink: vi.fn() },
}));
vi.mock("@/lib/api/appointments/appointment-ratings.api", () => ({
	appointmentRatingsApi: { rate: vi.fn() },
}));

import { useCallPatient } from "@/hooks/api/appointments/use-call-patient";
import { useCheckInByQr } from "@/hooks/api/appointments/use-check-in-by-qr";
import { useCheckInToken } from "@/hooks/api/appointments/use-check-in-token";
import { useCreatePayment } from "@/hooks/api/appointments/use-create-payment";
import { useGenerateMeetLink } from "@/hooks/api/appointments/use-generate-meet-link";
import { useQueue } from "@/hooks/api/appointments/use-queue";
import { useRateAppointment } from "@/hooks/api/appointments/use-rate-appointment";
import { appointmentCheckinApi } from "@/lib/api/appointments/appointment-checkin.api";
import { appointmentPaymentApi } from "@/lib/api/appointments/appointment-payment.api";
import { appointmentRatingsApi } from "@/lib/api/appointments/appointment-ratings.api";
import { appointmentVideoApi } from "@/lib/api/appointments/appointment-video.api";

const mockGetQueue = vi.mocked(appointmentCheckinApi.getQueue);
const mockGetCheckInToken = vi.mocked(appointmentCheckinApi.getCheckInToken);
const mockCheckInByQr = vi.mocked(appointmentCheckinApi.checkInByQr);
const mockCallPatient = vi.mocked(appointmentCheckinApi.callPatient);
const mockCreatePayment = vi.mocked(appointmentPaymentApi.createPayment);
const mockGenerateMeetLink = vi.mocked(appointmentVideoApi.generateMeetLink);
const mockRate = vi.mocked(appointmentRatingsApi.rate);

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
