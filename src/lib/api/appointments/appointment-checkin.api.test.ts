import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { appointmentCheckinApi } from "./appointment-checkin.api";

const mockGet = vi.mocked(api.get);
const mockPost = vi.mocked(api.post);
const mockPut = vi.mocked(api.put);

const appointment = {
	id: "a-1",
	patientId: "p-1",
	professionalId: "d-1",
	scheduledAt: "2026-05-20T10:00:00Z",
	status: "PENDING" as const,
};

describe("appointmentCheckinApi", () => {
	beforeEach(() => vi.clearAllMocks());

	it("getCheckInToken — chama GET /appointments/:id/checkin-token e retorna token", async () => {
		const token = { appointmentId: "a-1", token: "TOKEN-XYZ-123" };
		mockGet.mockResolvedValueOnce({ data: token });

		const result = await appointmentCheckinApi.getCheckInToken("a-1");

		expect(mockGet).toHaveBeenCalledWith("/appointments/a-1/checkin-token");
		expect(result.token).toBe("TOKEN-XYZ-123");
		expect(result.appointmentId).toBe("a-1");
	});

	it("getCheckInToken — IDs diferentes produzem URLs diferentes", async () => {
		mockGet
			.mockResolvedValueOnce({ data: { appointmentId: "a-1", token: "T1" } })
			.mockResolvedValueOnce({ data: { appointmentId: "a-2", token: "T2" } });

		await appointmentCheckinApi.getCheckInToken("a-1");
		await appointmentCheckinApi.getCheckInToken("a-2");

		expect(mockGet.mock.calls[0][0]).toBe("/appointments/a-1/checkin-token");
		expect(mockGet.mock.calls[1][0]).toBe("/appointments/a-2/checkin-token");
	});

	it("checkInByQr — chama POST /appointments/checkin com token como query param", async () => {
		const checkedIn = { ...appointment, status: "CHECKED_IN" as const };
		mockPost.mockResolvedValueOnce({ data: checkedIn });

		const result = await appointmentCheckinApi.checkInByQr("TOKEN-XYZ-123");

		expect(mockPost).toHaveBeenCalledWith(
			"/appointments/checkin",
			null,
			expect.objectContaining({ params: { token: "TOKEN-XYZ-123" } }),
		);
		expect(result.status).toBe("CHECKED_IN");
	});

	it("getQueue — chama GET /appointments/queue e retorna lista", async () => {
		const queue = [appointment, { ...appointment, id: "a-2" }];
		mockGet.mockResolvedValueOnce({ data: queue });

		const result = await appointmentCheckinApi.getQueue();

		expect(mockGet).toHaveBeenCalledWith("/appointments/queue");
		expect(result).toHaveLength(2);
	});

	it("getQueue — fila vazia retorna array vazio", async () => {
		mockGet.mockResolvedValueOnce({ data: [] });

		const result = await appointmentCheckinApi.getQueue();

		expect(result).toEqual([]);
	});

	it("callPatient — chama PUT /appointments/:id/call e retorna IN_PROGRESS", async () => {
		const called = { ...appointment, status: "IN_PROGRESS" as const };
		mockPut.mockResolvedValueOnce({ data: called });

		const result = await appointmentCheckinApi.callPatient("a-1");

		expect(mockPut).toHaveBeenCalledWith("/appointments/a-1/call");
		expect(result.status).toBe("IN_PROGRESS");
	});
});
