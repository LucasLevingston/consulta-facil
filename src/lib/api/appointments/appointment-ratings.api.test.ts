import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { appointmentRatingsApi } from "./appointment-ratings.api";

const mockPost = vi.mocked(api.post);

const appointment = {
	id: "a-1",
	patientId: "p-1",
	professionalId: "d-1",
	scheduledAt: "2026-05-20T10:00:00Z",
	status: "PENDING" as const,
};

describe("appointmentRatingsApi", () => {
	beforeEach(() => vi.clearAllMocks());

	it("rate — chama POST /appointments/:id/rate com stars e comment", async () => {
		const rated = {
			...appointment,
			rating: 5,
			ratingComment: "Ótimo atendimento",
		};
		mockPost.mockResolvedValueOnce({ data: rated });

		const result = await appointmentRatingsApi.rate("a-1", {
			stars: 5,
			comment: "Ótimo atendimento",
		});

		expect(mockPost).toHaveBeenCalledWith("/appointments/a-1/rate", {
			stars: 5,
			comment: "Ótimo atendimento",
		});
		expect(result.rating).toBe(5);
	});

	it("rate — aceita rating mínimo 1 e comentário opcional", async () => {
		mockPost.mockResolvedValueOnce({ data: { ...appointment, rating: 1 } });

		await appointmentRatingsApi.rate("a-1", { stars: 1 });

		expect(mockPost).toHaveBeenCalledWith("/appointments/a-1/rate", {
			stars: 1,
		});
	});
});
