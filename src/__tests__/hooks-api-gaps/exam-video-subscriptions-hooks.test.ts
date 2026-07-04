import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: {
		get: vi.fn(),
		post: vi.fn(),
		put: vi.fn(),
		patch: vi.fn(),
		delete: vi.fn(),
	},
}));
vi.mock("@/lib/api/exam-labs/exam-labs.api", () => ({
	examLabApi: {
		scheduleExam: vi.fn(),
		cancelScheduling: vi.fn(),
	},
}));
vi.mock("@/lib/api/subscriptions/subscriptions.api", () => ({
	subscriptionsApi: {
		adminListAll: vi.fn(),
		adminCancel: vi.fn(),
	},
}));
vi.mock("@/lib/api/video/create-video-room.api", () => ({
	createVideoRoomApi: vi.fn(),
}));
vi.mock("@/lib/api/video/get-video-room-token.api", () => ({
	getVideoRoomTokenApi: vi.fn(),
}));

import { useCancelExamScheduling } from "@/hooks/api/exam-labs/use-cancel-exam-scheduling";
import { useScheduleExam } from "@/hooks/api/exam-labs/use-schedule-exam";
import { useAdminCancelSubscription } from "@/hooks/api/subscriptions/use-admin-cancel-subscription";
import { useAdminSubscriptions } from "@/hooks/api/subscriptions/use-admin-subscriptions-list";
import { useCreateRoom } from "@/hooks/api/video/use-create-room";
import { useRoomToken } from "@/hooks/api/video/use-room-token";
import { examLabApi } from "@/lib/api/exam-labs/exam-labs.api";
import { subscriptionsApi } from "@/lib/api/subscriptions/subscriptions.api";
import { createVideoRoomApi } from "@/lib/api/video/create-video-room.api";
import { getVideoRoomTokenApi } from "@/lib/api/video/get-video-room-token.api";

const mockScheduleExam = vi.mocked(examLabApi.scheduleExam);
const mockCancelScheduling = vi.mocked(examLabApi.cancelScheduling);
const mockAdminListAll = vi.mocked(subscriptionsApi.adminListAll);
const mockAdminCancel = vi.mocked(subscriptionsApi.adminCancel);
const mockCreateVideoRoomApi = vi.mocked(createVideoRoomApi);
const mockGetVideoRoomTokenApi = vi.mocked(getVideoRoomTokenApi);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useScheduleExam", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama examLabApi.scheduleExam com os dados corretos", async () => {
		const data = {
			examRequestId: "req-1",
			examLabId: "lab-1",
			scheduledDate: "2026-01-10",
			scheduledTime: "10:00",
		};
		const scheduling = { id: "sched-1", ...data };
		mockScheduleExam.mockResolvedValueOnce(scheduling as never);
		const { result } = renderHook(() => useScheduleExam(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate(data as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockScheduleExam.mock.calls[0][0]).toEqual(data);
	});
});

describe("useCancelExamScheduling", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama examLabApi.cancelScheduling com o id do agendamento", async () => {
		mockCancelScheduling.mockResolvedValueOnce(undefined as never);
		const { result } = renderHook(() => useCancelExamScheduling(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("sched-1" as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockCancelScheduling).toHaveBeenCalledWith("sched-1");
	});
});

describe("useAdminSubscriptions", () => {
	beforeEach(() => vi.clearAllMocks());

	it("busca a lista de assinaturas administrativas", async () => {
		const subscriptions = [{ id: "sub-1", status: "ACTIVE" }];
		mockAdminListAll.mockResolvedValueOnce(subscriptions as never);
		const { result } = renderHook(() => useAdminSubscriptions(), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(subscriptions);
		expect(mockAdminListAll).toHaveBeenCalled();
	});
});

describe("useAdminCancelSubscription", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama subscriptionsApi.adminCancel com o id da assinatura", async () => {
		mockAdminCancel.mockResolvedValueOnce(undefined as never);
		const { result } = renderHook(() => useAdminCancelSubscription(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("sub-1" as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockAdminCancel).toHaveBeenCalledWith("sub-1");
	});
});

describe("useCreateRoom", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama createVideoRoomApi com o id do agendamento", async () => {
		const room = { roomId: "room-1", token: "token-abc" };
		mockCreateVideoRoomApi.mockResolvedValueOnce(room as never);
		const { result } = renderHook(() => useCreateRoom(), {
			wrapper: wrapper(),
		});
		await act(async () => {
			result.current.mutate("appt-1" as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockCreateVideoRoomApi).toHaveBeenCalledWith("appt-1");
	});
});

describe("useRoomToken", () => {
	beforeEach(() => vi.clearAllMocks());

	it("desabilitado quando appointmentId é null", () => {
		const { result } = renderHook(() => useRoomToken(null), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("busca o token da sala quando appointmentId é fornecido", async () => {
		const room = { roomId: "room-1", token: "token-abc" };
		mockGetVideoRoomTokenApi.mockResolvedValueOnce(room as never);
		const { result } = renderHook(() => useRoomToken("appt-1"), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(room);
		expect(mockGetVideoRoomTokenApi).toHaveBeenCalledWith("appt-1");
	});
});
