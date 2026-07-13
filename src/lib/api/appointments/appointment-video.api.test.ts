import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { appointmentVideoApi } from "./appointment-video.api";

const mockPost = vi.mocked(api.post);

const appointment = {
	id: "a-1",
	patientId: "p-1",
	professionalId: "d-1",
	scheduledAt: "2026-05-20T10:00:00Z",
	status: "PENDING" as const,
};

describe("appointmentVideoApi", () => {
	beforeEach(() => vi.clearAllMocks());

	it("generateMeetLink — chama POST /appointments/:id/meet-link e retorna meetLink", async () => {
		const withLink = {
			...appointment,
			meetLink: "https://meet.google.com/xyz-abc-def",
		};
		mockPost.mockResolvedValueOnce({ data: withLink });

		const result = await appointmentVideoApi.generateMeetLink("a-1");

		expect(mockPost).toHaveBeenCalledWith("/appointments/a-1/meet-link");
		expect(result.meetLink).toBe("https://meet.google.com/xyz-abc-def");
	});
});
